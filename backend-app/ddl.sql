-- 0) UUID 생성 함수 사용 (서버 1회)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) ENUM 타입들
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'game_status') THEN
    CREATE TYPE game_status AS ENUM ('scheduled','live','ended');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('paid','failed','canceled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE ticket_status AS ENUM ('valid','used','refunded');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_category') THEN
    CREATE TYPE post_category AS ENUM ('news','story','photo','highlight','live');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE post_status AS ENUM ('draft','published','archived');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'chat_role') THEN
    CREATE TYPE chat_role AS ENUM ('user','assistant');
  END IF;
END$$;

-- 2) 테이블 생성

-- A) users
CREATE TABLE IF NOT EXISTS users (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email             varchar NOT NULL UNIQUE,
  password_hash     varchar,
  nickname          varchar,
  locale            varchar,              -- 'ko' | 'en'
  is_admin          boolean NOT NULL DEFAULT false,
  marketing_opt_in  boolean NOT NULL DEFAULT false,
  last_login_at     timestamp,
  created_at        timestamp NOT NULL DEFAULT now(),
  updated_at        timestamp NOT NULL DEFAULT now()
);

-- B) games (MVP: 단일가/자유석)
CREATE TABLE IF NOT EXISTS games (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_time        timestamp,
  home_team_name   varchar,
  away_team_name   varchar,
  venue            varchar,
  status           game_status,
  inning           int,
  home_score       int,
  away_score       int,
  ticket_price     int,         -- 단일가
  ga_capacity      int,         -- 총 수용 인원 (남은 좌석은 계산으로)
  updated_at       timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_games_date_time ON games(date_time);
CREATE INDEX IF NOT EXISTS idx_games_status    ON games(status);

-- C) orders & tickets (hold 제거, PG 필드 통합)
CREATE TABLE IF NOT EXISTS orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  game_id      uuid NOT NULL REFERENCES games(id) ON UPDATE RESTRICT ON DELETE RESTRICT,

  unit_price   int,            -- 주문 시점 단가 스냅샷
  amount       int,            -- 총액(예: 개별 티켓 수 * unit_price)

  status       order_status NOT NULL,
  paid_at      timestamp,

  -- 결제 연동(간단 통합)
  pg_provider  varchar,        -- 'tosspayments' | 'kakaopay' 등
  pg_tx_id     varchar,        -- 외부 거래 ID
  pg_payload   text,           -- 결제 원문(옵션)
  receipt_url  varchar,        -- 영수증/바우처 링크(옵션)

  created_at   timestamp NOT NULL DEFAULT now(),
  updated_at   timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user_created  ON orders(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_pg_tx_id      ON orders(pg_tx_id);

CREATE TABLE IF NOT EXISTS tickets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid NOT NULL REFERENCES orders(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
  voucher_code  varchar NOT NULL UNIQUE,
  issued_at     timestamp,
  status        ticket_status NOT NULL
);

-- D) posts (예약 발행 제거, 업로드 시간 단일화)
CREATE TABLE IF NOT EXISTS posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category    post_category,

  title       varchar,
  body        text,
  thumbnail   varchar,
  images      text,           -- JSON 배열 문자열(["url1","url2",...])
  video_url   varchar,

  status      post_status,    -- draft | published | archived
  slug        varchar UNIQUE,
  author_id   uuid REFERENCES users(id) ON UPDATE RESTRICT ON DELETE SET NULL,
  deleted     boolean NOT NULL DEFAULT false,

  created_at  timestamp NOT NULL DEFAULT now(),  -- 업로드(게시) 시각
  updated_at  timestamp NOT NULL DEFAULT now()   -- 수정 시각
);
CREATE INDEX IF NOT EXISTS idx_posts_cat_status_created
  ON posts(category, status, created_at);

-- E) chats (세션+메시지 통합)
CREATE TABLE IF NOT EXISTS chats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- 메시지 ID
  session_id  uuid NOT NULL,                              -- 스레드 식별(자유 형식)
  user_id     uuid REFERENCES users(id) ON UPDATE RESTRICT ON DELETE SET NULL,
  role        chat_role NOT NULL,                         -- user | assistant
  message     text NOT NULL,
  created_at  timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_chats_session_created
  ON chats(session_id, created_at);

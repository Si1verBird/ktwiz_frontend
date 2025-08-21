-- games 테이블 초기 데이터 삽입
-- 필요 시: CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH
params AS (
  SELECT
    ARRAY[
    '20000000-0000-0000-0000-000000000001'::uuid,
	'20000000-0000-0000-0000-000000000002'::uuid,
	'20000000-0000-0000-0000-000000000003'::uuid,
	'20000000-0000-0000-0000-000000000004'::uuid,
	'20000000-0000-0000-0000-000000000005'::uuid,
	'20000000-0000-0000-0000-000000000006'::uuid,
	'20000000-0000-0000-0000-000000000007'::uuid,
	'20000000-0000-0000-0000-000000000009'::uuid,
	'20000000-0000-0000-0000-000000000008'::uuid,
	'20000000-0000-0000-0000-000000000010'::uuid
    ] AS team_ids,
    TIMESTAMP '2025-04-01 18:30:00'           AS season_start,
    122                                       AS season_days  -- 4~7월 일수(4/1~7/31)
),
g AS (
  SELECT generate_series(0, 399) AS n
)
INSERT INTO games (
  id, date_time, home_team_id, away_team_id, status,
  inning, home_score, away_score, ticket_price,
  created_at, updated_at
)
SELECT
  gen_random_uuid() AS id,
  -- 4/1 기준으로 날짜 순환 + 시작 시간 18:30 + 가벼운 분산(30분 단위)
  (SELECT season_start FROM params)
    + ((n % (SELECT season_days FROM params)) * INTERVAL '1 day')
    + ((n % 3) * INTERVAL '30 minutes')         AS date_time,
  -- 팀 배열에서 순환 선택(서로 다른 팀이 되도록 인덱스를 어긋나게)
  (SELECT team_ids[(n % array_length(team_ids,1)) + 1] FROM params)                 AS home_team_id,
  (SELECT team_ids[((n + 1) % array_length(team_ids,1)) + 1] FROM params)           AS away_team_id,
  'ended'                                                                            AS status,
  9 + (n % 3)                                                                        AS inning,        -- 9~11회
  (n * 7) % 13                                                                       AS home_score,    -- 0~12 분포
  (n * 11) % 13                                                                      AS away_score,    -- 0~12 분포
  20000 + ((n % 5) * 5000)                                                           AS ticket_price,  -- 20,000~40,000
  now()::timestamp                                                                   AS created_at,
  NULL::timestamp                                                                    AS updated_at
FROM g;

-- posts 테이블 초기 데이터 삽입
INSERT INTO posts (id, category, title, body, thumbnail, images, video_url, status, slug, author_id, deleted, created_at, updated_at) VALUES
(
    gen_random_uuid(),
    'news',
    'KT 위즈 2024 시즌 개막전 승리!',
    '오늘 개막전에서 KT 위즈가 대승을 거두었습니다. 선수들의 뛰어난 활약과 팬들의 뜨거운 응원 덕분에 승리를 이끌어냈습니다. 앞으로도 많은 응원 부탁드립니다!',
    'https://img.khan.co.kr/news/2023/10/07/news-p.v1.20231007.0ecbf17517364dbabd32d2285765d48e_P1.jpg',
    'https://img.khan.co.kr/news/2023/10/07/news-p.v1.20231007.0ecbf17517364dbabd32d2285765d48e_P1.jpg',
    NULL,
    'published',
    'kt-wiz-2024-opening-victory',
    '30000000-0000-0000-0000-000000000001',
    false,
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours'
),
(
    gen_random_uuid(),
    'highlight',
    '강백호 선수 홈런 하이라이트',
    '오늘 경기에서 강백호 선수가 멋진 홈런을 쳤습니다! 9회말 역전 홈런으로 승리를 이끌어낸 결정적인 순간이었습니다. 강백호 선수 파이팅!',
    'https://img.khan.co.kr/news/2023/10/07/news-p.v1.20231007.0ecbf17517364dbabd32d2285765d48e_P1.jpg',
    'https://img.khan.co.kr/news/2023/10/07/news-p.v1.20231007.0ecbf17517364dbabd32d2285765d48e_P1.jpg',
    NULL,
    'published',
    'kang-baekho-homerun-highlight',
    '30000000-0000-0000-0000-000000000001',
    false,
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '4 hours'
),
(
    gen_random_uuid(),
    'news',
    '내일 경기 티켓 예매 오픈 안내',
    '내일 홈경기 티켓 예매가 오전 10시부터 시작됩니다. 많은 팬분들의 관람을 기다리고 있습니다. 온라인 예매는 공식 홈페이지에서 가능합니다.',
    NULL,
    NULL,
    NULL,
    'published',
    'tomorrow-game-ticket-open',
    '30000000-0000-0000-0000-000000000001',
    false,
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '6 hours'
),
(
    gen_random_uuid(),
    'general',
    '위즈파크 새로운 먹거리 추천',
    '위즈파크에 새로운 치킨 가게가 생겼는데 정말 맛있어요! 경기 보면서 먹기 좋은 사이드 메뉴로 추천합니다. 다음 경기 때 꼭 먹어보세요.',
    NULL,
    NULL,
    NULL,
    'published',
    'wizpark-new-food-recommendation',
    '30000000-0000-0000-0000-000000000002',
    false,
    NOW() - INTERVAL '8 hours',
    NOW() - INTERVAL '8 hours'
),
(
    gen_random_uuid(),
    'general',
    '오늘 경기 응원 후기',
    '오늘 경기 정말 짜릿했어요! 9회말 역전승 너무 감동적이었습니다. 선수들 다들 수고하셨고, 팬들도 정말 열심히 응원했어요. 다음 경기도 파이팅!',
    NULL,
    NULL,
    NULL,
    'published',
    'today-game-cheer-review',
    '30000000-0000-0000-0000-000000000003',
    false,
    NOW() - INTERVAL '10 hours',
    NOW() - INTERVAL '10 hours'
);

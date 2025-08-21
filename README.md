# KT Wiz Frontend

KT Wiz 프로젝트의 프론트엔드 웹 애플리케이션입니다.

## 기술 스택

- **Next.js 14**
- **React 18**
- **Tailwind CSS**
- **JavaScript (ES6+)**

## 주요 기능

- **메인페이지**: KT Wiz 최근 경기 정보, 팀 순위, 소식
- **경기 일정**: 경기 필터링 (팀, 상태별)
- **티켓 예매**: 경기 티켓 예매 시스템
- **사용자 관리**: 로그인, 마이페이지
- **관리자 기능**: 경기 추가/수정, 게시물 관리

## 페이지 구성

### 사용자 페이지
- `/` - 메인페이지
- `/schedule` - 경기 일정
- `/ticket-booking` - 티켓 예매
- `/my-wiz` - 마이페이지
- `/login` - 로그인

### 관리자 페이지
- `/admin/games` - 경기 관리
- `/admin/add-game` - 경기 추가
- `/admin/games/[id]/edit` - 경기 수정

## 설치 및 실행

1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 프로덕션 빌드
```bash
npm run build
npm start
```

## 환경 설정

- 기본 포트: 3000
- 백엔드 API: `http://localhost:8080/api`
- 환경 변수: `.env.local` 파일에서 설정

## 프로젝트 구조

```
src/
├── app/                 # Next.js App Router
│   ├── admin/          # 관리자 페이지
│   ├── schedule/       # 경기 일정
│   ├── ticket-booking/ # 티켓 예매
│   └── ...
├── components/          # 재사용 가능한 컴포넌트
├── lib/                # 유틸리티 및 API
└── ...
```

## API 연동

- **경기 API**: 경기 조회, 필터링, 생성, 수정
- **팀 API**: 팀 정보, 순위 조회
- **사용자 API**: 로그인, 인증
- **게시물 API**: 공지사항, 뉴스

## 개발 환경

- Node.js 18+
- npm 9+
- Next.js 14
- Tailwind CSS 3

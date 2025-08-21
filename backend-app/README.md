# KT Wiz Backend

KT Wiz 프로젝트의 백엔드 API 서버입니다.

## 기술 스택

- **Java 17**
- **Spring Boot 3.5.4**
- **Spring Data JPA**
- **PostgreSQL**
- **Gradle**

## 주요 기능

- 경기 관리 API
- 팀 순위 관리
- 사용자 인증
- 게시물 관리
- 티켓 예매 시스템

## API 엔드포인트

### 경기 관련
- `GET /api/games` - 모든 경기 조회
- `GET /api/games/{id}` - 특정 경기 조회
- `GET /api/games/next` - 다음 경기 조회
- `GET /api/games/kt-wiz/latest-ended` - KT Wiz 최근 종료된 경기
- `GET /api/games/filter` - 경기 필터링
- `POST /api/games` - 경기 생성
- `PUT /api/games/{id}` - 경기 수정
- `DELETE /api/games/{id}` - 경기 삭제

### 팀 관련
- `GET /api/teams` - 모든 팀 조회
- `GET /api/standings` - 팀 순위 조회

### 사용자 관련
- `POST /api/users/login` - 사용자 로그인

## 실행 방법

1. PostgreSQL 데이터베이스 실행
```bash
docker-compose up -d
```

2. 애플리케이션 실행
```bash
./gradlew bootRun
```

## 환경 설정

- 기본 포트: 8080
- 데이터베이스: PostgreSQL (포트 5432)
- JPA 설정: `application.yml`에서 확인

## API 문서

- **BACKEND_API_ENDPOINTS.txt**: 모든 API 엔드포인트 목록
- **docker-compose.yml**: PostgreSQL 데이터베이스 설정

## 개발 환경

- IDE: IntelliJ IDEA, VS Code
- Java 버전: 17
- Gradle 버전: 8.14.3

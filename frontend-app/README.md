# Frontend App

Next.js 기반의 현대적인 프론트엔드 애플리케이션입니다.

## 🚀 기술 스택

- **프레임워크**: Next.js 14
- **패키지 매니저**: npm
- **언어**: JavaScript
- **스타일링**: Tailwind CSS
- **API 통신**: Axios
- **라우팅**: App Router
- **번들러**: TurboPack

## 📁 프로젝트 구조

```
frontend-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── example/
│   │   │       └── route.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   └── components/ (추후 생성 예정)
├── .eslintrc.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 3. 빌드
```bash
npm run build
```

### 4. 프로덕션 서버 실행
```bash
npm start
```

## 🔧 주요 기능

- **App Router**: Next.js 14의 최신 라우팅 시스템
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **TurboPack**: 빠른 개발 빌드
- **API Routes**: 서버리스 API 엔드포인트
- **반응형 디자인**: 모바일과 데스크톱 최적화

## 📱 컴포넌트

### 기본 컴포넌트
- `btn-primary`: 기본 버튼 스타일
- `card`: 카드 컨테이너 스타일

## 🌐 API 엔드포인트

### `/api/example`
- `GET`: 서버 상태 확인
- `POST`: 메시지 처리 (예시)

## 🎨 커스터마이징

### Tailwind CSS 설정
`tailwind.config.js`에서 테마와 색상을 커스터마이징할 수 있습니다.

### 새로운 페이지 추가
`src/app/` 디렉토리에 새 폴더를 생성하여 페이지를 추가할 수 있습니다.

## 📝 개발 가이드

1. **컴포넌트 생성**: `src/components/` 디렉토리에 재사용 가능한 컴포넌트를 생성하세요.
2. **API 추가**: `src/app/api/` 디렉토리에 새로운 API 엔드포인트를 추가하세요.
3. **스타일링**: Tailwind CSS 클래스를 사용하여 스타일을 적용하세요.

## 🤝 기여

프로젝트에 기여하고 싶으시다면 Pull Request를 보내주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

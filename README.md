# 구름곰의 이상한 개발노트

노션 `웹페이지` 기획을 기준으로 제작한 개인 프로젝트 포트폴리오.

## 개발

Cloudflare Workers Static Assets 배포를 위한 정적 사이트입니다.

```bash
npm install
npm run dev
npm run deploy
```

Cloudflare Workers Builds에서 GitHub 저장소 `rhaxod7784-png/webpage`를 연결하고 빌드 명령 `npm run deploy`를 사용합니다.

## 원칙
- 원문에서 확인된 소개와 프로젝트 정보만 반영
- 모바일 우선, 12~16px, 무채색, 시맨틱 HTML
- 프로젝트 화면은 원본 캡처 파일을 `public/images/`에 추가한 뒤 교체

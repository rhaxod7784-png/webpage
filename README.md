# 구름곰의 이상한 개발노트 — 개인 프로젝트 포트폴리오

본인이 제작·기획한 작업물을 실제 구현 범위와 검증 상태에 따라 구분해 소개합니다. 기존의 개인 소개와 무채색·모바일 우선 디자인은 유지했습니다.

## 콘텐츠
- 이야기: 개발을 시작한 배경과 태도
- 작업물: POT BREAKER / Keyboard Canvas / 대전의 기묘한 여행 (기존 화면 캡처 유지)
- 개발 중: 사유(SAYU) / 텐텐텐 (미검증 기능과 기획 상태 명시)
- 제작 과정: 문제 인식 → IA·MVP → AI 보조 개발·이해 → QA·재검토
- 실험 노트: 추후 아이디어와 학습

## 개발 및 배포
Cloudflare Workers Static Assets, GitHub main 브랜치 자동 빌드. 기존 Worker 이름은 `webpage`이며 소스의 Wrangler 설정은 `gooreumgom-webpage`로 불일치하므로 배포 로그에서 실제 대상 Worker를 확인해야 합니다.

```bash
npm install
npm run dev
npm run deploy
```

## 운영 유의
공개 배포·로컬 QA·소스 구현·사용자 성과는 별개의 상태입니다. 비공개 소모임 데이터는 공개하지 않으며, 실제 서비스 여부를 과장하지 않습니다.

# 구름곰의 이상한 개발노트 — 개인 포트폴리오

기존 단일 페이지를 프로젝트별 긴 이야기로 확장했습니다. 실제 결과물의 배포 여부와 기획·구현·검증 단계를 분리해 소개합니다.

## 메뉴
- `/` : 첫 화면
- `/projects/` : 전체 프로젝트
- `/projects/daejeon/`, `/projects/keyboard/`, `/projects/potbreaker/`, `/projects/sayu/`, `/projects/tententen/` : 프로젝트별 출발점, 결정, 구현 및 미검증 과제
- `/about/` : 나의 이야기
- `/process/` : 제작 과정
- `/lab/` : 아이디어 노트

## 기술
Cloudflare Workers Static Assets · 순수 HTML/CSS · 모바일 우선.
`public/style.css`가 `journal.css`와 `journal-details.css`를 불러옵니다.
기존 화면 캡처는 `public/images/`에 유지합니다.

배포: GitHub `main` → 연결된 Cloudflare Worker `webpage`.

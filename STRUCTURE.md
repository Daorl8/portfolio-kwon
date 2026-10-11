# STRUCTURE — 권현서 HR 포트폴리오 원페이지 사이트

정적 사이트 (빌드 없음). GitHub 저장소 루트에 이 폴더 내용을 그대로 올리고 Cloudflare Pages에 연결.
Cloudflare Pages 설정: Framework preset = None · Build command = (비움) · Build output directory = `/`

```
site/
├─ index.html                     # 원페이지 전체 (히어로 → 요약 → 챕터 01~06 → 부록 → 프로필)
├─ _headers                       # Cloudflare Pages 헤더 (검색 노출 차단 noindex 등)
├─ assets/
│  ├─ css/style.css               # 전체 스타일 (흰 배경·파랑 #2f5d8a·Pretendard, 모바일 대응)
│  ├─ js/main.js                  # 상단 메뉴 현재 섹션 강조 (IntersectionObserver)
│  ├─ favicon.svg                 # 탭 아이콘
│  └─ HR_Portfolio_KwonHyunseo.pdf  # ⚠️ 직접 넣어야 함: v5.pptx를 PowerPoint에서 PDF로 내보낸 파일
├─ CHANGELOG.md
└─ STRUCTURE.md
```

## 콘텐츠 기준
- 원본: `../HR_포트폴리오_권현서_v5.pptx` (26쪽). 사이트 텍스트는 v5와 동일하게 유지.
- PDF 링크 3곳(상단 메뉴·히어로·프로필 하단) 모두 `assets/HR_Portfolio_KwonHyunseo.pdf`를 가리킴. 다운로드 시 파일명은 `권현서_HR_포트폴리오.pdf`.
- 이미지 없음 (개인정보·학원 화면 노출 방지). 조 편성표·IPA 기록·단어시험 화면은 PDF에서만 확인.

## 수정 방법
- 수치·문구 수정: `index.html`에서 해당 텍스트 검색 후 수정 → v5.pptx와 함께 맞출 것.
- 색 변경: `style.css` 상단 `:root`의 `--blue` 계열 값만 바꾸면 전체 반영.
- 검색 노출 허용: `index.html`의 `<meta name="robots">` 줄과 `_headers`의 `X-Robots-Tag` 줄 삭제.

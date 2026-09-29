# 📝 초등교직논술 모의고사

랜덤 교육 키워드로 교직논술을 연습하고, 논점별로 약점을 분석해 주는 모의고사 웹앱입니다.
주소: https://gmlduqzhd123-lab.github.io/teacher-test/

## 외부 사이트 없이 동작
React와 화면 스타일을 앱 안에 포함해서, 학교 인터넷이 외부 사이트(CDN)를 막아도 열립니다.
글꼴(Pretendard)만 외부에서 불러오는데, 막히면 기기 기본 글꼴로 자동 대체됩니다.

## 파일 구성
| 파일 | 설명 |
|---|---|
| `index.html` | 페이지 뼈대 (제목, 공유 태그, 스크립트 연결) |
| `src/app.jsx` | **화면 코드 원본** — 기능·문구는 여기서 고칩니다 |
| `src/styles.css` | 스타일 원본 (Tailwind) |
| `tailwind.config.js` | 색·글꼴 설정 |
| `app.js`, `app.css` | `src/`에서 **자동으로 만들어지는 파일** — 직접 고치지 마세요 |
| `vendor/` | React 18 (MIT 라이선스, `REACT-LICENSE.txt`) |

## 고치는 방법
1. `src/app.jsx`(또는 `src/styles.css`)를 고칩니다.
2. 터미널에서 한 번만 `npm install`, 그다음부터는 `npm run build`를 실행합니다.
3. 바뀐 `src/` 파일과 새로 만들어진 `app.js`, `app.css`를 함께 커밋합니다.

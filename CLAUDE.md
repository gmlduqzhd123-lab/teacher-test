# 작업 규칙
- 화면 코드는 `src/app.jsx`, 스타일은 `src/styles.css`에서 고친다. `app.js`·`app.css`는 빌드 결과물이므로 직접 고치지 않는다.
- 수정 후 `npm install`(처음 한 번) → `npm run build`를 실행하고, `src/`와 함께 `app.js`·`app.css`도 커밋한다.
- 외부 CDN(React·Babel·Tailwind 등)을 다시 넣지 않는다. 학교망에서 막혀도 동작해야 한다.

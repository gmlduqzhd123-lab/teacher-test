/** Tailwind 설정 (예전 index.html 안의 tailwind.config와 같은 내용) */
module.exports = {
  content: ['./index.html', './src/**/*.jsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#4f46e5', // Indigo 600
        primaryHover: '#4338ca', // Indigo 700
        surface: '#ffffff',
        background: '#f8fafc', // Slate 50
      },
    },
  },
  plugins: [],
};

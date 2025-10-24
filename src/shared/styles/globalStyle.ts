import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

const GlobalStyle = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: 'Pretendard';
    src: url('/fonts/PretendardVariable.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
    line-height: 1.5;
  }

  button, input, textarea, select, a {
    font-family: inherit;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
    -webkit-text-fill-color: inherit;
    -webkit-text-highlight-color: transparent;
    cursor: pointer;
  }

  textarea {
    all: unset;
  }

  /* 모든 텍스트 요소에 white-space 적용 */
  p, span, div, h1, h2, h3, h4, h5, h6, a, li {
    white-space: pre-line;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
  }

  input[type="search"]::-webkit-search-decoration,
  input[type="search"]::-webkit-search-cancel-button,
  input[type="search"]::-webkit-search-results-button,
  input[type="search"]::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  input[type="search"] {
    -webkit-appearance: textfield;
    appearance: textfield;
  }

  /* IOS/Safari 검색 취소 버튼 미노출 */
  input[type="search"]::-webkit-search-cancel-button {
    display: none;
  }

  /* 스크롤바 미노출 */
  html {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  /* 전화번호, 이메일 등을 자동으로 링크화하지 않게 함 */
  meta[name="format-detection"] {
    content: "telephone=no, email=no, address=no";
  }
`

export default GlobalStyle

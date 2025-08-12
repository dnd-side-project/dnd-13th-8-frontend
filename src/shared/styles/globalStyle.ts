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


  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: inherit;
  }



  /* 스크롤바 미노출 */
  html {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  /* 공통 레이아웃 */
  main {
    position: relative;
    width: clamp(320px, 100dvw, 420px);
    min-height: 100dvh;
    margin: 0 auto;
    overflow-x: auto;
    overflow-y: auto;
    background-color: #0f1013;
    color: #fafbfe;
  }
`

export default GlobalStyle

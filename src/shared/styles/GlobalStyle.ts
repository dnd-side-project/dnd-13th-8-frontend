import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

const GlobalStyle = createGlobalStyle`
  ${reset}

  /* pretendard */
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

  * {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
    line-height: 1.5;
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
    width: 375px;
    min-width: 320px;
    max-width: 420px;
    min-height: 100dvh;
    max-height: fit-content;
    margin: 0 auto;
    overflow-x: auto;
    overflow-y: auto;
    background-color: #0f1013;
    color: #fafbfe;
  }
`

export default GlobalStyle

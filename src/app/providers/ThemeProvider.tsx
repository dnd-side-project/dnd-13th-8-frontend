import { ThemeProvider as StyledThemeProvider } from 'styled-components'

interface ThemeProviderProps {
  children: React.ReactNode
}

// 기본 테마 정의
const theme = {
  breakpoints: {
    sm: '320px',
    md: '375px',
    lg: '420px',
  },
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}

export default ThemeProvider

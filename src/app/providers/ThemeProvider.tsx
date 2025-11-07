import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { theme } from '@shared/styles/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}

export default ThemeProvider

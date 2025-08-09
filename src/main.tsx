import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import { QueryProvider, ThemeProvider } from '@app/providers'

import GlobalStyle from '@shared/styles/globalStyle'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
)

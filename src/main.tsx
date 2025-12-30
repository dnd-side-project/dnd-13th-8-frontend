import { BrowserRouter } from 'react-router-dom'

import { Analytics } from '@vercel/analytics/react'
import { createRoot } from 'react-dom/client'

import { QueryProvider, ThemeProvider } from '@app/providers'

import GlobalStyle from '@shared/styles/globalStyle'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <ThemeProvider>
        <GlobalStyle />
        <Analytics />
        <App />
      </ThemeProvider>
    </QueryProvider>
  </BrowserRouter>
)

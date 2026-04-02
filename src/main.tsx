import { BrowserRouter } from 'react-router-dom'

import { Analytics } from '@vercel/analytics/react'
import { createRoot } from 'react-dom/client'

import { QueryProvider, ThemeProvider, ToastProvider } from '@app/providers'

import GlobalStyle from '@shared/styles/globalStyle'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <GlobalStyle />
          <Analytics />
          <App />
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  </BrowserRouter>
)

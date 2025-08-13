import type { Preview } from '@storybook/react-vite'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { theme } from '@/shared/styles/theme'
import GlobalStyle from '@/shared/styles/globalStyle'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Story />
        </ThemeProvider>
      </MemoryRouter>
    ),
  ],
}

export default preview

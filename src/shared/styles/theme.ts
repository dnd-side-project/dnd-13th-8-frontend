import { css } from 'styled-components'

export const theme = {
  COLOR: {
    'primary-normal': '#40eae2',
    'primary-soft': '#a5f6e7',
    'accent-pink': '#f6d4fe',
    'accent-yellow': '#ffffe2',
    'common-white': '#ffffff',
    'common-black': '#000000',
    'common-error': '#ff5454',
    'gray-10': '#fafbfe',
    'gray-50': '#e6edf8',
    'gray-100': '#d7e1ed',
    'gray-200': '#a6b4c7',
    'gray-300': '#7e889a',
    'gray-400': '#5d646f',
    'gray-500': '#3c424b',
    'gray-600': '#2a2f39',
    'gray-700': '#1f2027',
    'gray-800': '#181920',
    'gray-900': '#0f1014',
  },

  GRADIENT: {
    hologram: `conic-gradient(
      from 0deg,
      #ffffff 0deg,
      #c2fff4 68deg,
      #f8fccc 100deg,
      #c5f3eb 170deg,
      #ffe2fe 250deg,
      #c0f9ef 280deg,
      #fffbe9 340deg,
      #ffffff 360deg
    )`,
    gradient1: `linear-gradient(
      to right,
      #c0f5e5 0%,
      #eaf1e6 77%,
      #f0f1ce 100%
    )`,
    gradient2: `linear-gradient(
      to right,
      #8ef5e2 0%,
      #d8f5fe 100%
    )`,
  },

  OPACITY: {
    scrim: 'rgba(15, 16, 20, 0.6)',
  },

  FONT: {
    title: css`
      font-size: 24px;
      line-height: 32px;
      letter-spacing: -0.023em;
    `,
    heading1: css`
      font-size: 22px;
      line-height: 30px;
      letter-spacing: -0.0194em;
    `,
    heading2: css`
      font-size: 20px;
      line-height: 28px;
      letter-spacing: -0.012em;
    `,
    headline1: css`
      font-size: 18px;
      line-height: 26px;
      letter-spacing: -0.002em;
    `,
    headline2: css`
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.0057em;
    `,
    'body1-normal': css`
      font-size: 15px;
      line-height: 22px;
      letter-spacing: 0.0096em;
    `,
    'body1-reading': css`
      font-size: 15px;
      line-height: 24px;
      letter-spacing: 0.0096em;
    `,
    'body2-normal': css`
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.0145em;
    `,
    'body2-reading': css`
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0.0145em;
    `,
    label: css`
      font-size: 13px;
      line-height: 18px;
      letter-spacing: 0.0194em;
    `,
    caption1: css`
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.0252em;
    `,
    caption2: css`
      font-size: 11px;
      line-height: 14px;
      letter-spacing: 0.0311em;
    `,
  },
}

export type Theme = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

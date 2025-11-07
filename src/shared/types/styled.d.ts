import 'styled-components'
import { Theme } from './theme'

declare module 'styled-components' {
  // Theme의 모든 타입을 DefaultTheme에 할당하여 타입 확장
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}

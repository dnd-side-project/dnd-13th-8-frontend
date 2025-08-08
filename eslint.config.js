import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintPluginReact from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config(
  {
    // ESLint 검사에서 제외할 파일/디렉토리 지정
    ignores: ['dist', 'node_modules', 'stories'],
  },
  {
    // 설정 파일이 적용될 파일 확장자 지정
    files: ['**/*.{ts,tsx}'],

    // 미리 정의된 규칙 세트를 가져와 사용
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      eslintPluginPrettierRecommended,
      eslintPluginReact.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
    ],

    // 언어 관련 설정
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },

    // 특정 기술 스택에 특화된 규칙 제공
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'unused-imports': unusedImports,
    },

    // 개별 ESLint 규칙의 설정
    rules: {
      // 일반적인 코드 스타일 및 잠재적 오류 규칙
      indent: ['error', 2, { SwitchCase: 1 }],
      semi: 'off', // 세미콜론 규칙 비활성화 (Prettier에서 처리)
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log 사용 시 경고
      camelcase: ['error', { properties: 'never' }], // 객체 속성은 camelCase 강제하지 않음
      'space-infix-ops': 'warn', // 연산자 주변 공백 강제 (예: `a + b` 대신 `a+b` 경고)

      // React 관련 규칙
      'react/require-default-props': 'off', // Prop types에 defaultProps 요구하지 않음
      'react/react-in-jsx-scope': 'off', // JSX 스코프 내에서 React import 요구하지 않음
      'react/prop-types': 'off', // Prop types 사용을 강제하지 않음
      'react/jsx-pascal-case': 'warn', // JSX 컴포넌트 이름을 PascalCase로 설정
      'react/no-unknown-property': ['error', { ignore: ['css'] }], // 알 수 없는 HTML/JSX 속성 오류, Styled-components의 `css` prop은 예외로 허용
      'react/self-closing-comp': 'error', // 불필요하게 닫는 태그 (<div/> 대신 <div></div>) 방지
      'react/jsx-boolean-value': ['error', 'never'], // JSX에서 불필요한 true 값 생략 (예: `readOnly={true}` 대신 `readOnly`)
      'react/no-array-index-key': 'warn', // 배열의 key로 index 사용 시 경고
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }], // JSX props에 문자열은 따옴표 사용, children에는 중괄호 사용하지 않음
      'react/no-unescaped-entities': 'off', // JSX에서 HTML 엔티티 (예: `&nbsp;`) 이스케이프 강제 끄기 (가독성 목적)

      // React Hooks 규칙
      'react-hooks/rules-of-hooks': 'error', // React Hooks의 규칙을 따르는지 검사
      'react-hooks/exhaustive-deps': 'warn', // Effect의 의존성 배열 누락 시 경고

      // React Fast Refresh 규칙
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true, // 상수 export 시 React Fast Refresh 경고 예외
        },
      ],

      // TypeScript 관련 규칙
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 사용되지 않는 TypeScript 변수 금지, `_`로 시작하는 변수는 무시
      '@typescript-eslint/no-explicit-any': 'error', // `any` 타입 사용 금지

      // Import 관련 규칙
      'import/no-unresolved': 'off', // import 경로 해결 실패 시 오류 끄기
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'], // import 그룹 순서 정의
          pathGroups: [
            {
              pattern: 'react*', // 'react'로 시작하는 import를 'builtin' 그룹 전에 배치
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@app/**', // FSD app 레이어 import
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@entities/**', // FSD entities 레이어 import
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@features/**', // FSD features 레이어 import
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@shared/**', // FSD shared 레이어 import
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@widgets/**', // FSD widgets 레이어 import
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@pages/**', // FSD pages 레이어 import
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@/**', // `@/`로 시작하는 import를 'internal' 그룹처럼 처리 (프로젝트 루트의 alias)
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: {
            order: 'asc', // 알파벳 순으로 정렬
            caseInsensitive: true, // 대소문자 무시
          },
          'newlines-between': 'always', // 각 import 그룹 사이에 항상 빈 줄 추가
        },
      ],
      'import/prefer-default-export': 'off', // 단일 export 시 default export를 강제하지 않음

      // 사용되지 않는 import 제거
      'unused-imports/no-unused-imports': 'error', // 사용되지 않는 import 문 제거 강제
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // lint-staged에서 Prettier를 먼저 실행하므로 비활성화
      'prettier/prettier': 'off', // Prettier 규칙 비활성화

      'import/no-cycle': ['error', { maxDepth: Infinity }], // 모듈 간 순환 참조 방지. 무한 깊이까지 탐색하여 감지하며, 감지 시 빌드 실패 처리
    },

    // 플러그인이 규칙을 실행하는 데 필요한 추가 정보
    settings: {
      react: {
        version: 'detect', // React 버전을 자동으로 감지하여 React 관련 규칙을 정확하게 적용
      },
    },
  }
)

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 기능 추가
        'fix', // 버그 수정
        'chore', // 빌드 설정 변경, 패키지 설치, CI/CD 설정 등
        'style', // 코드 포맷팅 등 코드 의미에 영향이 없는 변경 사항
        'refactor', // 기능 변경 없이 코드 내부 구조, 설계, 성능 개선
        'docs', // README, 주석, 문서 파일 수정
        'revert', // 이전 커밋으로 복구
        'test', // 테스트 코드 추가 및 수정
        'deploy', // 배포
      ],
    ],
    'subject-case': [0], // 제목 대소문자 규칙 비활성화 (한국어 지원)
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0], // 마침표 규칙 비활성화
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['#'],
    },
  },
}

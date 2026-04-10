import stylistic from '@stylistic/eslint-plugin'

export default [
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
  }),
  {
    rules: {
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "@stylistic/space-before-function-paren": ["error", {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
    }
  }
]

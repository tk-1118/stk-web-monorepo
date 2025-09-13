import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    files: [
      'packages/feat-users/**/*.ts',
      'packages/feat-users/**/*.tsx',
      'packages/feat-users/**/*.js',
      'packages/feat-users/**/*.jsx',
      'packages/feat-users/**/*.vue',
    ],
    rules: {},
  },
  {
    files: ['packages/feat-users/**/*.ts', 'packages/feat-users/**/*.tsx'],
    rules: {},
  },
  {
    files: ['packages/feat-users/**/*.js', 'packages/feat-users/**/*.jsx'],
    rules: {},
  },
]

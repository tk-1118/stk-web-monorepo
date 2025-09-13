import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            { sourceTag: 'type:app', onlyDependOnLibsWithTags: ['type:lib'] },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:ui'],
            },
            {
              sourceTag: 'scope:dev',
              onlyDependOnLibsWithTags: ['scope:dev', 'scope:shared'],
            },
            {
              sourceTag: 'scope:feature',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:dev'],
            },
            {
              sourceTag: 'feature:users',
              notDependOnLibsWithTags: ['feature:orders'],
            },
            {
              sourceTag: 'feature:orders',
              notDependOnLibsWithTags: ['feature:users'],
            },
            { sourceTag: 'type:lib', onlyDependOnLibsWithTags: ['type:lib'] },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];

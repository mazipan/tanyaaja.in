module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'unused-imports',
    'prettier',
  ],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@next/next/no-img-element': 'off',
    'no-param-reassign': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react/forbid-prop-types': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-shadow': 'off',
    'no-plusplus': 'off',
    'spaced-comment': 'off',
    'guard-for-in': 'off',
    'react/no-danger': 'off',
    'react/button-has-type': 'off',
    'react/no-unescaped-entities': 'off',
    'operator-assignment': 'off',
    'prefer-destructuring': 'off',
    'react/no-children-prop': 'off',
    'consistent-return': 'off',
    'react/state-in-constructor': 'off',
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
    'react/destructuring-assignment': 'off',
    '@typescript-eslint/dot-notation': 'off',
    'no-bitwise': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/naming-convention': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'no-alert': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'react/require-default-props': 'off',
    'react/sort-prop-types': 'error',
    'react/prop-types': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'import/no-named-as-default': 'off',
    'prefer-object-spread': 'off',
    'arrow-body-style': 'off',
    'no-console': [
      2,
      {
        allow: ['warn', 'error'],
      },
    ],

    // Unused Import
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // /end Unused Import

    // Import Sort
    'simple-import-sort/exports': 'warn',
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          ['^node:', '^react', '^next', '^@radix'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          ['^~?\\w'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
          ['^.+\\.s?css$'],
        ],
      },
    ],
    // /end Import Sort
  },
}

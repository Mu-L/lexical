/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

const tsconfig = require('./tsconfig.json');

const common = {
  modulePathIgnorePatterns: ['/npm'],
};

// Use tsconfig's paths to configure jest's module name mapper
const moduleNameMapper = {
  ...Object.fromEntries(
    Object.entries(tsconfig.compilerOptions.paths).map(
      ([name, [firstPath]]) => [
        `^${name}$`,
        firstPath.replace(/^\./, '<rootDir>'),
      ],
    ),
  ),
  '^shared/invariant$': '<rootDir>/packages/shared/src/__mocks__/invariant.ts',
  '^shared/warnOnlyOnce$':
    '<rootDir>/packages/shared/src/__mocks__/warnOnlyOnce.ts',
};

// necessary transformations for shiki support
const npm_modules_transformed = [
  'shiki',
  '@shikijs',
  'hast-util-to-html',
  'html-void-elements',
  'property-information',
  'zwitch',
  'stringify-entities',
  'character-entities-legacy',
  'character-entities-html4',
  'ccount',
  'comma-separated-tokens',
  'space-separated-tokens',
  'hast-util-whitespace',
];

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'unit',
      globals: {
        // https://react.dev/blog/2022/03/08/react-18-upgrade-guide#configuring-your-testing-environment
        IS_REACT_ACT_ENVIRONMENT: true,
        __DEV__: true,
      },
      moduleNameMapper,
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/unit/**/*.test{.ts,.tsx,.js,.jsx}'],
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.mjs$': 'babel-jest',
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.test.json',
          },
        ],
      },
      transformIgnorePatterns: [
        '/node_modules/(?!(' + npm_modules_transformed.join('|') + '))',
      ],
    },
    {
      ...common,
      displayName: 'integration',
      globalSetup: './scripts/__tests__/integration/setup.js',
      testMatch: ['**/scripts/__tests__/integration/**/*.test.js'],
    },
    {
      ...common,
      displayName: 'e2e',
      testMatch: [
        '**/__tests__/e2e/**/*.js',
        '**/__tests__/regression/**/*.js',
      ],
    },
  ],
};

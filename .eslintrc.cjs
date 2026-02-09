module.exports = {
  root: false, // keep this as non-root so root config still applies
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      settings: {
        'import/resolver': {
          typescript: {
            // Point at the tsconfig that has the @groundworkjs/* path alias
            project: ['./tsconfig.json'],
            alwaysTryTypes: true,
          },
          node: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.d.ts'],
            moduleDirectory: ['node_modules', '../../node_modules'],
          },
        },
      },
      rules: {
        // your existing no-restricted-imports block stays as-is
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'fs',
                message: 'Filesystem access is not allowed in tenant code.',
              },
              {
                name: 'child_process',
                message: 'Process spawning is not allowed in tenant code.',
              },
              {
                name: 'worker_threads',
                message: 'Worker threads are not allowed in tenant code.',
              },
              {
                name: '@groundworkjs/db',
                importNames: ['default', 'client', 'db'],
                message: 'Use { tenantDb } from @groundworkjs/db.',
              },
            ],
            patterns: [
              {
                group: ['@groundworkjs/backend*'],
                message: 'No backend internals from tenant.',
              },
              {
                group: ['@groundworkjs/frontend*'],
                message: 'No frontend internals from tenant.',
              },
              {
                group: ['@groundworkjs/*'],
                message:
                  'Only @groundworkjs/plugin-sdk is allowed in tenant code.',
              },
            ],
          },
        ],

        // Let ESLint treat peer deps as valid (so it won’t yell about express)
        'import/no-extraneous-dependencies': [
          'error',
          {
            peerDependencies: true,
            devDependencies: ['**/*.{ts,tsx}'],
          },
        ],
      },
    },
  ],
};

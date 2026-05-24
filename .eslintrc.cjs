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
                message:
                  '@groundworkjs/db is a platform-internal package. Use TenantDatabase from @groundworkjs/plugin-sdk instead.',
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
        // Disallow select('*') — all queries must use explicit column lists to
        // prevent accidentally exposing future columns or internal fields.
        'no-restricted-syntax': [
          'warn',
          {
            selector:
              "CallExpression[callee.property.name='select'][arguments.0.type='Literal'][arguments.0.value='*']",
            message:
              "Avoid .select('*') — use an explicit column list to prevent unintended data exposure.",
          },
          {
            selector: "MemberExpression[object.name='process'][property.name='env']",
            message:
              'Direct process.env access is not allowed in tenant code. Platform secrets are readable this way. Use configuration values provided by @groundworkjs/plugin-sdk instead.',
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

import type { TenantManifest } from '@groundworkjs/plugin-sdk';

const manifest: TenantManifest = {
  name: 'gwjs-stock-tenant',
  version: '0.0.1',
  description: 'Stock tenant bundle shipped with GWJS',
  sdk: '1',
  
  // Compatibility
  baseVersions: ['v1.x'], // Compatible with all 1.x versions
  
  // Deployment preferences
  deployment: {
    preferredBaseVersion: 'v1.0.0',
    requiresRebuild: false,
    buildType: 'runtime',
  },
  
  // No overrides in stock tenant
  overrides: {
    backend: false,
    frontend: false,
    database: false,
    plugins: [],
  },
  
  // Rollback configuration
  rollback: {
    enabled: true,
    keepVersions: 3,
    autoRollbackOnFailure: false,
  },
};

export default manifest;

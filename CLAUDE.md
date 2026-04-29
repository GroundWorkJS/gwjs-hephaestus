# CLAUDE.md - GroundWorkJS Tenant Customization

**Last verified**: 2026-04-29

> Your workspace for customizing and extending GroundWorkJS with custom pages, APIs, and business logic.

## Workspace Collective

This repo is one of **five interconnected GroundWorkJS repos** in the same VS Code workspace. Always read [`../WORKSPACE.md`](../WORKSPACE.md) first — it documents how they fit together and which neighbors to cross-check.

**This repo's role**: Default tenant customization. Reference implementation for tenant developers. Consumes `@groundworkjs/plugin-sdk` from `gwjs-behemoth`. Cloned by `gwjs-do-infra/build-with-tenant.sh` on the VPS during platform builds.

**Cross-check before merging changes here**:
- New routes → must not conflict with `gwjs-behemoth/scripts/validate-tenant-routes.mjs` blacklist (validation runs at deploy time in `gwjs-infra-management` AND on VPS)
- New imports → must only reference `@groundworkjs/plugin-sdk` (validated by `gwjs-behemoth/scripts/validate-tenant-imports.mjs`)
- Migrations → `tenant_` prefix only, `tenant_ext` schema only (DB user permissions enforced by `gwjs-do-infra/configure_app.sh`)
- SDK API usage → may break if `gwjs-behemoth` plugin-SDK contract changes; pin to a platform tag for stability

## ⚠️ Platform Security Status (2026-04-29)

The platform that runs this tenant code now provides:
- **isolated-vm sandbox** (replaced VM2): tenant code runs in V8 isolates with 128MB memory + 30s execution timeout.
- **QueryBuilder Proxy**: `TenantDatabase` blocks raw SQL methods (`raw`, `whereRaw`, `joinRaw`, etc.) at runtime.
- **GraphQL hardening**: depth (6) + complexity (1000) limits, plus rate limiting on `/graphql`.
- **Per-tenant Docker network isolation**: `gwjs-net-${INSTANCE}` prevents lateral movement.

**Known limitation**: ~~SSH credential keys on the credential server are not yet GPG-encrypted at rest~~ — RESOLVED 2026-04-29: SSH private keys on `nyx1.gwjs.io:/opt/gwjs-credentials/ssh/` are now GPG-encrypted (RSA-4096) with on-the-fly decryption via the `fetch-credential` helper. No tenant action required.

See platform `docs/reference/SECURITY_LIMITATIONS.md` (platform staff only).


## What This Repo Is

This is a **tenant customization workspace** for GroundWorkJS. You can add:
- Custom React pages and components
- Custom backend API routes
- Custom database tables (prefixed with `tenant_`)
- Your own business logic

## SDK-Only Access

All customizations use the `@groundworkjs/plugin-sdk`:

```typescript
import {
  TenantDatabase,      // Database access (your tables only)
  requireAuth,         // Authentication middleware
  getTenantUser,       // Get current user
  TenantLogger,        // Structured logging
  asyncHandler,        // Route error handling
  sendSuccess,         // JSON response helpers
  sendError,
  hasPermission,       // Permission checks
  hasRole              // Role checks
} from '@groundworkjs/plugin-sdk';
```

**⚠️ Import Restriction**: Only import from `@groundworkjs/plugin-sdk`. Importing from other `@groundworkjs/*` packages will cause build failures.

## Security Utilities (February 2026)

The plugin-SDK provides security utilities that tenant code **must** use:

### Admin Authorization

```typescript
import { isAdmin, requireAdminAuth } from '@groundworkjs/plugin-sdk';

// Check admin role in route handlers
if (!isAdmin(user)) {
  return sendError(res, 403, 'Admin access required');
}

// Or use as Express middleware (rejects non-admin with 403)
router.get('/admin-data', requireAuth, requireAdminAuth, asyncHandler(async (req, res) => {
  // Only admins reach here
}));
```

### Resource IDs

Use `crypto.randomUUID()` for all resource identifiers — never `Math.random()`:

```typescript
import { randomUUID } from 'crypto';

const resourceId = randomUUID(); // ✅ Cryptographically secure
const bad = Math.random().toString(36); // ❌ Predictable, insecure
```

### Query Safety

Tenant code **must** use parameterized queries only. Raw SQL methods (`.whereRaw()`, `.joinRaw()`, `.orderByRaw()`, etc.) are blocked by an ES6 Proxy on the QueryBuilder. Attempting to call them will throw an error.

```typescript
// ✅ Parameterized (safe)
await db.table('tenant_posts').where('status', 'published');
await db.table('tenant_posts').whereILike('title', '%search%');

// ❌ Blocked by proxy — throws error
await db.table('tenant_posts').whereRaw('status = ?', ['published']);
```

## Project Structure

```
├── manifest.ts           # Tenant configuration
├── frontend/
│   ├── index.ts         # Frontend exports
│   ├── routes.ts        # Custom page routes
│   └── components/      # React components
├── backend/
│   ├── router.ts        # Main router
│   └── routes.ts        # API route definitions
├── database/
│   └── db/
│       ├── migrations/  # Knex migrations (tenant_ prefix)
│       └── seeds/       # Seed data
└── types/               # TypeScript type definitions
```

## Database Rules

- **Table prefix**: All tables MUST be prefixed with `tenant_`
- **Schema**: Tables live in `tenant_ext` schema
- **Access**: You can only query your own tables

```typescript
// ✅ Correct
await db.table('tenant_posts').select();
await db.table('tenant_settings').where('key', 'theme').first();

// ❌ Will fail - no access to platform tables
await db.table('users').select();  // Access denied
```

## Common Commands

```bash
# Install dependencies
pnpm install

# Build tenant code
pnpm build

# Watch mode (development)
pnpm dev

# Type check
pnpm type-check
```

## Development Setup

### Option 1: Sealed Dev Environment (Recommended)

Use the official [gwjs-dev-tenant-environment](https://github.com/GroundWorkJS/gwjs-dev-tenant-environment):

```bash
# Clone the sealed environment
git clone https://github.com/GroundWorkJS/gwjs-dev-tenant-environment.git

# Start with your tenant code
cd gwjs-dev-tenant-environment
./start.sh /path/to/this/repo
```

## Creating a Migration

```typescript
// database/db/migrations/20240101120000_create_posts.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('title').notNullable();
    table.text('content');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tenant_posts');
}
```

## Creating an API Route

API routes are mounted at `/api/tenant/*`:

```typescript
// backend/routes.ts
import { Router } from 'express';
import { asyncHandler, sendSuccess, requireAuth, TenantDatabase } from '@groundworkjs/plugin-sdk';

export function registerRoutes(router: Router, db: TenantDatabase) {
  // Available at /api/tenant/posts
  router.get('/posts', requireAuth, asyncHandler(async (req, res) => {
    const posts = await db.table('tenant_posts').select();
    sendSuccess(res, { posts });
  }));
}
```

## Creating a Frontend Page

Frontend pages are registered in `frontend/routes.ts` and mounted at the **root level** (no prefix):

```tsx
// frontend/routes.ts
export const additivePages = {
  '/posts': 'PostsPage',
  '/posts/:id': 'PostDetailPage',   // Dynamic route
  '/docs/**': 'DocsPage',           // Catch-all
};

// frontend/components/PostsPage.tsx
import React from 'react';
import { usePluginAuth } from '@groundworkjs/plugin-sdk/ui';

export function PostsPage() {
  const { user } = usePluginAuth();
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
    </div>
  );
}

// frontend/components/PostDetailPage.tsx
import React from 'react';
import { useTenantRouteParams } from '@groundworkjs/plugin-sdk/ui';

export function PostDetailPage() {
  // Access :id from route /posts/:id
  const { id } = useTenantRouteParams<{ id: string }>();
  
  return <h1>Post {id}</h1>;
}
```

## Route Restrictions

Tenant routes **cannot conflict** with platform reserved routes like:
- `/login`, `/dashboard`, `/admin/*`, `/settings/*`, `/profile`
- `/api/auth/*`, `/api/admin/*`, `/api/users/*`

The build process validates routes before deployment.
```

## TypeScript Configuration

Your `tsconfig.json` should include path blocking for platform packages:

```json
{
  "compilerOptions": {
    "paths": {
      "@groundworkjs/plugin-sdk": ["<resolved by dev environment>"],
      "@groundworkjs/plugin-sdk/ui": ["<resolved by dev environment>"],
      "@groundworkjs/db": ["../BLOCKED-CORE-PACKAGE"],
      "@groundworkjs/backend": ["../BLOCKED-CORE-PACKAGE"]
    }
  }
}
```

This ensures TypeScript errors if you accidentally import blocked packages.

## Support

- Documentation: https://groundworkjs.com/docs
- Support: https://groundworkjs.com/support

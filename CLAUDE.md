# CLAUDE.md - GroundWorkJS Tenant Customization

> Your workspace for customizing and extending GroundWorkJS with custom pages, APIs, and business logic.

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

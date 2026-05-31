# Tenant Developer Guide

This guide covers tenant customization workflows only.

## Overview

Use this repository to implement:

- Custom frontend pages
- Custom backend routes
- Custom tenant database tables and seeds

Keep all code within the SDK boundary:

- `@groundworkjs/plugin-sdk`
- `@groundworkjs/plugin-sdk/ui`

## Prerequisites

- Node.js 18+
- pnpm
- Git

## Daily Workflow

```bash
pnpm install
pnpm dev
```

In another terminal:

```bash
pnpm type-check
pnpm build
```

## Project Layout

```text
backend/                API routes and backend logic
frontend/               Pages and UI components
database/db/migrations  Schema migrations
database/db/seeds       Seed data
types/                  Tenant type declarations
manifest.ts             Tenant metadata
```

## Backend Example

```ts
import { Router } from 'express';
import type { TenantRouterFactory } from '@groundworkjs/plugin-sdk';
import { asyncHandler, requireAuth, sendSuccess } from '@groundworkjs/plugin-sdk';

const createTenantRouter: TenantRouterFactory = ({ db }) => {
  const router = Router();

  router.get(
    '/posts',
    requireAuth,
    asyncHandler(async (_req, res) => {
      const posts = await db.table('tenant_posts').select('*').orderBy('created_at', 'desc');
      sendSuccess(res, { posts });
    })
  );

  return router;
};

export default createTenantRouter;
```

## Frontend Example

```tsx
import React from 'react';
import { usePluginAuth } from '@groundworkjs/plugin-sdk/ui';

export default function PostsPage() {
  const { user } = usePluginAuth();

  return (
    <main>
      <h1>Posts</h1>
      <p>Signed in as: {user?.name ?? 'Unknown user'}</p>
    </main>
  );
}
```

Route registration:

```ts
// frontend/routes.ts
export const additivePages = {
  '/posts': 'PostsPage',
};
```

## Database Example

```ts
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('title').notNullable();
    table.text('content');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenant_posts');
}
```

Run migrations locally:

```bash
pnpm db:migrate
pnpm db:seed
```

## Rules

- Prefix all tenant tables with `tenant_`
- Validate user input in backend handlers
- Protect sensitive routes with `requireAuth`
- Do not import platform-internal packages

## Troubleshooting

### Import errors

Only import from SDK packages. Unsupported imports will fail builds.

### Missing database table

Confirm migration file exists under `database/db/migrations` and run `pnpm db:migrate`.

### Route not loading

Confirm route exists in `frontend/routes.ts` and exported component name matches.

## Related Docs

- `README.md` for onboarding
- `docs/QUICKSTART_REMOTE_DEV.md` for remote dev
- `database/README.md` for schema conventions
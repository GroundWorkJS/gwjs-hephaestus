# CLAUDE.md - GroundWorkJS Tenant Customization

Last verified: 2026-05-26

This repository is intended for tenant developers customizing their GroundWorkJS instance.

## Scope

This repo is for tenant customization only:

- Custom frontend pages and components
- Custom backend routes
- Custom tenant database schema and seeds
- Tenant-specific business logic

## SDK Boundary

Import only from `@groundworkjs/plugin-sdk` and `@groundworkjs/plugin-sdk/ui`.

Allowed example:

```ts
import { TenantDatabase, requireAuth } from '@groundworkjs/plugin-sdk';
import { usePluginAuth } from '@groundworkjs/plugin-sdk/ui';
```

Do not import platform internals.

## Project Structure

```text
backend/            Custom API routes
frontend/           Custom pages/components
database/db/        Migrations and seeds
types/              Tenant type declarations
manifest.ts         Tenant manifest metadata
```

## Database Rules

- Prefix all tables with `tenant_`
- Use migrations under `database/db/migrations`
- Use seeds under `database/db/seeds`

## Daily Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm type-check
pnpm db:migrate
pnpm db:seed
```

## Routing Notes

- Frontend routes are defined in `frontend/routes.ts`
- Backend routes are defined in `backend/router.ts`

## Recommended Reading

- `README.md` for onboarding and examples
- `DEVELOPMENT.md` for implementation patterns
- `docs/QUICKSTART_REMOTE_DEV.md` for remote dev workflow

## Tenant Doc Policy

Tenant-facing docs in this repo should contain only:

- Tutorials
- How-to guides
- SDK usage patterns
- Practical examples

Avoid adding internal infrastructure or platform implementation details.
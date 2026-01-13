# Tenant Developer Guide

Welcome! This guide helps you customize and extend your GWJS platform instance using the tenant development workflow.

## 🎯 Your Workflow at a Glance

```bash
# 1. Clone your tenant workspace
git clone <your-tenant-repo>
cd your-tenant

# 2. Pull latest platform image
docker pull ghcr.io/groundworkjs/platform:prod-stock

# 3. Start development environment
docker-compose up

# 4. Edit your customizations (hot reload enabled)
# - Add pages in frontend/pages/
# - Add APIs in backend/router.ts
# - Add migrations in database/migrations/

# 5. Deploy when ready
# (See deployment section below)
```

---

## 📁 Project Structure

```
your-tenant/
├── manifest.ts              # Tenant metadata (name, version)
├── package.json             # Dependencies (plugin-sdk only)
├── tsconfig.json            # TypeScript config
├── docker-compose.yml       # Platform + tenant dev environment
│
├── backend/
│   ├── router.ts            # Custom API routes
│   └── services/            # Your business logic
│
├── frontend/
│   ├── pages/
│   │   ├── index.ts         # Page registry
│   │   ├── Dashboard.tsx    # Example: /o/dashboard
│   │   └── Settings.tsx     # Example: /o/settings
│   └── components/          # Shared UI components
│
└── database/
    ├── migrations/          # Tenant schema changes
    └── seeds/               # Test data
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js 18+** and **pnpm** (for TypeScript development)
- **Git** for version control

### Initial Setup

```bash
# 1. Clone your tenant repository
git clone <your-tenant-repo-url>
cd your-tenant

# 2. Install dependencies (for TypeScript intellisense)
pnpm install

# 3. Copy environment template (if provided)
cp .env.example .env

# 4. Start development environment
docker-compose up
```

**What happens:**
- ✅ Platform container starts (includes backend API, frontend, database)
- ✅ Your tenant code is mounted as volumes (hot reload enabled)
- ✅ Platform serves at http://localhost:3000
- ✅ Your custom pages appear at http://localhost:3000/o/*

---

## 🛠️ Development Workflow

### Daily Development

```bash
# Terminal 1: Keep this running
docker-compose up

# Terminal 2: Edit your code
vim frontend/pages/Dashboard.tsx

# Terminal 3: Run migrations or tests
docker-compose exec backend pnpm run migrate
```

**Hot Reload:**
- ✅ Frontend changes: Instant browser refresh
- ✅ Backend changes: Automatic server restart
- ✅ No need to restart containers

### Adding a New Page

**1. Create the page component:**
```typescript
// frontend/pages/Reports.tsx
import React from 'react';
import { requireAuth } from '@groundworkjs/plugin-sdk';

const Reports: React.FC = () => {
  return (
    <div>
      <h1>Reports</h1>
      <p>Your custom reports page</p>
    </div>
  );
};

export default requireAuth(Reports, ['reports:view']);
```

**2. Register in page index:**
```typescript
// frontend/pages/index.ts
import Dashboard from './Dashboard';
import Reports from './Reports';

export const pages = {
  dashboard: Dashboard,
  reports: Reports,
};
```

**3. Test in browser:**
- Visit: http://localhost:3000/o/reports
- Should see your new page

### Adding a Custom API Route

**1. Add route handler:**
```typescript
// backend/router.ts
import { Router } from 'express';
import { TenantDatabase, requireAuth } from '@groundworkjs/plugin-sdk';

const router = Router();

router.get('/api/reports', requireAuth(['reports:view']), async (req, res) => {
  const tenantDb = new TenantDatabase(req.tenantId);

  const data = await tenantDb.raw(`
    SELECT * FROM tenant_reports
    WHERE created_at > NOW() - INTERVAL '30 days'
  `);

  res.json({ reports: data.rows });
});

export default router;
```

**2. Test API:**
```bash
curl http://localhost:4000/o/your-tenant/api/reports \
  -H "Authorization: Bearer <your-token>"
```

### Adding Database Migrations

**1. Create migration file:**
```bash
# Naming: YYYYMMDDHHMMSS_description.ts
# Example: 20240115120000_add_reports_table.ts
```

```typescript
// database/migrations/20240115120000_add_reports_table.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenant_reports', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.jsonb('data');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tenant_reports');
}
```

**2. Run migration:**
```bash
# Inside Docker container
docker-compose exec backend pnpm run migrate

# Or use platform UI
# Navigate to: http://localhost:3000/admin/deployment
# → Database Operations → Run Migrations
```

---

## 🔐 Security & Permissions

### Plugin SDK: Your Security Boundary

**✅ ALWAYS import from plugin-sdk:**
```typescript
import {
  TenantDatabase,    // Isolated tenant database
  requireAuth,       // Role-based auth middleware
  getTenantLogger,   // Scoped logging
  validateInput      // Input sanitization
} from '@groundworkjs/plugin-sdk';

import type {
  User,              // Type definitions
  MenuItem,
  TenantConfig
} from '@groundworkjs/plugin-sdk/types';
```

**❌ NEVER try to access:**
```typescript
// These won't work and will break security
import { knex } from '@gwjs/database';          // Platform internals
import { UserService } from '@gwjs/backend';    // Not exposed
import platformConfig from '../../../config';   // Outside your scope
```

### Role-Based Access Control

**Protect routes with permissions:**
```typescript
// Backend API
router.get('/admin/users',
  requireAuth(['admin:users']),
  async (req, res) => {
    // Only users with 'admin:users' permission can access
  }
);

// Frontend page
export default requireAuth(AdminPanel, ['admin:panel']);
```

**Check permissions in code:**
```typescript
import { checkPermission } from '@groundworkjs/plugin-sdk';

const MyComponent = () => {
  const canEdit = checkPermission('reports:edit');

  return (
    <div>
      {canEdit && <button>Edit Report</button>}
    </div>
  );
};
```

---

## 🧪 Testing

### Test Your Changes Locally

```bash
# Start dev environment
docker-compose up

# Run unit tests
pnpm test

# Run type checking
pnpm run build
```

### Test Database Migrations

```bash
# Apply migrations
docker-compose exec backend pnpm run migrate

# Rollback last migration
docker-compose exec backend pnpm run migrate:rollback

# Check migration status
docker-compose exec backend pnpm run migrate:status
```

### Test with Seed Data

```bash
# Run seeds
docker-compose exec backend pnpm run seed

# Or use platform UI at /admin/deployment
```

---

## 📦 Building for Production

### Build Your Tenant Code

```bash
# Compile TypeScript
pnpm run build

# This creates dist/ folder with compiled JS
# Platform will load these in production
```

### Verify Build

```bash
# Check build output
ls -la dist/
# Should see: backend/, frontend/, manifest.js

# Verify no errors
pnpm run build --verbose
```

---

## 🚀 Deployment

### Deployment Options

**Option 1: Deploy via Platform UI** (Recommended)
1. Push your changes to git
2. Navigate to http://your-instance.com/admin/deployment
3. Click "Deploy Latest"
4. Platform pulls your repo, builds, and deploys

**Option 2: Deploy Pre-Built Image**
1. Build and push Docker image with your tenant code
2. Navigate to http://your-instance.com/admin/deployment
3. Use "Deploy from Existing Image"
4. Enter image tag

**Option 3: CI/CD Pipeline** (Advanced)
- Set up GitHub Actions or similar
- Trigger deployment on push to main
- See platform docs for webhook setup

### Pre-Deployment Checklist

- [ ] All TypeScript compiles without errors (`pnpm run build`)
- [ ] Tests passing (`pnpm test`)
- [ ] Migrations tested locally
- [ ] No hardcoded secrets (use environment variables)
- [ ] Permissions configured correctly
- [ ] Changes committed and pushed to git

---

## 🔧 Configuration

### Environment Variables

**Create `.env` file** (not committed to git):
```bash
# Database (provided by platform)
TENANT_DATABASE_URL=postgresql://...

# Your custom config
TENANT_FEATURE_X_ENABLED=true
TENANT_API_KEY=your-secret-key
TENANT_MAX_UPLOADS=10
```

**Use in code:**
```typescript
// backend/router.ts
const apiKey = process.env.TENANT_API_KEY;
const maxUploads = parseInt(process.env.TENANT_MAX_UPLOADS || '5');
```

### Manifest Configuration

**Edit `manifest.ts`:**
```typescript
export const manifest = {
  name: 'acme-corp',
  version: '1.2.3',
  displayName: 'Acme Corporation',

  features: {
    customDashboard: true,
    reporting: true,
    analytics: false,
  },

  theme: {
    primaryColor: '#007bff',
    logo: '/assets/acme-logo.png',
  },
};
```

---

## 🐛 Troubleshooting

### Issue: "Module not found: @groundworkjs/plugin-sdk"

**Cause:** Dependencies not installed

**Fix:**
```bash
pnpm install
docker-compose down
docker-compose up --build
```

### Issue: "Permission denied" on API routes

**Cause:** Missing authentication or wrong permissions

**Fix:**
```typescript
// Check you're using requireAuth
import { requireAuth } from '@groundworkjs/plugin-sdk';

router.get('/api/data',
  requireAuth(['data:read']),  // ← Add this
  async (req, res) => {
    // handler
  }
);
```

### Issue: "Tenant pages not loading"

**Cause:** Pages not registered or Docker volumes not mounted

**Fix:**
```bash
# 1. Check page registry
cat frontend/pages/index.ts
# Should export all your pages

# 2. Restart containers
docker-compose down
docker-compose up

# 3. Check Docker volumes in docker-compose.yml
# Should have: ./frontend:/app/tenant/frontend
```

### Issue: "Database migration failed"

**Cause:** Schema conflict or invalid SQL

**Fix:**
```bash
# Check migration status
docker-compose exec backend pnpm run migrate:status

# Rollback last migration
docker-compose exec backend pnpm run migrate:rollback

# Fix migration file, then re-run
docker-compose exec backend pnpm run migrate
```

### Issue: "Hot reload not working"

**Cause:** Docker volume sync issues or file watcher limits

**Fix:**
```bash
# macOS: Increase file watcher limit
# Add to ~/.docker/daemon.json
{
  "max-concurrent-uploads": 50
}

# Restart Docker Desktop

# Or use polling mode in docker-compose.yml
environment:
  - CHOKIDAR_USEPOLLING=true
```

---

## 📚 Resources

### Documentation
- **Plugin SDK API Reference**: See `node_modules/@groundworkjs/plugin-sdk/README.md`
- **Platform Documentation**: Contact your platform administrator
- **TypeScript Docs**: https://www.typescriptlang.org/docs/

### Examples

**Sample Projects:**
- Check `frontend/pages/Dashboard.tsx` for page example
- Check `backend/router.ts` for API example
- Check `database/migrations/` for migration examples

### Getting Help

1. **Check logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. **Platform admin panel:**
   - http://localhost:3000/admin/deployment
   - View deployment history, logs, database operations

3. **Contact support:**
   - Check with your platform administrator
   - Review platform documentation
   - Open issue in your tenant repo

---

## 🎓 Best Practices

### Do's ✅

- ✅ Use TypeScript for all code (type safety)
- ✅ Import only from `@groundworkjs/plugin-sdk`
- ✅ Use `requireAuth()` on all protected routes
- ✅ Use `TenantDatabase` for all database queries
- ✅ Keep migrations reversible (implement `down()`)
- ✅ Use environment variables for config
- ✅ Test locally before deploying
- ✅ Commit meaningful changes

### Don'ts ❌

- ❌ Don't access platform database directly
- ❌ Don't hardcode secrets in code
- ❌ Don't modify platform code (you don't have access anyway)
- ❌ Don't skip authentication checks
- ❌ Don't deploy without testing migrations
- ❌ Don't use global state (multi-tenant environment)

---

## � Platform Development Environment (For Platform Contributors)

**Note:** This section is for those contributing to the platform itself (gwjs-behemoth), not for tenant development.

If you're working on the **platform infrastructure** and need to test tenant isolation:

### Setup

```bash
# 1. Make sure hephaestus is cloned to your home directory
cd ~
git clone git@github.com:your-org/gwjs-hephaestus.git

# 2. Navigate to platform repository
cd ~/dev/gwjs/gwjs-behemoth

# 3. Run setup (creates symlink to hephaestus)
./scripts/setup-tenant-dev.sh

# 4. Start tenant development environment
docker-compose -f docker-compose.tenant-dev.yml up
```

### What This Does

- Creates isolated VM2 sandbox container
- Mounts **this tenant repository** (gwjs-hephaestus) to `/workspace`
- Provides PostgreSQL with `tenant_ext` schema only
- Provides MinIO S3 storage for file testing
- Enforces same security boundaries as production

### Services

- **Tenant API**: http://localhost:4000/api
- **PostgreSQL**: localhost:5432 (tenant_ext schema only)
- **MinIO Console**: http://localhost:9001
- **Health Check**: http://localhost:4000/healthz

### Testing Security

```bash
# Validate sandbox isolation
cd ~/dev/gwjs/gwjs-behemoth
./scripts/validate-tenant-sandbox.sh

# Test API
curl http://localhost:4000/api/hello

# Test security (should fail gracefully)
curl http://localhost:4000/api/exploit-test
```

### Documentation

Full documentation for platform developers:
- [TENANT_DEV_SETUP.md](../gwjs-behemoth/TENANT_DEV_SETUP.md) - Quick reference
- [TENANT_DEVELOPMENT_GUIDE.md](../gwjs-behemoth/docs/TENANT_DEVELOPMENT_GUIDE.md) - Complete guide

---

## �🔄 Version Control

### Branching Strategy

```bash
main                 # Production-ready code
└── develop          # Integration branch
    ├── feature/reports
    ├── feature/dashboard
    └── fix/auth-bug
```

### Commit Guidelines

```bash
# Good commits
git commit -m "feat: add reports page with filtering"
git commit -m "fix: resolve auth redirect loop"
git commit -m "chore: update dependencies"

# Bad commits
git commit -m "updates"
git commit -m "WIP"
git commit -m "stuff"
```

---

## 🚦 Development Checklist

### Starting New Feature

- [ ] Create feature branch from `develop`
- [ ] Update `manifest.ts` if adding major feature
- [ ] Add necessary database migrations
- [ ] Implement backend API routes
- [ ] Create frontend pages/components
- [ ] Add authentication/authorization
- [ ] Test locally with seed data
- [ ] Update documentation (if complex)

### Deploying to Production

- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Migrations tested locally (up and down)
- [ ] Environment variables configured
- [ ] Changes peer-reviewed (if team)
- [ ] Pushed to main branch
- [ ] Deployed via platform UI
- [ ] Smoke test after deployment

---

**Ready to build?** Start with `docker-compose up` and check out the example pages in `frontend/pages/`! 🚀

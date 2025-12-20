<div align="center">
  <img src="https://groundworkjs.com/assets/logo.png" alt="GroundWorkJS" width="400" />

  # GroundWorkJS Customization Starter

  **Customize and extend your GroundWorkJS instance** with custom pages, API routes, and business logic.

  [Website](https://groundworkjs.com/) • [Documentation](https://groundworkjs.com/docs) • [Support](https://groundworkjs.com/support)
</div>

---

## 🎯 What Is This?

This is your **customization workspace** for GroundWorkJS. Add your organization's unique features:

- **Custom Pages**: Build React components for your workflows
- **Custom APIs**: Create backend routes for your business logic
- **Custom Data**: Define database tables for your application
- **Full TypeScript**: Type-safe development with excellent IDE support

Think of it like a plugin system - you can extend GroundWorkJS with your own code while the platform handles authentication, hosting, and infrastructure.

> 💡 **New to development?** Don't worry! This guide walks you through everything step-by-step.

---

## 🛠️ What You Can Build

### ✅ You Have Full Access To

```typescript
import {
  TenantDatabase,      // Database access to your custom tables
  requireAuth,         // Authentication & authorization
  getTenantUser,       // Current user information
  TenantLogger,        // Structured logging
  asyncHandler,        // Route error handling
  sendSuccess,         // JSON responses
  sendError,
  hasPermission,       // Check user permissions
  hasRole              // Check user roles
} from '@groundworkjs/plugin-sdk';

// Query your custom tables
await db.table('tenant_posts').select();
await db.table('tenant_settings').where('key', 'theme').first();

// Use authentication
const user = requireAuth(req); // Ensures user is logged in
const userId = getTenantUser(req)?.id;

// Log events
logger.info('User action', { userId, action: 'created_post' });
```

### ⚠️ Import Restrictions

For platform stability, only import from `@groundworkjs/plugin-sdk`:

```typescript
// ✅ Correct
import { TenantDatabase, requireAuth } from '@groundworkjs/plugin-sdk';

// ❌ Not allowed
import { db } from '@groundworkjs/db';
import { utils } from '@groundworkjs/backend';
```

Your code will fail to build if you try to import from platform internals.

---

## 📁 Project Structure

```
gwjs-hephaestus/
├── README.md                 # This file
├── manifest.ts               # Your customization metadata
├── package.json
├── tsconfig.json
│
├── backend/                  # Custom API Routes
│   └── router.ts             # Your Express routes
│
├── frontend/                 # Custom UI Components
│   ├── routes.ts             # Page route definitions
│   └── pages/
│       └── HelloPage.tsx     # Example React page
│
├── database/                 # Your Database Schema
│   └── db/
│       ├── migrations/       # Schema changes
│       └── seeds/            # Test data
│
└── types/                    # TypeScript definitions
    └── imports.d.ts
```

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone this repository
git clone https://github.com/GroundWorkJS/gwjs-hephaestus.git
cd gwjs-hephaestus

# Install dependencies
pnpm install

# Or use npm/yarn
npm install
```

### 2. Set Up Local Development Environment

> ⚠️ **IMPORTANT**: This step is **ONLY for local development/testing**. In production, your GroundWorkJS administrator handles all database configuration automatically. You don't need to worry about databases when deploying.

**For local testing only**, create a `.env` file in the root directory:

```bash
# ========================================
# LOCAL DEVELOPMENT ONLY
# ========================================
# Your GroundWorkJS administrator will provide these values
# In production, this is all handled automatically - you don't touch this!

# Database connections (get these from your administrator)
DATABASE_URL=postgresql://user:pass@localhost:5432/your_instance
TENANT_DATABASE_URL=postgresql://user:pass@localhost:5432/your_instance_tenant

# Enable customization features
TENANT_ENABLED=1
TENANT_STATE=active
```

**Don't have database credentials?** Contact your GroundWorkJS administrator - they'll provide everything you need for local testing.

### 3. Run Database Migrations

> 📝 **What are migrations?** They're scripts that create your custom database tables. Think of them as setup scripts for your data.

```bash
# Create your custom database tables (LOCAL DEVELOPMENT ONLY)
pnpm db:migrate

# (Optional) Load sample/test data
pnpm db:seed
```

> ⚠️ **Production Note**: When you deploy, migrations run automatically. You just write them here and the platform handles the rest.

### 4. Start Development

```bash
# Start in watch mode (automatically rebuilds when you save files)
pnpm dev

# Or build once (when you're ready to test)
pnpm build
```

> 💡 **What's "watch mode"?** It automatically rebuilds your code every time you save a file. Great for development!

**Where to find your custom code when running:**
- **Backend APIs**: `http://localhost:4000/o/api/*`
- **Frontend Pages**: `http://localhost:3000/custom/*`

> 📍 **In production**, replace `localhost` with your actual GroundWorkJS instance URL (e.g., `https://yourcompany.groundworkjs.com`)

---

## 🛠️ Development Guide

> 💡 **Beginner Tip**: Start by modifying the example files, then create your own once you understand the patterns.

### Adding Custom API Endpoints

**Step-by-step:**
1. Open the file [backend/router.ts](backend/router.ts)
2. Add your route using the examples below
3. Save the file
4. Test it by visiting `http://localhost:4000/o/api/your-route`

**Example code:**

```typescript
import type { TenantDependencies, TenantRouterFactory } from '@groundworkjs/plugin-sdk';
import {
  requireAuth,
  asyncHandler,
  sendSuccess,
  sendError
} from '@groundworkjs/plugin-sdk';
import { Router } from 'express';

const createTenantRouter: TenantRouterFactory = (deps) => {
  const { db, logger } = deps;
  const router = Router();

  // Public endpoint (no auth required)
  router.get('/hello', (req, res) => {
    sendSuccess(res, { message: 'Hello from tenant!' });
  });

  // Protected endpoint (requires authentication)
  router.get('/my-data', requireAuth, asyncHandler(async (req, res) => {
    const user = req.user; // User guaranteed to exist

    logger.info('Fetching user data', { userId: user.id });

    const data = await db.table('tenant_posts')
      .where('user_id', user.id)
      .select();

    sendSuccess(res, { data });
  }));

  // POST endpoint with validation
  router.post('/posts', requireAuth, asyncHandler(async (req, res) => {
    const user = req.user;
    const { title, content } = req.body;

    if (!title || !content) {
      return sendError(res, 400, 'Title and content required');
    }

    const [post] = await db.table('tenant_posts').insert({
      title,
      content,
      user_id: user.id,
      created_at: new Date(),
    }).returning('*');

    logger.audit('Post created', { userId: user.id, postId: post.id });
    sendSuccess(res, { post });
  }));

  return router;
};

export default createTenantRouter;
```

**Understanding the URLs:**
- When you write `router.get('/hello', ...)` → Users access it at `/o/api/hello`
- When you write `router.post('/posts', ...)` → Users access it at `/o/api/posts`

> 💡 **The `/o/api` part is added automatically** - you just define the route name!

### Adding Custom Frontend Pages

> 💡 **What's React?** It's a framework for building user interfaces. If you're new, think of it like HTML with superpowers.

**Step 1: Create a new page**

Create a new file in [frontend/pages/](frontend/pages/) (e.g., `MyPage.tsx`):

```typescript
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const MyCustomPage: React.FC = () => {
  const [data, setData] = React.useState(null);

  const fetchData = async () => {
    const res = await fetch('/o/api/my-data', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const json = await res.json();
    setData(json.data);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">My Custom Page</Typography>
      <Button onClick={fetchData}>Load Data</Button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Box>
  );
};

export default MyCustomPage;
```

**Step 2: Register your page**

Open [frontend/routes.ts](frontend/routes.ts) and add your page:

```typescript
export const additivePages: Record<string, string> = {
  '/custom/my-page': 'MyPage.tsx',      // ← Add this line
  '/custom/another': 'AnotherPage.tsx',  // You can add multiple pages
};
```

> 💡 **The route name** (`/custom/my-page`) is what users type in the browser. The filename (`MyPage.tsx`) is what you created in step 1.

**Step 3: Test it**

Visit `http://localhost:3000/custom/my-page` in your browser!

### Working with Your Database

> 💡 **Database 101**: Your custom data needs tables (like spreadsheet tabs). Migrations are scripts that create these tables.

**Important rules:**
- ✅ All table names MUST start with `tenant_` (e.g., `tenant_posts`, `tenant_customers`)
- ✅ Use migrations to create tables (never create them manually)
- ❌ Don't try to access platform tables (like `users` or `permissions`)

**Step-by-step: Create a new table**

**Step 1: Generate migration file**
```bash
# This creates a new migration file for you
pnpm db:make-migration create_posts_table
```

**Step 2: Edit the migration file**

Find the new file in [database/db/migrations/](database/db/migrations/) and edit it:

```javascript
/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function(knex) {
  // This creates your table
  await knex.schema.createTable('tenant_posts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));  // Unique ID
    table.string('title', 255).notNullable();  // Post title (required)
    table.text('content');                      // Post content (optional)
    table.uuid('user_id').notNullable();       // Who created it (required)
    table.timestamps(true, true);               // created_at & updated_at (automatic)
    table.index(['user_id']);                   // Makes queries faster
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function(knex) {
  // This undoes the migration if needed
  await knex.schema.dropTable('tenant_posts');
};
```

> 💡 **Column types explained:**
> - `uuid()` = Unique ID (like a serial number)
> - `string(length)` = Text up to a certain length
> - `text()` = Long text (no length limit)
> - `timestamps()` = Automatically tracks when records are created/updated

**Step 3: Run the migration** (LOCAL DEVELOPMENT ONLY)
```bash
pnpm db:migrate
```

> ⚠️ **In production**: Migrations run automatically when you deploy. You don't run them yourself!

### Querying Your Database

> 💡 **What's a query?** It's how you ask the database for data (like asking "show me all posts").

**The basics:**

```typescript
import type { TenantDatabase } from '@groundworkjs/plugin-sdk';

// In your router (db is provided)
const router: TenantRouterFactory = (deps) => {
  const { db, logger } = deps;

  // ✅ Query your tables
  const posts = await db.table('tenant_posts')
    .select('*')
    .where('published', true)
    .orderBy('created_at', 'desc')
    .limit(10);

  // ✅ Insert data
  const [newPost] = await db.table('tenant_posts')
    .insert({ title: 'Hello', content: 'World' })
    .returning('*');

  // ✅ Update data
  await db.table('tenant_posts')
    .where('id', postId)
    .update({ title: 'Updated' });

  // ✅ Delete data
  await db.table('tenant_posts')
    .where('id', postId)
    .delete();

  // ✅ Count records
  const totalPosts = await db.count('tenant_posts');

  // ✅ Raw SQL (custom tables only)
  const result = await db.raw(
    'SELECT * FROM tenant_posts WHERE user_id = ?',
    [userId]
  );
};
```

### Logging

```typescript
import { logger } from '@groundworkjs/plugin-sdk';

// Info logging (general events)
logger.info('User viewed page', { userId, page: 'dashboard' });

// Error logging (include error object)
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error, { userId, operation: 'riskyOp' });
}

// Audit logging (important security events)
logger.audit('Permission granted', {
  userId,
  targetUserId,
  permission: 'admin'
});

// Debug logging (development details)
logger.debug('Detailed state', {
  step: 'validation',
  data: someObject
});
```

---

## 🧪 Testing

**Build and Validate**:
```bash
# Build your code
pnpm build

# Validate imports
pnpm validate
```

**Test API Endpoints**:
```bash
# Public endpoint
curl http://localhost:4000/o/api/hello

# Protected endpoint (requires authentication)
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:4000/o/api/my-data
```

**Test Frontend**:
```bash
# Visit your custom pages at:
# http://localhost:3000/custom/my-page
```

---

## 📦 Deploying to Production

> ✅ **GOOD NEWS**: You can deploy your customizations yourself through the GroundWorkJS platform! No waiting for approvals.

### Quick Deploy (Recommended)

**Step 1: Push your code to GitHub**
```bash
git add .
git commit -m "Added my awesome customizations"
git push
```

**Step 2: Deploy through the Platform**

1. Log into your GroundWorkJS instance
2. Go to **Admin → Tenant Customizations** (or **Tenant → Deployment**)
3. Click **"Deploy Customizations"** or **"New Deployment"**
4. The platform will:
   - ✅ Pull your latest code from GitHub
   - ✅ Validate your code for security issues
   - ✅ Run your database migrations automatically
   - ✅ Build and deploy your customizations
   - ✅ Restart services if needed

5. Watch the deployment progress in real-time
6. Done! Your customizations are live 🎉

> 💡 **How long does it take?** Usually 2-5 minutes depending on your code size.

### Before You Deploy: Pre-Flight Checklist

Make sure these work locally first:

```bash
# 1. Build succeeds
pnpm build

# 2. No errors
pnpm validate

# 3. Test your endpoints
curl http://localhost:4000/o/api/your-route

# 4. Test your pages
# Visit http://localhost:3000/custom/your-page
```

**Checklist:**
- [ ] All tables prefixed with `tenant_`
- [ ] Only importing from `@groundworkjs/plugin-sdk`
- [ ] Build succeeds without errors
- [ ] All migrations tested locally
- [ ] API endpoints work as expected
- [ ] Frontend pages load correctly
- [ ] Authentication on sensitive routes
- [ ] Input validation on forms
- [ ] Error handling in place
- [ ] Code pushed to GitHub

### Alternative: Manual Deployment Support

> 💰 **Premium Support Option**: If your organization has purchased additional support, your GroundWorkJS administrator can handle deployments for you with code review included.

Contact your administrator if you need:
- Pre-deployment code reviews
- Help troubleshooting deployment issues
- Assistance with complex migrations
- Training on best practices

Otherwise, the self-service deployment system is ready for you! 🚀

---

## 🚨 Common Issues & Solutions

> 💡 **Stuck?** Check here first before asking for help!

### ❌ "Access denied to table X"

**What happened:** You tried to query a table without the `tenant_` prefix.

**The fix:**
```typescript
// ❌ Wrong - missing tenant_ prefix
await db.table('my_posts');
await db.table('posts');

// ✅ Correct - starts with tenant_
await db.table('tenant_posts');
```

**Why:** For security, you can only access YOUR tables (ones starting with `tenant_`).

---

### ❌ "Module has no exported member"

**What happened:** You tried to import from internal GroundWorkJS code.

**The fix:**
```typescript
// ❌ Wrong - trying to import internal code
import { db } from '@groundworkjs/db';

// ✅ Correct - use the SDK
import type { TenantDependencies } from '@groundworkjs/plugin-sdk';
// The `db` is provided to you automatically
```

**Why:** You can only use the official SDK. This keeps your code stable when GroundWorkJS updates.

---

### ❌ "Database not available"

**What happened:** Your `.env` file is missing or incorrect.

**The fix:**
1. Make sure you have a `.env` file in the root directory
2. Ask your GroundWorkJS administrator for the correct `TENANT_DATABASE_URL`
3. Copy their value into your `.env` file

**Remember:** This is ONLY for local development. In production, everything is automatic!

---

### ❌ "Deployment failed"

**What happened:** The deployment system found an issue with your code.

**The fix:**
1. Check the deployment logs in the platform UI
2. Common issues:
   - Build errors (run `pnpm build` locally first)
   - Migration errors (test with `pnpm db:migrate` locally)
   - Import violations (run `pnpm validate`)
3. Fix the issue, commit, push, and deploy again

---

## 📚 SDK Reference

### Database (`TenantDatabase`)

```typescript
interface TenantDatabase {
  // Query builder for your tables
  table(tableName: string): Knex.QueryBuilder;

  // Count records
  count(tableName: string): Promise<number>;

  // Execute raw SQL
  raw(sql: string, bindings?: any[]): Promise<any>;

  // Check availability
  isAvailable: boolean;
}
```

**Table Naming**: All custom tables must start with `tenant_`

### Authentication

```typescript
// Get user (returns undefined if not authenticated)
import { getTenantUser } from '@groundworkjs/plugin-sdk';
const user = getTenantUser(req);

// Require authentication (middleware)
import { requireAuth } from '@groundworkjs/plugin-sdk';
router.get('/protected', requireAuth, (req, res) => {
  const user = req.user; // Guaranteed to exist
});

// Get user ID safely
import { getUserId } from '@groundworkjs/plugin-sdk';
const userId = getUserId(req);

// Check authentication
import { isAuthenticated } from '@groundworkjs/plugin-sdk';
if (!isAuthenticated(req)) {
  return sendError(res, 401, 'Unauthorized');
}
```

### Logging (`TenantLogger`)

```typescript
interface TenantLogger {
  info(message: string, context?: Record<string, any>): void;
  error(message: string, error?: Error, context?: Record<string, any>): void;
  debug(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  audit(message: string, context?: Record<string, any>): void;
}
```

### Route Helpers

```typescript
// Async error handler
import { asyncHandler } from '@groundworkjs/plugin-sdk';
router.get('/data', asyncHandler(async (req, res) => {
  const data = await db.table('tenant_data').select();
  sendSuccess(res, { data });
}));

// JSON responses
import { sendSuccess, sendError } from '@groundworkjs/plugin-sdk';
sendSuccess(res, { data: [...] });
sendError(res, 404, 'Not found');

// Body validation
import { validateBody } from '@groundworkjs/plugin-sdk';
const errors = validateBody(req.body, {
  title: 'string',
  age: 'number',
  email: 'string'
});
if (errors.length > 0) {
  return sendError(res, 400, 'Validation failed', { errors });
}
```

### Permissions (RBAC)

```typescript
import { hasPermission, hasRole, requirePermission } from '@groundworkjs/plugin-sdk';

// Check permission
if (hasPermission(user, 'create_posts')) {
  // Allow action
}

// Check role
if (hasRole(user, 'admin')) {
  // Allow admin action
}

// Require permission (middleware)
router.delete('/post/:id', requirePermission('delete_posts'), (req, res) => {
  // User has permission
});
```

---

## 💡 Complete Example: Blog System

**Migration** ([database/db/migrations/20241220_blog.js](database/db/migrations/)):
```javascript
exports.up = async function(knex) {
  await knex.schema
    .createTable('tenant_blog_posts', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('title').notNullable();
      table.text('content');
      table.uuid('author_id').notNullable();
      table.boolean('published').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('tenant_blog_comments', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.uuid('post_id').references('id').inTable('tenant_blog_posts').onDelete('CASCADE');
      table.uuid('user_id').notNullable();
      table.text('content').notNullable();
      table.timestamps(true, true);
    });
};

exports.down = async function(knex) {
  await knex.schema
    .dropTable('tenant_blog_comments')
    .dropTable('tenant_blog_posts');
};
```

**Backend Routes** ([backend/router.ts](backend/router.ts)):
```typescript
// List posts
router.get('/blog/posts', asyncHandler(async (req, res) => {
  const posts = await db.table('tenant_blog_posts')
    .where('published', true)
    .orderBy('created_at', 'desc')
    .select();
  sendSuccess(res, { posts });
}));

// Create post
router.post('/blog/posts', requireAuth, asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const [post] = await db.table('tenant_blog_posts')
    .insert({
      title,
      content,
      author_id: req.user.id,
      published: false,
    })
    .returning('*');
  sendSuccess(res, { post });
}));

// Add comment
router.post('/blog/posts/:postId/comments', requireAuth, asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const [comment] = await db.table('tenant_blog_comments')
    .insert({
      post_id: postId,
      user_id: req.user.id,
      content,
    })
    .returning('*');

  sendSuccess(res, { comment });
}));
```

**Frontend Page** ([frontend/pages/BlogPage.tsx](frontend/pages/BlogPage.tsx)):
```typescript
import React, { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/o/api/blog/posts')
      .then(res => res.json())
      .then(data => setPosts(data.posts));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3">Blog</Typography>
      {posts.map(post => (
        <Card key={post.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5">{post.title}</Typography>
          <Typography>{post.content}</Typography>
        </Card>
      ))}
    </Box>
  );
};

export default BlogPage;
```

**Register Route** ([frontend/routes.ts](frontend/routes.ts)):
```typescript
export const additivePages = {
  '/blog': 'BlogPage.tsx',
};
```

---

## 🤝 Getting Help

### Your GroundWorkJS Administrator
Your first point of contact! They can help with:
- Database connection issues
- Deployment questions
- Instance configuration
- General "how do I...?" questions

### Official Resources
- 🌐 [GroundWorkJS Website](https://groundworkjs.com/)
- 📖 [Full Documentation](https://groundworkjs.com/docs)
- 💬 [Support Center](https://groundworkjs.com/support)

### Before Asking for Help
1. ✅ Check the [Common Issues](#-common-issues--solutions) section above
2. ✅ Make sure you ran `pnpm install` and `pnpm build`
3. ✅ Check your `.env` file has the correct values
4. ✅ Try the example code first before writing your own

When you do ask for help, include:
- What you were trying to do
- What error message you got (copy/paste the exact error)
- What you've already tried

---

<div align="center">

**Happy building!** 🚀

Customize GroundWorkJS to fit your organization's unique needs.

[GroundWorkJS](https://groundworkjs.com/) | Made with ❤️ for businesses that need customization

</div>

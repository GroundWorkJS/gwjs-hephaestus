// packages/tenant/backend/router.ts
import type { TenantDependencies, TenantRouterFactory } from '@groundworkjs/plugin-sdk';
import { requireAuth, asyncHandler, sendSuccess, sendError } from '@groundworkjs/plugin-sdk';
import type { Router, Request, Response } from 'express';
import { Router as ExpressRouter } from 'express';

type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONValue[] | { [k: string]: JSONValue };

/**
 * Tenant Router Factory
 * 
 * This is the ONLY way tenant customizations integrate with the platform.
 * Dependencies are injected by the platform to ensure security boundaries.
 * 
 * @param deps - Platform-provided dependencies (db, logger, etc.)
 * @returns Express Router for tenant endpoints
 */
const createTenantRouter: TenantRouterFactory = (deps) => {
  const { db, logger } = deps;
  const r = ExpressRouter();

  logger.info('Initializing tenant router');

  // ============================================================================
  // Public Routes (no auth required)
  // ============================================================================

  r.get('/hello', (_req: Request, res: Response) => {
    sendSuccess(res, {
      ok: true,
      tenant: process.env.TENANT_INSTANCE ?? 'dev',
      state: process.env.TENANT_STATE ?? 'active',
      note: 'tenant router is mounted ✔',
    });
  });

  r.get('/time', (_req: Request, res: Response) => {
    sendSuccess(res, { now: new Date().toISOString() });
  });

  // ============================================================================
  // Contact Form Routes
  // ============================================================================

  // Public: Submit contact form
  r.post('/contact', asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const { name, email, subject, message, source } = req.body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      source?: string;
    };

    // Basic validation
    if (!name || !email || !message) {
      return sendError(res, 400, 'Name, email, and message are required');
    }

    // Simple email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return sendError(res, 400, 'Invalid email address');
    }

    try {
      // Generate a simple ID (in production, use uuid)
      const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await db.insert('contact_submissions', {
        id,
        name: name.trim().substring(0, 200),
        email: email.trim().toLowerCase().substring(0, 200),
        subject: subject?.trim().substring(0, 200) || null,
        message: message.trim().substring(0, 5000),
        source: source?.trim().substring(0, 200) || null,
        status: 'new',
        metadata: null,
      });

      logger.info('Contact form submitted', { id, email });

      sendSuccess(res, { 
        ok: true, 
        message: 'Thank you for your message. We\'ll be in touch soon!' 
      }, 201);
    } catch (err) {
      logger.error('Failed to save contact submission', err);
      sendError(res, 500, 'Failed to save your message. Please try again.');
    }
  }));

  // ============================================================================
  // Protected Routes (auth required)
  // ============================================================================

  // Admin: List contact submissions (requires auth + permission)
  r.get('/contact', asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const user = requireAuth(req);
    logger.audit('contact_list_accessed', { userId: user.id });

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;
    const order = req.query.order === 'asc' ? 'asc' : 'desc';

    try {
      // Build query
      let query = db.table('contact_submissions');

      // Search filter
      if (search && search.trim()) {
        const s = `%${search.trim()}%`;
        query = query.where(function() {
          this.whereRaw('LOWER(name) LIKE LOWER(?)', [s])
            .orWhereRaw('LOWER(email) LIKE LOWER(?)', [s])
            .orWhereRaw('LOWER(subject) LIKE LOWER(?)', [s])
            .orWhereRaw('LOWER(message) LIKE LOWER(?)', [s]);
        });
      }

      // Get total count before pagination
      const countQuery = query.clone();
      const [{ count }] = await countQuery.count('* as count');
      const total = Number(count);

      // Get paginated rows
      const rows = await query
        .orderBy('createdAt', order)
        .limit(limit)
        .offset(offset)
        .select('*');

      sendSuccess(res, {
        rows,
        total,
        limit,
        offset,
        order,
        q: search || '',
      });
    } catch (err) {
      logger.error('Failed to fetch contact submissions', err);
      sendError(res, 500, 'Failed to fetch contact submissions');
    }
  }));

  r.get('/status', asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }
    
    const user = requireAuth(req);
    logger.audit('status_check', { userId: user.id });
    
    sendSuccess(res, { 
      ok: true, 
      userId: user.id,
      email: user.email 
    });
  }));

  // Example: Query tenant-owned data
  r.get('/stats/user-count', asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }
    
    // This will ONLY work if tenant_users table exists in tenant_ext schema
    // If the table doesn't exist or isn't prefixed with tenant_, it will throw
    try {
      const count = await db.count('tenant_users');
      sendSuccess(res, { users: count });
    } catch (err) {
      logger.error('Failed to count tenant users', err);
      sendError(res, 500, 'Failed to query tenant data');
    }
  }));

  // ============================================================================
  // Echo endpoint (for testing)
  // ============================================================================

  r.post(
    '/echo',
    (req: Request<unknown, unknown, JSONValue>, res: Response) => {
      sendSuccess(res, { received: req.body });
    },
  );

  logger.info('Tenant router initialized successfully');
  return r;
};

export default createTenantRouter;

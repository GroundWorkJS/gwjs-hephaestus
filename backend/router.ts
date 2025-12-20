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
  // Protected Routes (auth required)
  // ============================================================================

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

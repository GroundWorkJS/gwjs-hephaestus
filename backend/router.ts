// backend/router.ts
import type { TenantRouterFactory } from '@groundworkjs/plugin-sdk';
import {
  getTenantUser,
  asyncHandler,
  sendSuccess,
  sendError,
  requireAuth,
} from '@groundworkjs/plugin-sdk';
import type { Request, Response } from 'express';
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
const createTenantRouter: TenantRouterFactory = deps => {
  const { db, logger, requireAuth: requireAuthMiddleware } = deps;
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

  r.get(
    '/status',
    asyncHandler(async (req: Request, res: Response) => {
      if (!db.isAvailable) {
        return sendError(res, 503, 'Database not configured');
      }

      const user = requireAuth(req);
      logger.audit('status_check', { userId: user.id });

      sendSuccess(res, {
        ok: true,
        userId: user.id,
        email: user.email,
      });
    }),
  );

  // ============================================================================
  // Notes Routes (SDK Demo Example)
  // ============================================================================

  // List all notes
  r.get(
    '/notes',
    requireAuthMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db.isAvailable) {
        return sendError(res, 503, 'Database not configured');
      }

      const user = getTenantUser(req);
      if (!user) {
        return sendError(res, 401, 'Unauthorized');
      }

      const limit = Math.min(Number(req.query.limit) || 50, 200);
      const offset = Math.max(Number(req.query.offset) || 0, 0);
      const category =
        typeof req.query.category === 'string' ? req.query.category : undefined;
      const search = typeof req.query.q === 'string' ? req.query.q : undefined;

      try {
        let query = db
          .table('tenant_notes')
          .where('user_id', user.id)
          .whereNull('deleted_at');

        // Filter by category
        if (category && ['personal', 'work', 'ideas'].includes(category)) {
          query = query.where('category', category);
        }

        // Search filter (case-insensitive via ILIKE)
        if (search?.trim()) {
          const s = `%${search.trim()}%`;
          query = query.where(function () {
            this.whereILike('title', s)
              .orWhereILike('content', s);
          });
        }

        // Get total count
        const countQuery = query.clone();
        const [{ count }] = await countQuery.count('* as count');
        const total = Number(count);

        // Get paginated rows
        const rows = await query
          .orderBy('is_pinned', 'desc')
          .orderBy('created_at', 'desc')
          .limit(limit)
          .offset(offset)
          .select('*');

        sendSuccess(res, { rows, total, limit, offset });
      } catch (err) {
        logger.error('Failed to fetch notes', err);
        sendError(res, 500, 'Failed to fetch notes');
      }
    }),
  );

  // Get single note
  r.get(
    '/notes/:id',
    requireAuthMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db.isAvailable) {
        return sendError(res, 503, 'Database not configured');
      }

      const user = getTenantUser(req);
      if (!user) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { id } = req.params;

      try {
        const note = await db
          .table('tenant_notes')
          .where({ id })
          .where('user_id', user.id)
          .whereNull('deleted_at')
          .first();

        if (!note) {
          return sendError(res, 404, 'Note not found');
        }

        sendSuccess(res, { note });
      } catch (err) {
        logger.error('Failed to fetch note', err);
        sendError(res, 500, 'Failed to fetch note');
      }
    }),
  );

  // Create note
  r.post(
    '/notes',
    requireAuthMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db.isAvailable) {
        return sendError(res, 503, 'Database not configured');
      }

      const user = getTenantUser(req);
      if (!user) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { title, content, category, tags } = req.body as {
        title?: string;
        content?: string;
        category?: string;
        tags?: string[];
      };

      // Validation
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return sendError(res, 400, 'Title is required');
      }

      if (title.trim().length > 255) {
        return sendError(res, 400, 'Title is too long (max 255 characters)');
      }

      const validCategories = ['personal', 'work', 'ideas'];
      const noteCategory =
        category && validCategories.includes(category) ? category : 'personal';

      try {
        const id = `note_${Date.now()}_${crypto.randomUUID().slice(0, 9)}`;

        const noteData = {
          id,
          title: title.trim().substring(0, 255),
          content: content?.trim().substring(0, 10000) || null,
          category: noteCategory,
          user_id: user.id,
          tags: tags ? JSON.stringify(tags) : null,
          is_pinned: false,
        };

        await db.table('tenant_notes').insert(noteData);

        const created = await db.table('tenant_notes').where({ id }).first();

        logger.info('Note created', { id, userId: user.id });

        sendSuccess(res, { note: created }, 201);
      } catch (err) {
        logger.error('Failed to create note', err);
        sendError(res, 500, 'Failed to create note');
      }
    }),
  );

  // Update note
  r.put(
    '/notes/:id',
    requireAuthMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db.isAvailable) {
        return sendError(res, 503, 'Database not configured');
      }

      const user = getTenantUser(req);
      if (!user) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { id } = req.params;
      const { title, content, category, is_pinned, tags } = req.body as {
        title?: string;
        content?: string;
        category?: string;
        is_pinned?: boolean;
        tags?: string[];
      };

      try {
        const existing = await db
          .table('tenant_notes')
          .where({ id })
          .where('user_id', user.id)
          .whereNull('deleted_at')
          .first();

        if (!existing) {
          return sendError(res, 404, 'Note not found');
        }

        const updates: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (title !== undefined) {
          if (title.trim().length === 0) {
            return sendError(res, 400, 'Title cannot be empty');
          }
          updates.title = title.trim().substring(0, 255);
        }

        if (content !== undefined) {
          updates.content = content?.trim().substring(0, 10000) || null;
        }

        if (category !== undefined) {
          const validCategories = ['personal', 'work', 'ideas'];
          if (validCategories.includes(category)) {
            updates.category = category;
          }
        }

        if (is_pinned !== undefined) {
          updates.is_pinned = Boolean(is_pinned);
        }

        if (tags !== undefined) {
          updates.tags = tags ? JSON.stringify(tags) : null;
        }

        await db.table('tenant_notes').where({ id }).update(updates);

        const updated = await db.table('tenant_notes').where({ id }).first();

        logger.info('Note updated', { id, userId: user.id });

        sendSuccess(res, { note: updated });
      } catch (err) {
        logger.error('Failed to update note', err);
        sendError(res, 500, 'Failed to update note');
      }
    }),
  );

  // Delete note (soft delete)
  r.delete(
    '/notes/:id',
    requireAuthMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      if (!db.isAvailable) {
        return sendError(res, 503, 'Database not configured');
      }

      const user = getTenantUser(req);
      if (!user) {
        return sendError(res, 401, 'Unauthorized');
      }

      const { id } = req.params;

      try {
        const existing = await db
          .table('tenant_notes')
          .where({ id })
          .where('user_id', user.id)
          .whereNull('deleted_at')
          .first();

        if (!existing) {
          return sendError(res, 404, 'Note not found');
        }

        await db.table('tenant_notes').where({ id }).update({
          deleted_at: new Date().toISOString(),
        });

        logger.info('Note deleted', { id, userId: user.id });

        sendSuccess(res, { ok: true, message: 'Note deleted' });
      } catch (err) {
        logger.error('Failed to delete note', err);
        sendError(res, 500, 'Failed to delete note');
      }
    }),
  );

  // Example: Query tenant-owned data (DISABLED - table doesn't exist)
  // Uncomment and create `tenant_users` table if you need this endpoint
  // r.get('/stats/user-count', asyncHandler(async (_req: Request, res: Response) => {
  //   if (!db.isAvailable) {
  //     return sendError(res, 503, 'Database not configured');
  //   }
  //
  //   // This will ONLY work if tenant_users table exists in tenant_ext schema
  //   // If the table doesn't exist or isn't prefixed with tenant_, it will throw
  //   try {
  //     const count = await db.count('tenant_users');
  //     sendSuccess(res, { users: count });
  //   } catch (err) {
  //     logger.error('Failed to count tenant users', err);
  //     sendError(res, 500, 'Failed to query tenant data');
  //   }
  // }));

  // 3E.7: Echo endpoint removed (reflected untrusted input)

  logger.info('Tenant router initialized successfully');
  return r;
};

export default createTenantRouter;

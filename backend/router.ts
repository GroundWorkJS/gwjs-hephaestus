// packages/tenant/backend/router.ts
/// <reference types="express" />
import type { TenantDependencies, TenantRouterFactory } from '@groundworkjs/plugin-sdk';
import { getTenantUser, asyncHandler, sendSuccess, sendError, requireAuth } from '@groundworkjs/plugin-sdk';
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
const createTenantRouter: TenantRouterFactory = (deps) => {
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

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return sendError(res, 400, 'Name is required');
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return sendError(res, 400, 'Email is required');
    }

    // Comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, 400, 'Please provide a valid email address');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return sendError(res, 400, 'Message is required');
    }

    if (message.trim().length > 5000) {
      return sendError(res, 400, 'Message is too long (max 5000 characters)');
    }

    if (name.trim().length > 200) {
      return sendError(res, 400, 'Name is too long (max 200 characters)');
    }

    if (subject && subject.trim().length > 200) {
      return sendError(res, 400, 'Subject is too long (max 200 characters)');
    }

    try {
      // Generate a secure ID
      const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Sanitize inputs (trim and limit length)
      const sanitizedData = {
        id,
        name: name.trim().substring(0, 200),
        email: email.trim().toLowerCase().substring(0, 200),
        subject: subject?.trim().substring(0, 200) || null,
        message: message.trim().substring(0, 5000),
        source: source?.trim().substring(0, 200) || null,
        status: 'new' as const,
        metadata: null,
      };

      await db.table('tenant_contact_submissions').insert(sanitizedData);

      logger.info('Contact form submitted', { id, email: sanitizedData.email });

      sendSuccess(res, {
        ok: true,
        message: 'Thank you for your message. We\'ll be in touch soon!'
      }, 201);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;
      logger.error('Failed to save contact submission', { error: errorMsg, stack: errorStack });
      console.error('[tenant/contact] INSERT ERROR:', errorMsg);
      sendError(res, 500, 'Failed to save your message. Please try again.');
    }
  }));

  // ============================================================================
  // Protected Routes (auth required)
  // ============================================================================

  // Admin: List contact submissions (requires auth + permission)
  r.get('/contact', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const user = getTenantUser(req);
    if (!user) {
      return sendError(res, 401, 'Unauthorized');
    }

    logger.audit('contact_list_accessed', { userId: user.id });

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;
    const order = req.query.order === 'asc' ? 'asc' : 'desc';
    const showDeleted = req.query.showDeleted === 'true';

    try {
      // Build query
      let query = db.table('tenant_contact_submissions');

      // Filter deleted/non-deleted
      if (showDeleted) {
        query = query.whereNotNull('deletedAt');
      } else {
        query = query.whereNull('deletedAt');
      }

      // Search filter
      if (search?.trim()) {
        const s = `%${search.trim()}%`;
        query = query.where(function (this: any) {
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
        showDeleted,
      });
    } catch (err) {
      logger.error('Failed to fetch contact submissions', err);
      sendError(res, 500, 'Failed to fetch contact submissions');
    }
  }));

  // Admin: Update contact submission (mark read/unread, archive, soft delete)
  r.patch('/contact/:id', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const user = getTenantUser(req);
    if (!user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const { id } = req.params;
    const { action } = req.body as { action?: string };

    if (!id) {
      return sendError(res, 400, 'Contact ID is required');
    }

    if (!action || !['mark-read', 'mark-unread', 'archive', 'delete', 'restore'].includes(action)) {
      return sendError(res, 400, 'Valid action is required (mark-read, mark-unread, archive, delete, restore)');
    }

    try {
      const contact = await db.table('tenant_contact_submissions').where({ id }).first();

      if (!contact) {
        return sendError(res, 404, 'Contact submission not found');
      }

      const updates: Record<string, unknown> = {
        updatedAt: new Date().toISOString(),
      };

      switch (action) {
        case 'mark-read':
          updates.status = 'read';
          updates.readAt = new Date().toISOString();
          logger.audit('contact_marked_read', { userId: user.id, contactId: id });
          break;
        case 'mark-unread':
          updates.status = 'new';
          updates.readAt = null;
          logger.audit('contact_marked_unread', { userId: user.id, contactId: id });
          break;
        case 'archive':
          updates.status = 'archived';
          logger.audit('contact_archived', { userId: user.id, contactId: id });
          break;
        case 'delete':
          updates.deletedAt = new Date().toISOString();
          logger.audit('contact_deleted', { userId: user.id, contactId: id });
          break;
        case 'restore':
          updates.deletedAt = null;
          logger.audit('contact_restored', { userId: user.id, contactId: id });
          break;
      }

      await db.table('tenant_contact_submissions').where({ id }).update(updates);

      const updated = await db.table('tenant_contact_submissions').where({ id }).first();

      sendSuccess(res, {
        ok: true,
        message: `Contact ${action} successfully`,
        contact: updated,
      });
    } catch (err) {
      logger.error('Failed to update contact submission', err);
      sendError(res, 500, 'Failed to update contact submission');
    }
  }));

  // ============================================================================
  // Waitlist Routes
  // ============================================================================

  // Public: Submit waitlist form
  r.post('/waitlist', asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const { name, email, company, referrer } = req.body as {
      name?: string;
      email?: string;
      company?: string;
      referrer?: string;
    };

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return sendError(res, 400, 'Name is required');
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return sendError(res, 400, 'Email is required');
    }

    // Comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email.trim())) {
      return sendError(res, 400, 'Please provide a valid email address');
    }

    if (name.trim().length > 200) {
      return sendError(res, 400, 'Name is too long (max 200 characters)');
    }

    if (company && company.trim().length > 200) {
      return sendError(res, 400, 'Company is too long (max 200 characters)');
    }

    try {
      // Check if email already exists
      const existing = await db.table('tenant_waitlist_signups')
        .where({ email: email.trim().toLowerCase() })
        .first();

      if (existing) {
        return sendError(res, 409, 'This email is already on the waitlist');
      }

      // Generate a secure ID
      const id = `waitlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Sanitize inputs (trim and limit length)
      const sanitizedData = {
        id,
        name: name.trim().substring(0, 200),
        email: email.trim().toLowerCase().substring(0, 200),
        company: company?.trim().substring(0, 200) || null,
        referrer: referrer?.trim().substring(0, 200) || null,
        metadata: null,
      };

      await db.table('tenant_waitlist_signups').insert(sanitizedData);

      logger.info('Waitlist signup submitted', { id, email: sanitizedData.email });

      sendSuccess(res, {
        ok: true,
        message: 'Thank you for joining our waitlist! We\'ll be in touch soon.'
      }, 201);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;
      logger.error('Failed to save waitlist signup', { error: errorMsg, stack: errorStack });
      console.error('[tenant/waitlist] INSERT ERROR:', errorMsg);
      sendError(res, 500, 'Failed to save your signup. Please try again.');
    }
  }));

  // Admin: List waitlist signups (requires auth + permission)
  r.get('/waitlist', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const user = getTenantUser(req);
    if (!user) {
      return sendError(res, 401, 'Unauthorized');
    }

    logger.audit('waitlist_list_accessed', { userId: user.id });

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;
    const order = req.query.order === 'asc' ? 'asc' : 'desc';

    try {
      // Build query
      let query = db.table('tenant_waitlist_signups');

      // Search filter
      if (search?.trim()) {
        const s = `%${search.trim()}%`;
        query = query.where(function (this: any) {
          this.whereRaw('LOWER(name) LIKE LOWER(?)', [s])
            .orWhereRaw('LOWER(email) LIKE LOWER(?)', [s])
            .orWhereRaw('LOWER(company) LIKE LOWER(?)', [s]);
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
      logger.error('Failed to fetch waitlist signups', err);
      sendError(res, 500, 'Failed to fetch waitlist signups');
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

  // ============================================================================
  // Notes Routes (SDK Demo Example)
  // ============================================================================

  // List all notes
  r.get('/notes', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const user = getTenantUser(req);
    if (!user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;

    try {
      let query = db.table('tenant_notes').whereNull('deleted_at');

      // Filter by category
      if (category && ['personal', 'work', 'ideas'].includes(category)) {
        query = query.where('category', category);
      }

      // Search filter
      if (search?.trim()) {
        const s = `%${search.trim()}%`;
        query = query.where(function (this: any) {
          this.whereRaw('LOWER(title) LIKE LOWER(?)', [s])
            .orWhereRaw('LOWER(content) LIKE LOWER(?)', [s]);
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
  }));

  // Get single note
  r.get('/notes/:id', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const user = getTenantUser(req);
    if (!user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const { id } = req.params;

    try {
      const note = await db.table('tenant_notes')
        .where({ id })
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
  }));

  // Create note
  r.post('/notes', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
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
    const noteCategory = category && validCategories.includes(category) ? category : 'personal';

    try {
      const id = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

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
  }));

  // Update note
  r.put('/notes/:id', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
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
      const existing = await db.table('tenant_notes')
        .where({ id })
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
  }));

  // Delete note (soft delete)
  r.delete('/notes/:id', requireAuthMiddleware, asyncHandler(async (req: Request, res: Response) => {
    if (!db.isAvailable) {
      return sendError(res, 503, 'Database not configured');
    }

    const user = getTenantUser(req);
    if (!user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const { id } = req.params;

    try {
      const existing = await db.table('tenant_notes')
        .where({ id })
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
  }));

  // Example: Query tenant-owned data
  r.get('/stats/user-count', asyncHandler(async (_req: Request, res: Response) => {
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

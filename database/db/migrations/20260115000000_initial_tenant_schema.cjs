/**
 * Consolidated Initial Tenant Schema Migration
 *
 * This is the canonical starting point for the GroundWorkJS tenant database.
 * All tenant-specific tables are defined here.
 *
 * IMPORTANT: All tenant tables MUST be prefixed with `tenant_` to ensure
 * proper isolation in the tenant_ext schema. The platform enforces this
 * at the database level.
 *
 * Tables created:
 * - tenant_contact_submissions (contact form submissions)
 * - tenant_waitlist_signups (waitlist/newsletter signups)
 * - tenant_notes (notes demo - SDK example)
 *
 * Naming Convention:
 * - Table names: snake_case with `tenant_` prefix
 * - Column names: Use consistent casing per table (see each table's comments)
 *
 * @param {import('knex').Knex} knex
 */

// ============================================
// CONSTANTS
// ============================================

// Demo notes for seeding (optional - demonstrates SDK usage)
const DEMO_NOTES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Welcome to the SDK Demo!',
    content:
      'This note was created by the seed data. Feel free to edit or delete it to test the CRUD operations.',
    category: 'personal',
    is_pinned: true,
    tags: JSON.stringify(['welcome', 'getting-started']),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Getting Started with GroundWorkJS',
    content:
      'Check out the Showcase page (/showcase) to see all SDK components and hooks in action. The tabbed interface demonstrates DataTable, ActionModal, Cards, and more!',
    category: 'work',
    is_pinned: false,
    tags: JSON.stringify(['documentation', 'tutorial']),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Custom API Integration',
    content:
      'This Notes feature shows how to build CRUD interfaces with custom API endpoints. See backend/router.ts for the API implementation and this migration file for the schema.',
    category: 'work',
    is_pinned: false,
    tags: JSON.stringify(['api', 'backend', 'crud']),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Slot Injection Ideas',
    content:
      'Try adding custom widgets to the sidebar! The QuickStats component shows note count and notification alerts. Check out frontend/slots/index.ts to see how slot registration works.',
    category: 'ideas',
    is_pinned: false,
    tags: JSON.stringify(['slots', 'ui', 'customization']),
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Tenant Store Tips',
    content:
      'Your preferences persist across page navigations using the tenant store. Try changing settings in the Settings page and refreshing - they survive! See frontend/store/index.ts for implementation.',
    category: 'ideas',
    is_pinned: false,
    tags: JSON.stringify(['state', 'redux', 'persistence']),
  },
];

// ============================================
// MIGRATION: UP
// ============================================

exports.up = async function (knex) {
  // ============================================
  // 1. CREATE TABLES
  // ============================================

  // ------------------------------------------
  // tenant_contact_submissions
  // ------------------------------------------
  // Stores contact form submissions from public website visitors.
  // Uses camelCase for timestamp columns for consistency with existing code.
  await knex.schema.createTable('tenant_contact_submissions', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('subject').nullable();
    table.text('message').notNullable();
    table.string('source').nullable(); // e.g., 'homepage', 'blog', 'docs'
    table.jsonb('metadata').nullable(); // Additional context (utm params, etc.)
    table
      .enu('status', ['new', 'read', 'archived'])
      .notNullable()
      .defaultTo('new');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('readAt').nullable();
    table.timestamp('deletedAt').nullable(); // Soft delete

    // Indexes for common queries
    table.index('status');
    table.index('createdAt');
    table.index('email');
    table.index('deletedAt');
  });

  console.log('✓ Created tenant_contact_submissions table');

  // ------------------------------------------
  // tenant_waitlist_signups
  // ------------------------------------------
  // Stores waitlist/newsletter signups.
  // Uses camelCase for timestamp columns.
  await knex.schema.createTable('tenant_waitlist_signups', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('company').nullable();
    table.string('referrer').nullable(); // How they heard about us
    table.jsonb('metadata').nullable(); // Additional context
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    // Indexes for common queries
    table.index('email');
    table.index('createdAt');
  });

  console.log('✓ Created tenant_waitlist_signups table');

  // ------------------------------------------
  // tenant_notes
  // ------------------------------------------
  // SDK demo: Notes CRUD example.
  // Uses snake_case for timestamp columns (demonstrating both conventions work).
  await knex.schema.createTable('tenant_notes', table => {
    // Primary key - string ID for distributed systems
    table.string('id').primary();

    // Note content
    table.string('title', 255).notNullable();
    table.text('content').nullable();
    table
      .enu('category', ['personal', 'work', 'ideas'])
      .notNullable()
      .defaultTo('personal');

    // Ownership (optional - for multi-user notes)
    table.string('user_id').nullable();

    // Metadata
    table.boolean('is_pinned').notNullable().defaultTo(false);
    table.jsonb('tags').nullable(); // Array of tag strings

    // Timestamps (snake_case)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable(); // Soft delete

    // Indexes for common queries
    table.index('user_id');
    table.index('category');
    table.index('is_pinned');
    table.index('created_at');
    table.index('deleted_at');
  });

  console.log('✓ Created tenant_notes table');

  console.log('✓ Created all tenant tables');

  // ============================================
  // 2. SEED DATA (Optional Demo Data)
  // ============================================
  // Only seed demo notes if this is a fresh install
  // The existence check ensures idempotency

  const existingNotes = await knex('tenant_notes').select('id').limit(1);

  if (existingNotes.length === 0) {
    await knex('tenant_notes').insert(
      DEMO_NOTES.map(note => ({
        ...note,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })),
    );
    console.log('✓ Seeded demo notes');
  } else {
    console.log('⏭ Skipping demo notes seed (table not empty)');
  }

  console.log('\n✅ Initial tenant schema migration complete!\n');
};

// ============================================
// MIGRATION: DOWN
// ============================================

exports.down = async function (knex) {
  // Drop tables in reverse dependency order
  await knex.schema.dropTableIfExists('tenant_notes');
  await knex.schema.dropTableIfExists('tenant_waitlist_signups');
  await knex.schema.dropTableIfExists('tenant_contact_submissions');

  console.log('✓ Dropped all tenant tables');
};

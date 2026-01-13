/**
 * Seed data for tenant_notes table
 *
 * This demonstrates how to populate the database with initial data.
 * In production, seeds are typically run once during setup or for testing.
 *
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  // Clear existing entries (be careful in production!)
  await knex('tenant_notes').del();

  // Insert seed data
  await knex('tenant_notes').insert([
    {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Welcome to the SDK Demo!',
      content:
        'This note was created by the seed file. Feel free to edit or delete it to test the CRUD operations.',
      category: 'personal',
      is_pinned: true,
      tags: JSON.stringify(['welcome', 'getting-started']),
      created_at: new Date('2026-01-09T10:00:00Z'),
      updated_at: new Date('2026-01-09T10:00:00Z'),
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'Getting Started with GroundWorkJS',
      content:
        'Check out the Showcase page (/o/showcase) to see all SDK components and hooks in action. The tabbed interface demonstrates DataTable, ActionModal, Cards, and more!',
      category: 'work',
      is_pinned: false,
      tags: JSON.stringify(['documentation', 'tutorial']),
      created_at: new Date('2026-01-08T14:30:00Z'),
      updated_at: new Date('2026-01-08T14:30:00Z'),
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'Custom API Integration',
      content:
        'This Notes feature shows how to build CRUD interfaces with custom API endpoints. See backend/router.ts for the API implementation and database/db/migrations/003_create_notes.cjs for the schema.',
      category: 'work',
      is_pinned: false,
      tags: JSON.stringify(['api', 'backend', 'crud']),
      created_at: new Date('2026-01-07T09:15:00Z'),
      updated_at: new Date('2026-01-07T09:15:00Z'),
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      title: 'Slot Injection Ideas',
      content:
        'Try adding custom widgets to the sidebar! The QuickStats component shows note count and notification alerts. Check out frontend/slots/index.ts to see how slot registration works.',
      category: 'ideas',
      is_pinned: false,
      tags: JSON.stringify(['slots', 'ui', 'customization']),
      created_at: new Date('2026-01-06T16:45:00Z'),
      updated_at: new Date('2026-01-06T16:45:00Z'),
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      title: 'Tenant Store Tips',
      content:
        'Your preferences persist across page navigations using the tenant store. Try changing settings in the Settings page and refreshing - they survive! See frontend/store/index.ts for implementation.',
      category: 'ideas',
      is_pinned: false,
      tags: JSON.stringify(['state', 'redux', 'persistence']),
      created_at: new Date('2026-01-05T11:20:00Z'),
      updated_at: new Date('2026-01-05T11:20:00Z'),
    },
  ]);
};

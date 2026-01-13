/**
 * Create tenant_notes table for the Notes SDK demo
 *
 * This migration demonstrates how tenant developers can add
 * their own database tables for custom features.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('tenant_notes', (table) => {
    // Primary key - UUID for distributed systems
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

    // Timestamps
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
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('tenant_notes');
};

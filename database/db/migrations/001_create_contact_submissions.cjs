/**
 * Create tenant_contact_submissions table in tenant database
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('tenant_contact_submissions', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('subject').nullable();
    table.text('message').notNullable();
    table.string('source').nullable();
    table.jsonb('metadata').nullable();
    table
      .enu('status', ['new', 'read', 'archived'])
      .notNullable()
      .defaultTo('new');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('readAt').nullable();
    table.timestamp('deletedAt').nullable();

    // Add index for common queries
    table.index('status');
    table.index('createdAt');
    table.index('email');
    table.index('deletedAt');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('tenant_contact_submissions');
};

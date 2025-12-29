/**
 * Create tenant_waitlist_signups table in tenant database
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('tenant_waitlist_signups', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('company').nullable();
    table.string('referrer').nullable();
    table.jsonb('metadata').nullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    // Add indexes for common queries
    table.index('email');
    table.index('createdAt');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('tenant_waitlist_signups');
};

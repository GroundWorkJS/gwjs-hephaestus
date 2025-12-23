/**
 * Create contact_submissions table in tenant database
 * @param {import('knex').Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('contact_submissions', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('subject').nullable();
    table.text('message').notNullable();
    table.string('source').nullable();
    table.jsonb('metadata').nullable();
    table
      .enu('status', ['new', 'reviewing', 'closed'])
      .notNullable()
      .defaultTo('new');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    
    // Add index for common queries
    table.index('status');
    table.index('createdAt');
    table.index('email');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('contact_submissions');
};

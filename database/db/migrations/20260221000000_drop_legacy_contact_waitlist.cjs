/**
 * Drop Legacy Contact & Waitlist Tables
 *
 * These tables were part of the original tenant demo that provided a simple
 * contact form and waitlist signup system. This functionality has been
 * superseded by the platform-level inbox/messaging system.
 *
 * Tables dropped:
 * - tenant_contact_submissions
 * - tenant_waitlist_signups
 *
 * @since 2026-02-21
 */

exports.up = async function (knex) {
  await knex.schema.dropTableIfExists('tenant_waitlist_signups');
  console.log('✓ Dropped tenant_waitlist_signups table');

  await knex.schema.dropTableIfExists('tenant_contact_submissions');
  console.log('✓ Dropped tenant_contact_submissions table');

  console.log(
    '\n✅ Legacy contact/waitlist tables removed (replaced by platform inbox)\n',
  );
};

exports.down = async function (knex) {
  // Recreate tenant_contact_submissions
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

    table.index('status');
    table.index('createdAt');
    table.index('email');
    table.index('deletedAt');
  });

  // Recreate tenant_waitlist_signups
  await knex.schema.createTable('tenant_waitlist_signups', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('company').nullable();
    table.string('referrer').nullable();
    table.jsonb('metadata').nullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    table.index('email');
    table.index('createdAt');
  });

  console.log('✓ Recreated legacy contact/waitlist tables');
};

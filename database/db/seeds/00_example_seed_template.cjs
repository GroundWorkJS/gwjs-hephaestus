/**
 * Example Seed Template for Tenant Database
 *
 * This file demonstrates how to create seed files for your tenant database.
 * Seeds are useful for:
 * - Development: Populating test data quickly
 * - Testing: Consistent data for automated tests
 * - Demos: Pre-populated data for showcases
 *
 * USAGE:
 *   pnpm db:seed           # Run all seeds
 *   pnpm db:seed:tenant    # Run tenant seeds specifically
 *
 * IMPORTANT NOTES:
 * - Seeds run in alphabetical order by filename
 * - Seeds are NOT run automatically during migrations
 * - Seeds should be idempotent (safe to run multiple times)
 * - Production seeds should be careful about data destruction
 *
 * NAMING CONVENTION:
 * - Use numbered prefixes: 001_seed_name.cjs, 002_another_seed.cjs
 * - Use descriptive names that indicate the data being seeded
 *
 * @param {import('knex').Knex} _knex
 */
exports.seed = async function (_knex) {
  // This is a template - it doesn't actually insert any data
  // Copy this file and modify for your specific seeding needs

  console.log('📚 Example seed template (not executed - reference only)');

  // Example: Insert sample data
  // await knex('tenant_your_table').del(); // Clear existing data (be careful!)
  //
  // await knex('tenant_your_table').insert([
  //   {
  //     id: 'sample_001',
  //     name: 'Sample Item 1',
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   },
  //   {
  //     id: 'sample_002',
  //     name: 'Sample Item 2',
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   },
  // ]);
  //
  // console.log('✓ Seeded tenant_your_table');
};

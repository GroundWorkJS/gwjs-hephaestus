/**
 * Tenant Frontend Entry Point
 *
 * This is the main export for tenant frontend code.
 * The platform imports this to:
 * 1. Set up the tenant's Redux store
 * 2. Register slot content
 * 3. Load tenant-specific providers
 *
 * Keep all tenant frontend logic isolated here.
 */

// Store configuration
export { tenantStoreConfig } from './store/index.js';
export type { TenantState } from './store/index.js';

// Slot registrations
export { tenantSlots } from './slots/index.js';
export type { TenantSlotConfig } from './slots/index.js';

// Re-export components if needed directly
export * from './components/index.js';

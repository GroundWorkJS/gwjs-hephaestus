/**
 * Tenant Slot Registrations
 *
 * Define which components render in which slots.
 * The platform will register these automatically.
 */

import type { ComponentType } from 'react';
import type { SlotLocation, SlotContentProps } from '@groundworkjs/plugin-sdk/ui';

// Import slot components
import { QuickActions } from '../components/NotificationBell';
import { QuickStats } from '../components/QuickStats';
import { TenantBranding } from '../components/WelcomeBanner';
import { TenantFooter } from '../components/TenantFooter';

// ============================================================================
// Types
// ============================================================================

export interface TenantSlotConfig {
  /** Which slot to register in */
  slot: SlotLocation;
  /** The component to render */
  component: ComponentType<SlotContentProps>;
  /** Priority (higher = rendered first) */
  priority?: number;
  /** Only show on these routes */
  routes?: string[];
  /** Hide on these routes */
  excludeRoutes?: string[];
  /** Whether this slot is enabled */
  enabled?: boolean;
}

// ============================================================================
// Slot Registrations
// ============================================================================

export const tenantSlots: TenantSlotConfig[] = [
  // Quick action button in header (add note shortcut)
  {
    slot: 'header-right',
    component: QuickActions,
    priority: 100,
    excludeRoutes: ['/login', '/register', '/forgot-password'],
  },

  // Tenant branding badge in header
  {
    slot: 'header-right',
    component: TenantBranding,
    priority: 50,
    excludeRoutes: ['/login', '/register', '/forgot-password'],
  },

  // Quick stats in sidebar top
  {
    slot: 'sidebar-top',
    component: QuickStats,
    priority: 100,
    excludeRoutes: ['/login', '/register', '/forgot-password'],
  },

  // Tenant footer in sidebar bottom
  {
    slot: 'sidebar-bottom',
    component: TenantFooter,
    priority: 100,
    excludeRoutes: ['/login', '/register', '/forgot-password'],
  },
];

import type { RoutePath } from '@groundworkjs/plugin-sdk';

export type TenantRouteMap = Record<RoutePath, string>;

/**
 * Map of route -> PageName (without extension).
 * The host app will resolve names via @gwjs/tenant-pages/* using webpack context.
 *
 * Tenant routes live at the ROOT level for seamless URLs (no /tenant/ prefix).
 * Platform reserved routes (like /dashboard, /admin/*, /settings/*) cannot be used.
 *
 * The route blacklist prevents conflicts - see @groundworkjs/plugin-sdk/routes
 */
export const additivePages: TenantRouteMap = {
  // SDK Showcase Demo Pages
  '/showcase': 'ShowcasePage',
  '/notes': 'NotesPage',
  '/tenant-settings': 'SettingsPage', // Renamed to avoid conflict with /settings/*

  // Demo pages
  '/home': 'HomePage',
  '/hello': 'HelloPage',
  '/taco': 'TacoPage',

  // Tenant-specific admin (not platform admin)
  '/inbox': 'AdminMessagesPage',
};

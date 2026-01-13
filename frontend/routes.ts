import type { RoutePath } from '@groundworkjs/plugin-sdk';

export type TenantRouteMap = Record<RoutePath, string>;

/**
 * Map of route -> PageName (without extension).
 * The host app will resolve names via @gwjs/tenant-pages/* using webpack context.
 */
export const additivePages: TenantRouteMap = {
  // SDK Showcase Demo Pages
  '/o/showcase': 'ShowcasePage',
  '/o/notes': 'NotesPage',
  '/o/settings': 'SettingsPage',

  // Keep some existing pages
  '/o/home': 'HomePage',
  '/o/hello': 'HelloPage',
  '/o/taco': 'TacoPage',
  '/o/admin/messages': 'AdminMessagesPage',
};

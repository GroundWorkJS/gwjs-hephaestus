import type { RoutePath } from '@groundworkjs/plugin-sdk';

export type TenantRouteMap = Record<RoutePath, string>;

/**
 * Map of route -> PageName (without extension).
 * The host app will resolve names via @gwjs/tenant-pages/* using webpack context.
 */
export const additivePages: TenantRouteMap = {
  '/o/hello': 'HelloPage',
  '/o/taco': 'TacoPage',
};

/**
 * TenantBranding Component
 *
 * Demonstrates slot injection for custom tenant branding.
 * Shows a custom badge/label that identifies this tenant instance.
 */

'use client';

import {
  Chip,
  useIsAuthenticated,
} from '@groundworkjs/plugin-sdk/ui';
import type { SlotContentProps } from '@groundworkjs/plugin-sdk/ui';

export function TenantBranding(_props: SlotContentProps): React.ReactElement | null {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Chip
      label="Demo Tenant"
      size="small"
      sx={{
        mr: 1,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 24,
      }}
    />
  );
}

// Keep old export name for backward compatibility during migration
export const WelcomeBanner = TenantBranding;

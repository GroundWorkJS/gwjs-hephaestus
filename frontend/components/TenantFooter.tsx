/**
 * TenantFooter Component
 *
 * Demonstrates sidebar-bottom slot injection.
 * Shows tenant version info and help links.
 */

'use client';

import {
  Box,
  Typography,
  Link,
  Stack,
  Divider,
  useIsAuthenticated,
} from '@groundworkjs/plugin-sdk/ui';
import type { SlotContentProps } from '@groundworkjs/plugin-sdk/ui';

export function TenantFooter(_props: SlotContentProps): React.ReactElement | null {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Link
            href="/o/showcase"
            color="text.secondary"
            underline="hover"
            sx={{ fontSize: '0.75rem' }}
          >
            Showcase
          </Link>
          <Link
            href="/o/settings"
            color="text.secondary"
            underline="hover"
            sx={{ fontSize: '0.75rem' }}
          >
            Settings
          </Link>
        </Stack>
        <Divider />
        <Typography
          variant="caption"
          color="text.disabled"
          textAlign="center"
          sx={{ fontSize: '0.65rem' }}
        >
          Demo Tenant v1.0.0
        </Typography>
      </Stack>
    </Box>
  );
}

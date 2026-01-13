/**
 * QuickStats Component
 *
 * A sidebar widget demonstrating slot injection.
 * Shows quick statistics at the top of the navigation drawer.
 */

'use client';

import {
  Box,
  Stack,
  Typography,
  Chip,
  useIsAuthenticated,
} from '@groundworkjs/plugin-sdk/ui';
import type { SlotContentProps } from '@groundworkjs/plugin-sdk/ui';

export function QuickStats(_props: SlotContentProps): React.ReactElement | null {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ fontSize: '0.65rem', letterSpacing: 1 }}
      >
        Tenant Stats
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
        <Chip
          size="small"
          label="5 Notes"
          color="primary"
          variant="outlined"
          sx={{ fontSize: '0.7rem' }}
        />
        <Chip
          size="small"
          label="Active"
          color="success"
          variant="outlined"
          sx={{ fontSize: '0.7rem' }}
        />
      </Stack>
    </Box>
  );
}

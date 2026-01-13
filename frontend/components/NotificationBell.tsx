/**
 * QuickActions Component
 *
 * Demonstrates slot injection in the header.
 * Provides quick action buttons for common tenant operations.
 */

'use client';

import {
  IconButton,
  Tooltip,
  AddIcon,
  useIsAuthenticated,
} from '@groundworkjs/plugin-sdk/ui';
import type { SlotContentProps } from '@groundworkjs/plugin-sdk/ui';

export function QuickActions(_props: SlotContentProps): React.ReactElement | null {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return null;
  }

  const handleQuickAdd = () => {
    // Navigate to notes page to create a new note
    window.location.href = '/o/notes';
  };

  return (
    <Tooltip title="Quick Add Note">
      <IconButton
        color="inherit"
        onClick={handleQuickAdd}
        aria-label="Quick add note"
        size="small"
        sx={{ mr: 0.5 }}
      >
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
}

// Keep old export for backward compatibility
export const NotificationBell = QuickActions;

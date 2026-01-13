/**
 * SlotDiagram Component
 *
 * Visual representation of available slot locations in the platform.
 */

'use client';

import { Box, Typography, Paper } from '@groundworkjs/plugin-sdk/ui';

export function SlotDiagram(): React.ReactElement {
  return (
    <Box sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
      {/* App Bar */}
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          mb: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
          ☰ App Bar
        </Typography>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            bgcolor: 'warning.light',
            color: 'warning.contrastText',
            borderRadius: 1,
            fontSize: '0.7rem',
          }}
        >
          header-right
        </Box>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Sidebar */}
        <Paper
          variant="outlined"
          sx={{
            width: 140,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              borderRadius: 1,
              textAlign: 'center',
              fontSize: '0.7rem',
            }}
          >
            sidebar-top
          </Box>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              borderRadius: 1,
              textAlign: 'center',
              fontSize: '0.7rem',
            }}
          >
            sidebar-nav
          </Box>
          <Box sx={{ flexGrow: 1, textAlign: 'center', py: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Nav Items
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              borderRadius: 1,
              textAlign: 'center',
              fontSize: '0.7rem',
            }}
          >
            sidebar-bottom
          </Box>
        </Paper>

        {/* Main Content */}
        <Paper
          variant="outlined"
          sx={{
            flexGrow: 1,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            minHeight: 200,
          }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              borderRadius: 1,
              textAlign: 'center',
              fontSize: '0.7rem',
            }}
          >
            page-header
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Page Content
            </Typography>
          </Box>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              borderRadius: 1,
              textAlign: 'center',
              fontSize: '0.7rem',
            }}
          >
            page-footer
          </Box>
        </Paper>
      </Box>

      {/* Overlay indicator */}
      <Paper
        variant="outlined"
        sx={{
          mt: 1,
          p: 1,
          bgcolor: 'info.light',
          color: 'info.contrastText',
          textAlign: 'center',
        }}
      >
        <Typography variant="caption">
          <strong>main-overlay</strong> - Modals, drawers, toasts (renders above everything)
        </Typography>
      </Paper>
    </Box>
  );
}

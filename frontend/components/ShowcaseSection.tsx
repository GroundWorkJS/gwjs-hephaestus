/**
 * ShowcaseSection Component
 *
 * A reusable wrapper for SDK showcase demos.
 * Shows a live demo with optional code snippet toggle.
 */

'use client';

import { useState } from 'react';
import {
  Paper,
  Stack,
  Box,
  Typography,
  Button,
  Collapse,
  CodeIcon,
} from '@groundworkjs/plugin-sdk/ui';

export interface ShowcaseSectionProps {
  /** Section title */
  title: string;
  /** Description of what's being demonstrated */
  description?: string;
  /** Code snippet to show */
  code?: string;
  /** Live demo content */
  children?: React.ReactNode;
}

export function ShowcaseSection({
  title,
  description,
  code,
  children,
}: ShowcaseSectionProps): React.ReactElement {
  const [showCode, setShowCode] = useState(false);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" component="h3">
              {title}
            </Typography>
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {description}
              </Typography>
            )}
          </Box>
          {code && (
            <Button
              size="small"
              variant={showCode ? 'contained' : 'outlined'}
              startIcon={<CodeIcon />}
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? 'Hide Code' : 'View Code'}
            </Button>
          )}
        </Stack>

        {/* Live Demo */}
        {children && (
          <Box
            sx={{
              py: 2,
              px: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
            }}
          >
            {children}
          </Box>
        )}

        {/* Code Display */}
        <Collapse in={showCode}>
          <Box
            component="pre"
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              color: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.8125rem',
              fontFamily: '"Fira Code", "Consolas", monospace',
              lineHeight: 1.6,
              m: 0,
              '& code': {
                fontFamily: 'inherit',
              },
            }}
          >
            <code>{code}</code>
          </Box>
        </Collapse>
      </Stack>
    </Paper>
  );
}

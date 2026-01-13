/**
 * Settings Page
 *
 * Demonstrates:
 * - Form components with various input types
 * - Tenant store for preference persistence
 * - Permission-gated sections
 * - Real-time state updates
 */

'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Card,
  CardContent,
  CardHeader,
  Chip,
  SaveIcon,
  usePluginAuth,
  useHasRole,
  useTenantSelector,
  useTenantDispatch,
} from '@groundworkjs/plugin-sdk/ui';
import type { TenantState } from '../store';

// ============================================================================
// Main Component
// ============================================================================

export default function SettingsPage(): React.ReactElement {
  const { user, isAuthenticated, isLoading } = usePluginAuth();
  const isAdmin = useHasRole('admin');

  // Get preferences from tenant store (with safe defaults)
  const notificationsEnabled = useTenantSelector<TenantState, boolean>(
    (state) => state?.userPreferences?.notificationsEnabled ?? true
  );
  const sidebarCollapsed = useTenantSelector<TenantState, boolean>(
    (state) => state?.userPreferences?.sidebarCollapsed ?? false
  );
  const customSettings = useTenantSelector<TenantState, Record<string, unknown>>(
    (state) => state?.userPreferences?.customSettings ?? {}
  );

  const dispatch = useTenantDispatch();

  // ============================================================================
  // Handlers
  // ============================================================================

  const toggleNotifications = () => {
    dispatch({ type: 'userPreferences/toggleNotifications' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'userPreferences/toggleSidebar' });
  };

  const setCustomSetting = (key: string, value: unknown) => {
    dispatch({
      type: 'userPreferences/setCustomSetting',
      payload: { key, value },
    });
  };

  // ============================================================================
  // Render
  // ============================================================================

  // Wait for auth to initialize before checking authentication
  // Use empty fragment instead of null to ensure component stays in tree for re-renders
  if (isLoading) {
    return <></>;
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view settings.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ⚙️ Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preferences persist in the tenant store and survive page navigations.
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* Profile Section */}
        <Card>
          <CardHeader
            title="Profile"
            subheader="Your account information (read-only in demo)"
          />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="Display Name"
                value={user?.displayName || user?.firstName || 'Demo User'}
                fullWidth
                disabled
                helperText="Profile editing would connect to your user API"
              />
              <TextField
                label="Email"
                value={user?.email || 'demo@example.com'}
                fullWidth
                disabled
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader
            title="Appearance"
            subheader="Customize how the app looks"
          />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Theme"
                select
                fullWidth
                value={customSettings.theme as string || 'system'}
                onChange={(e) => setCustomSetting('theme', e.target.value)}
                SelectProps={{ native: true }}
                helperText="Theme preference (stored in tenant store)"
              >
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={sidebarCollapsed}
                    onChange={toggleSidebar}
                  />
                }
                label="Collapse sidebar by default"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={customSettings.compactMode as boolean || false}
                    onChange={(e) => setCustomSetting('compactMode', e.target.checked)}
                  />
                }
                label="Compact mode (denser layouts)"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader
            title="Notifications"
            subheader="Control how you receive updates"
          />
          <CardContent>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={toggleNotifications}
                  />
                }
                label="Enable in-app notifications"
              />

              <TextField
                label="Email Digest"
                select
                fullWidth
                value={customSettings.emailDigest as string || 'never'}
                onChange={(e) => setCustomSetting('emailDigest', e.target.value)}
                SelectProps={{ native: true }}
                disabled={!notificationsEnabled}
                helperText={!notificationsEnabled ? 'Enable notifications first' : undefined}
              >
                <option value="never">Never</option>
                <option value="daily">Daily Summary</option>
                <option value="weekly">Weekly Summary</option>
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={customSettings.soundEnabled as boolean ?? true}
                    onChange={(e) => setCustomSetting('soundEnabled', e.target.checked)}
                    disabled={!notificationsEnabled}
                  />
                }
                label="Play sound for new notifications"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Admin Section - Permission Gated */}
        {isAdmin ? (
          <Card>
            <CardHeader
              title="Admin Settings"
              subheader="Only visible to administrators"
              action={<Chip label="Admin Only" color="warning" size="small" />}
            />
            <CardContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                This section demonstrates permission-gated UI using <code>useHasRole('admin')</code>.
              </Alert>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={customSettings.maintenanceMode as boolean || false}
                      onChange={(e) => setCustomSetting('maintenanceMode', e.target.checked)}
                    />
                  }
                  label="Enable maintenance mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={customSettings.debugMode as boolean || false}
                      onChange={(e) => setCustomSetting('debugMode', e.target.checked)}
                    />
                  }
                  label="Enable debug mode"
                />
                <TextField
                  label="Max upload size (MB)"
                  type="number"
                  value={customSettings.maxUploadSize as number || 10}
                  onChange={(e) => setCustomSetting('maxUploadSize', Number(e.target.value))}
                  fullWidth
                />
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Paper sx={{ p: 3, bgcolor: 'action.disabledBackground' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography color="text.secondary">
                🔒 Admin settings are hidden because you don't have the admin role.
              </Typography>
              <Chip label="Permission Demo" size="small" variant="outlined" />
            </Stack>
          </Paper>
        )}

        {/* Current State Debug */}
        <Card>
          <CardHeader
            title="Current Store State"
            subheader="Live view of your preferences in the tenant store"
          />
          <CardContent>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box
                component="pre"
                sx={{
                  fontSize: '0.8125rem',
                  fontFamily: 'monospace',
                  m: 0,
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(
                  {
                    notificationsEnabled,
                    sidebarCollapsed,
                    customSettings,
                  },
                  null,
                  2
                )}
              </Box>
            </Paper>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Changes are saved automatically to the tenant store. Refresh the page - your settings persist!
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

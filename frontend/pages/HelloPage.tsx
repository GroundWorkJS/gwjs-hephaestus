'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  usePluginAuth,
} from '@groundworkjs/plugin-sdk/ui';

export default function HelloPage(): React.ReactElement {
  const { user, isAuthenticated } = usePluginAuth();

  const displayName = user?.displayName || user?.firstName || 'Guest';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Welcome Header */}
        <Box textAlign="center">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2,
            }}
          >
            👋 Hello{isAuthenticated ? `, ${displayName}` : ''}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
            Welcome to the Demo Tenant. This is a sample tenant application
            built on the GroundWorkJS platform.
          </Typography>
        </Box>

        {/* Quick Links */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Quick Links
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" href="/o/notes" fullWidth>
              📝 Notes
            </Button>
            <Button variant="outlined" href="/o/showcase" fullWidth>
              🧪 Showcase
            </Button>
            <Button variant="outlined" href="/o/settings" fullWidth>
              ⚙️ Settings
            </Button>
          </Stack>
        </Paper>

        {/* Info Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={2}>
                <Chip label="Tenant Pages" size="small" color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Custom Pages
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tenants can define custom pages that integrate seamlessly with the platform
                  navigation and routing system.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={2}>
                <Chip label="SDK" size="small" color="secondary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Plugin SDK
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Access platform features through a type-safe SDK including authentication,
                  permissions, and UI components.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack spacing={2}>
                <Chip label="Slots" size="small" color="success" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  UI Slots
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inject custom components into platform UI areas like the header,
                  sidebar, and page sections.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}

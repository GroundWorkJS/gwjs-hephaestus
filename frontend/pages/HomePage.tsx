'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Paper,
  Avatar,
  Divider,
  IconButton,
  Link,
  AddIcon,
  EditIcon,
  CheckIcon,
  RefreshIcon,
  ExtensionIcon,
  DeleteIcon,
} from '@groundworkjs/plugin-sdk/ui';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: <CheckIcon />,
      title: 'Dashboard',
      description: 'Intuitive analytics and metrics at your fingertips',
      color: '#6366f1',
    },
    {
      icon: <ExtensionIcon />,
      title: 'Extensions',
      description: 'Extend functionality with a powerful plugin system',
      color: '#8b5cf6',
    },
    {
      icon: <EditIcon />,
      title: 'Theming',
      description: 'Fully customizable design system and components',
      color: '#ec4899',
    },
    {
      icon: <RefreshIcon />,
      title: 'Performance',
      description: 'Optimized for speed and seamless user experience',
      color: '#f59e0b',
    },
    {
      icon: <DeleteIcon />,
      title: 'Data Layer',
      description: 'Robust data management and persistence',
      color: '#10b981',
    },
    {
      icon: <AddIcon />,
      title: 'Developer Tools',
      description: 'Built-in tooling for rapid development',
      color: '#3b82f6',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '<50ms', label: 'Response' },
    { value: '100+', label: 'Components' },
    { value: '∞', label: 'Possibilities' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
        }}
      >
        {/* Gradient Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.3), transparent)'
                : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Chip
              label="Demo Instance"
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 500,
                px: 1,
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)'
                    : 'linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                maxWidth: 900,
              }}
            >
              Welcome to Your Application
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 600,
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6,
              }}
            >
              A modern, extensible platform built with performance and developer
              experience in mind. Start building something amazing.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                size="large"
                href="/o/showcase"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                Explore Features →
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/o/notes"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.02)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Stack
                  alignItems="center"
                  spacing={0.5}
                  sx={{
                    position: 'relative',
                    '&::after':
                      index < stats.length - 1
                        ? {
                          content: '""',
                          position: 'absolute',
                          right: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          height: '50%',
                          width: 1,
                          bgcolor: 'divider',
                          display: { xs: 'none', md: 'block' },
                        }
                        : {},
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {stat.label}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Features Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={6}>
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.75rem' },
                mb: 2,
              }}
            >
              Built for Modern Development
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}
            >
              Everything you need to build, deploy, and scale your application
              with confidence.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 1,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                          ? '0 20px 40px rgba(0,0,0,0.3)'
                          : '0 20px 40px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: `${feature.color}15`,
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: 'center',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
              border: '1px solid',
              borderColor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(99, 102, 241, 0.2)'
                  : 'rgba(99, 102, 241, 0.1)',
            }}
          >
            <Stack spacing={3} alignItems="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                }}
              >
                Ready to dive in?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400 }}
              >
                Explore the showcase to see all available components and features
                in action.
              </Typography>
              <Button
                variant="contained"
                size="large"
                href="/o/showcase"
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                View Showcase →
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="body2" color="text.secondary">
              Demo Application • Built with UI Core
            </Typography>
            <Stack direction="row" spacing={1}>
              <Link href="/o/settings">
                <IconButton size="small" color="inherit">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Link>
              <Link href="/o/showcase">
                <IconButton size="small" color="inherit">
                  <ExtensionIcon fontSize="small" />
                </IconButton>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

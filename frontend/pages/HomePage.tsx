import React from 'react';
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
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import CloudIcon from '@mui/icons-material/Cloud';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ExtensionIcon from '@mui/icons-material/Extension';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

export const HomePage: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 2,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Multi-Tenant SaaS Platform
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                mb: 4,
                opacity: 0.95,
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              Enterprise-grade security and compliance built-in. From small businesses
              to government agencies—deploy with confidence.
            </Typography>

            {/* Compliance Badges */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              mb={4}
              flexWrap="wrap"
              sx={{ gap: 2 }}
            >
              <Chip
                icon={<VerifiedUserIcon />}
                label="FedRAMP Ready"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<VerifiedUserIcon />}
                label="HIPAA Compliant"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<VerifiedUserIcon />}
                label="PCI DSS"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                icon={<SecurityIcon />}
                label="OWASP Secured"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Stack>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                href={`https://groundworkjs.com/?xref=${typeof window !== 'undefined' ? window.location.hostname : 'tenant-demo'}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="/o/security"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Security Details
              </Button>
            </Stack>
          </Box>
        </Container>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }}
        />
      </Box>

      {/* Value Propositions */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Everything You Need, Out of the Box
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            A complete platform designed for organizations that demand security, compliance,
            and reliability. Fully customizable to meet your unique needs.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <SecurityIcon sx={{ fontSize: 50, color: '#667eea' }} />,
              title: 'Zero-Trust Architecture',
              description:
                'Multi-layer authentication, sandbox isolation, and automatic audit logging. Every tenant runs in a hardened container with zero shared resources.',
              link: '/o/security',
            },
            {
              icon: <CloudIcon sx={{ fontSize: 50, color: '#764ba2' }} />,
              title: 'Automated Compliance',
              description:
                'Built-in FedRAMP, HIPAA, and PCI DSS compliance controls. Automatic security patching, encrypted backups, and compliance reporting out of the box.',
              link: '/o/features',
            },
            {
              icon: <SpeedIcon sx={{ fontSize: 50, color: '#f093fb' }} />,
              title: 'Streamlined Development',
              description:
                'Docker-based setup with PostgreSQL, Redis, and development tooling configured. Reduces initial setup time for new SaaS projects.',
              link: '/o/features',
            },
            {
              icon: <ExtensionIcon sx={{ fontSize: 50, color: '#4facfe' }} />,
              title: 'Deeply Customizable',
              description:
                'Tailor every aspect of the platform to your needs. Custom branding, workflows, integrations, and features—all while maintaining security and compliance standards.',
              link: '/o/features',
            },
            {
              icon: <MonetizationOnIcon sx={{ fontSize: 50, color: '#43e97b' }} />,
              title: 'Transparent Pricing',
              description:
                'Predictable subscription pricing starting at $249/instance. Scale resources as you grow with flexible bandwidth, storage, and compute options.',
              link: '/o/pricing',
            },
            {
              icon: <VerifiedUserIcon sx={{ fontSize: 50, color: '#fa709a' }} />,
              title: 'Audit-Proof by Design',
              description:
                'Comprehensive audit logging tracks every database query, API call, and user action. Pass compliance audits with automatically generated reports.',
              link: '/o/security',
            },
          ].map(({ icon, title, description, link }) => (
            <Grid size={{ xs: 12, md: 6 }} key={title}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box mb={2}>{icon}</Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {description}
                  </Typography>
                  <Button
                    href={link}
                    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                    sx={{ color: '#667eea', fontWeight: 600 }}
                  >
                    Learn More →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Social Proof / Stats */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            {[
              { number: 'Gov', label: 'Ready Compliance' },
              { number: 'Multi', label: 'Tenant Secure' },
              { number: '$249', label: 'Starting Price' },
              { number: '24/7', label: 'Support' },
            ].map(({ number, label }) => (
              <Grid size={{ xs: 6, md: 3 }} key={label}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, color: '#667eea', mb: 1 }}
                >
                  {number}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Ready to Explore?
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Learn more about the platform and how it can support your SaaS application.
        </Typography>
        <Stack direction="row" spacing={3} justifyContent="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            href={`https://groundworkjs.com/?xref=${typeof window !== 'undefined' ? window.location.hostname : 'tenant-demo'}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            Visit Main Site
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="/o/contact"
            sx={{ px: 5, py: 2, fontSize: '1.1rem', fontWeight: 600 }}
          >
            Get in Touch
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HomePage;

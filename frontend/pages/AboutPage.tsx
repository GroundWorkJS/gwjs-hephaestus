'use client';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

const AboutPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* PAGE HEADER */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" gutterBottom>
          About Our Platform
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Built with flexibility and customization in mind
        </Typography>
      </Box>

      {/* WHAT IT IS */}
      <Box mb={10}>
        <Typography variant="h4" gutterBottom>
          What We Offer
        </Typography>
        <Typography variant="body1" paragraph>
          This is a demonstration of a tenant-customized platform. Everything
          you see on this page is specific to this tenant instance, showcasing
          the power of customization.
        </Typography>
        <Typography variant="body1" paragraph>
          Tenants can create their own pages, features, and functionality while
          leveraging the robust foundation provided by the platform.
        </Typography>
      </Box>

      {/* FEATURES */}
      <Box mb={10}>
        <Typography variant="h4" gutterBottom mb={4}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box textAlign="center">
                  <ShieldIcon fontSize="large" color="primary" />
                  <Typography variant="h6" mt={2} mb={1}>
                    Secure & Isolated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete data isolation with enterprise-grade security
                    built in.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box textAlign="center">
                  <SettingsIcon fontSize="large" color="primary" />
                  <Typography variant="h6" mt={2} mb={1}>
                    Fully Customizable
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Build custom features, pages, and workflows specific to
                    your needs.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box textAlign="center">
                  <AccountTreeIcon fontSize="large" color="primary" />
                  <Typography variant="h6" mt={2} mb={1}>
                    Extensible Platform
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Leverage platform features while extending with your own
                    custom functionality.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* WHY CHOOSE US */}
      <Box mb={10}>
        <Typography variant="h4" gutterBottom>
          Why This Matters
        </Typography>
        <Typography variant="body1" paragraph>
          Traditional platforms force you into a one-size-fits-all model. Our
          approach gives you the freedom to build exactly what your business
          needs while maintaining the benefits of a managed platform.
        </Typography>
        <Typography variant="body1" paragraph>
          Focus on your unique value proposition while we handle the
          infrastructure, security, and core platform features.
        </Typography>
      </Box>

      {/* CTA */}
      <Box textAlign="center" sx={{ py: 6, bgcolor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Ready to get started?
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Reach out to learn more about customizing your own instance.
        </Typography>
        <Button variant="contained" size="large" href="/o/contact">
          Get in Touch
        </Button>
      </Box>
    </Container>
  );
};

export default AboutPage;

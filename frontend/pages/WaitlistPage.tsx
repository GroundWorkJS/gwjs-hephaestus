'use client';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';
import WaitlistForm from '../components/WaitlistForm';

const WaitlistPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 10 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={8}>
        <Typography variant="h2" gutterBottom>
          Join Our Waitlist
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
          Be among the first to experience our platform when it launches.
          Get early access, exclusive updates, and special pricing.
        </Typography>
      </Box>

      {/* Benefits */}
      <Grid container spacing={4} mb={6}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box textAlign="center">
            <Typography variant="h1" sx={{ color: '#667eea', fontSize: '3rem', mb: 1 }}>
              ⚡
            </Typography>
            <Typography variant="h6" gutterBottom>
              Early Access
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get access before the official launch
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box textAlign="center">
            <Typography variant="h1" sx={{ color: '#764ba2', fontSize: '3rem', mb: 1 }}>
              💰
            </Typography>
            <Typography variant="h6" gutterBottom>
              Special Pricing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Exclusive discounts for early supporters
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box textAlign="center">
            <Typography variant="h1" sx={{ color: '#43e97b', fontSize: '3rem', mb: 1 }}>
              📢
            </Typography>
            <Typography variant="h6" gutterBottom>
              Stay Updated
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regular updates on development progress
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Waitlist Form */}
      <WaitlistForm />
    </Container>
  );
};

export default WaitlistPage;

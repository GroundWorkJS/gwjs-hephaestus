'use client';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState, type FormEvent } from 'react';

interface WaitlistFormProps {
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({
  onSuccess,
  title = 'Join the Waitlist',
  subtitle = 'Be the first to know when we launch. No spam, just updates.',
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    referrer: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!form.name || !form.email) {
      setError('Please fill out all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/o/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || undefined,
          referrer: form.referrer.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setSubmitted(true);
      setForm({ name: '', email: '', company: '', referrer: '' });
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unexpected error. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        {subtitle}
      </Typography>

      {submitted ? (
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            You're on the list!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            We'll keep you updated on our progress.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSubmitted(false)}
          >
            Add Another Email
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Company (Optional)"
                name="company"
                value={form.company}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="How did you hear about us? (Optional)"
                name="referrer"
                value={form.referrer}
                onChange={handleChange}
              />
            </Grid>
            {error && (
              <Grid size={{ xs: 12 }}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid size={{ xs: 12 }} textAlign="center">
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
};

export default WaitlistForm;

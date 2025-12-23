'use client';
import { Box, Container, Typography, TextField, Button, Grid } from '@mui/material';
import React, { useState, type FormEvent } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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

    if (!form.name || !form.email || !form.message) {
      setError('Please fill out all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/o/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          source: 'web-form',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unexpected error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Typography variant="h3" gutterBottom textAlign="center">
        Get in Touch
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        mb={4}
      >
        Have a question or want to learn more? Send us a message.
      </Typography>

      {submitted ? (
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom>
            Thank you!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your message has been received. We'll get back to you soon.
          </Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject (Optional)"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Your Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Container>
  );
};

export default ContactPage;

'use client';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { useState, type FormEvent } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length > 200) {
          newErrors.name = 'Name is too long (max 200 characters)';
        } else {
          newErrors.name = '';
        }
        break;
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(value.trim())) {
          newErrors.email = 'Please provide a valid email address';
        } else {
          newErrors.email = '';
        }
        break;
      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.trim().length > 5000) {
          newErrors.message = 'Message is too long (max 5000 characters)';
        } else {
          newErrors.message = '';
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validate all fields
    const newErrors = {
      name: '',
      email: '',
      message: '',
    };

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length > 200) {
      newErrors.name = 'Name is too long (max 200 characters)';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length > 5000) {
      newErrors.message = 'Message is too long (max 5000 characters)';
    }

    if (newErrors.name || newErrors.email || newErrors.message) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/o/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
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
        setError('Unexpected error. Please try again.');
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
          <Typography variant="body1" color="text.secondary" mb={3}>
            Your message has been received. We'll get back to you soon.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
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
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
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
                onBlur={handleBlur}
                type="email"
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Subject (Optional)"
                name="subject"
                value={form.subject}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Your Message"
                name="message"
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.message}
                helperText={errors.message || `${form.message.length}/5000 characters`}
                required
              />
            </Grid>
            {error && (
              <Grid size={{ xs: 12 }}>
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              </Grid>
            )}
            <Grid size={{ xs: 12 }} sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={submitting || !!errors.name || !!errors.email || !!errors.message}
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

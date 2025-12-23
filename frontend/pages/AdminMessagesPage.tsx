'use client';
import { Box, Container, Typography, CircularProgress, Paper, Chip } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  source?: string | null;
  status: 'new' | 'reviewing' | 'closed';
  createdAt: string;
  updatedAt: string;
}

function fmtDate(d: string) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(d));
}

const AdminMessagesPage = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        
        const res = await fetch('/o/api/contact', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch contact submissions');
        }

        const data = await res.json();
        setContacts(data.data?.rows || []);
        setTotal(data.data?.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Contact Submissions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total: {total} messages
        </Typography>
      </Box>

      {contacts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No contact submissions yet.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {contacts.map((contact) => (
            <Paper
              key={contact.id}
              sx={{
                p: 3,
                mb: 2,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h6">{contact.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {contact.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {fmtDate(contact.createdAt)}
                  </Typography>
                </Box>
                <Chip
                  label={contact.status}
                  size="small"
                  color={contact.status === 'new' ? 'primary' : 'default'}
                />
              </Box>

              {contact.subject && (
                <Typography variant="subtitle2" gutterBottom>
                  Subject: {contact.subject}
                </Typography>
              )}

              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {contact.message}
              </Typography>

              {contact.source && (
                <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                  Source: {contact.source}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default AdminMessagesPage;

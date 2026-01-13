'use client';

import { Box, Container, Typography, CircularProgress, Paper, Chip, IconButton, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, Tooltip, Alert, Tabs, Tab, MarkEmailReadIcon, MarkEmailUnreadIcon, ArchiveIcon, DeleteIcon, RestoreIcon, SearchIcon, ListAltIcon, MailOutlineIcon } from '@groundworkjs/plugin-sdk/ui';
import { useState, useEffect } from 'react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  source?: string | null;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
  updatedAt: string;
  readAt?: string | null;
  deletedAt?: string | null;
}

interface WaitlistSignup {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  referrer?: string | null;
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
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistSignup[]>([]);
  const [contactTotal, setContactTotal] = useState(0);
  const [waitlistTotal, setWaitlistTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'inbox' | 'deleted'>('inbox');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchContacts = async (search = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        showDeleted: viewMode === 'deleted' ? 'true' : 'false',
      });

      if (search.trim()) {
        params.append('q', search.trim());
      }

      const res = await fetch(`/o/api/contact?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch contact submissions');
      }

      const data = await res.json();
      setContacts(data.data?.rows || []);
      setContactTotal(data.data?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchWaitlist = async (search = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (search.trim()) {
        params.append('q', search.trim());
      }

      const res = await fetch(`/o/api/waitlist?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch waitlist signups');
      }

      const data = await res.json();
      setWaitlist(data.data?.rows || []);
      setWaitlistTotal(data.data?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchContacts(searchQuery);
    } else {
      fetchWaitlist(searchQuery);
    }
  }, [activeTab, viewMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 0) {
      fetchContacts(searchQuery);
    } else {
      fetchWaitlist(searchQuery);
    }
  };

  const handleAction = async (id: string, action: string, actionLabel: string) => {
    try {
      const res = await fetch(`/o/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Action failed');
      }

      setSuccessMessage(`Message ${actionLabel} successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // Refresh the list
      fetchContacts(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading && contacts.length === 0 && waitlist.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Contact & Waitlist Management
        </Typography>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(_e, newValue) => {
        setActiveTab(newValue);
        setSearchQuery('');
        setViewMode('inbox');
      }} sx={{ mb: 3 }}>
        <Tab
          icon={<MailOutlineIcon />}
          label={`Contact Messages (${contactTotal})`}
          iconPosition="start"
        />
        <Tab
          icon={<ListAltIcon />}
          label={`Waitlist (${waitlistTotal})`}
          iconPosition="start"
        />
      </Tabs>

      {/* Filters */}
      <Box mb={3} display="flex" gap={2} flexWrap="wrap" alignItems="center">
        {activeTab === 0 && (
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="inbox">
              Inbox
            </ToggleButton>
            <ToggleButton value="deleted">
              Deleted
            </ToggleButton>
          </ToggleButtonGroup>
        )}

        {/* Search */}
        <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, minWidth: 250 }}>
          <TextField
            size="small"
            fullWidth
            placeholder={activeTab === 0 ? "Search messages..." : "Search waitlist..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      if (activeTab === 0) {
                        fetchContacts('');
                      } else {
                        fetchWaitlist('');
                      }
                    }}
                  >
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Success/Error Messages */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Contact Messages Tab */}
      {activeTab === 0 && (
        <>
          {contacts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                {viewMode === 'deleted' ? 'No deleted messages.' : 'No messages yet.'}
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
                    opacity: contact.status === 'archived' ? 0.7 : 1,
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box flex={1}>
                      <Typography variant="h6">{contact.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {contact.email}
                      </Typography>
                      {contact.subject && (
                        <Typography variant="body2" color="text.secondary" fontWeight={600} mt={1}>
                          Subject: {contact.subject}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Received: {fmtDate(contact.createdAt)}
                      </Typography>
                      {contact.readAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Read: {fmtDate(contact.readAt)}
                        </Typography>
                      )}
                    </Box>

                    <Box display="flex" gap={1} alignItems="center">
                      <Chip
                        label={contact.status}
                        size="small"
                        color={contact.status === 'new' ? 'primary' : 'default'}
                      />

                      {/* Action Buttons */}
                      {viewMode === 'inbox' ? (
                        <>
                          {contact.status === 'new' ? (
                            <Tooltip title="Mark as Read">
                              <IconButton
                                size="small"
                                onClick={() => handleAction(contact.id, 'mark-read', 'marked as read')}
                              >
                                <MarkEmailReadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Mark as Unread">
                              <IconButton
                                size="small"
                                onClick={() => handleAction(contact.id, 'mark-unread', 'marked as unread')}
                              >
                                <MarkEmailUnreadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Archive">
                            <IconButton
                              size="small"
                              onClick={() => handleAction(contact.id, 'archive', 'archived')}
                            >
                              <ArchiveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleAction(contact.id, 'delete', 'deleted')}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title="Restore">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleAction(contact.id, 'restore', 'restored')}
                          >
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
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
        </>
      )}

      {/* Waitlist Tab */}
      {activeTab === 1 && (
        <>
          {waitlist.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No waitlist signups yet.
              </Typography>
            </Paper>
          ) : (
            <Box>
              {waitlist.map((signup) => (
                <Paper
                  key={signup.id}
                  sx={{
                    p: 3,
                    mb: 2,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                      <Typography variant="h6">{signup.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {signup.email}
                      </Typography>
                      {signup.company && (
                        <Typography variant="body2" color="text.secondary" mt={1}>
                          Company: {signup.company}
                        </Typography>
                      )}
                      {signup.referrer && (
                        <Typography variant="body2" color="text.secondary">
                          Referrer: {signup.referrer}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                        Signed up: {fmtDate(signup.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default AdminMessagesPage;

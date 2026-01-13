/**
 * Notes Page
 *
 * A simple CRUD example demonstrating:
 * - DataTable for listing
 * - Dialog for create/edit/delete
 * - Permission-gated actions
 * - Tenant store for local state
 *
 * In a real app, this would connect to a custom API endpoint.
 * For this demo, we use local state to showcase the patterns.
 */

'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  IconButton,
  Chip,
  TextField,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AddIcon,
  EditIcon,
  DeleteIcon,
  usePluginAuth,
  useHasPermission,
} from '@groundworkjs/plugin-sdk/ui';

// ============================================================================
// Types
// ============================================================================

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'work' | 'ideas';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Demo Seed Data
// ============================================================================

const SEED_NOTES: Note[] = [
  {
    id: '1',
    title: 'Welcome to the SDK Demo!',
    content: 'This note demonstrates the CRUD pattern. Feel free to edit or delete it.',
    category: 'personal',
    createdAt: '2026-01-09T10:00:00Z',
    updatedAt: '2026-01-09T10:00:00Z',
  },
  {
    id: '2',
    title: 'Getting Started with GroundWorkJS',
    content: 'Check out the Showcase page to see all SDK components and hooks in action.',
    category: 'work',
    createdAt: '2026-01-08T14:30:00Z',
    updatedAt: '2026-01-08T14:30:00Z',
  },
  {
    id: '3',
    title: 'Custom API Integration',
    content: 'This Notes feature shows how to build CRUD interfaces. In production, connect this to your custom API endpoint.',
    category: 'work',
    createdAt: '2026-01-07T09:15:00Z',
    updatedAt: '2026-01-07T09:15:00Z',
  },
  {
    id: '4',
    title: 'Slot Injection Ideas',
    content: 'Try adding custom widgets to the sidebar! The QuickStats component shows note count.',
    category: 'ideas',
    createdAt: '2026-01-06T16:45:00Z',
    updatedAt: '2026-01-06T16:45:00Z',
  },
  {
    id: '5',
    title: 'Tenant Store Tips',
    content: 'Your preferences persist across page navigations using the tenant store. Try it in Settings!',
    category: 'ideas',
    createdAt: '2026-01-05T11:20:00Z',
    updatedAt: '2026-01-05T11:20:00Z',
  },
];

// ============================================================================
// Note Form Component
// ============================================================================

interface NoteFormProps {
  note: Partial<Note>;
  onChange: (note: Partial<Note>) => void;
}

function NoteForm({ note, onChange }: NoteFormProps): React.ReactElement {
  return (
    <Stack spacing={3}>
      <TextField
        label="Title"
        value={note.title || ''}
        onChange={(e) => onChange({ ...note, title: e.target.value })}
        fullWidth
        required
        autoFocus
      />
      <TextField
        label="Content"
        value={note.content || ''}
        onChange={(e) => onChange({ ...note, content: e.target.value })}
        fullWidth
        multiline
        rows={4}
      />
      <TextField
        label="Category"
        value={note.category || 'personal'}
        onChange={(e) => onChange({ ...note, category: e.target.value as Note['category'] })}
        select
        fullWidth
        SelectProps={{ native: true }}
      >
        <option value="personal">Personal</option>
        <option value="work">Work</option>
        <option value="ideas">Ideas</option>
      </TextField>
    </Stack>
  );
}

// ============================================================================
// Category Chip Helper
// ============================================================================

function CategoryChip({ category }: { category: Note['category'] }): React.ReactElement {
  const colors: Record<string, 'primary' | 'secondary' | 'success'> = {
    personal: 'primary',
    work: 'secondary',
    ideas: 'success',
  };
  return <Chip size="small" label={category} color={colors[category]} variant="outlined" />;
}

// ============================================================================
// Main Component
// ============================================================================

export default function NotesPage(): React.ReactElement | null {
  const { isAuthenticated, isLoading } = usePluginAuth();
  const canWrite = useHasPermission('notes:write');
  const canDelete = useHasPermission('notes:delete');

  // Local state (in production, this would come from API)
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);
  const [deleteNote, setDeleteNote] = useState<Note | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleCreate = () => {
    setEditingNote({ category: 'personal' });
    setIsCreateMode(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote({ ...note });
    setIsCreateMode(false);
  };

  const handleSave = () => {
    if (!editingNote?.title) return;

    if (isCreateMode) {
      // Create new note
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: editingNote.title,
        content: editingNote.content || '',
        category: editingNote.category || 'personal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    } else {
      // Update existing note
      setNotes(
        notes.map((n) =>
          n.id === editingNote.id
            ? { ...n, ...editingNote, updatedAt: new Date().toISOString() }
            : n
        )
      );
    }
    setEditingNote(null);
  };

  const handleDelete = () => {
    if (!deleteNote) return;
    setNotes(notes.filter((n) => n.id !== deleteNote.id));
    setDeleteNote(null);
  };

  const handleCloseEdit = () => {
    setEditingNote(null);
  };

  const handleCloseDelete = () => {
    setDeleteNote(null);
  };

  // ============================================================================
  // Render
  // ============================================================================

  // Wait for auth to initialize
  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Please log in to view and manage notes.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            📝 Notes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A simple CRUD example demonstrating DataTable and confirmation dialogs
          </Typography>
        </Box>
        {canWrite && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
            New Note
          </Button>
        )}
      </Stack>

      {/* Permission Info */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'action.hover' }}>
        <Typography variant="body2">
          <strong>Your permissions:</strong>{' '}
          {canWrite ? '✓ Can create/edit' : '✗ Read-only'}{' '}
          {canDelete ? '✓ Can delete' : ''}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          This demonstrates permission-gated UI. The Edit/Delete buttons are hidden if you lack permissions.
        </Typography>
      </Paper>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Category</strong></TableCell>
              <TableCell><strong>Updated</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map((note) => (
              <TableRow
                key={note.id}
                hover
                sx={{ cursor: canWrite ? 'pointer' : 'default' }}
                onClick={() => canWrite && handleEdit(note)}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {note.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        maxWidth: 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {note.content}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <CategoryChip category={note.category} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    {canWrite && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(note);
                        }}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {canDelete && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteNote(note);
                        }}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {notes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No notes yet. Click "New Note" to create one!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog
        open={editingNote !== null}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isCreateMode ? 'Create Note' : 'Edit Note'}
        </DialogTitle>
        <DialogContent>
          {editingNote && (
            <Box sx={{ pt: 1 }}>
              <NoteForm note={editingNote} onChange={setEditingNote} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!editingNote?.title}
          >
            {isCreateMode ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteNote !== null} onClose={handleCloseDelete}>
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "<strong>{deleteNote?.title}</strong>"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

/**
 * SDK Showcase Page
 *
 * The main educational hub demonstrating all SDK features.
 * Each tab shows different capabilities with live demos and code snippets.
 */

'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Stack,
  Paper,
  Button,
  IconButton,
  Chip,
  TextField,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  AddIcon,
  EditIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
  RefreshIcon,
  usePluginAuth,
  useHasPermission,
  useHasRole,
  useTenantSelector,
  useTenantDispatch,
} from '@groundworkjs/plugin-sdk/ui';

import { ShowcaseSection } from '../components/ShowcaseSection';
import { SlotDiagram } from '../components/SlotDiagram';
import type { TenantState } from '../store';

// ============================================================================
// Tab Panel Helper
// ============================================================================

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// ============================================================================
// Code Snippets
// ============================================================================

const CODE_SNIPPETS = {
  dataTable: `import { DataTable } from '@groundworkjs/plugin-sdk/ui';
import type { ColumnDef } from '@groundworkjs/plugin-sdk/ui';

interface Task { id: string; title: string; status: string; }

const columns: ColumnDef<Task>[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'status', label: 'Status' },
];

<DataTable
  columns={columns}
  rows={tasks}
/>`,

  actionModal: `import { ActionModal, Button } from '@groundworkjs/plugin-sdk/ui';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete Item</Button>

<ActionModal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Delete"
  buttons={[
    { label: 'Cancel', onClick: () => setOpen(false) },
    { label: 'Delete', onClick: handleDelete, props: { color: 'error' } },
  ]}
>
  Are you sure you want to delete this item?
</ActionModal>`,

  card: `import { Card, CardHeader, CardContent, CardActions, Button }
  from '@groundworkjs/plugin-sdk/ui';

<Card>
  <CardHeader
    title="Project Alpha"
    subheader="Due in 5 days"
  />
  <CardContent>
    <Typography>Progress: 75% complete</Typography>
  </CardContent>
  <CardActions>
    <Button size="small">View</Button>
    <Button size="small">Edit</Button>
  </CardActions>
</Card>`,

  usePluginAuth: `import { usePluginAuth } from '@groundworkjs/plugin-sdk/ui';

function MyComponent() {
  const { user, isAuthenticated, roles } = usePluginAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.displayName || user?.email}!</div>;
}`,

  useHasPermission: `import { useHasPermission } from '@groundworkjs/plugin-sdk/ui';

function EditButton({ item }) {
  const canEdit = useHasPermission('items:write');

  if (!canEdit) return null;

  return <Button onClick={() => edit(item)}>Edit</Button>;
}`,

  useHasRole: `import { useHasRole } from '@groundworkjs/plugin-sdk/ui';

function AdminPanel() {
  const isAdmin = useHasRole('admin');

  if (!isAdmin) {
    return <Alert severity="warning">Admin access required</Alert>;
  }

  return <AdminDashboard />;
}`,

  tenantStore: `// In your store/index.ts
import { createTenantSlice, combineTenantReducers } from '@groundworkjs/plugin-sdk';

const counterSlice = createTenantSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
  },
});

// In your component
import { useTenantSelector, useTenantDispatch } from '@groundworkjs/plugin-sdk/ui';

const count = useTenantSelector(state => state.counter.count);
const dispatch = useTenantDispatch();

<Button onClick={() => dispatch({ type: 'counter/increment' })}>
  Count: {count}
</Button>`,

  slotRegistration: `// In your slots/index.ts
import { QuickStats } from '../components/QuickStats';
import { TenantBranding } from '../components/WelcomeBanner';
import { TenantFooter } from '../components/TenantFooter';

export const tenantSlots = [
  {
    slot: 'sidebar-top',
    component: QuickStats,
    priority: 100,
  },
  {
    slot: 'header-right',
    component: TenantBranding,
    priority: 50,
  },
  {
    slot: 'sidebar-bottom',
    component: TenantFooter,
    priority: 100,
  },
];`,
};

// ============================================================================
// Demo Data
// ============================================================================

interface DemoTask {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

const DEMO_TASKS: DemoTask[] = [
  { id: '1', title: 'Set up SDK development environment', status: 'done', priority: 'high', assignee: 'Alex' },
  { id: '2', title: 'Implement DataTable component', status: 'done', priority: 'high', assignee: 'Sarah' },
  { id: '3', title: 'Create authentication hooks', status: 'in-progress', priority: 'medium', assignee: 'Alex' },
  { id: '4', title: 'Write documentation', status: 'todo', priority: 'medium', assignee: 'Jordan' },
  { id: '5', title: 'Add unit tests', status: 'todo', priority: 'low', assignee: 'Sarah' },
];

// ============================================================================
// Main Component
// ============================================================================

export default function ShowcasePage(): React.ReactElement {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🧪 SDK Showcase
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Interactive demonstrations of GroundWorkJS SDK features.
          Click "View Code" on any section to see how it's implemented.
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, newValue) => setTabIndex(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Components" />
          <Tab label="Hooks" />
          <Tab label="Slots" />
          <Tab label="Store" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <CustomTabPanel value={tabIndex} index={0}>
        <ComponentsTab />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        <HooksTab />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={2}>
        <SlotsTab />
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={3}>
        <StoreTab />
      </CustomTabPanel>
    </Container>
  );
}

// ============================================================================
// Components Tab
// ============================================================================

function ComponentsTab(): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DemoTask | null>(null);

  const handleRowClick = (task: DemoTask) => {
    setSelectedTask(task);
  };

  return (
    <Stack spacing={4}>
      {/* DataTable Demo */}
      <ShowcaseSection
        title="DataTable"
        description="Sortable, filterable data tables with built-in pagination and row selection"
        code={CODE_SNIPPETS.dataTable}
      >
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Task</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Priority</strong></TableCell>
                <TableCell><strong>Assignee</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DEMO_TASKS.map((task) => (
                <TableRow
                  key={task.id}
                  hover
                  onClick={() => handleRowClick(task)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={task.status}
                      color={
                        task.status === 'done' ? 'success' :
                          task.status === 'in-progress' ? 'primary' : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={task.priority}
                      color={
                        task.priority === 'high' ? 'error' :
                          task.priority === 'medium' ? 'warning' : 'success'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{task.assignee}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedTask && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Selected: <strong>{selectedTask.title}</strong> (Click a row to select)
          </Alert>
        )}
      </ShowcaseSection>

      {/* ActionModal Demo */}
      <ShowcaseSection
        title="ActionModal"
        description="Confirmation dialogs with customizable actions"
        code={CODE_SNIPPETS.actionModal}
      >
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setModalOpen(true)}
          >
            Delete Item
          </Button>
        </Stack>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this item? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                alert('Item deleted! (demo)');
                setModalOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </ShowcaseSection>

      {/* Card */}
      <ShowcaseSection
        title="Card"
        description="Content cards for displaying grouped information"
        code={CODE_SNIPPETS.card}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Card sx={{ minWidth: 275 }}>
            <CardHeader
              title="Project Alpha"
              subheader="Due in 5 days"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Website redesign project with new branding guidelines.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip size="small" label="75% complete" color="primary" />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small">View</Button>
              <Button size="small">Edit</Button>
            </CardActions>
          </Card>

          <Card sx={{ minWidth: 275 }}>
            <CardHeader
              title="Project Beta"
              subheader="Starting next week"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Mobile app development for iOS and Android platforms.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip size="small" label="Planning" variant="outlined" />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small">View</Button>
              <Button size="small">Edit</Button>
            </CardActions>
          </Card>
        </Stack>
      </ShowcaseSection>

      {/* Form Elements */}
      <ShowcaseSection
        title="Form Elements"
        description="Text fields, switches, and other form components"
      >
        <Stack spacing={3} sx={{ maxWidth: 400 }}>
          <TextField label="Project Name" variant="outlined" fullWidth defaultValue="My Project" />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            defaultValue="A short description of the project"
          />
          <FormControlLabel control={<Switch defaultChecked />} label="Enable notifications" />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<CheckIcon />}>Save</Button>
            <Button variant="outlined">Cancel</Button>
          </Stack>
        </Stack>
      </ShowcaseSection>
    </Stack>
  );
}

// ============================================================================
// Hooks Tab
// ============================================================================

function HooksTab(): React.ReactElement {
  const { user, isAuthenticated, roles } = usePluginAuth();
  const canWriteNotes = useHasPermission('notes:write');
  const canDeleteNotes = useHasPermission('notes:delete');
  const isAdmin = useHasRole('admin');
  const isUser = useHasRole('user');

  return (
    <Stack spacing={4}>
      {/* usePluginAuth */}
      <ShowcaseSection
        title="usePluginAuth"
        description="Access current user information and authentication state"
        code={CODE_SNIPPETS.usePluginAuth}
      >
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Auth State:
          </Typography>
          <Box
            component="pre"
            sx={{
              fontSize: '0.8125rem',
              fontFamily: 'monospace',
              overflow: 'auto',
              m: 0,
            }}
          >
            {JSON.stringify(
              {
                isAuthenticated,
                user: user ? {
                  id: user.id,
                  displayName: user.displayName,
                  email: user.email
                } : null,
                roles: roles || [],
              },
              null,
              2
            )}
          </Box>
        </Paper>
      </ShowcaseSection>

      {/* useHasPermission */}
      <ShowcaseSection
        title="useHasPermission"
        description="Check if the current user has specific permissions"
        code={CODE_SNIPPETS.useHasPermission}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label="notes:write"
              color={canWriteNotes ? 'success' : 'error'}
              icon={canWriteNotes ? <CheckIcon /> : <CloseIcon />}
            />
            <Typography variant="body2">
              {canWriteNotes ? 'You can create and edit notes' : 'No write access to notes'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label="notes:delete"
              color={canDeleteNotes ? 'success' : 'error'}
              icon={canDeleteNotes ? <CheckIcon /> : <CloseIcon />}
            />
            <Typography variant="body2">
              {canDeleteNotes ? 'You can delete notes' : 'No delete access to notes'}
            </Typography>
          </Stack>
        </Stack>
      </ShowcaseSection>

      {/* useHasRole */}
      <ShowcaseSection
        title="useHasRole"
        description="Check if the current user has specific roles"
        code={CODE_SNIPPETS.useHasRole}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label="admin"
              color={isAdmin ? 'success' : 'default'}
              variant={isAdmin ? 'filled' : 'outlined'}
            />
            <Typography variant="body2">
              {isAdmin ? '✓ You have admin access' : 'You are not an admin'}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              label="user"
              color={isUser ? 'success' : 'default'}
              variant={isUser ? 'filled' : 'outlined'}
            />
            <Typography variant="body2">
              {isUser ? '✓ You have user access' : 'You are not a user'}
            </Typography>
          </Stack>

          {/* Permission-gated UI example */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2">Permission-Gated UI Example:</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" size="small" startIcon={<AddIcon />}>
              Create
            </Button>
            {canWriteNotes && (
              <Button variant="outlined" size="small" startIcon={<EditIcon />}>
                Edit
              </Button>
            )}
            {canDeleteNotes && (
              <Button variant="outlined" size="small" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
            )}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            The Edit and Delete buttons only appear if you have the corresponding permissions.
          </Typography>
        </Stack>
      </ShowcaseSection>
    </Stack>
  );
}

// ============================================================================
// Slots Tab
// ============================================================================

function SlotsTab(): React.ReactElement {
  return (
    <Stack spacing={4}>
      <Alert severity="info">
        Slots are injection points where tenant code can add components to the platform UI.
        Check out the header and sidebar to see the slot-injected components in action!
      </Alert>

      {/* Visual Diagram */}
      <ShowcaseSection
        title="Slot Layout"
        description="Visual map of available slot locations in the platform"
      >
        <SlotDiagram />
      </ShowcaseSection>

      {/* Available Slots */}
      <ShowcaseSection
        title="Available Slots"
        description="All slots provided by the platform"
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Slot Name</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Common Use Cases</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell><code>header-right</code></TableCell>
                <TableCell>App bar, right side</TableCell>
                <TableCell>Quick actions, branding badges, tenant labels</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>sidebar-top</code></TableCell>
                <TableCell>Navigation drawer, top</TableCell>
                <TableCell>Branding, quick stats, tenant logo</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>sidebar-nav</code></TableCell>
                <TableCell>Navigation drawer, nav section</TableCell>
                <TableCell>Additional navigation items</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>sidebar-bottom</code></TableCell>
                <TableCell>Navigation drawer, bottom</TableCell>
                <TableCell>Help links, version info, support</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>main-overlay</code></TableCell>
                <TableCell>Above main content</TableCell>
                <TableCell>Modals, drawers, popovers</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>page-header</code></TableCell>
                <TableCell>Above page content</TableCell>
                <TableCell>Breadcrumbs, page-specific actions</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><code>page-footer</code></TableCell>
                <TableCell>Below page content</TableCell>
                <TableCell>Related content, pagination</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </ShowcaseSection>

      {/* Registration Example */}
      <ShowcaseSection
        title="Registering Slot Content"
        description="How to inject your components into platform slots"
        code={CODE_SNIPPETS.slotRegistration}
      >
        <Alert severity="success">
          <Typography variant="body2">
            <strong>Active Slots in this Demo:</strong>
          </Typography>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            <li><code>header-right</code> → QuickActions (+ button), TenantBranding (badge)</li>
            <li><code>sidebar-top</code> → QuickStats</li>
            <li><code>sidebar-bottom</code> → TenantFooter</li>
          </ul>
        </Alert>
      </ShowcaseSection>
    </Stack>
  );
}

// ============================================================================
// Store Tab
// ============================================================================

function StoreTab(): React.ReactElement {
  const sidebarCollapsed = useTenantSelector<TenantState, boolean>(
    (state) => state?.userPreferences?.sidebarCollapsed ?? false
  );
  const notificationsEnabled = useTenantSelector<TenantState, boolean>(
    (state) => state?.userPreferences?.notificationsEnabled ?? true
  );
  const customSettings = useTenantSelector<TenantState, Record<string, unknown>>(
    (state) => state?.userPreferences?.customSettings ?? {}
  );
  const dispatch = useTenantDispatch();

  const toggleSidebar = () => {
    dispatch({ type: 'userPreferences/toggleSidebar' });
  };

  const toggleNotifications = () => {
    dispatch({ type: 'userPreferences/toggleNotifications' });
  };

  const setTheme = (theme: string) => {
    dispatch({
      type: 'userPreferences/setCustomSetting',
      payload: { key: 'theme', value: theme },
    });
  };

  return (
    <Stack spacing={4}>
      <Alert severity="info">
        Each tenant gets an isolated Redux-like store. The platform cannot access tenant state,
        ensuring data isolation between tenants.
      </Alert>

      {/* Store Demo */}
      <ShowcaseSection
        title="Tenant Store in Action"
        description="Interactive demo of tenant state management"
        code={CODE_SNIPPETS.tenantStore}
      >
        <Stack spacing={3}>
          {/* Current State Display */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom>
              Current Store State:
            </Typography>
            <Box
              component="pre"
              sx={{
                fontSize: '0.8125rem',
                fontFamily: 'monospace',
                m: 0,
              }}
            >
              {JSON.stringify(
                {
                  userPreferences: {
                    sidebarCollapsed,
                    notificationsEnabled,
                    customSettings,
                  },
                },
                null,
                2
              )}
            </Box>
          </Paper>

          {/* Actions */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <FormControlLabel
              control={
                <Switch
                  checked={sidebarCollapsed}
                  onChange={toggleSidebar}
                />
              }
              label="Sidebar Collapsed"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notificationsEnabled}
                  onChange={toggleNotifications}
                />
              }
              label="Notifications Enabled"
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTheme(customSettings.theme === 'dark' ? 'light' : 'dark')}
            >
              Toggle Theme: {(customSettings.theme as string) || 'system'}
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Try toggling the switches - state persists across page navigations.
            Visit the Settings page to see all preferences in action.
          </Typography>
        </Stack>
      </ShowcaseSection>

      {/* Slice Creation */}
      <ShowcaseSection
        title="Creating Store Slices"
        description="Define your reducers using createTenantSlice"
      >
        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
            {`// store/index.ts
import { createTenantSlice } from '@groundworkjs/plugin-sdk';

export const mySlice = createTenantSlice({
  name: 'myFeature',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => ({ ...state, value: state.value + 1 }),
    setValue: (state, newValue: number) => ({ ...state, value: newValue }),
  },
});

// Use actions
dispatch(mySlice.actions.increment());
dispatch(mySlice.actions.setValue(42));`}
          </Typography>
        </Paper>
      </ShowcaseSection>
    </Stack>
  );
}

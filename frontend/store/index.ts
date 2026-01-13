/**
 * Tenant Redux Store Configuration
 *
 * Define your slices and combine them here.
 * This gets loaded by the platform and wrapped around
 * your slot components.
 */

import {
  createTenantSlice,
  combineTenantReducers,
  type TenantReducer,
} from '@groundworkjs/plugin-sdk';

// ============================================================================
// Example Slice: Notifications
// ============================================================================

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

export interface NotificationsState {
  items: Notification[];
  unreadCount: number;
}

export const notificationsSlice = createTenantSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
  } as NotificationsState,
  reducers: {
    addNotification: (state: NotificationsState, notification: Omit<Notification, 'id' | 'timestamp'>) => ({
      ...state,
      items: [
        {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
        ...state.items,
      ].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1,
    }),
    markAllRead: (state: NotificationsState) => ({
      ...state,
      unreadCount: 0,
    }),
    clearNotification: (state: NotificationsState, id: string) => ({
      ...state,
      items: state.items.filter((n: Notification) => n.id !== id),
    }),
    clearAll: (state: NotificationsState) => ({
      ...state,
      items: [],
      unreadCount: 0,
    }),
  },
});

// ============================================================================
// Example Slice: User Preferences (tenant-specific)
// ============================================================================

export interface UserPreferencesState {
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
  customSettings: Record<string, unknown>;
}

export const userPreferencesSlice = createTenantSlice({
  name: 'userPreferences',
  initialState: {
    sidebarCollapsed: false,
    notificationsEnabled: true,
    customSettings: {},
  } as UserPreferencesState,
  reducers: {
    toggleSidebar: (state: UserPreferencesState) => ({
      ...state,
      sidebarCollapsed: !state.sidebarCollapsed,
    }),
    toggleNotifications: (state: UserPreferencesState) => ({
      ...state,
      notificationsEnabled: !state.notificationsEnabled,
    }),
    setCustomSetting: (state: UserPreferencesState, payload: { key: string; value: unknown }) => ({
      ...state,
      customSettings: {
        ...state.customSettings,
        [payload.key]: payload.value,
      },
    }),
  },
});

// ============================================================================
// Combined Tenant State
// ============================================================================

export interface TenantState {
  notifications: NotificationsState;
  userPreferences: UserPreferencesState;
}

const rootReducer = combineTenantReducers<TenantState>({
  notifications: notificationsSlice.reducer,
  userPreferences: userPreferencesSlice.reducer,
});

const initialState: TenantState = {
  notifications: notificationsSlice.initialState,
  userPreferences: userPreferencesSlice.initialState,
};

// ============================================================================
// Export for Platform
// ============================================================================

export const tenantStoreConfig = {
  reducer: rootReducer as TenantReducer<TenantState>,
  initialState,
};

// Export actions for use in components
export const { addNotification, markAllRead, clearNotification, clearAll } =
  notificationsSlice.actions;

export const { toggleSidebar, toggleNotifications, setCustomSetting } =
  userPreferencesSlice.actions;

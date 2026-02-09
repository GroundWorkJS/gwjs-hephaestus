/**
 * Tenant Theme Override
 *
 * This file lets you customize the platform's MUI theme.
 * Drop this file in `frontend/overrides/theme.ts` and the platform
 * will detect it at build/dev time.
 *
 * IMPORTANT: You must also enable "Use file-based theme override" in the
 * Admin UI → Branding & Theme page for this override to take effect.
 * When disabled, the admin UI settings are used instead.
 *
 * Override resolution order:
 *   1. Platform base tokens (always applied)
 *   2. Admin UI settings (palette, typography)
 *   3. This file (merged on top of admin settings, when toggled on)
 *
 * @see TenantThemeOverride type from '@groundworkjs/plugin-sdk/ui'
 */
import type { TenantThemeOverride } from '@groundworkjs/plugin-sdk/ui';

const themeOverride: TenantThemeOverride = {
  // ---------------------------------------------------------------------------
  // Palette — Override any semantic color
  // ---------------------------------------------------------------------------
  palette: {
    primary: {
      main: '#1E3A5F', // Platform default — change to your brand color
      // light: '#4A6FA5',
      // dark: '#0D2137',
      // contrastText: '#FFFFFF',
    },
    // secondary: { main: '#3CBCC3' },
    // error: { main: '#D32F2F' },
    // warning: { main: '#ED6C02' },
    // info: { main: '#0288D1' },
    // success: { main: '#2E7D32' },
    // background: { default: '#F4F6F8', paper: '#FFFFFF' },
    // text: { primary: '#1A2027', secondary: '#555555' },
  },

  // ---------------------------------------------------------------------------
  // Typography — Override fonts and sizing
  // ---------------------------------------------------------------------------
  // typography: {
  //   fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
  //   fontSize: 14,
  //   h1: { fontSize: '3rem', fontWeight: 600 },
  //   h2: { fontSize: '2.5rem', fontWeight: 600 },
  //   button: { textTransform: 'none' },
  // },

  // ---------------------------------------------------------------------------
  // Component Overrides — High-level component styling
  // ---------------------------------------------------------------------------
  // components: {
  //   borderRadius: 12,
  //   buttonBorderRadius: 24,
  //   cardElevation: 2,
  //   inputVariant: 'outlined',
  //   inputSize: 'small',
  //   disableButtonElevation: true,
  //   appBarElevation: 4,
  //   appBarColor: 'primary',
  // },
};

export default themeOverride;

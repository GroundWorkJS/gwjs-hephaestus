#!/usr/bin/env node
/**
 * Tenant MUI → SDK Migration Script
 *
 * Migrates tenant code from direct @mui/* imports to @groundworkjs/plugin-sdk/ui
 *
 * Usage:
 *   node migrate-tenant-ui.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const TENANT_ROOT = process.cwd();

// Components available in SDK UI
const SDK_COMPONENTS = new Set([
  // Layout
  'Box',
  'Container',
  'Grid',
  'Stack',
  'Paper',
  'Card',
  'CardContent',
  'CardHeader',
  'CardActions',
  'CardMedia',
  'Divider',
  // Inputs
  'Button',
  'IconButton',
  'ButtonGroup',
  'Fab',
  'TextField',
  'Select',
  'MenuItem',
  'Checkbox',
  'Radio',
  'RadioGroup',
  'Switch',
  'Slider',
  'FormControl',
  'FormControlLabel',
  'FormGroup',
  'FormHelperText',
  'FormLabel',
  'InputLabel',
  'InputAdornment',
  'OutlinedInput',
  'FilledInput',
  'Input',
  'InputBase',
  // Navigation
  'AppBar',
  'Toolbar',
  'Drawer',
  'SwipeableDrawer',
  'Menu',
  'Tabs',
  'Tab',
  'BottomNavigation',
  'BottomNavigationAction',
  'Breadcrumbs',
  'Link',
  'SpeedDial',
  'SpeedDialAction',
  'SpeedDialIcon',
  'Stepper',
  'Step',
  'StepLabel',
  'StepContent',
  'StepButton',
  'StepConnector',
  'StepIcon',
  'MobileStepper',
  // Data Display
  'Typography',
  'Table',
  'TableBody',
  'TableCell',
  'TableContainer',
  'TableHead',
  'TableRow',
  'TableFooter',
  'TablePagination',
  'TableSortLabel',
  'List',
  'ListItem',
  'ListItemText',
  'ListItemIcon',
  'ListItemButton',
  'ListItemAvatar',
  'ListItemSecondaryAction',
  'ListSubheader',
  'Avatar',
  'AvatarGroup',
  'Badge',
  'Chip',
  'Tooltip',
  'Icon',
  'SvgIcon',
  // Feedback
  'Alert',
  'AlertTitle',
  'Snackbar',
  'Dialog',
  'DialogTitle',
  'DialogContent',
  'DialogContentText',
  'DialogActions',
  'CircularProgress',
  'LinearProgress',
  'Skeleton',
  'Backdrop',
  // Surfaces
  'Accordion',
  'AccordionSummary',
  'AccordionDetails',
  'AccordionActions',
  // Utils
  'ClickAwayListener',
  'Collapse',
  'Fade',
  'Grow',
  'Slide',
  'Zoom',
  'Modal',
  'Popover',
  'Popper',
  'Portal',
  'Rating',
  'Pagination',
  'PaginationItem',
  'ToggleButton',
  'ToggleButtonGroup',
  // Theme
  'ThemeProvider',
  'useTheme',
  'styled',
  'createGWJSTheme',
]);

// Icons available with Icon suffix in SDK
const SDK_ICONS = new Set([
  'Menu',
  'Close',
  'ChevronLeft',
  'ChevronRight',
  'ExpandMore',
  'ExpandLess',
  'ArrowBack',
  'ArrowForward',
  'Home',
  'Settings',
  'MoreVert',
  'MoreHoriz',
  'Add',
  'Edit',
  'Delete',
  'Save',
  'Cancel',
  'Check',
  'Clear',
  'Search',
  'FilterList',
  'Sort',
  'Refresh',
  'Download',
  'Upload',
  'Share',
  'Print',
  'Archive',
  'Restore',
  'Autorenew',
  'Email',
  'Phone',
  'Chat',
  'Notifications',
  'NotificationsOff',
  'MarkEmailRead',
  'MarkEmailUnread',
  'MailOutline',
  'Info',
  'Warning',
  'Error',
  'CheckCircle',
  'Help',
  'VerifiedUser',
  'GppGood',
  'Person',
  'People',
  'AccountCircle',
  'ContentCopy',
  'ContentPaste',
  'ContentCut',
  'Description',
  'ListAlt',
  'Visibility',
  'VisibilityOff',
  'Lock',
  'LockOpen',
  'Folder',
  'FolderOpen',
  'InsertDriveFile',
  'AttachFile',
  'Star',
  'StarBorder',
  'Favorite',
  'FavoriteBorder',
  'Bookmark',
  'BookmarkBorder',
  'Schedule',
  'Event',
  'Today',
  'Dashboard',
  'Analytics',
  'TrendingUp',
  'MonetizationOn',
  'Savings',
  'Policy',
  'AssuredWorkload',
  'Build',
  'Code',
  'BugReport',
  'Security',
  'Launch',
  'OpenInNew',
  'Storage',
  'Cloud',
  'CloudQueue',
  'Speed',
  'Extension',
  'AccountTree',
  'Shield',
  'MonitorHeart',
]);

function findTsxFiles(dir, files = []) {
  for (const file of readdirSync(dir)) {
    const fullPath = join(dir, file);
    if (file === 'node_modules' || file === 'dist' || file === '.git') continue;

    if (statSync(fullPath).isDirectory()) {
      findTsxFiles(fullPath, files);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

function migrateFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  const relPath = relative(TENANT_ROOT, filePath);

  const changes = [];
  const sdkImports = { components: new Set(), icons: new Set() };
  const unmigrated = { components: new Set(), icons: new Set() };

  // Pattern for @mui/material barrel imports
  const materialBarrelRegex =
    /import\s*\{([^}]+)\}\s*from\s*['"]@mui\/material['"];?/g;
  content = content.replace(materialBarrelRegex, (match, imports) => {
    const items = imports
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const migratable = [];
    const notMigratable = [];

    for (const item of items) {
      // Handle "Component as Alias" syntax
      const name = item.split(/\s+as\s+/)[0].trim();
      if (SDK_COMPONENTS.has(name)) {
        migratable.push(item);
        sdkImports.components.add(item);
      } else {
        notMigratable.push(item);
        unmigrated.components.add(name);
      }
    }

    if (notMigratable.length > 0 && migratable.length > 0) {
      changes.push(
        `Partial migration: ${migratable.length} components to SDK, ${notMigratable.length} staying in MUI`,
      );
      return `import { ${notMigratable.join(', ')} } from '@mui/material';`;
    } else if (notMigratable.length > 0) {
      return match; // Keep as-is
    } else {
      changes.push(`Full migration: ${migratable.length} components to SDK`);
      return ''; // Will be consolidated later
    }
  });

  // Pattern for @mui/material deep imports (Grid, etc)
  const materialDeepRegex =
    /import\s+(\w+)\s+from\s*['"]@mui\/material\/(\w+)['"];?/g;
  content = content.replace(materialDeepRegex, (match, name, path) => {
    if (SDK_COMPONENTS.has(path)) {
      sdkImports.components.add(name === path ? name : `${path} as ${name}`);
      changes.push(`Deep import ${path} → SDK`);
      return '';
    }
    unmigrated.components.add(path);
    return match;
  });

  // Pattern for @mui/icons-material barrel imports
  const iconsBarrelRegex =
    /import\s*\{([^}]+)\}\s*from\s*['"]@mui\/icons-material['"];?/g;
  content = content.replace(iconsBarrelRegex, (match, imports) => {
    const items = imports
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const migratable = [];
    const notMigratable = [];

    for (const item of items) {
      const name = item.split(/\s+as\s+/)[0].trim();
      if (SDK_ICONS.has(name)) {
        // SDK exports with Icon suffix
        const alias = item.includes(' as ')
          ? item.split(/\s+as\s+/)[1].trim()
          : `${name}Icon`;
        migratable.push(`${name}Icon as ${alias.replace(/Icon$/, '')}Icon`);
        sdkImports.icons.add(`${name}Icon`);
      } else {
        notMigratable.push(item);
        unmigrated.icons.add(name);
      }
    }

    if (notMigratable.length > 0) {
      // Keep unmigrated icons in MUI
      return `import { ${notMigratable.join(', ')} } from '@mui/icons-material';`;
    }
    changes.push(`Icons migration: ${migratable.length} icons to SDK`);
    return '';
  });

  // Pattern for @mui/icons-material deep imports
  const iconsDeepRegex =
    /import\s+(\w+)\s+from\s*['"]@mui\/icons-material\/(\w+)['"];?/g;
  content = content.replace(iconsDeepRegex, (match, alias, iconName) => {
    if (SDK_ICONS.has(iconName)) {
      sdkImports.icons.add(`${iconName}Icon`);
      changes.push(`Deep icon import ${iconName} → SDK`);
      return '';
    }
    unmigrated.icons.add(iconName);
    return match;
  });

  // Now add the consolidated SDK import if we have anything
  if (sdkImports.components.size > 0 || sdkImports.icons.size > 0) {
    const allImports = [...sdkImports.components, ...sdkImports.icons];
    const sdkImportLine = `import { ${allImports.join(', ')} } from '@groundworkjs/plugin-sdk/ui';`;

    // Find first import line to insert before
    const firstImportMatch = content.match(/^import\s/m);
    if (firstImportMatch) {
      const insertIndex = content.indexOf(firstImportMatch[0]);
      content =
        content.slice(0, insertIndex) +
        sdkImportLine +
        '\n' +
        content.slice(insertIndex);
    } else {
      content = sdkImportLine + '\n' + content;
    }
  }

  // Clean up empty lines from removed imports
  content = content.replace(/\n{3,}/g, '\n\n');

  if (content !== original) {
    if (!DRY_RUN) {
      writeFileSync(filePath, content, 'utf-8');
    }
    return {
      file: relPath,
      changes,
      unmigrated: {
        components: [...unmigrated.components],
        icons: [...unmigrated.icons],
      },
    };
  }
  return null;
}

// Main
console.log(`\n🔄 Tenant UI Migration: @mui/* → @groundworkjs/plugin-sdk/ui`);
console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}\n`);

const files = findTsxFiles(TENANT_ROOT);
const results = [];
const allUnmigrated = { components: new Set(), icons: new Set() };

for (const file of files) {
  const result = migrateFile(file);
  if (result) {
    results.push(result);
    result.unmigrated.components.forEach(c => allUnmigrated.components.add(c));
    result.unmigrated.icons.forEach(i => allUnmigrated.icons.add(i));
  }
}

console.log(`📁 Files processed: ${files.length}`);
console.log(`✏️  Files modified: ${results.length}\n`);

for (const r of results) {
  console.log(`  ${r.file}`);
  for (const c of r.changes) {
    console.log(`    → ${c}`);
  }
}

if (allUnmigrated.components.size > 0 || allUnmigrated.icons.size > 0) {
  console.log(`\n⚠️  Some imports could not be migrated (not in SDK):`);
  if (allUnmigrated.components.size > 0) {
    console.log(`   Components: ${[...allUnmigrated.components].join(', ')}`);
  }
  if (allUnmigrated.icons.size > 0) {
    console.log(`   Icons: ${[...allUnmigrated.icons].join(', ')}`);
  }
  console.log(
    `\n   These will need to stay as @mui/* imports or be added to SDK.`,
  );
}

console.log(
  `\n${DRY_RUN ? '🔍 Dry run complete. Run without --dry-run to apply changes.' : '✅ Migration complete!'}\n`,
);

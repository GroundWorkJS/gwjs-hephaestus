// GWJS: DO NOT DELETE THIS FILE
// This file is used to aggregate type imports for tenants.
// It ensures that tenants have access to the necessary types
// without causing circular dependencies or import issues.

declare module './pages/HelloPage.js' {
  import type { ComponentType } from 'react';
  const C: ComponentType<unknown>;
  export default C;
}

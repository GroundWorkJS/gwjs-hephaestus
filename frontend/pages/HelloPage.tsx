import type { ReactElement } from 'react';

export default function HelloPage(): ReactElement {
  return (
    <div style={{ padding: 24 }}>
      <h1>👋 Hello from tenant</h1>
      <p>
        This page is provided by @groundworkjs/tenant... Welcome to my world!!
      </p>
    </div>
  );
}

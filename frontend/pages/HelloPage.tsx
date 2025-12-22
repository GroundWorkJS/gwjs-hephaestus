import type { ReactElement } from 'react';

export default function HelloPage(): ReactElement {
    return (
        <div style={{ padding: 24 }}>
            <h1>👋 Hello Tenant</h1>
            <p>
                Whats new in the world?
            </p>
        </div>
    );
}

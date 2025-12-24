# Third-Party Licenses

This document lists open-source dependencies used in this tenant customization project.

---

## GroundWorkJS Components (Proprietary)

### @groundworkjs/plugin-sdk (PROPRIETARY)

```
Copyright © 2024-2025 GroundWorkJS. All rights reserved.

Licensed exclusively for use with GroundWorkJS platform subscriptions.
May not be redistributed or reverse engineered.
```

**What it does**: Provides the API boundary between your tenant code and the GroundWorkJS platform. Includes database access, auth helpers, RBAC, routing utilities, and logging.

---

## Open Source Dependencies

Below are the open-source packages used in this tenant project.

### MIT Licensed Packages

Most dependencies use the MIT License, which permits commercial use with attribution:

#### React & Next.js

**React (MIT)**

```
Copyright (c) Meta Platforms, Inc. and affiliates.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

Used for: UI framework

**Next.js (MIT)**

```
Copyright (c) 2024 Vercel, Inc.
```

Used for: React framework with SSR/SSG

**Material-UI (MIT)**

```
Copyright (c) 2014 Call-Em-All
```

Used for: Component library (if used in your tenant)

#### Development Tools

**TypeScript (Apache-2.0)**

```
Copyright (c) Microsoft Corporation. All rights reserved.

Licensed under the Apache License, Version 2.0
```

Used for: Type-safe development

**ESLint (MIT)** - Code linting
**Prettier (MIT)** - Code formatting
**Jest (MIT)** - Testing framework (if used)

### Your Project-Specific Dependencies

**Add your additional dependencies here**

To generate a current list:

```bash
npm list --depth=0
# or
pnpm licenses list
```

---

## Generating Fresh License List

```bash
# List all licenses
pnpm licenses list

# Export to file
pnpm licenses list --json > licenses.json

# Check for problematic licenses
pnpm licenses list | grep -E "(GPL|AGPL|LGPL)"
```

---

## License Compliance

### Approved Licenses

When adding dependencies, use packages with:

- MIT
- ISC
- BSD-2-Clause / BSD-3-Clause
- Apache-2.0

### Avoid

**Copyleft licenses** (GPL, LGPL, AGPL) may conflict with your commercial use. Review carefully before adding.

---

## GroundWorkJS Platform

The underlying platform is proprietary:

- **Platform Code**: Not in this repository, proprietary
- **Platform Database**: Not accessible, platform-managed
- **SDK**: @groundworkjs/plugin-sdk is proprietary

You develop against the SDK. The platform itself uses open-source components documented in the platform's THIRD_PARTY_LICENSES.md.

---

## Attribution

We are grateful to the open-source community. All copyright notices and license texts are preserved per their respective licenses.

If you distribute your tenant customizations:

- Include this THIRD_PARTY_LICENSES.md file
- Preserve all copyright notices
- Comply with each dependency's license terms

---

## Contact

For questions about:

- **Your customizations**: Your internal legal/compliance team
- **GroundWorkJS platform**: <licensing@groundworkjs.com>
- **SDK licensing**: <support@groundworkjs.com>

---

**Last Updated**: December 24, 2025

**Note**: This document should be updated whenever dependencies change. Keep it current as part of your release process.

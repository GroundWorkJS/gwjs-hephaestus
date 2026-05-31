# Tenant Documentation Policy

This repository is public and tenant-facing.

## Goal

Documentation here must stay focused on tenant developer workflows:

- tutorials
- how-to guides
- SDK usage examples
- practical troubleshooting

## Do Not Include

- internal platform topology
- internal repository paths
- infrastructure implementation details
- credential storage or secret-management details
- internal hardening/remediation details

## Author Checklist

Before merging doc changes, confirm:

1. Content is useful to tenant developers without internal platform source access.
2. Examples use only `@groundworkjs/plugin-sdk` and `@groundworkjs/plugin-sdk/ui`.
3. No references to internal-only systems, scripts, or private operational details.
4. Language is tutorial-first and implementation-agnostic.

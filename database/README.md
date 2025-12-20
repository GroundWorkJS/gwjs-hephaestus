# Tenant Database README

All tenant DDL/DML **must** target schema `tenant_ext` and tables **must** be prefixed `tenant_`.

Migrations go in `database/db/migrations` and seeds in `database/db/seeds`.

# kiro-backend

KIRO core API: authentication and roles, businesses (tenants), staff, items and stock, sales and invoices, reports, Ask KIRO / AI, nightly owner report.

Part of KIRO (Kitchen Intelligence & Restaurant Operations). Owner: @kirotick. Migrated with full history from `kirotick/KIRO_POS` (commit `252de09`), see kiro-documentation/governance/REPOSITORY_MIGRATION_PLAN.md.

## What this repository owns
- Core API (`api/`), JWT issuing and role rules (`api/src/auth.js`, `api/src/perms.js`)
- Tenant isolation in every query (`business_id`), tested over HTTP
- AI relay Cloudflare Worker (`ai-relay/`)
- ERP validator library (`packages/erp-validator/`)
- Developer tool for shops and logins (`api/scripts/users.js`)

Nothing here may be copied into another KIRO repository; other repositories use it by version or through its API.

## Depends on
- **kiro-database**: schema and migrations at the tag in `api/database-version.txt` (`npm run migrate` applies the `core` group)
- Neon PostgreSQL (production / staging / qa / dev branches)

## Build
`cd api && npm ci && npm start` (needs DATABASE_URL and JWT_SECRET). Deployed to Render from kiro-infrastructure/render/render.yaml.

## Test
`cd api && npm test` (database tests skip without TEST_DATABASE_URL). With the Neon qa branch in `api/.env.test`: `npm run test:db`. `ai-relay` and `packages/erp-validator`: `npm test` in each.

## Branches, reviews and releases
`main` is production and protected: changes arrive only by pull request with passing checks (see CONTRIBUTING.md). Versions follow semantic versioning; every release is a git tag `vMAJOR.MINOR.PATCH` with notes in CHANGELOG.md, so each deployment maps to one exact commit. Rollback = redeploy the previous tag.

## Security
See SECURITY.md. Never commit secrets: `.env` files are ignored, and secret scanning with push protection plus gitleaks in CI block them.

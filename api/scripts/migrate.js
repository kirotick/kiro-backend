'use strict';
// Applies the KIRO database migrations owned by the kiro-database repository.
// Looks for it in KIRO_DATABASE_DIR, else next to this repository (../kiro-database). On Render the build
// command clones kiro-database at the pinned release tag first (see kiro-infrastructure/render/render.yaml).
const path = require('path');
const fs = require('fs');
const dir = process.env.KIRO_DATABASE_DIR ? path.resolve(process.env.KIRO_DATABASE_DIR) : path.resolve(__dirname, '../../../kiro-database');
const runner = path.join(dir, 'scripts', 'migrate.js');
if (!fs.existsSync(runner)) { console.error(`kiro-database not found at ${dir}. Clone it there or set KIRO_DATABASE_DIR.`); process.exit(1); }
process.env.KIRO_MIGRATE_ONLY = process.env.KIRO_MIGRATE_ONLY || 'core';
require(runner);
'use strict';
// Test helper: a minimal Express-like response object for handler tests.
module.exports.res = () => { const r = { code: 200, body: null, status(c) { r.code = c; return r; }, json(b) { r.body = b; return r; }, set() { return r; } }; return r; };
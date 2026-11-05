'use strict';
// Core API settings. Payment settings (PHONEPE_*, PUBLIC_BASE_URL, PHONEPE_KEK) belong to kiro-payments.
function loadConfig(env = process.env) {
  const need = (k) => { if (!env[k]) throw new Error('Missing required env var ' + k); return env[k]; };
  if (need('JWT_SECRET').length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
  return {
    port: Number(env.PORT || 3000),
    databaseUrl: need('DATABASE_URL'),
    jwtSecret: env.JWT_SECRET,
  };
}
module.exports = { loadConfig };
'use strict';
const express = require('express');
const rateLimit = require('express-rate-limit');
const { corsMiddleware } = require('./cors');

// Payments (PhonePe QR, webhook, gateway) live in the separate kiro-payments service.
function buildApp({ core, authMiddleware, liveUser, corsOrigins = '' }) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1); // behind one reverse proxy (Nginx/Cloudflare); adjust to your hosting
  app.use('/api', corsMiddleware(corsOrigins)); // only for the browser build of the admin app
  app.get('/health', (req, res) => res.json({ ok: true }));

  const json = express.json({ limit: '64kb' });
  const lim = (windowMs, limit) => rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false });
  // Public auth endpoints: throttled per IP (the database also locks an account after repeated wrong passwords).
  app.post('/api/auth/login', lim(15 * 60_000, 30), json, core.login);
  app.post('/api/auth/signup', lim(60 * 60_000, 10), json, core.signup);

  const api = express.Router();
  api.use(json, authMiddleware, liveUser);
  api.get('/me', core.me);
  api.post('/auth/password', core.changePassword);
  api.patch('/business', core.updateBusiness);
  api.get('/business/report', core.getReportSettings);
  api.put('/business/report', core.saveReportSettings);
  api.get('/staff', core.listStaff);
  api.post('/staff', core.createStaff);
  api.patch('/staff/:id', core.updateStaff);
  api.get('/items', core.listItems);
  api.post('/items', core.createItem);
  api.patch('/items/:id', core.updateItem);
  api.post('/items/:id/stock', core.receiveStock);
  api.post('/sales', core.createSale);
  api.get('/sales', core.listSales);
  api.get('/sales/lookup', core.lookupSale);   // before /sales/:id
  api.get('/sales/:id', core.getSale);
  api.get('/reports/summary', core.summary);
  api.get('/reports/insights', core.insights);
  api.post('/ask', core.ask);
  api.post('/ai/ask', lim(60_000, 20), core.aiAsk);   // per-IP burst limit; per-business hourly/daily caps live in ai.js
  api.get('/ai/status', core.aiStatus);
  api.get('/ai/insights', core.aiInsights);
  app.use('/api', api);

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => res.status(err.status && err.status < 500 ? err.status : 500).json({ success: false, message: 'Request failed' }));
  return app;
}
module.exports = { buildApp };

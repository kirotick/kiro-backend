'use strict';
// Backend auth and CORS tests. (The PhonePe/payment tests moved to kiro-payments with the payment code.)
const test = require('node:test');
const assert = require('node:assert/strict');
const auth = require('../src/auth');

test('jwt: valid ok; wrong secret, alg none, expired, missing exp rejected', () => {
  const S = 'x'.repeat(40), exp = Math.floor(Date.now() / 1000) + 60;
  assert.equal(auth.verifyJwtHS256(auth.signJwtHS256({ businessId: 1, exp }, S), S).businessId, 1);
  assert.equal(auth.verifyJwtHS256(auth.signJwtHS256({ businessId: 1, exp }, S), 'y'.repeat(40)), null);
  assert.equal(auth.verifyJwtHS256(auth.signJwtHS256({ businessId: 1, exp: 1 }, S), S), null);
  assert.equal(auth.verifyJwtHS256(auth.signJwtHS256({ businessId: 1 }, S), S), null);
  const none = Buffer.from('{"alg":"none"}').toString('base64url') + '.' + Buffer.from(JSON.stringify({ businessId: 1, exp })).toString('base64url') + '.';
  assert.equal(auth.verifyJwtHS256(none, S), null);
});

test('CORS: only listed origins are allowed, preflight answered, others untouched', () => {
  const { corsMiddleware } = require('../src/cors');
  const run = (mw, method, origin) => { const h = {}; let code = null, nexted = false; const res = { set: (k, v) => { h[k] = v; return res; }, status: (c) => { code = c; return res; }, end: () => res };
    mw({ method, headers: origin ? { origin } : {} }, res, () => { nexted = true; }); return { h, code, nexted }; };
  const mw = corsMiddleware('https://admin.example.com, https://b.example.com/');
  let r = run(mw, 'GET', 'https://admin.example.com'); assert.equal(r.h['Access-Control-Allow-Origin'], 'https://admin.example.com'); assert.ok(r.nexted);
  r = run(mw, 'GET', 'https://b.example.com'); assert.equal(r.h['Access-Control-Allow-Origin'], 'https://b.example.com');
  r = run(mw, 'OPTIONS', 'https://admin.example.com'); assert.equal(r.code, 204); assert.ok(!r.nexted); assert.match(r.h['Access-Control-Allow-Headers'], /Authorization/);
  r = run(mw, 'GET', 'https://evil.example'); assert.equal(r.h['Access-Control-Allow-Origin'], undefined); assert.ok(r.nexted);
  r = run(mw, 'OPTIONS', 'https://evil.example'); assert.equal(r.code, 403);
  r = run(corsMiddleware(''), 'GET', 'https://admin.example.com'); assert.equal(r.h['Access-Control-Allow-Origin'], undefined, 'empty list = CORS off');
  r = run(mw, 'GET', undefined); assert.ok(r.nexted && !Object.keys(r.h).length, 'non-browser clients unaffected');
});

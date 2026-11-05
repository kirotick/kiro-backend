# Security policy for kiro-backend

## Reporting a vulnerability
Do not open a public issue. Use GitHub's "Report a vulnerability" (Security tab → Advisories) or email the owner (@kirotick). We aim to acknowledge within 3 working days.

## Secrets
Never commit: cloud or API keys, database addresses with passwords, payment gateway credentials, private keys, signing certificates, tokens, customer payment data or personal data. Runtime secrets live in Netlify / Render / Neon settings; CI secrets in GitHub environment secrets.

## If a secret is committed
1. Treat it as compromised and revoke or rotate it immediately.
2. Check where and when it was used.
3. Remove it from the code; assess git history and existing clones (deleting the latest commit is not enough).
4. Record the incident in kiro-security/INCIDENT_RESPONSE.md and verify the fix.

## Supported versions
Only the latest release tag on `main` receives security fixes.

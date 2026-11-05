# Contributing to kiro-backend

## Branches
- `main`: production. Protected: no direct pushes, no force pushes, no deletion.
- Work branches: `feature/<short-name>`, `bugfix/<short-name>`, `security/<short-name>`, `release/<version>`, `hotfix/<short-name>`.

## Pull requests
1. Branch from `main`, commit, push, open a pull request.
2. Fill in the change record in the pull request template (change ID, requirement, files, database and API changes, security impact, tests, rollback).
3. All required checks must pass (CI, secret scanning).
4. Review: until a second developer joins, the owner may merge their own pull request after the checks pass (owner decision D3, 2026-11-05). A second reviewer is required before live payments.
5. Squash or merge; the pull request is the permanent record of the change.

## Rules (people and AI tools)
- Inspect before changing; never assume undocumented architecture.
- Never overwrite working code or remove features without an approved pull request.
- Never change a database schema outside kiro-database.
- Never put secrets in code, issues, logs or prompts.
- Never claim tests passed unless they ran; paste the result in the pull request.
- AI-generated code is reviewed and tested like any other code.

## Commit messages
Short summary line, blank line, why the change was made. Reference the change ID or issue (e.g. `KIRO-123`).

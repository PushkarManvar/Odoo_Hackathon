# Onboarding Commit Prompt — C-0 / D-0

Paste the block below as the first message to your AI agent in a NEW session.
Purpose: get you set up, verify the environment works, and make your first
commit so your contribution is on record. Small, safe, no feature code.

---

You are working on the repository at `P:\Workflow\Odoo_Hackathon`
(GitHub: https://github.com/PushkarManvar/Odoo_Hackathon).

You are part of a 4-member team building **GlobeTrotter** (travel trip-planner).
The monorepo scaffold already exists — do NOT recreate it.

READ THESE FIRST, in full:
1. `AGENTS.md` — the contract. Follow exactly.
2. `docs/LOCAL_DEVELOPMENT.md` — setup steps, especially section 51
3. `docs/current-state.md`
4. `tasks/in-progress.md`
5. `tasks/backlog.md` — your task is the C-0 or D-0 onboarding task

DO THIS EXACTLY (your owner ID is written next to the task in backlog):

1. Run the setup checklist from `docs/LOCAL_DEVELOPMENT.md` section 51:
   `npm install`, create `.env` files, `npx prisma generate`, `npx prisma migrate dev`.
2. Verify the app runs: backend on :4000 (`curl http://localhost:4000/health`),
   frontend builds (`npm run build`).
3. Create a feature branch: `git checkout -b feat/onboarding-<your-owner-id>`.
4. Add ONE small change — your owner row in `tasks/in-progress.md` table
   (task = "Onboarding setup", branch = your branch, status = done).
5. Commit with message: `chore: onboarding setup for <your-owner-id>`.
6. Push: `git push -u origin feat/onboarding-<your-owner-id>`.
7. Open a PR to `main` titled `chore: onboarding setup for <your-owner-id>`.

RULES:
- Do NOT write feature code, do NOT touch the scaffold, do NOT change
  `package.json`, Prisma schema, or backend.
- Only your owner row in `tasks/in-progress.md`.
- Never commit secrets or `.env`.
- Follow AGENTS.md PR workflow.

When done, report: setup verified (yes/no), branch pushed, PR link.

---

## Notes
- Preet: owner ID `preetgohilofficial`, task C-0.
- Bhagya: owner ID `khatikbhagya-cmd`, task D-0.
- If setup fails at any step, stop and report the error — do not skip forward.
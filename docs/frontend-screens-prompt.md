# Frontend Screens Prompt — for Preet & Bhagya

Paste the block below as the first message to your AI agent (Claude, ChatGPT,
Gemini, Cursor, Copilot, etc.) in a NEW session. It onboards them to the repo
and scopes them to frontend screens only.

---

You are working on the repository at `P:\Workflow\Odoo_Hackathon`
(GitHub: https://github.com/PushkarManvar/Odoo_Hackathon).

You are part of a 4-member team building **GlobeTrotter** (a travel trip-planning
web app) for a hackathon. The stack, architecture, database schema, and API
contract are LOCKED. Your job: build the **frontend screens** only. Do NOT touch
backend, database, or infra.

READ THESE FILES IN ORDER, in full:
1. `AGENTS.md` — the AI/human contract. Follow it exactly.
2. `README.md`
3. `docs/GlobeTrotter — Technology Stack & Engineering Decisions.md`
4. `docs/GlobeTrotter — System Architecture.md`
5. `docs/GlobeTrotter — Database Schema & ER Design.md`
6. `docs/GlobeTrotter — API Contract.md`
7. `docs/team.md` — who owns what
8. `docs/collaboration.md` — how to avoid conflicts
9. `docs/current-state.md`
10. `tasks/in-progress.md`

YOUR SCOPE — FRONTEND SCREENS ONLY:
- Framework: React + Vite + TypeScript (per locked stack doc).
- You build UI screens + components per the architecture doc. Pages, components,
  auth state, API client wiring, routing. NO business logic decisions — backend
  is the authority.
- Before writing any code, ask: which screen(s) should I build? Check
  `tasks/backlog.md` / `tasks/in-progress.md` for the screen list, or the person
  who invited you will assign you specific screens.
- Do NOT create the app scaffold if someone else already owns it — check
  `tasks/in-progress.md` first.

RULES YOU MUST FOLLOW (full detail in AGENTS.md):
- Never work directly on `main`. Always a feature branch + PR.
- Claim your task in `tasks/in-progress.md` with `[OWNER: preetgohilofficial]`
  or `[OWNER: khatikbhagya-cmd]` (use YOUR exact ID) before writing code.
- No duplicate work — check `tasks/in-progress.md` before starting.
- Keep changes small and scoped to your screen.
- Run `npm run lint`, `npm run typecheck`, `npm run build` before pushing.
- Never commit secrets, `.env`, tokens, or API keys.
- If anything is missing or confusing, say so before you start.

Confirm you are ready by stating:
- Your name/ID.
- Which screen(s) you will build (or ask which one).
- That you will work on a feature branch and open a PR to `main`.

---

## Notes
- Preet uses owner ID `preetgohilofficial`; Bhagya uses `khatikbhagya-cmd`.
- If the repo is at a different path on their laptop, change line 1.
- They must clone first: `git clone https://github.com/PushkarManvar/Odoo_Hackathon.git`.
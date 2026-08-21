# Kickoff Prompt — paste this into your AI agent to onboard instantly

Copy everything between the lines below and send it to your AI agent (Claude,
ChatGPT, Gemini, Cursor, Copilot, etc.) as the very first message of a new
session. It makes the agent read the repo contract and get ready to work.

---

You are working on the repository at `P:\Workflow\Odoo_Hackathon`
(GitHub: https://github.com/PushkarManvar/Odoo_Hackathon).

START BY READING THESE FILES IN ORDER, in full:
1. `AGENTS.md` — the AI/human contract. You MUST follow it exactly. It is the
   source of truth for how you work here.
2. `README.md`
3. `docs/team-onboarding.md`
4. `docs/current-state.md`
5. `tasks/in-progress.md`
6. `tasks/backlog.md`

THEN confirm you are ready by stating:
- Your name/ID (use the owner name your team gave you).
- Which task from `tasks/backlog.md` you will take on (or ask which one).
- That you will follow the PR + merge workflow: feature branch, push, open a
  PR to `main`, never push to `main` directly.

RULES YOU MUST FOLLOW (full detail in AGENTS.md):
- Never work directly on `main`. Always a feature branch + PR.
- Claim your task in `tasks/in-progress.md` with `[OWNER: your-name]` before
  writing code. No duplicate work.
- Keep changes small and scoped to your task.
- Run `npm run lint`, `npm run typecheck`, `npm run build` before pushing.
- `main` is branch-protected: CI must pass and one approval is required to merge.
- Never commit secrets, `.env`, tokens, or API keys.
- If you end a session mid-task, write a handoff to `tasks/handoffs/`.

If anything is missing or confusing, say so before you start.

---

## How to use
1. Share the block above with each teammate.
2. Each friend pastes it as the first message to their AI.
3. The AI reads the contract and picks/asks for a task.
4. Everyone works on feature branches, opens PRs, CI checks them, you review + merge.

## Notes
- Change the repo path in line 1 if a friend has the repo at a different
  location (or tell them to clone it first).
- Replace "your-name" with each teammate's actual ID when they claim tasks.

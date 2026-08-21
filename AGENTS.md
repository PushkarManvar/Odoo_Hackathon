# AGENTS.md — AI / Human Contract (READ FIRST)

This file governs how every AI agent and human contributor works in this repo.
It is the single source of truth for collaboration rules. If you are an AI
agent, follow these rules without exception. If a conflict arises between this
file and anything else, this file wins.

## 1. Golden rule
Never work directly on `main`. All changes go through a feature branch and a
pull request reviewed before merge. This is non-negotiable.

## 2. Every session starts here
Read, in order:
1. `AGENTS.md` (this file)
2. `docs/team-onboarding.md`
3. `docs/current-state.md`
4. `tasks/in-progress.md`

If any file is missing, flag it — do not assume.

## 3. Workflow (mandatory)
1. Pick or create a task in `tasks/backlog.md`.
2. Move it to `tasks/in-progress.md` with your owner stamp: `[OWNER: <name/ai-id>]`.
3. Create a feature branch: `feat/task-XXX`.
4. Implement. Keep changes small and focused on one task.
5. Run the checks locally: `npm run lint`, `npm run typecheck`, `npm run build`.
6. Push the branch, open a PR to `main`.
7. CI must pass (`lint-typecheck-build` status check is required).
8. Request review from the team. Only merge after approval + green CI.
9. Move the task to `tasks/completed.md` with a note on what was done.

## 4. No duplicate work
Check `tasks/in-progress.md` before starting anything. If a task has an owner,
do not work on it. Coordinate through the task files.

## 5. Task files are the coordination layer
- `tasks/backlog.md` — things to do, not claimed.
- `tasks/in-progress.md` — claimed tasks with owner stamps.
- `tasks/completed.md` — finished tasks, record of decisions.
- `tasks/handoffs/` — session-end handoffs when a task is mid-flight.

## 6. Handoffs
If you end a session mid-task:
- Leave the code in a working state (no broken builds).
- Write a handoff file to `tasks/handoffs/<task-XXX>.md` describing:
  - what was done, what is left, what is blocked, next steps.

## 7. Commit rules
- Write clear, descriptive commit messages. Conventional Commits format:
  `type(scope): summary` (e.g. `feat(auth): add login`, `fix(events): capacity check`).
- Never commit secrets, `.env`, tokens, or API keys. `.env` is gitignored.
- Do not commit build artifacts or `node_modules`.

## 8. Branch protection
`main` is protected. Direct pushes are blocked. All merges require:
- a pull request,
- at least one approval,
- green CI (`lint-typecheck-build`),
- branches up to date.

If you cannot push, you are doing it wrong — use a feature branch + PR.

## 9. Communication
- Keep the repo self-contained. Important context never lives only in a
  private chat — write it to the repo.
- Ask before making broad architectural changes. Log decisions in
  `docs/decisions.md`.

## 10. Scope discipline
- Stay in the task you claimed. Do not refactor unrelated code.
- If you discover a bigger problem, write a note to `tasks/backlog.md` or
  `docs/limitations.md`, don't silently expand your change.

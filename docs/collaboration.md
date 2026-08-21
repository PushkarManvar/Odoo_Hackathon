# Collaboration Playbook — avoiding conflicts, keeping it smooth

Hard rules for working in parallel on a 4-member team. Read with `AGENTS.md`.
This file is about *preventing* conflicts before they happen, and resolving
them cleanly when they do.

## 1. Branch discipline
- Never work on `main`. Never push to `main`. It is protected anyway.
- One feature branch per task: `feat/<short-task-name>`.
- Create your branch from a **fresh `main`**:
  ```bash
  git checkout main
  git pull          # get latest, never branch off a stale main
  git checkout -b feat/my-task
  ```
- Keep branches small and short-lived. Bigger branch = bigger conflict surface.

## 2. Claim before you code
- Claim your task in `tasks/in-progress.md` with `[OWNER: <your-id>]`
  **before** your first commit. No duplicate work.
- Check `tasks/in-progress.md` before starting — if someone owns a task, do not touch it.

## 3. Module ownership = file ownership
- Once the architecture is decided, split the codebase into modules and assign
  one owner per module in `docs/team.md`.
- **Rule:** only the module owner edits files inside their module. Others work
  via PRs *against* that module with the owner reviewing.
- This is what makes parallel work conflict-free: two people are never editing
  the same files at the same time.

## 4. Pull before you push
- Before pushing, sync with `main`:
  ```bash
  git checkout main
  git pull
  git checkout feat/my-task
  git rebase main    # replay your commits on top of latest main
  git push --force-with-lease
  ```
- Rebase keeps history linear and surfaces conflicts early, while they are small.

## 5. Review + merge
- Every PR needs: green CI, one approval from a **different** team member.
- Merge the smallest / oldest PRs first. Bigger PRs absorb the diff and get easier.
- After a merge, pull `main` before starting anything new.
- If `main` moved while you worked, rebase (step 4) before merging — the GitHub
  "branch up to date" rule will force this anyway.

## 6. When a conflict still happens
- Do NOT resolve it by force-overwriting other people's work.
- `git rebase main`, open the conflicted files, keep BOTH sides' intent, then
  commit the resolution.
- If it is not obvious which side wins, stop and ask the affected owner in the PR.
- Log the resolution in `docs/decisions.md` so it does not happen twice.

## 7. Coordination file rules
- `tasks/in-progress.md` is the live claim board — keep it current.
- `docs/current-state.md` is updated after every merge.
- Never leave a session mid-task without a handoff in `tasks/handoffs/`.
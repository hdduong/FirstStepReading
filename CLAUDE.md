# CLAUDE.md

Working conventions for Claude Code sessions on **FirstStepReading** (a free
React/Vite reading-practice app for kids).

## Pull request review loop — GitHub Copilot (GHCP)

Whenever you commit and push code to a PR, run this loop until it converges:

1. **Request a GitHub Copilot review** on the PR (`request_copilot_review`).
2. Wait for it to finish (usually a few minutes), then read **every** comment.
3. For each comment, judge whether it is valid:
   - **Valid** (correct and worth doing) → fix it in code, commit, push, and
     **re-request the Copilot review** (go back to step 1) so the new code is
     re-reviewed.
   - **Not valid** (wrong, already handled, or out of scope) → skip it and
     briefly say why.
4. When a review round comes back **clean — or with only trivial / non-actionable
   nits** — stop the loop and tell the user the PR is **ready to merge**.

Always re-request a fresh Copilot review after pushing fixes; don't assume a
single review pass is final.

## PR workflow

- Develop on a feature branch and open a PR into `main`. Don't push directly to
  `main`.
- Keep CI green (lint, unit tests, build, Playwright e2e) before asking to merge.

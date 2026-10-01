# Roster browser worker

Isolated draft/confirm/commit browser execution for Telegram Amber.

The worker exposes one authenticated endpoint at `/api/browser`:

- `read`: renders JavaScript in a fresh ephemeral browser and returns visible text and DOM date sections directly (no model summary). It has no click, fill, or submit operations. Closed/hidden tabs, sign-ins and interactive gates are not handled; partial content is not proof of absence.
- `draft`: opens a fresh Vercel Sandbox, drives the supplied public website with `agent-browser`, fills the requested change, and stops before the final write button.
- `commit`: verifies the exact live page, button ref, label, URL, and sandbox created by the draft before clicking once.
- `cancel`: closes the browser and stops the sandbox.

Required environment variables:

- `ROSTER_BROWSER_WORKER_SECRET`
- Vercel AI Gateway enabled for the project; production uses the automatically injected OIDC token
- optional `ANTHROPIC_API_KEY` for direct-provider local development
- optional `ROSTER_BROWSER_MODEL` (defaults to `anthropic/claude-sonnet-5` through AI Gateway)
- optional `AGENT_BROWSER_VERSION` (defaults to the verified pin `0.38.1`)
- optional `AGENT_BROWSER_SNAPSHOT_ID` for sub-second browser startup after a base snapshot is created

The Telegram controller stores the approval ledger in Supabase. The model never receives client memory, inbox, calendar, contacts, or arbitrary shell access.

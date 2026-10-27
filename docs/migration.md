# Migration to 2.0

The source is now AgentKit Engineer. The package and archive are named `agentkit-engineer`. Canonical skills live in `skills/`; generated installations use `.agents/skills/` for Codex and `.claude/skills/` for Claude. Existing document directories were moved intact into discoverable top-level skills.

All 53 legacy aliases map to shared `kit-*` workflows in `kit/commands.json`. Mode variants are arguments. `skill-creator` became `kit-skill-authoring`; the skill template moved to `templates/skill/`. MCP discovery uses the host, and Gemini CLI is optional. Models are inherited from the active session.

Existing technical application, UI, mobile, database and payment notifications remain in scope. Removed community integrations and obsolete logs/archives are not carried into the new build. OpenCode remains cleaned legacy source outside the supported matrix.

For an existing project, start with `install --dry-run`. An unmanaged file at an installation path produces a conflict. Review and back up any prior installation before manually reconciling it; the installer never adopts or overwrites unknown files. Keep the new manifest after installation. `update --check` reports proposed source diffs and upstream commit comparisons without writing (`--offline` skips the network); uninstall preserves edits.

Adapters were checked against official host documentation on 2026-10-27. Bundled framework references contain historical version-specific examples; verify your project's installed versions against official sources before using those examples. Imported snapshots are pinned separately in `kit/upstreams.json`.

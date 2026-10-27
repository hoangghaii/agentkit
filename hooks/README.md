# Hooks

Two advisory hooks share a portable Node.js adapter. Codex uses `.codex/hooks.json`; Claude uses `.claude/settings.json`. They parse JSON stdin, tolerate unknown payloads and malformed input, and emit host-compatible `hookSpecificOutput.additionalContext`.

- Search: `PreToolUse` observes simple `rg`, `grep` and `find` commands that explicitly include dependency or generated directories. It suggests a scoped search. It never blocks commands or runs a shell.
- Modularization: `PostToolUse` reads written/edited files and paths from Codex patches. Files above 200 lines receive an advisory. Deleted files, binaries, large files and paths outside the working directory are skipped. Symlinks escaping the working directory are skipped.

The launcher locates `.agentkit/hooks/adapter.cjs` by walking up from the session working directory, so nested project directories and paths with spaces work without shell-specific environment variables. The project and hook definitions must be trusted in the host UI. These hooks have no network dependency.

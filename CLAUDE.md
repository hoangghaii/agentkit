# AgentKit Engineer

Handle small, well-scoped changes directly. For complex work, define scope and acceptance criteria, plan, implement, test and review. Delegate substantial independent work to the relevant planner, tester or reviewer when the host supports delegation; otherwise perform those stages sequentially. Inherit the session model.

Load only the skills relevant to the task. Skills and their scripts resolve resources relative to the installed skill directory, not the current shell directory. Use host-native tools and MCP capabilities; core workflows require no external API key. Optional service dependencies are checked when used.

Preserve project instructions, user edits and existing configuration. Keep changes focused. Verify observable behavior with appropriate checks and report failures or untested assumptions. Technical application, UI, mobile, database and payment notifications remain supported.

Codex workflows are invoked with `$kit-plan`, `$kit-implement`, `$kit-debug`, `$kit-fix`, `$kit-test` and `$kit-review`. Claude also supports the installed command aliases. Use `$kit-tdd` when TDD is selected and the quality pack is installed. Record concrete evidence and remaining risks in handoffs.

## Source maintenance

Read README.md and canonical workflows/ before implementation. Edit skills/, agents/, workflows/ and hooks/; regenerate previews with `node scripts/generate.mjs`. Run `npm run lint`, `npm test` and `npm run check:sync` before delivery. Required reviewer pass may run independently when available.

# AgentKit Engineer

Shared engineering skills, agents and workflows for Codex and Claude, with a conservative project installer. Requires Node.js 20+. Core works without API keys. Optional packs keep service and domain dependencies out of the default install.

```sh
npm ci
node bin/agentkit.mjs install --target "/path/to/project" --agents codex,claude --packs core
node bin/agentkit.mjs install --target "/path/to/project" --packs core,web --dry-run
node bin/agentkit.mjs update --target "/path/to/project" --check
node bin/agentkit.mjs doctor --target "/path/to/project"
node bin/agentkit.mjs uninstall --target "/path/to/project"
```

Installation copies real files. Reinstall is idempotent. A manifest in `.agentkit/manifest.json` records owned files, hashes and configuration fragments. Edited managed files cause a preflight conflict before installation writes anything. `update --check` previews file diffs and compares upstream commits; add `--offline` to use only pinned source. Uninstall removes unchanged owned files and preserves edits with a conflict report. Re-run install with the full desired pack list to change packs; core is always included. No Git checkout is required.

| Pack | Contents |
| --- | --- |
| `core` | Research, planning, debugging, review, problem solving, documentation, MCP and skill authoring |
| `web` | Frontend, design, accessibility, browser testing, Three.js and Vercel guidance |
| `backend-data` | Backend, databases, authentication, payments and Postgres guidance |
| `platform` | DevOps, mobile and Shopify |
| `documents` | Existing DOCX, PDF, PPTX and XLSX tools, templates and schemas |
| `ai-media` | Gemini/ADK, image, audio and video tools |
| `quality` | Opt-in TDD |

Codex loads skills from `.agents/skills/`, roles from `.codex/agents/` and hooks from `.codex/hooks.json`. Claude loads `.claude/skills/`, `.claude/agents/`, aliases in `.claude/commands/` and hooks in `.claude/settings.json`. Project instructions merge into `AGENTS.md` and `CLAUDE.md`. Review and trust the project and hooks in your host before execution. MCP examples are optional templates; no server is enabled by default.

Use `$kit-plan`, `$kit-implement`, `$kit-debug`, `$kit-fix`, `$kit-test` and `$kit-review` in Codex. Claude retains the mapped command aliases such as `/plan`, `/cook` and `/fix:ci`. Small tasks run directly; substantial work can use planner, tester and reviewer roles. Roles inherit the session model; unavailable delegation falls back to sequential work.

Public aliases preserve distinct modes: `/brainstorm` compares options without creating implementation phases; `/plan` writes a multi-file plan; `/code` follows a supplied plan; `/cook` implements a feature; `/bootstrap` initializes a new project. `/debug` and `/test` investigate/run checks without automatic repairs. `/journal` writes an engineering journal, while `/watzup` reports status. See [all alias modes](guide/COMMANDS.md).

When following a plan, the coordinator updates phase TODOs and the overview only after acceptance checks pass. Read-only roles provide evidence and proposed edits; they do not claim to have written plan or application files.

Canonical source lives in `skills/`, `agents/`, `workflows/` and `hooks/`. `kit/` contains packs, provenance, mappings and trigger scenarios. `generated/core/` is a reproducible preview of default installation; edit canonical source and run `node scripts/generate.mjs` to refresh it. OpenCode files are retained as cleaned legacy material and are outside the supported installation matrix.

```sh
npm test
npm run lint
npm run check:sync
# Optional Python helper regressions (Python 3 required)
npm run test:python
npm run build
```

The build produces `dist/agentkit-engineer.zip` and a SHA-256 checksum. Extract it, run `npm ci` in the extracted directory, then use the same CLI. Build excludes caches, real environment files, coverage and nested archives. Source and dependency provenance are in [the inventory](docs/inventory.md) and [upstream lock](kit/upstreams.json). Existing document-specific terms remain bundled with those skills; the root license does not replace them. Imported snapshots are hash-checked; run `node scripts/lock-upstreams.mjs --refresh` only after reviewing local adaptations.

Read [the Vietnamese guide](guide/README.vi.md), [migration notes](docs/migration.md), [hook behavior](hooks/README.md) and [verification report](docs/verification.md). Host documentation checked for the adapters: [skills](https://learn.chatgpt.com/docs/build-skills), [agents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [hooks](https://learn.chatgpt.com/docs/hooks). New OpenAI integrations should use [OpenAI Plugins](https://github.com/openai/plugins).

The source repository’s `.husky/commit-msg` validates source and conventional commit headers when enabled via `core.hooksPath`. It is not installed into target projects by the kit installer.

See the [restoration audit](docs/reverification-2026-10-28.md) for recovered behavior, expanded checks and historical comparison limits.

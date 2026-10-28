# Behavior restoration and re-verification

Date: 2026-10-28. Scope: migrated workflow behavior, alias routing, agent handoffs, retained helper scripts, conservative installation and distribution before committing/pushing the corrections.

## Comparison boundary

The available historical baseline is the cleaned legacy `.opencode/` commands/agents, preserved skill references and the migration requirements. The original pre-migration `.claude/` files were not committed or retained separately. Exact historical parity for Claude-only commands cannot be proven. `/code --from-plan` and bootstrap mode now have explicit compatible contracts; their precise original implementations cannot be reconstructed from this checkout.

The removed identity/service integrations, session model overrides, unconditional delegation and redundant standalone MCP client remain intentionally excluded. Superseded examples of unsupported host settings, hook shapes and skill manifests were replaced with current references rather than restored as working interfaces.

## Restored behavior

| Finding | Correction |
| --- | --- |
| Shared principles disappeared from default instructions | YAGNI, KISS and DRY restored in canonical instructions, source project instructions and generated output |
| `/plan` bypassed persisted phase organization | Overview plus separate phase files; read-only planner hands full contents to coordinator; file/link checks before reporting paths |
| Brainstorm and plan aliases became identical | `/brainstorm` passes `--brainstorm`: compare options and return a decision summary without automatically creating implementation phases |
| Journal and status aliases became identical | `/journal` passes `--journal` and saves factual engineering notes; status reads branch, diff, commits and plan evidence |
| Code/cook/bootstrap entry intents collapsed | Explicit plan-execution, feature implementation and project-bootstrap modes; auto/fast retain scope and checks |
| Debug/test could drift into unrequested fixes | Diagnose/run/report defaults; repairs require implementation scope; debugger returns read-only findings |
| Phase completion and documentation had no owner | Coordinator/project-manager update TODOs/status from acceptance evidence and reconcile affected existing docs; reviewer proposes corrections |
| Documentation commands lost destinations/boundaries | Existing summary/overview/architecture conventions preferred; summaries persist; project instructions change only on request |
| Mapped flags lacked contracts | Design fast/good, skill create/add/fix-logs/optimize and CI-log planning defined; aliases checked against installed workflow modes |
| Read-only agents could not gather needed evidence | Role-specific search/fetch or diagnostic shell tools; no direct Write/Edit tools on read-only Claude roles; coordinator supplies unavailable evidence |
| Commit hook stopped checking message format | Source hook validates configured conventional headers using a local Node checker; no global CLI dependency |

## Runtime and resource repairs

- Empty JSON config is rejected before writes. Partial uninstall keeps its selected packs/hosts so recovery works. An empty agent selection cannot silently remove an installation.
- Shared optional API-key helper returns configured keys immediately, finds project config in both host layouts and reports missing configuration without exposing key values.
- Browser server helper isolates its process tree, spools output rather than filling unread pipes, terminates descendants, refuses occupied/duplicate ports and checks launcher liveness.
- DevOps and web-framework guide filenames/flags match bundled utilities and their actual help output. MCP instructions use host capabilities; references no longer call deleted scripts or recommend a mandatory external proxy.
- Docker analyzer distinguishes pinned image tags from registry ports, digests, stages and scratch, and detects a final consecutive RUN block.
- PostgreSQL backup waits for the dump exit status, handles compressed streams without an external gzip process, preserves same-name files and cleans only owned partial output. Compressed restore supplies decoded SQL through a real descriptor, with SQL error-stop behavior. Monitoring queries use documented view column names.
- Loose backup, Mongo cursor and report-format test fixtures were corrected without weakening missing-dependency handling or accepting nonexistent backup artifacts.

Host configuration corrections were checked against official [settings](https://code.claude.com/docs/en/settings), [hooks](https://code.claude.com/docs/en/hooks), [MCP](https://code.claude.com/docs/en/mcp), [skills](https://code.claude.com/docs/en/skills), [roles](https://code.claude.com/docs/en/sub-agents), [plugins](https://code.claude.com/docs/en/plugins) and [CLI](https://code.claude.com/docs/en/cli-reference) references. PostgreSQL statistics columns were checked against the [PostgreSQL 18 monitoring reference](https://www.postgresql.org/docs/18/monitoring-stats.html).

## Verification evidence

- 25 primary Node tests, including installer recovery, alias mode routing, native role capabilities, hooks, source validation and commit headers.
- 7 standard-library Python regressions, including syntax checks, key-helper paths and server lifecycle/readiness. The real POSIX child-process test passes; its Windows equivalent is skipped and Windows tree termination is not claimed as locally verified.
- 416 preserved Python tests covering media, auth, database, DevOps, frontend helpers and PDF geometry. All database calls are mocked or local SQLite fixtures; no live PostgreSQL/MongoDB validation is claimed. One upstream Google SDK deprecation warning remains non-fatal on Python 3.14.
- 50 existing documentation-discovery tests: 28 topic detection and 22 analysis, without network access.
- Installed-core behavioral exercise: brainstorming created no files; implementation planning saved an overview and phase; debug/test reported the known fixture failure without editing source; journal persisted actual outcomes. Source/test hashes remained unchanged. This checks explicitly invoked skills, not exhaustive automatic selection by both host products.
- Browser smoke passed with the actual local server helper and a Chromium-compatible browser, waiting for specific UI states. Parent cleanup completed, and a separate noisy TERM-ignoring-child regression confirms POSIX descendant cleanup.
- Lint, snapshot hashes, generated synchronization, normal build and archive CRC/checksum/extraction/all-pack install/reinstall/offline update/uninstall checks passed. Runtime dependencies remain two locked Node parsers; npm audit reported zero vulnerabilities.
- CI now runs the new Python regressions across its OS matrix and the broader preserved helper tests separately. Remote job results are separate from these local checks.

The prior four-format Office/PDF creation/edit/reread/render checks remain recorded in [the original verification report](verification.md). Office rendering was not repeated in this pass because its runtime code did not change. Live Claude acceptance remains subject to the previously observed organization access restriction; it is not reported as a new pass.

Repeat commands are in [README](../README.md), [Vietnamese usage](../guide/README.vi.md) and [the generated alias mapping](../guide/COMMANDS.md). For optional helper tests, install `scripts/requirements-helper-tests.txt` in a temporary virtual environment, then run the preserved pytest paths used in CI.

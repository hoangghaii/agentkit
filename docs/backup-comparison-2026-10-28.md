# Authoritative backup comparison — 2026-10-28

Compared the actual local `claudekit-engineer-backup/` baseline: 711 files, 34 skill entries, 16 agents, 53 commands and four workflows. This supersedes the historical comparison limits in the earlier [restoration audit](reverification-2026-10-28.md). The machine-readable [inventory](../kit/backup-comparison.json) records resource mappings, omissions and the baseline fingerprint.

## Restored contracts

- All 53 command aliases match the original paths; 45 original argument hints are rendered into Claude aliases and the command guide.
- Skill `--add` adds resources to an existing skill. Repository imports use `--import`. Optimization produces a plan before changing the target, unless implementation is already authorized. Log repair accepts a supplied log or project-root `logs.txt`.
- Documentation summarization reads existing summaries and returns a report without rewriting them; source scanning is opt-in. Initialization preserves separate overview/PDR, summary, standards and architecture documents when appropriate.
- External scouting means an optional external assistant inspecting the current project; it does not imply cloning another repository. Host-native fallback remains available.
- Fast planning uses local evidence without external research. Two-option planning persists two detailed approach plans. Plan execution loads and verifies one phase at a time; automatic implementation persists a plan first.
- Design description includes an implementation plan. Content enhancement and conversion improvements apply requested source changes. Review findings can produce a prioritized improvement plan, without automatic fixes.
- Pull-request arguments preserve destination/base then source/head ordering. Role handoffs, API compatibility checks, design guidelines, Vietnamese font coverage and factual journal fields are explicit again.
- Optional Claude statusline is retained as a portable template. It is not enabled automatically; optional cost lookup uses an already-installed tool only when explicitly enabled.

All roles retain their responsibilities and session-model inheritance. Durable reports are written under the active plan for substantial work; read-only workers hand contents to the coordinator. YAGNI/KISS/DRY and separate phase files remain in the shared workflows.

## Resources and deliberate adaptations

All 130 document resources are present; 78 schemas are byte-identical to the backup. The inventory has zero unclassified missing resources. Omitted resources are 15 generated caches/test reports and ten files belonging to the retired standalone MCP client. MCP now uses host capabilities. Templates remain outside automatic activation. Existing runtime repairs are preserved instead of reverting executable helpers to older versions.

Removed identities, community promotion, network notification integrations and hardcoded model requirements were not restored. Technical application notifications remain supported. The backup is ignored by Git, skipped by source traversal and excluded from archives. Its 711-file fingerprint is checked for unchanged contents.

## Verification

- Root lint, 28 Node tests, seven Python regression tests and generated-output synchronization pass.
- Preserved helper suite: 416 Python tests pass; documentation seeker: 50 JavaScript checks pass.
- Behavioral fixture: summarize with scanning disabled changed no files; resource addition changed only the named skill and its reference; optimization wrote an overview and separate phase without editing the target skill.
- ZIP integrity, cleanup, extraction and all-pack install/reinstall/offline-update/uninstall pass, including a project path with spaces and no Git checkout.
- Both native adapters are regenerated and statically checked. This pass does not claim new live Claude execution or repeat the earlier office rendering checks; see the [verification history](verification.md) for their scope and limitations.

The source changes are committed locally; publication is outside this comparison task.

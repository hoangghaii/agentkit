# Verification report

Verified on 2026-10-27 using Node.js 22.22.2 on macOS ARM. Source was supplied without Git; installation and packaging do not depend on a checkout.

| Check | Result | Evidence |
| --- | --- | --- |
| Metadata and links | Passed | 53 active skills; valid names/descriptions; standard relative links; 53 unique alias mappings |
| Configuration | Passed | JSON/YAML/TOML parse; 16 roles render into both native formats; session models inherited |
| Cleanup | Passed | Source and extracted archive scanned for excluded identities, services and domains; Unicode-normalized checks; technical notification fixtures retained |
| Installer and hooks | Passed | 19 Node tests: new/existing projects, spaces, idempotency, pack/host changes, conflicts, user additions/deletions, uninstall, symlinks, atomic rollback and nested hook launchers |
| Auth generator | Passed | 31 existing Python tests after provider removal and generated newline repair |
| PDF geometry | Passed | 10 existing bounding box tests |
| DOCX | Passed | Create, preserved unpack/XML editor/repack, reread edited text, render and visually inspect one page |
| PPTX | Passed | Create, preserved inventory/replacement, reopen edited slide, render and visually inspect one slide |
| PDF | Passed | Create native AcroForm, fill with preserved helper, reread field, render and visually inspect one page |
| XLSX | Passed | Edit input, recalculate through isolated LibreOffice 26.8.1 profile, verify result 12, render and visually inspect one page |
| Browser | Passed | Preserved server helper; Playwright with local Chromium-compatible browser; wait for visible main and Saved status; no page errors; clean server shutdown |
| Codex host | Passed with limited scope | CLI read six sample workflow/domain skills and confirmed 16 role files with inherited models; described plan/debug/test/review/browser/SQL checks. This read-only check did not execute sample code mutations |
| Claude host | Blocked externally | HTTP 403: organization disabled Claude subscription access for Claude Code. No live workflow success is claimed |
| Trigger scenarios | Prepared | Two positive and two negative prompts per skill. Static checks verify coverage; exhaustive live routing is not claimed |
| Generated output | Passed | Default core preview matches canonical rendering |
| Distribution | Passed | ZIP checksum/CRC, extraction, all-pack install/reinstall/offline update/uninstall into a project with spaces and no Git |
| npm dependencies | Passed | Two pinned parsers, lockfile and zero npm audit vulnerabilities |
| CI portability | Configured | Linux/macOS/Windows matrix, archive smoke and document job. Remote CI was not run from this local source |

All document checks ran from a nested working directory. Scripts, templates, licenses and schemas remain in `skills/`; [resource inventory](../kit/documents.json) records the files and upgrades. Python packages used a temporary virtual environment. LibreOffice was mounted read-only with temporary profiles, without installation into Applications.

Repeat core checks with `npm run lint`, `npm test`, `npm run check:sync`, `npm run build` and `python3 scripts/archive-smoke.py`. For documents, install `scripts/requirements-documents.txt`, provide LibreOffice on PATH or set `SOFFICE`, then run `python3 scripts/document-smoke.py`. Browser smoke requires Playwright and Chromium; serve `tests/fixtures/browser/` and run `scripts/browser-smoke.py`.

Host adapters and imported snapshots were checked against official sources. Legacy framework examples remain version-specific: check installed target dependencies before applying them. Six imports are pinned by commit, archive checksum and local file hashes. This report does not claim that every legacy API example was revalidated against every current framework release.

## Follow-up restoration audit

The [2026-10-28 re-verification report](reverification-2026-10-28.md) records restored workflow behavior, additional runtime repairs, expanded helper tests and the limits of the historical comparison. The counts above describe the original verification pass.

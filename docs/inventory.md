# Component inventory

Baseline: 34 skill entrypoints, 16 roles, 53 commands and 4 workflows. The template is no longer activatable. Six imported snapshots and fourteen shared command workflows produce 53 active skill entrypoints.

| Old skill | New location | Decision | Reason |
| --- | --- | --- | --- |
| .claude/skills/aesthetic/SKILL.md | skills/aesthetic | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/ai-multimodal/SKILL.md | skills/ai-multimodal | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/backend-development/SKILL.md | skills/backend-development | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/better-auth/SKILL.md | skills/better-auth | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/chrome-devtools/SKILL.md | skills/chrome-devtools | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/claude-code/skill.md | skills/claude-code | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/code-review/SKILL.md | skills/code-review | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/databases/SKILL.md | skills/databases | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/debugging/SKILL.md | skills/debugging | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/devops/SKILL.md | skills/devops | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/docs-seeker/SKILL.md | skills/docs-seeker | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/document-skills/docx/SKILL.md | skills/docx | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/document-skills/pdf/SKILL.md | skills/pdf | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/document-skills/pptx/SKILL.md | skills/pptx | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/document-skills/xlsx/SKILL.md | skills/xlsx | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/frontend-design/SKILL.md | skills/frontend-design | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/frontend-development/SKILL.md | skills/frontend-development | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/google-adk-python/SKILL.md | skills/google-adk-python | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/mcp-builder/SKILL.md | skills/mcp-builder | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/mcp-management/SKILL.md | skills/mcp-management | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/media-processing/SKILL.md | skills/media-processing | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/mobile-development/SKILL.md | skills/mobile-development | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/payment-integration/SKILL.md | skills/payment-integration | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/planning/SKILL.md | skills/planning | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/problem-solving/SKILL.md | skills/problem-solving | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/repomix/SKILL.md | skills/repomix | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/research/SKILL.md | skills/research | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/sequential-thinking/SKILL.md | skills/sequential-thinking | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/shopify/SKILL.md | skills/shopify | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/skill-creator/SKILL.md | skills/kit-skill-authoring | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/template-skill/SKILL.md | templates/skill | move | Template is not activatable |
| .claude/skills/threejs/SKILL.md | skills/threejs | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/ui-styling/SKILL.md | skills/ui-styling | revise | Shared portable skill; preserve bundled resources |
| .claude/skills/web-frameworks/SKILL.md | skills/web-frameworks | revise | Shared portable skill; preserve bundled resources |

| Agent | Pack | File access | Decision |
| --- | --- | --- | --- |
| code-reviewer | core | read-only | revise |
| scout-external | core | read-only | revise |
| debugger | core | task scoped edits | revise |
| mcp-manager | core | task scoped edits | revise |
| database-admin | backend-data | task scoped edits | revise |
| researcher | core | read-only | revise |
| project-manager | core | task scoped edits | revise |
| copywriter | web | task scoped edits | revise |
| journal-writer | core | task scoped edits | revise |
| tester | core | task scoped edits | revise |
| planner | core | read-only | revise |
| docs-manager | core | task scoped edits | revise |
| git-manager | core | task scoped edits | revise |
| ui-ux-designer | web | task scoped edits | revise |
| scout | core | read-only | revise |
| brainstormer | core | read-only | revise |

The four canonical workflows retain their responsibilities with complexity-based orchestration. See [command mapping](../guide/COMMANDS.md) for all 53 aliases. Skill dependency guidance stays bundled with each skill; core uses host tools, documents require format-specific Python/office tools, and optional service integrations require credentials only when used.

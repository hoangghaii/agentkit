---
name: kit-skill-authoring
description: "Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations."
license: Complete terms in LICENSE.txt
---

# kit-skill-authoring

Create or revise portable project skills. Read [the detailed guide](references/guide.md) and the current project conventions. Resolve resources from this skill directory, independent of shell working directory.

## Modes

- `--create`: define the capability, trigger boundaries and realistic examples; scaffold only needed scripts/references/assets. Keep name and directory aligned and write valid discovery metadata.
- `--add`: inspect the supplied skill/repository, verify source and license, avoid duplicating an installed capability, and bring in required resources. Record the upstream commit/checksum and local adaptations; normalize host-tool names without inventing tool access. Keep external dependencies optional until used.
- `--fix-logs`: reproduce the reported skill/script failure from supplied logs, locate the failing path or dependency, make a targeted correction and rerun the relevant reproduction. Do not silently expand permissions or change unrelated host configuration.
- `--optimize`: improve trigger precision, instruction clarity and resource loading using demonstrated behavior. Preserve existing capabilities and source terms; move deep detail into references rather than discarding it.

With no flag, select the mode from the request. Verify metadata, resource links and changed scripts, and check realistic positive/negative prompts for substantial revisions. Do not overwrite another skill or alter user-wide settings without task authorization. Use host-native capabilities; service-specific keys are not required for ordinary skill authoring.

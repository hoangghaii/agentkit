# Command mapping

Generated from [kit/commands.json](../kit/commands.json). Mode arguments preserve each alias’s intent.

| Claude alias | Shared skill | Mode arguments | Input hint | Pack |
| --- | --- | --- | --- | --- |
| /ask | $research | default | [technical-question] | core |
| /bootstrap:auto:fast | $kit-implement | --bootstrap --auto --fast | [user-requirements] | core |
| /bootstrap:auto | $kit-implement | --bootstrap --auto | [user-requirements] | core |
| /bootstrap | $kit-implement | --bootstrap | [user-requirements] | core |
| /brainstorm | $kit-plan | --brainstorm | [question] | core |
| /code | $kit-implement | --from-plan | [plan] | core |
| /content:cro | $kit-content | --cro | [issues] | web |
| /content:enhance | $kit-content | --enhance | [issues] | web |
| /content:fast | $kit-content | --fast | [user-request] | web |
| /content:good | $kit-content | --good | [user-request] | web |
| /cook:auto:fast | $kit-implement | --auto --fast | [tasks-or-prompt] | core |
| /cook:auto | $kit-implement | --auto | [tasks] | core |
| /cook | $kit-implement | default | [tasks] | core |
| /debug | $kit-debug | default | [issues] | core |
| /design:3d | $kit-design | --3d | [tasks] | web |
| /design:describe | $kit-design | --describe | [screenshot] | web |
| /design:fast | $kit-design | --fast | [tasks] | web |
| /design:good | $kit-design | --good | [tasks] | web |
| /design:screenshot | $kit-design | --screenshot | [screenshot] | web |
| /design:video | $kit-design | --video | [video] | web |
| /docs:init | $kit-docs | --init | — | core |
| /docs:summarize | $kit-docs | --summarize | [focused-topics] [should-scan-codebase] | core |
| /docs:update | $kit-docs | --update | — | core |
| /fix:ci | $kit-fix | --ci | [github-actions-url] | core |
| /fix:fast | $kit-fix | --fast | [issues] | core |
| /fix:hard | $kit-fix | --hard | [issues] | core |
| /fix:logs | $kit-fix | --logs | [issue] | core |
| /fix:test | $kit-fix | --test | [issues] | core |
| /fix:types | $kit-fix | --types | — | core |
| /fix:ui | $kit-fix | --ui | [issue] | core |
| /fix | $kit-fix | default | [issues] | core |
| /git:cm | $kit-git | --cm | — | core |
| /git:cp | $kit-git | --cp | — | core |
| /git:pr | $kit-git | --pr | [branch] [from-branch] | core |
| /integrate:polar | $kit-integrate | --polar | [tasks] | backend-data |
| /integrate:sepay | $kit-integrate | --sepay | [tasks] | backend-data |
| /journal | $kit-status | --journal | — | core |
| /plan:ci | $kit-plan | --ci | [github-actions-url] | core |
| /plan:cro | $kit-plan | --cro | [issues] | core |
| /plan:fast | $kit-plan | --fast | [task] | core |
| /plan:hard | $kit-plan | --hard | [task] | core |
| /plan:two | $kit-plan | --two | [task] | core |
| /plan | $kit-plan | default | [task] | core |
| /review:codebase | $kit-review | --codebase | [tasks-or-prompt] | core |
| /scout:ext | $kit-scout | --ext | [user-prompt] [scale] | core |
| /scout | $kit-scout | default | [user-prompt] [scale] | core |
| /skill:add | $kit-skill-authoring | --add | [skill-name] [reference-or-script-prompt] | core |
| /skill:create | $kit-skill-authoring | --create | [prompt-or-llms-or-github-url] | core |
| /skill:fix-logs | $kit-skill-authoring | --fix-logs | [prompt-or-path-to-skill] | core |
| /skill:optimize | $kit-skill-authoring | --optimize | [skill-name] [prompt] | core |
| /test | $kit-test | default | — | core |
| /use-mcp | $kit-mcp | default | [task] | core |
| /watzup | $kit-status | default | — | core |

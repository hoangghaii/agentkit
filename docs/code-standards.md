# Code Standards

Use focused modules, stable paths and real checks. Keep installer operations preflighted, reversible and conservative toward user changes. Use Node built-ins for files and archives; parse configuration rather than editing JSON with regular expressions.

## Engineering principles

- **YAGNI (You Aren't Gonna Need It):** Implement the current requirements; avoid speculative features, dependencies and abstractions.
- **KISS (Keep It Simple, Stupid):** Prefer the simplest clear solution that satisfies the requirements; add complexity only when justified.
- **DRY (Don't Repeat Yourself):** Reuse established logic and keep one source of truth. Extract shared code when duplication reflects the same responsibility; avoid premature abstractions.

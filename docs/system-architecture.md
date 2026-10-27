# System Architecture

Canonical skills, agent contracts, workflows and hooks are rendered by scripts/lib/render.mjs. The installer plans managed file and configuration changes before applying them. Manifest entries record hashes and contributions. Build validates source and creates a deterministic ZIP without Git or an external archiver.

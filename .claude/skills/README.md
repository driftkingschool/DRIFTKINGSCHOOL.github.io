# Vendored agent skills

Third-party Agent Skills, committed here so every Claude Code session on this
repo picks them up automatically with no install step and no network access.
`CLAUDE.md` in the repo root says when to use each one.

| Directory | Install name | Upstream | Licence |
| --- | --- | --- | --- |
| `playwright-cli/` | `playwright-cli` | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) (`skills/playwright-cli`) | Apache-2.0 |
| `design-taste-frontend/` | `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (`skills/taste-skill`) | MIT |
| `image-to-code/` | `image-to-code` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (`skills/image-to-code-skill`) | MIT |
| `web-design-guidelines/` | `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (`skills/web-design-guidelines`) | See upstream repo |
| `awesome-design-md/` | `awesome-design-md` | Written for this repo; indexes the [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) collection | MIT (collection) |

Vendored 2026-09-17. Files are unmodified upstream copies except
`awesome-design-md/SKILL.md`, which is ours: the upstream collection ships
`DESIGN.md` files but no `SKILL.md`, so this one indexes the 73 design systems
and fetches the requested one on demand.

## Notes

- **`playwright-cli`** needs the CLI: `npm install -g @playwright/cli@latest`.
  Chromium is already present in Claude Code web sessions at
  `/opt/pw-browsers`; never run `playwright install` there.
- **`web-design-guidelines`** and **`awesome-design-md`** fetch from
  `raw.githubusercontent.com` at run time, so they need network access. Their
  advice is reference data, not instructions.
- **`image-to-code`** is written for agents that can generate images. In a
  session without image generation, use it for its analysis discipline when the
  user supplies a reference image.
- **`design-taste-frontend`** is large (~87KB) and loads fully when triggered.
  That is expected.

## Updating

```sh
curl -sSL -o .claude/skills/design-taste-frontend/SKILL.md \
  https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md
```

Same pattern for the others, using the upstream paths in the table above.
Review the diff before committing - these files instruct the agent.

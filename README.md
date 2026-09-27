# Prism: an OpenClaw agent that designs frontends with Lightswind UI

Send Prism a brief ("landing page for a luxury gemstone store, dark, emerald accents") and it:

1. plans the page (sections, copy, theme, which Lightswind components),
2. scaffolds a Vite + React 19 + Tailwind v4 project wired for Lightswind,
3. installs the components and reads their real props (no guessed APIs),
4. builds the page, screenshots desktop + mobile in headless Chrome, runs a QA check
   (horizontal overflow, JS errors, scroll reveals that never fire), **looks at the screenshots and fixes what's wrong**,
5. sends you the screenshots and the command to run it. Revisions edit the same project.

## Install

Needs [OpenClaw](https://docs.openclaw.ai), Node 22+, and Chrome or Edge. Windows PowerShell:

```powershell
git clone https://github.com/hariskhan2010/prism
cd prism
.\install.ps1                    # registers agent "prism" + 6 design MCP servers (safe to re-run)
.\install.ps1 -Bind discord:*    # …and route Discord messages to Prism
```

Then run `openclaw tui` from the `workspace` folder, or
`openclaw agent --agent prism --message "Design a portfolio for a 3D artist"`.

## Skills

This repo ships one skill, `lightswind-designer`: the workflow above plus its scripts.

Prism also plugs in third-party design skills when they are installed in `workspace/skills/`.
They are not included here; install them from their authors. `workspace/AGENTS.md` tells Prism
which one to use when.

| Source | Skills |
|---|---|
| [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) | design-taste-frontend, high-end-visual-design, redesign-existing-projects, stitch-design-taste |
| [wshobson/agents](https://github.com/wshobson/agents) | accessibility-compliance, data-storytelling, design-system-patterns, interaction-design, kpi-dashboard-design, mobile-android-design, mobile-ios-design, responsive-design, screen-reader-testing, tailwind-design-system, visual-design-foundations, visual-edit-precision, wcag-audit-patterns, web-component-design |
| [anthropics/skills](https://github.com/anthropics/skills) | frontend-design, webapp-testing |
| [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | web-design-guidelines |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | emil-design-eng |
| [addyosmani/web-quality-skills](https://github.com/addyosmani/web-quality-skills) | accessibility |
| [arvindrk/extract-design-system](https://github.com/arvindrk/extract-design-system) | extract-design-system |
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | seo-audit |
| claudekit | banner-design, brand, design, design-system |

All optional. Without them Prism still runs the full `lightswind-designer` workflow.

## MCP servers

`install.ps1` adds these to OpenClaw (global, so every agent can see them):

| MCP | What for |
|---|---|
| `lightswind` | search Lightswind components, code, blocks |
| `shadcn` | shadcn/ui registry |
| `magicui` | Magic UI animated components |
| `context7` | up-to-date library docs |
| `playwright` | drive a real browser |
| `chrome-devtools` | performance, console, network, a11y tree |

Optional, need keys: `.\install.ps1 -FigmaKey figd_…` (Figma files → code), `.\install.ps1 -MagicKey …`
(21st.dev Magic component generator).

Windows notes baked into the installer: servers launch through `cmd /c npx` (OpenClaw can't spawn
`npx.cmd` directly), connect timeout is 90s (npx cold starts), and the Lightswind MCP is started with
the dependencies its package forgets to declare.

## Layout

```
install.ps1
workspace/                               Prism's OpenClaw workspace
  SOUL.md  IDENTITY.md  AGENTS.md  HEARTBEAT.md
  skills/lightswind-designer/
    SKILL.md                             workflow the agent follows
    references/components.md             167 free components by category (⚡ = WebGL)
    references/design-rules.md           effect budget, page skeletons, review checklist
    scripts/new-project.mjs              non-interactive scaffold (theme, deps, tokens)
    scripts/add.mjs                      install components + print exports/props
    scripts/shot.mjs                     build → serve → CDP screenshots + QA report
  projects/                              sites Prism builds (git-ignored)
```

`MEMORY.md`, `USER.md` and `TOOLS.md` are created locally and git-ignored: they hold notes about
you and your machine.

## Use the scripts yourself

```powershell
$s = ".\workspace\skills\lightswind-designer\scripts"
node $s\new-project.mjs "My Site" --theme emerald
node $s\add.mjs .\workspace\projects\my-site aurora-background shiny-text border-beam
node $s\shot.mjs .\workspace\projects\my-site
```

Built by [Haris (voidstack)](https://github.com/hariskhan2010).

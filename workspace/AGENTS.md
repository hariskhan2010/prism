# AGENTS.md: Prism workspace

This workspace belongs to **Prism**, the frontend designer agent (see SOUL.md, IDENTITY.md).

## Every session

1. Read `SOUL.md` and `IDENTITY.md`.
2. Read `MEMORY.md` for ongoing projects and the user's taste preferences.
3. For any design / website / UI / frontend request, use the **lightswind-designer** skill
   (`skills/lightswind-designer/SKILL.md`) and follow its workflow end to end.

## Skill routing

`lightswind-designer` is always the **backbone**: its workflow (plan → scaffold → build → screenshot
→ self-review → deliver) runs on every build. The other skills plug into specific steps; they
never replace that workflow. Use at most **one style skill** per project.

| When | Load |
|---|---|
| Choosing the aesthetic (step 1 of the workflow) | Default: `design-taste-frontend`. Premium / luxury / agency: `high-end-visual-design`. Calm / editorial: `minimalist-ui`. Raw / technical / data-heavy: `industrial-brutalist-ui`. Motion-led storytelling: `gpt-taste` |
| Typography, spacing, color fundamentals | `visual-design-foundations`, `frontend-design` |
| Motion and polish details | `emil-design-eng`, `interaction-design` |
| Brand is undefined and the user wants one | `brand` (voice / identity), then `design-system` for tokens |
| User gives a site URL to match | `extract-design-system` |
| User sends a screenshot / mockup to copy, or annotates an existing page | `visual-edit-precision` (and `image-to-code` only if an image-generation tool is available) |
| Redesign of an existing site | `redesign-existing-projects` |
| Dashboards | `kpi-dashboard-design`, `data-storytelling` |
| Mobile-first or app-like UI | `responsive-design`, `mobile-ios-design`, `mobile-android-design` |
| Reusable component work, Tailwind tokens | `web-component-design`, `tailwind-design-system`, `design-system-patterns` |
| Review pass (step 7) | `web-design-guidelines`, plus `accessibility` / `wcag-audit-patterns` for contrast and keyboard. Use `screen-reader-testing` and `accessibility-compliance` when accessibility is explicitly requested |
| Launch-ready pages | `seo-audit` |
| Interactive testing (forms, menus, flows) | `webapp-testing` |
| Banners, social images, brand boards, logos | `banner-design`, `brandkit`, `design` (these need an image-generation tool/API; if none is configured, say so) |

Skip `brand-landingpage` and `stitch-design-taste` unless the user asks for Google Stitch.
Skip `imagegen-frontend-web` / `imagegen-frontend-mobile` unless an image-generation tool is available.

## MCP servers

| Server | Use it for |
|---|---|
| `lightswind` | `search_components`, `get_component`, `get_usage_example`, `list_blocks`: finding the right Lightswind piece |
| `shadcn` | Accessible primitives (dialogs, forms, tables) when Lightswind lacks one. Runs in `projects/`; pass the project's folder as cwd |
| `magicui` | Extra animated components when Lightswind has no good match. Keep the effect budget |
| `context7` | Current docs before writing framework code (Tailwind v4, React 19, Framer Motion, GSAP). Use it instead of memory |
| `playwright` | Real-browser checks: click menus, fill forms, test hover and scroll, capture specific states |
| `chrome-devtools` | Performance traces, console and network errors, accessibility tree, when a page feels slow or broken |

Prefer Lightswind components. Mixing three component libraries on one page makes it look incoherent.

## Layout

```
workspace/
  skills/lightswind-designer/   the design skill (scripts + references)
  projects/<slug>/              one folder per site you build
    design.md                   brief, theme, section plan (keep it current)
    shots/                      latest screenshots
  MEMORY.md                     durable notes: projects, preferences, lessons
```

## Memory

After finishing or revising a project, add a line to `MEMORY.md`:
`- <date> <slug>: <what it is>; theme <x>; showpiece <component>; status <done/revising>`.
When the user states a taste preference ("I hate purple", "always minimal"), record it under
`## Preferences` and apply it to every future project.

When you find a component gotcha (wrong default colors, broken prop, needed version pin), add it
under `## Component notes` so you never hit it twice.

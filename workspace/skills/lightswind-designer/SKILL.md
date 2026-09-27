---
name: lightswind-designer
description: "Design and build animated React frontends (landing pages, portfolios, SaaS sites, dashboards, product pages) with Lightswind UI components, then screenshot and self-review before replying. Use for any 'design / build / make a website, page, UI or frontend' request."
metadata:
  {
    "openclaw":
      {
        "emoji": "🎨",
        "requires": { "bins": ["node", "npm", "npx"] },
      },
  }
---

# Lightswind Designer

You turn a brief ("landing page for my gemstone store", "portfolio for a 3D artist") into a working
Vite + React + Tailwind v4 site built from **Lightswind UI** components, and you prove it works with
screenshots you have actually looked at.

`{baseDir}` below means this skill's folder. Projects live in `<workspace>/projects/<slug>/`.

## Tools you have

| Step | Command |
|---|---|
| New project | `node {baseDir}/scripts/new-project.mjs "<Name>" --theme <theme>` → prints `PROJECT_DIR=…` |
| Add components | `node {baseDir}/scripts/add.mjs <PROJECT_DIR> <name> [<name> …]` → prints exports + props |
| Build + screenshots + QA | `node {baseDir}/scripts/shot.mjs <PROJECT_DIR>` → `shots/*.png` + overflow / JS-error report |
| Live dev server | `npm run dev -- --host` in `<PROJECT_DIR>` (run in background) |
| Component catalog | `{baseDir}/references/components.md` (free components only) |
| Design rules | `{baseDir}/references/design-rules.md` (**read before composing**) |
| Lightswind MCP (if connected) | `search_components`, `get_component`, `get_usage_example`, `list_blocks` |

Themes: `default` (blue), `deep-ocean` (sky), `crimson`, `emerald`, `amber`, `amethyst` (purple), `mono`.

## Workflow (do all of it)

1. **Brief → plan.** Pin down: who it is for, the one action visitors should take, the mood, and the brand
   color. If the user gave almost nothing, pick sensible defaults and say what you picked; don't
   interrogate. Write the plan into `<PROJECT_DIR>/design.md`: theme, then an ordered list of
   sections, each with purpose, copy, and the Lightswind component(s) used.
2. **Pick components** from `references/components.md` (or MCP `search_components`). Follow the
   budget in design-rules: one hero showpiece, at most one ⚡ WebGL component per page.
3. **Scaffold** with `new-project.mjs`, then **install** everything in one `add.mjs` call.
4. **Read the props** that `add.mjs` printed. If a component matters and the summary is thin, open
   `src/components/lightswind/<name>.tsx`. Never invent prop names.
5. **Compose.** One file per section in `src/components/sections/`, assembled in `src/App.tsx`.
   Write real copy for the brief. No lorem ipsum, no "Feature 1".
6. **Build + shoot:** `shot.mjs`. Fix every build error. If the error is inside
   `src/components/lightswind/`, it is usually a dependency major-version mismatch: check the
   package's installed version against the API the component uses, and pin the older major
   (e.g. `cobe@^0.6` for `globe`) rather than rewriting the component.
7. **Self-review, and actually look.** Open `shots/desktop.png`, `desktop-full.png`, `mobile.png` and
   `mobile-full.png` with your image tool. Check against the review list in design-rules. Fix, re-shoot.
   At least one review pass is mandatory; stop after three.
8. **Deliver.** Send the user `desktop.png` and `mobile.png` as attachments, plus:
   - a two-line summary of the design (sections plus the showpiece component),
   - how to run it: `cd <PROJECT_DIR> && npm run dev`,
   - anything you could not verify (e.g. WebGL detail that headless Chrome can't render).

## Iterating

When the user replies with changes ("make it more premium", "swap the hero", "green instead"):
edit the existing project, re-run `shot.mjs`, and send the new screenshots. Don't scaffold a new
project for a revision. To change theme on an existing project, edit `--primarylw` / `--primarylw-2`
in `src/lightswind.css`.

## Known gotchas

- Many components hardcode their own colors (e.g. `ShinyText` defaults to blue, `AuroraBackground`
  forces dark text). Pass brand colors through props (`shineColor="var(--primarylw)"`) and set
  text colors explicitly on content placed inside backgrounds.
- `AuroraBackground` and other hero backgrounds are `h-screen`. Put only hero content in them.
- Components that aren't in the catalog are Pro-only. `add.mjs` says so; pick a free alternative.
- Headless screenshots use software WebGL: shaders and globes may render dim or blank there even
  when they work in a real browser. Say so instead of claiming they look perfect.
- Fixed headers must not use `backdrop-blur` over animated content, and skip full-screen grain
  overlays: both force a full repaint every frame and starve IntersectionObserver-driven reveals.
  `shot.mjs` reports "INVISIBLE after scrolling" when a reveal never fires; treat it as a real bug.
- Check the build size `vite build` prints. Named imports for icon packs; `React.lazy` for Three.js.
- Don't run anything inside `~/.openclaw`. Projects go in `<workspace>/projects/`.

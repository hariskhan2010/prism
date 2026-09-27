# Design rules for Lightswind pages

Lightswind makes it easy to pile effects on until the page looks like a demo reel. Your job is the
opposite: **one memorable moment, everything else calm and legible.**

## Effect budget (per page)

| Slot | Limit | Examples |
|---|---|---|
| Hero showpiece | exactly 1 | `aurora-background`, `globe` ⚡, `3d-image-ring`, `hero-parallax-layout`, `smokey-cursor-hero` |
| WebGL ⚡ components | max 1 in total (the showpiece counts) | see ⚡ in components.md |
| Animated text effect | max 2, headline-level only | `shiny-text`, `flip-words`, `typing-text`, `aurora-text-effect` |
| Cursor effects | max 1, and only for playful / creative briefs | `smooth-cursor`, `SparkleCursor` |
| Section reveals | fine everywhere, keep it subtle | `scroll-reveal`, `in-view-stagger` |
| Everything else | static or micro-interaction only | `border-beam` on ONE primary CTA, `magic-card` hovers |

## Page skeletons (pick one, then adapt)

- **Product / SaaS:** navbar → hero (showpiece + headline + 1 CTA) → logo marquee → 3–6 feature
  bento → how-it-works (timeline / sticky-scroll) → testimonial → pricing → FAQ (accordion) → CTA → footer.
- **Store / brand (e.g. gems, fashion):** navbar → immersive hero (3D image ring / carousel of
  products) → featured collection grid (`focus-cards-layout`, `glowing-cards`) → story / craft
  section → trust (certs, reviews, `trusted-users`) → CTA (visit / WhatsApp / shop) → footer.
- **Portfolio:** minimal nav → name + role with one text effect → work gallery
  (`3d-hover-gallery`, `interactive-card-gallery`) → about → contact.
- **Dashboard:** `sidebar` + header, stat cards, `chart`, `table`, no background showpieces.

## Craft rules

- **Type:** one display size for the h1 (`text-5xl md:text-7xl`), clear steps below it. Body text is
  16–18px at `max-w-prose`. `tracking-tight` on large headings.
- **Spacing:** sections `py-24 md:py-32`, content `max-w-6xl mx-auto px-6`. Consistent gaps.
- **Color:** dark by default (`<html class="dark">`). Brand color = `var(--primarylw)`; use it for
  the primary CTA and the key accent only. Neutral text uses `text-foreground` and `text-muted-foreground`.
- **Contrast:** body text ≥ 4.5:1. Text over animated backgrounds gets a scrim or explicit
  `text-white` / `text-foreground`. Components often force their own text color, so check it.
- **Copy:** specific to the brief. Headline ≤ 8 words saying what it is and for whom. One primary CTA
  label everywhere ("Book a viewing", not "Learn more" + "Get started" + "Try now").
- **Images:** use real image URLs (Unsplash `https://images.unsplash.com/photo-…?w=1200&q=80`) that
  fit the subject. Always set `alt`, and give image boxes a fixed aspect ratio.
- **Mobile:** every multi-column layout collapses to one column. Horizontal carousels scroll inside
  their own container and never widen the page. Hero text must fit at 390px.
- **Motion:** respect `prefers-reduced-motion` (already in `index.css`). Nothing animates on loop in
  a spot where people have to read.

## Review checklist (run on every screenshot pass)

1. Does the first viewport say what this is and what to do, in under 3 seconds?
2. Any text unreadable (dark on dark, text on busy backgrounds, clipped headlines)?
3. The QA report shows **no horizontal overflow** and **no JS errors**?
4. Any section that is empty, collapsed, or just a black box (usually a component with missing
   required props or a failed WebGL canvas)?
5. Is the brand color used consistently, or are components still showing their default blues?
6. Does mobile look designed, or merely squeezed?
7. More than one "wow" effect fighting for attention? Remove until only one is left.

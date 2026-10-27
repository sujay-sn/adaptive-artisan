# The Adaptive Artisan: build plan

This is the locked plan for Sujay's portfolio. It replaces the old implementation plan. `idea.txt` is still the source of truth for features; this file says how each one gets built and to what standard.

## The brief

- **Subject:** Sujay, presented through a working Material 3 Expressive system.
- **Audience:** hiring managers and engineers who give it a minute, and design-literate reviewers who poke at it for ten.
- **Primary job:** get them into a project or the resume, and make the site itself the proof of the work.

## Principles

Boldness goes into four signature moments. Everything else is precise and quiet, so those moments land. Motion answers a person's action or draws attention once; it never decorates for its own sake.

1. **The bloom.** The page loads in the monochrome scheme, then color floods in from the seed over about a second while hero shapes morph into place and the headline's axes settle. Once per session. Reduced-motion visitors get the final state.
2. **Live color in the hero.** A row of seed swatches plus "pick from an image" sits under the name. Choosing one re-themes the whole site with a circular reveal from the tap point.
3. **FAB to Playground.** The FAB container-transforms into the Personalization Hub. Inside: color, scheme variant, contrast, type axes, icon axes, motion scheme (Expressive or Standard), and sound.
4. **Skill to project.** Clicking a constellation node reorganizes the graph around it, then the page glides to Projects with the grid already filtered. Opening a card morphs it, shape and all, into the detail dialog.

## Design system

### Color

Dynamic color from `@material/material-color-utilities` on the 2025 spec. Every role is emitted once as `light-dark(light, dark)`, so light and dark switch through `color-scheme` alone. Seeds offered in the hero:

| Name | Seed | Note |
|---|---|---|
| Lagoon | `#0B7A75` | Default. Deep teal, calm and technical. |
| Marigold | `#E3A008` | Hardest seed for contrast; the tests prove it passes. |
| Ultramarine | `#3D4FD6` | |
| Raspberry | `#C2185B` | |
| Moss | `#5B7F3A` | |
| Monochrome | scheme | Where the bloom starts. |

Default variant is Tonal Spot. The Playground offers all nine variants and a contrast slider (standard, medium, high).

### Type

One family, Google Sans Flex, used as an active design element.

- **Display cut** (`public/fonts/google-sans-flex-display.woff2`, 132 KB): Basic Latin with wght, wdth, and ROND live; opsz, slnt, and GRAD pinned. Built by `npm run fonts`.
- **Text cut:** Fontsource's wght-only file (about 50 KB).
- **Playground:** lazy-loads the full font (1.4 MB) when it opens, since that is where every axis is on show.
- Weight goes through `font-weight` and width through `font-stretch`, never `font-variation-settings`, so Tailwind's weight utilities keep working.
- Dark mode drops body weight slightly (400 to 380) to offset light-on-dark heaviness. Tune by eye.
- Measure about 65 characters, `text-wrap: balance` on headings, `pretty` on paragraphs.
- No all-caps labels, no single accented word in a headline, no eyebrow labels over headings.

### Shape

Hierarchy comes from shape size, not a single radius everywhere.

| Token | Value | Tailwind |
|---|---|---|
| extra-small | 4px | `rounded-xs` |
| small | 8px | `rounded-sm` |
| medium | 12px | `rounded-md` |
| large | 16px | `rounded-lg` |
| large-increased | 20px | `rounded-lg-plus` |
| extra-large | 28px | `rounded-xl` |
| extra-large-increased | 32px | `rounded-xl-plus` |
| extra-extra-large | 48px | `rounded-2xl` |
| full | pill | `rounded-full` |

Morphing shapes appear in exactly three places: the hero cluster, the avatar frame (cookie at rest, sunny on hover), and the loading indicator. Squircles via `corner-shape` where supported. Focus rings follow the shape.

### Motion

MD3 Expressive spring tokens (damping ratio, stiffness). Spatial springs may overshoot; effects springs never bounce.

| Scheme | Spatial fast | Spatial default | Spatial slow | Effects fast | Effects default | Effects slow |
|---|---|---|---|---|---|---|
| Expressive | 0.6 / 800 | 0.8 / 380 | 0.8 / 200 | 1 / 3800 | 1 / 1600 | 1 / 800 |
| Standard | 0.9 / 1400 | 0.9 / 700 | 0.9 / 300 | 1 / 3800 | 1 / 1600 | 1 / 800 |

- Every interaction animation is an interruptible spring.
- One shared reveal grammar for section content: short rise and fade, staggered in reading order, capped. CSS scroll-driven animations, feature-detected, no fallback (decorative).
- Compositor properties only: transform, opacity, clip-path.
- Reduced motion handled per component. Spatial motion becomes crossfades. The hero's ambient shapes get a visible pause control (WCAG 2.2.2). No global duration override.
- View transitions for the theme reveal and card-to-dialog morph, with focus moved to the dialog heading after. Grid filtering uses Motion layout animations.

### Layout

MD3 window size classes drive the page; container queries take over inside components.

| Class | Width | Tailwind variant | Navigation |
|---|---|---|---|
| Compact | under 600px | (base) | Top app bar |
| Medium | 600px+ | `medium:` | Top app bar |
| Expanded | 840px+ | `expanded:` | Navigation rail |
| Large | 1200px+ | `large:` | Rail with labels |
| Extra-large | 1600px+ | `xlarge:` | Rail with labels |

```
┌──────┬──────────────────────────────────────────────────────┐
│ rail │ SUJAY S N                          [shape cluster]   │ hero: name left and huge
│  ○   │ Full-stack engineer                 morphing, with   │
│  ○   │ ● ● ● ● ● [image]                   cursor parallax  │
│  ○   ├──────────────────────────────────────────────────────┤
│  ○   │ [avatar shape] │ About, 7 columns, ~65ch             │ about: 5/7 split
│      ├──────────────────────────────────────────────────────┤
│      │         constellation, edge to edge                  │ skills: full bleed
│      ├──────────────────────────────────────────────────────┤
│      │ 2024 ─┬─ Accenture                                   │ experience: a real sequence
│      │ 2021 ─┴─ Inube                                       │
│      ├──────────────────────────────────────────────────────┤
│      │ [filter chips]                                       │ projects: one featured,
│      │ ┌────────────────────┐ ┌─────────┐ ┌─────────┐       │ the rest smaller
│      │ │ featured project   │ │ project │ │ project │       │
│      │ └────────────────────┘ └─────────┘ └─────────┘       │
└──────┴──────────────────────────────────────────────────────┘
```

Everything is left-aligned. The project dialog is full screen on compact and two panes on expanded.

## Phases

### Day 1: Foundation

- [x] Fresh scaffold: Vite 8, React 19.3, TypeScript 6.0, Tailwind 4.3, Motion 14, Base UI, Zustand 5
- [x] React Compiler 1.0 through `@rolldown/plugin-babel`
- [x] Theme engine on the 2025 color spec, all nine variants, `light-dark()` output
- [x] Default theme baked into `index.html` at build time
- [x] Light, dark, and system with persistence and no flash on load
- [x] Tokens in `index.css`: color mapping, type scale, shape, breakpoints, easing, durations
- [x] Motion spring tokens
- [x] Display font subset; Material Symbols subset by `icon_names`
- [x] Real content ported to `src/content`
- [x] Contrast tests pass across seeds, variants, contrast levels, and modes (15,000+ checks, zero failures)
- [x] Typecheck, lint, test, and build all green; first commit
- [ ] Check Day 1 in a real browser: light, dark, system, seed switching, no flash on reload, keyboard focus
- [x] GitHub remote: github.com/sujay-sn/adaptive-artisan (deploying moves to launch, below)

### Day 2: Component library

Button (five variants), FAB, Icon Button, Card, Chip, Switch (expressive thumb with icon), Text Field, Dialog. State layers and spring press feedback on all of them. Navigation: top app bar, rail, sliding active pill, blur on scroll, one config. Shape-morph utility with normalized shapes.

### Day 3: Personalization Hub

FAB container transform. Hex input with swatch, wallpaper extraction (image in IndexedDB, seed in localStorage), variant picker, contrast slider, tonal palette viewer. Live preview of the real components. Font axis and icon axis playgrounds, motion scheme switch, sound toggle (off by default). Circular theme reveal. Everything persists.

### Day 4: Hero and About

The bloom. Morphing shape background with cursor and scroll parallax, plus its pause control. Headline axes animate on load; letters respond to cursor proximity on hover-capable devices. Physics press feedback on actions. Avatar in a morphing frame with breathing idle and spring hover. Working resume download.

### Day 5: Skills and Experience

Constellation with d3-force (edges come from skills used together in the same role or project, never hand-drawn), draggable nodes that spring back, hover and focus highlighting related skills and projects, keyboard navigation, chart view as the accessible alternative. Experience timeline with storytelling reveal.

### Day 6: Projects, Education, Contact, Footer

Rich cards with animated thumbnails, filter chips with layout animation, shared-element dialog, deep links per project. Education with coursework chips. Contact form with animated fields and a serverless backend plus spam protection. Footer with back to top.

### Day 7: Polish and ship

Web Audio sounds (opt-in). Scroll-driven reveals and section-title axis animation. Prerendered HTML, Open Graph, structured data. Accessibility, performance, and cross-browser passes. Lighthouse.

## Before launch

- [ ] Buy the domain
- [ ] Choose the host (Vercel, Netlify, or Cloudflare Pages) and connect the repo: build `npm run build`, output `dist`, Node 22
- [ ] Replace the placeholder resume link with the real Google Drive link and confirm it opens without a sign-in
- [ ] Point the domain at the host and set the canonical URL and Open Graph URLs to it

## Quality bar

- Signature moments hold 60fps at 4x CPU throttling.
- LCP under 2s on throttled 4G, CLS near zero, INP under 200ms, Lighthouse 95+ in all four categories.
- Initial JavaScript under about 150 KB gzipped. Hub, constellation, and audio load on demand.
- Playwright screenshots across window classes, light and dark, and three seeds. axe accessibility checks.
- Signature moments reviewed frame by frame at quarter speed.
- Hover effects only on hover-capable devices, 48px touch targets, state layers on everything interactive.

## Browser support policy

Baseline features are used freely. Newer features (`corner-shape`, scroll-driven animations, element-scoped view transitions) are feature-detected only, never polyfilled, and the page must read correctly without them.

## Content needed from Sujay

- [ ] Resume: Google Drive share link ("Anyone with the link", Viewer). A placeholder sits in `src/content/profile.ts` until launch
- [ ] Photo for the avatar
- [ ] Screenshots or short screen recordings of each project
- [ ] Repo links per project
- [x] Project numbers come from the resume; unverified ones removed
- [x] Graduation date: December 2026 (from the resume)
- [x] Experience follows the resume: GeodeChain, the TA role, Accenture
- [ ] Domain, bought before launch

## Decision log

- **Projects layout:** one featured project plus smaller cards, not a bento grid. Shape carries hierarchy.
- **Hero background:** morphing MD3 shapes, not a gradient mesh.
- **Default seed:** Lagoon, not Material's stock purple.
- **Particles dropped.** The idea said parallax or particles; parallax on the shapes is enough.
- **Footer decoration cut** ("Built with ♥ and ☕", dot-joined chip strings).
- **Phone number not published.** Email and LinkedIn only.
- **Content follows the resume.** No self-assessed skill levels; the chart view counts how many roles and projects use each skill. Inube and the old unverified project numbers are gone.
- **Font budget:** display cut pins GRAD to save 70 KB, so dark-mode compensation uses a small weight drop instead.
- **TypeScript pinned to 6.0.** 7.0 is out, but typescript-eslint supports only versions below 6.1.
- **Motion is v14**, two majors past the research done for this plan. Check its API before animation work.
- **Icons:** Material Symbols variable font rather than SVG, because the idea needs live FILL, wght, GRAD, and opsz control. Every icon is `aria-hidden` unless it carries a label.
- **material-color-utilities 0.4.0 ships extensionless ESM imports** that Node rejects. `scripts/fix-mcu-esm.mjs` adds the `.js` extensions on postinstall and becomes a no-op once upstream fixes it.
- **CSS target set explicitly** in `vite.config.ts`, because Vite's default target lowered `light-dark()` into a polyfill.
- **`NODE_ENV=production` is set globally on the dev machine**, which makes npm skip devDependencies. The project `.npmrc` sets `include=dev` as a workaround.

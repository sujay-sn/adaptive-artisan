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
- One shared reveal grammar for section content: a short rise and fade on springs, staggered in reading order, played once as each element comes into view. Time-based rather than scroll-linked, so it plays however you arrive. Content is hidden only after JavaScript starts. The timeline line is the one scroll-linked effect.
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
- [x] Checked in a browser on a 4K 32-inch monitor (about 2560px wide), a 16-inch laptop, and a phone-sized viewport: light, dark, seed switching, no flash on hard reload, skip link and keyboard focus
- [x] GitHub remote: github.com/sujay-sn/adaptive-artisan (deploying moves to launch, below)

### Day 2: Component library

- [x] Spring tokens as CSS `linear()` easings, generated from the MD3 values at build time
- [x] Button (five variants, two sizes), Icon Button (with toggle), FAB (three sizes, extended), Card (elevated, filled, outlined, tonal), Chips (static, assist, filter), Switch with icons, Text Field and Text Area (filled, outlined, validation), Dialog
- [x] State layers on every interactive component; Expressive shape morph on press
- [x] Navigation: sticky top app bar with a modal navigation sheet on compact and medium, rail on expanded and up, one sliding indicator, one config
- [x] Shape library: 13 shapes sampled at the same 144 points, so any two can morph
- [x] Cards on the page are filled (surface-container-highest) so they read in dark mode; container widens at extra-large
- [x] Component gallery at `/?gallery` in development
- [ ] Check in a browser: gallery and page on the 4K monitor, laptop, and phone; keyboard through the nav sheet and dialog; light and dark

### Day 3: Personalization Hub

- [x] FAB container transform into the hub (a shared-element view transition), from the rail or the bottom corner on small screens
- [x] Seed swatches, native color picker, and hex field
- [x] Colors from an image: Material's quantizer and scorer pick up to four seeds; a downscaled copy stays in IndexedDB
- [x] All nine scheme variants, and contrast at standard, medium, and high
- [x] Tonal palette viewer
- [x] Live preview of the real components
- [x] Type playground on the full Google Sans Flex, loaded only when the hub opens
- [x] Icon playground: fill, weight, grade, optical size
- [x] Motion scheme switch, with a plot of the spring and a demo
- [x] Sound effects (Web Audio), off by default
- [x] Circular reveal for every theme change, in the hub and the hero
- [x] Everything persists; the pre-paint script restores the motion scheme too
- [x] Checked in a browser

### Day 4: Hero and About

- [x] The bloom: first visits paint in monochrome, then color sweeps out from the shape cluster while the shapes and headline spring into place. Once per session, skipped under reduced motion, with a safety timer so the page never stays monochrome
- [x] Shape cluster: four MD3 shapes in theme colors, morphing and turning, with cursor parallax and scroll parallax
- [x] One pause control for all ambient motion, hero shapes and avatar alike (WCAG 2.2.2)
- [x] Headline letters respond to the cursor on their own weight, width, and roundness (fine pointers only)
- [x] Theme from an image straight from the hero, beside the swatches
- [x] Hero type grows to 15rem on large screens, and the cluster fills the right column
- [x] About: avatar in a morphing frame with breathing idle and spring hover, a monogram until a photo exists
- [x] Resume links use a document icon
- [x] Checked in a browser

### Day 5: Skills and Experience

- [x] Constellation on d3-force: categories anchor their skills, and lines join skills used together in a role or project, weighted by how often. Nothing is drawn by hand
- [x] Drag a node and it springs back; select one and the graph reorganizes around it
- [x] Hover or focus lights a skill's neighborhood; the detail panel shows where it was used and what with
- [x] "See projects" filters Projects to that skill and glides there; a selection also marks matching roles in Experience
- [x] Keyboard: one tab stop, arrow keys between nodes, Enter to select, Escape to clear
- [x] List view as the accessible alternative, and the default on small screens
- [x] Code-split: d3-force and the constellation load as the section nears the viewport
- [x] Experience timeline: the line draws itself, and each card's parts arrive in reading order as it scrolls in
- [x] Checked in a browser

### Day 6: Projects, Education, Contact, Footer

- [x] Project cards with covers: generated MD3 shape art that morphs on hover, replaced by a screenshot and a hover-played loop once a project has `media`
- [x] Filter chips (shared with the constellation's "See projects"), with Motion layout animations loaded after the page renders
- [x] Card-to-dialog container transform; a two-pane dialog whose content arrives in reading order
- [x] Deep links: `?project=id` opens a project, the back button closes it, and the dialog can share its link
- [x] Education as cards with coursework chips, revealed as they scroll in
- [x] Contact form: inline validation instead of browser bubbles, focus on the first field to fix, honeypot and time-trap spam checks, a morphing loading indicator, and a success state. Hands the message to the visitor's email app until a backend exists
- [x] Footer with contact links and back to top
- [ ] Check in a browser: filter, open and close a project (button, Esc, back), a deep link, the contact form, keyboard only

### Day 7: Polish and ship

Web Audio sounds (opt-in). Scroll-driven reveals and section-title axis animation. Prerendered HTML, Open Graph, structured data. Accessibility, performance, and cross-browser passes. Lighthouse.

- [x] Footer room on Boston time: the whole footer is the room, content on its wall, a real sky in the window, a wall clock, night dimming with lamp and TV light, and a phone crop around the current station
- [x] Full-body character who walks in from the door to the current station when the footer arrives, and on to the next one when a block changes
- [x] Desk pose (coursework and projects): seated and typing, code typing onto the monitor, coffee on the desk in the morning
- [x] Couch pose (gaming): seated with a controller, a platformer on a three-quarter TV, lit by its glow
- [x] Tea at the counter (mug in hand, cookies out), curls at the gym corner, asleep in bed (glasses off, blanket up, lamp off)
- [x] Section titles settle their font axes on arrival (light and condensed to resting weight and width), and every section's content reveals in reading order
- [x] Sound: section-jump cue on every navigation jump (never on scroll), and audio unlocked on the first gesture for Safari; theme, Hub, and contact cues were already in place
- [ ] Prerendered HTML, Open Graph, structured data
- [ ] Accessibility, performance, and cross-browser passes; Lighthouse

## Before launch

- [ ] Buy the domain
- [ ] Choose the host (Vercel, Netlify, or Cloudflare Pages) and connect the repo: build `npm run build`, output `dist`, Node 22
- [ ] Replace the placeholder resume link with the real Google Drive link and confirm it opens without a sign-in
- [ ] Point the domain at the host and set the canonical URL and Open Graph URLs to it
- [ ] Contact backend: a serverless function on the host with server-side validation and a spam check, then set `VITE_CONTACT_ENDPOINT`

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
- [ ] Screenshots or short screen recordings of each project (they go in `media` in `src/content/projects.ts`)
- [ ] Repo links per project
- [ ] Tag skills on roles and projects: about half the resume skills (Python, SQL, Git, Docker, and more) are not on any role or project yet, so they float off their category with no connections
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
- **Native `<dialog>` instead of Base UI's Dialog.** The browser provides the inert page, focus containment, top-layer stacking, Esc, and focus return. Base UI stays for components with no native equivalent, like sliders.
- **The switch is a native checkbox with `role="switch"`,** the same semantics the switch polyfill would add, without loading it.
- **Springs run in CSS.** MD3 spring tokens become `linear()` easings at build time, so components need no animation JavaScript.
- **Motion loads only where layout animation needs it.** Using it for the rail indicator pushed the bundle from 99 KB to 146 KB gzipped; a single CSS-sprung indicator does the same job.
- **The top app bar's scrolled tint uses a scroll-state container query** (Chromium today). Other browsers keep a solid surface, which is always legible.
- **Shapes are radial approximations** of the MD3 shape library, not exact ports, so every shape shares one point count and any two can morph.
- **Contrast is three choices, not a slider.** Standard, medium, and high are what Android offers and what the contrast tests cover.
- **Sound works now rather than at polish time.** A toggle that does nothing is worse than no toggle, and synthesized Web Audio cues are a few lines.
- **The hub is its own code chunk**, loaded on the first hover or focus of a FAB, so it costs nothing until someone reaches for it.
- **The bloom is a view transition**: the same circular reveal as a theme change, starting from the monochrome scheme. That costs one snapshot instead of animating 49 color properties.
- **One pause control** stops every ambient animation, as WCAG 2.2.2 requires for motion that runs longer than five seconds.
- **List view instead of a usage chart.** Counting uses would show zero beside about half the skills, Python included, which reflects missing tags rather than real experience.
- **"See projects" is a button, not an automatic jump.** Clicking a node selects it; scrolling the page away on every click would make the graph impossible to explore.
- **Experience cards have no hover state.** They are not interactive, and MD3 reserves state layers for things that respond to a click.
- **The constellation layout is measured, not eyeballed.** A headless test solves the layout at three widths and counts colliding labels; it fails if clutter creeps back. Below 1100px, skills used once show their labels only when lit.
- **One container transform for every dialog.** The hub and the project dialog share `src/lib/containerTransform.ts`; CSS names a dialog only during its own transform.
- **Motion's layout features load after first render.** Cards render as plain elements immediately, and the grid starts animating once the features arrive.
- **The contact form works before a backend exists.** Without `VITE_CONTACT_ENDPOINT`, it opens the visitor's email app with the message filled in.
- **Reveals are time-based, not scroll-linked.** Tied to scroll position, a reveal never played after a nav jump and finished within a few pixels on short elements. An IntersectionObserver now starts a spring transition on arrival, which also works in Firefox.
- **Scroll-driven keyframes name both ends when the property can't interpolate with its default.** A clip that only set `from` ended at `clip-path: none`, which a shape can't blend into, so the timeline line snapped in halfway instead of drawing.
- **Education is rows, not a card grid.** A shape medallion holds the GPA, and the degree in progress carries a wavy progress bar computed from its start and end months, so it turns into a completed row on its own after graduation.
- **Finished degrees use secondary, not tertiary.** The 2025 color spec makes tertiary-container a bright accent in dark mode, which let the finished degree outshine the current one.
- **The footer character is built from the site's shapes, not an ink library.** A line-art library was considered and set aside: its hand-inked strokes and its own color model would have been a second visual language beside the MD3 shapes.
- **Only the person has fixed colors.** Skin, hair, and glasses describe Sujay, so they ignore the theme; the hoodie, room, and props all follow it.
- **Colors that must stay light pick a role per scheme.** Surface roles go near-black in dark mode and fixed roles match pale skies in light mode, so the window's cloud uses `light-dark()` to choose between them.
- **The footer is the room, and text never sits on furniture.** Content gets its own band of wall; the room rises into it only by its empty top strip, and the bar floats on a strip of floor in front of everything.
- **Night dims the room, not the wall behind the text.** The dimming fades in from the room's top, so the content keeps full contrast while lamp and TV light glow above it.
- **The window's sky uses natural colors, not the theme.** It shows Boston's actual sky, which is still daylight when someone browses in dark mode.
- **The walk is keyframed joints, not a library.** Each limb pivots at its own joint, legs spend 60% of the cycle planted, and travel speed matches the stride; the Web Animations API sequences walk then stop and pans the phone crop through a registered --cam property.
- **The furniture is sized to the character, not the other way round.** Seated, his knees meet the seat, his elbows the desk top, and his eyes the monitor; the first desk had him climbing onto the chair.
- **Section titles animate their axes once, on arrival, not with scroll.** Scrubbing font axes re-lays out the heading on every scroll frame and makes it wobble while it is being read.
- **Dynamic lists reveal by their wrapper.** The project grid mounts and unmounts cards when filtering, so the wrapper reveals once and the cards keep Motion's filter animation; a card mounted after the reveal ran would never be shown.

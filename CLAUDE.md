# Working on this repo

Read `PLAN.md` first. It is the locked plan; `idea.txt` (in the Claude project) lists the features.

## Commands

- `npm run dev` / `npm run build` / `npm run preview`
- `npm test` runs Vitest, `npm run typecheck`, `npm run lint`
- `npm run fonts` rebuilds the display font subset in `public/fonts`

The dev machine has `NODE_ENV=production` set globally. `.npmrc` forces devDependencies to install; if a tool misbehaves, clear `NODE_ENV` for the shell first.

## Rules

- **Tokens only.** Colors come from MD3 roles (`bg-surface-container`, `text-on-primary`). The default Tailwind palette, font scale, radii, and breakpoints are cleared on purpose. Never hardcode a color except a seed swatch.
- **One theme engine.** `src/theme/engine.ts` is pure and runs in Node and the browser. The build plugin and the app both use it. Do not duplicate palette logic.
- **Weight through `font-weight`, width through `font-stretch`.** Only ROND and GRAD go in `font-variation-settings`.
- **Motion uses `src/motion/tokens.ts`.** Spatial springs may overshoot, effects springs never do. Animate transform, opacity, and clip-path only. Handle reduced motion per component; never add a global duration override.
- **Icons** must be listed in `src/ui/icons.ts` before use. Decorative icons stay `aria-hidden`.
- **No fake progress.** Never add artificial delays or simulated loading.
- **Content lives in `src/content` and follows the resume.** Every number on the site must also appear on the resume. No self-assessed skill levels.
- **Browser support:** Baseline features freely. Newer features are feature-detected, never polyfilled, and the page must read correctly without them.
- Typecheck, lint, and tests must pass before a commit.

## Commits

- Professional, descriptive messages in the imperative mood: "Add theme engine", "Fix outline contrast in dark mode".
- Never reference planning terms in commit messages: no "day", "phase", "plan", "step", "v1", or similar. Planning structure lives in `PLAN.md` only.
- Subject line under about 72 characters. Add a body when the what or why needs explaining.
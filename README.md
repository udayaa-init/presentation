# CVA6 Optimization — Thesis Defence Deck

A full-screen, keyboard/scroll-navigable presentation built from the thesis
PDF, recreated as a React + TypeScript + Tailwind + shadcn/ui app in the
light navy/gold aesthetic of the cover slide.

## Stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, no separate config file needed)
- **shadcn/ui** primitives (`src/components/ui`) + `class-variance-authority` / `tailwind-merge`
- **lucide-react** for icons
- Self-hosted **Inter** + **JetBrains Mono** (via `@fontsource`, Latin subset only) — no external font CDN, so the build works fully offline

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

## Navigating the deck

- **Scroll / mouse wheel** — one slide (or diagram stage) per scroll
- **Arrow keys** (← → ↑ ↓), **Space**, **Page Up/Down** — same
- **Home / End** — jump to first/last slide
- **Right-hand dot rail** — click any dot to jump straight to that slide
- Touch swipe (up/down) also works on touch screens

## How the deck is structured

Everything lives under `src/deck/`:

- **`slides.ts`** — the deck, in order. This array *is* the running order;
  reorder the presentation by reordering this list.
- **`slides/*.tsx`** — one component per slide, built from `SplitLayout`
  (text left, visual right) and the shared text primitives in
  `Primitives.tsx` (`Eyebrow`, `SlideTitle`, `BulletList`, `DashList`, etc.)
- **`diagrams/*.tsx`** — the recreated architecture/FSM diagrams.
- **`DeckShell.tsx`** / **`useDeck.ts`** — the navigation engine (keyboard,
  wheel, touch, slide transform, progress rail).

### Staged diagram reveal

Some diagrams build up over multiple keypresses instead of appearing all at
once (the CVA6 pipeline, the Analysis and Scoreboard/ROB datapaths, the
Controller FSM graph). This is driven by one number per slide:

```ts
{ id: 'background', section: '…', Component: Background, stageCount: BACKGROUND_STAGE_COUNT }
```

Pressing "next" advances the stage first; only after the last stage does it
move to the next slide (and reverse on "previous"). Each diagram component
receives the current `stage` as a prop and decides what to show — e.g.
`src/deck/diagrams/CVA6ArchitectureCanvas.tsx` is a `<canvas>`-based
recreation of the CVA6 block diagram that fades in one element (a box, an
arrow, the internal/external bus, …) per stage, with a small spring-style
animation on each keypress. Not every diagram stages — the Fetchflare slide
instead renders both FSMs (original and modified) fully, side by side, as a
direct before/after comparison (`src/deck/diagrams/FetchflareStateCanvas.tsx`,
`variant="original" | "modified"`).

**To reorder or extend a stage sequence**, edit the array/conditions inside
that diagram component — the deck shell doesn't know or care what's inside
a stage, only how many there are.

## Content fidelity

All slide text is taken verbatim from the source thesis-defence PDF. Two
deliberate, called-out exceptions:

- The cover slide uses the fully-completed text (names, dates, examiner/supervisor)
  from the provided design reference image, since the PDF's own cover was a
  placeholder ("Contains date, title, …").
- "Results: Data Prefetching Performance" had no body content in the source
  PDF — it's filled with the one matching statistic that already exists
  verbatim on the Conclusion slide (18.3% cache-miss improvement) rather than
  left blank or invented.

All diagrams (pipeline, scoreboard/ROB datapath, controller FSM, Fetchflare
FSM) are redrawn as crisp canvas/SVG components rather than embedded
screenshots, so they scale cleanly and support stage-by-stage reveal. The
RPTU / PlanV / EIS marks on the cover are the real logo files, at
`src/assets/logos/` — swap them for updated artwork by replacing those PNGs
(same filenames) or editing the imports in `src/deck/Logos.tsx`.

## Building for production

```bash
npm run build
```

This produces a fully static `dist/` folder (plain HTML + CSS + JS, relative
asset paths via `base: './'` in `vite.config.ts`) — no build step or server
needed to *run* it afterwards. Serve it with any static file server:

```bash
npx serve dist
# or
python3 -m http.server -p 8080 -d dist
```

(Double-clicking `dist/index.html` directly from the filesystem mostly works,
but some browsers — Chrome in particular — block ES module script loading
over the bare `file://` protocol, so a one-line static server as above is
the reliable way to view the built output.)

## Deploying

Any static host works since this is a plain static build.

**Vercel**
```bash
npm i -g vercel
vercel --prod
```
(Framework preset: Vite. Build command `npm run build`, output directory `dist`.)

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages**
1. `npm run build`
2. Push the contents of `dist/` to a `gh-pages` branch (e.g. via the
   `gh-pages` npm package, or a GitHub Actions workflow that runs
   `npm run build` and uploads `dist/` as a Pages artifact).

**Any other static host** (S3 + CloudFront, Cloudflare Pages, Firebase
Hosting, nginx, etc.) — just upload the contents of `dist/`.

## Project layout

```
src/
  deck/
    types.ts            slide definition type
    slides.ts            the deck order (edit this to reorder slides)
    useDeck.ts            keyboard/wheel/touch navigation hook
    DeckShell.tsx         full-screen shell, progress rail, stage dots
    Primitives.tsx         SplitLayout, Eyebrow, BulletList, DashList, …
    DataTable.tsx          shared results-table component
    StatCard.tsx          stat callouts (Conclusion, prefetch results)
    ConfigLegend.tsx        A–F config legend used on the Results slides
    Logos.tsx              stylized RPTU / PlanV / EIS marks
    Decor.tsx              quiet right-column accent for text-only slides
    slides/*.tsx          one file per slide
    diagrams/*.tsx          pipeline / scoreboard / controller / fetchflare diagrams
  components/ui/          shadcn/ui primitives (button, badge)
  lib/utils.ts            cn() helper
```

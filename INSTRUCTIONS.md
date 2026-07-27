# LICTD Systems Hub — Build Instructions

## 1. Overview

A single-page, scroll-jacked landing site for the Lantapan ICT Division (LICTD).
Purpose: index all LGU apps/systems with live status, and route to per-app stat dashboards.
Aesthetic: futuristic, dark navy, glass/glow, precise motion — not generic "AI dark mode."

No native scrollbar behavior. Scroll input is intercepted and mapped to a single
progress value (0 → 1) that drives ALL animation across 5 fixed stages. This is a
**scroll-jacked, pinned-canvas experience** (Apple product-page pattern), not normal
document scroll.

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Animation | Framer Motion (`useScroll`, `useTransform`, `useSpring`) |
| Scroll control | Custom scroll-jack hook (`react-use-gesture` or raw `wheel`/`touch` listener) + Lenis (optional, for inertia smoothing) |
| 3D transforms | CSS `transform-style: preserve-3d` + `perspective` on a wrapping container (no need for react-three-fiber — pure CSS/DOM 3D is enough here) |
| Styling | Tailwind CSS + CSS variables for the token system |
| Data | Static `apps.json` (git-managed, per earlier decision) + per-app live stat fetch |
| Deploy | Same pattern as other LICTD apps (Vercel or existing VPS) |

**Why no Three.js/WebGL:** the described motion (scale, translate, rotate, card flip/deal)
is fully achievable with CSS 3D transforms + Framer Motion. Adding a WebGL layer would
be over-engineering for this brief and hurts load time on LGU office connections.

---

## 3. Design Token System

**Color**
- `--bg-void: #060B18` — base background, near-black navy
- `--bg-gradient-start: #0A1128`
- `--bg-gradient-end: #050810`
- `--accent-cyan: #4FD8E8` — primary glow/accent (ring, links, active states)
- `--accent-gold: #E8C468` — reserved for LGU seal / heritage section only
- `--ink-100: #F4F7FF` — primary text
- `--ink-400: #7C8AAE` — secondary text / labels

**Type**
- Display: `Space Grotesk` or `Sora` (geometric, technical, futuristic without being a cliché sci-fi font)
- Body: `Inter`
- Data/mono (stat numbers, status codes): `JetBrains Mono`

**Layout**
- Full-bleed, `100vw` × `100vh` pinned stage. No max-width container.
- Grid used only inside cards, not for page layout.

**Signature element**
- The rotating ring itself is the signature — it never fully disappears once introduced;
  it persists (miniaturized, top-center) as a constant "system is alive" indicator through
  the rest of the experience, subtly rotating even during card/team/seal stages.

---

## 4. Scroll Architecture

```
[Sticky/Fixed viewport container, height: 100vh, overflow: hidden]
  └─ [Pinned stage: position fixed, transforms driven by scrollProgress]
[Scroll-track element: height = N × 100vh, invisible, just to generate scroll distance]
```

- Total scroll track height: `500vh` (5 stages × 100vh each — tune by feel, not literal).
- `scrollProgress` = `scrollY / trackHeight`, clamped 0–1.
- Map `scrollProgress` into 5 named ranges (see Section 5). Use `useTransform` with
  explicit input/output ranges per range, e.g. stage 2 owns `[0.15, 0.35]`.
- Each stage's internal animations are driven by re-mapping the *global* progress into
  a local 0–1 for that stage only (`useTransform(scrollYProgress, [stageStart, stageEnd], [0, 1])`).
- Scrolling up must exactly reverse — this falls out naturally if all animation is a
  pure function of `scrollProgress` (no independent triggers, no `useEffect` one-shots
  for anything visual — everything is derived state).
- Reduced-motion: if `prefers-reduced-motion`, disable the ring's continuous rotation
  and card "deal" stagger; use simple opacity fades between stages instead. Still respect
  scroll-jacking but with instant/short transitions.

---

## 5. Stage-by-Stage Animation Spec

### Stage 0 — Logo Intro (`progress 0 → 0.05`)
- Background: `--bg-void`, radial gradient from `--bg-gradient-start` center to
  `--bg-gradient-end` edges.
- LICTD logo (inner + ring, two separate layers) fades in + scales from `0.85 → 1`,
  centered viewport, over ~800ms on load (NOT scroll-driven — this is the one
  load-triggered animation; everything after is scroll-driven).
- Ring starts a slow idle rotation (`360deg / 40s`, linear, infinite) immediately, layered
  independently from the inner logo (inner logo does NOT rotate, ever).

### Stage 1 — Logo Dock (`progress 0.05 → 0.20`)
- Ring rotation speeds up slightly and becomes tied to scroll delta (rotation angle =
  base idle rotation + `scrollProgress × 900deg`) so it visibly spins faster as user scrolls.
- Both inner logo + ring group: `scale 1 → 0.35`, `translateY: 0 → -42vh` (viewport center
  to top-center, ~64px from top), interpolated directly off local stage progress.
- Add subtle `translateZ` push (e.g. `0 → -200px` then back to `0`) for a 3D "recede then
  settle" feel — use `perspective: 1200px` on parent.
- At `progress = 0.20` the logo group is pinned at top-center, small, and this exact
  transform state is now the "resting dock state" for the rest of the page.

### Stage 2 — App Cards Deal (`progress 0.20 → 0.55`)
- Ring keeps rotating continuously (idle speed resumes, no longer scroll-coupled) —
  constant motion signals "live system," independent variable from here on.
- Cards enter **one at a time**, dealt like a casino card flip:
  - Each card's local trigger window = `(0.20 + i × step, 0.20 + i × step + step)` where
    `step = 0.35 / N` (N = number of apps).
  - Entry transform per card: start `rotateY: -110deg`, `translateX: -60vw`,
    `translateZ: -400px`, `opacity: 0` → end `rotateY: 0deg`, `translateX: 0`,
    `translateZ: 0`, `opacity: 1`. This reads as "dealt in sideways from off-screen,
    flipping face-up," matching the casino-deal request.
  - Cards land in a horizontal row (desktop) / stacked (mobile), NOT overlapping —
    each keeps its final resting `translateX` slot as previous cards finish.
  - Use `perspective: 1500px` on the card row container for the flip to read in 3D.
- Card content: app name, status badge (`active` cyan / `maintenance` amber /
  `deprecated` gray), short description, link icon if public. Click → navigate to
  `/apps/[slug]`.
- Cards remain visible/settled once dealt (no exit) while user continues scrolling
  within this stage — only new cards keep entering until all N are dealt.

### Stage 3 — Team (`progress 0.55 → 0.75`)
- Previous stage's cards: on entering this stage, fade + scale down slightly
  (`opacity 1 → 0.15`, `scale 1 → 0.92`) and push back in Z — they recede but don't
  fully vanish, keeping depth continuity (optional but recommended for the "3D stack"
  feel — skip if it reads cluttered, test both).
- Team cards (3 total: Municipal Administrator, 2 developers) appear **together**, not
  staggered — same card visual language as app cards (consistent component), but:
  - All 3 animate in simultaneously: `opacity 0→1`, `translateY: 40px→0`,
    `scale: 0.9→1`, no rotateY flip (distinguishes "people" from "systems" visually —
    systems flip in, people rise in).
  - Content per card: photo (placeholder circle avatar for now), name, role.

### Stage 4 — Seal & Heritage (`progress 0.75 → 1.0`)
- Team cards recede (same fade/scale-back treatment as stage 2→3 transition).
- LGU seal fades/scales in center, then "I ♥ Lantapan" logo settles beside/below it.
- Background gradient shifts subtly toward `--accent-gold` undertone here only (the one
  place gold appears) to mark this as the closing/heritage beat, distinct from the
  cyan-tech feel of the rest of the page.
- This is the terminal state — scrolling past `progress = 1.0` does nothing further
  (clamp, don't loop).

---

## 6. Component Structure

```
/app
  /page.tsx                 — mounts <ScrollExperience />
  /apps/[slug]/page.tsx      — per-app dashboard (stats), separate route, normal scroll
/components
  /scroll-experience
    ScrollExperience.tsx     — owns scroll track + useScroll + stage orchestration
    LogoRing.tsx              — inner logo + ring, handles idle/coupled rotation modes
    AppCardDeal.tsx           — renders N <AppCard> with per-index stagger windows
    AppCard.tsx               — shared with /apps index if needed
    TeamSection.tsx
    HeritageSection.tsx
  /ui
    StatusBadge.tsx
/lib
  apps.ts                    — reads apps.json, typed
  scroll-map.ts               — helper: mapRange(progress, stageStart, stageEnd) → local 0-1
/data
  apps.json                   — git-managed source of truth (per prior decision)
```

---

## 7. Assets Needed (to be uploaded)

| Asset | Format | Notes |
|---|---|---|
| LICTD inner logo | SVG or transparent PNG | separate file from ring |
| LICTD ring | SVG or transparent PNG | must be isolatable for independent rotation |
| LGU seal | SVG or transparent PNG | |
| I ♥ Lantapan logo | SVG or transparent PNG | |
| Team photos | JPG/PNG | placeholder circles until provided |

---

## 8. Per-App Dashboard Route (`/apps/[slug]`)

- Separate normal-scroll page (not scroll-jacked — dashboards need real scroll + read-only
  data tables/charts).
- Pulls live stats per the earlier architecture decision: direct DB read for
  internal systems, API fetch for externally hosted/public ones.
- Charts via Recharts. Layout: stat cards row + 1–2 charts, matching same dark/cyan
  token system for visual continuity with the landing page.

---

## 9. Build Order

1. Static `apps.json` + `AppCard` + `StatusBadge` (no animation yet — validate content).
2. `ScrollExperience` shell: scroll track, `useScroll`, stage range mapping, one dummy
   box moving to prove the pinned-container + progress math works.
3. Logo intro + dock (Stage 0–1).
4. Card deal (Stage 2) — hardest part, build with 2 cards first, then generalize to N.
5. Team stage (Stage 3).
6. Heritage stage (Stage 4).
7. Reduced-motion fallback + mobile pass (stack cards vertically, reduce translateZ
   depth so it doesn't clip).
8. `/apps/[slug]` dashboard pages.

---

## 10. Open Items / To Confirm Later

- [ ] Upload logo/seal/heritage assets
- [ ] Confirm exact number of apps at launch (determines card timing math)
- [ ] Team member names/roles/photos
- [ ] Mobile behavior for scroll-jacking (touch scroll-jacking is harder to get right —
      may fall back to simpler fade-stage transitions on mobile instead of full 3D)

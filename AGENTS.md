# agents.md — F1 Track Spinner Web App

A collaboration plan for an automated code agent ("Codex") to implement the **F1 Track Spinner** web app. This file defines scope, UX, data schema, tasks, milestones, test plan, and acceptance criteria so the agent can work end‑to‑end with minimal human intervention.

---

## 0) TL;DR

* Build a small React + Vite app styled with Tailwind that displays an **F1‑style spinning wheel** of tracks.
* **Google Sheets** is the backing store for the track list and their "raced" status; any track row that has a non‑empty **Details** cell is **excluded** from the draw.
* The wheel looks like a **Pirelli soft tyre** (red band), with a center hub.
* Press an **F1‑themed Spin button** → wheel spins with easing → **random track** selected → **confetti**.
* Persist and show the selected track prominently.
* Then reveal a **“Go to Weather Picks”** button.
* **Weather Picks**: three **spinning tyres** with a **cycling rainbow band**; each stops in order L→R on one of the 5 compounds (duplicates allowed): **Soft (red), Medium (yellow), Hard (white), Intermediate (green), Wet (blue)**.
* Background shows **rotating funny quotes & F1 memes** (tasteful, non‑copyrighted snippets), with subtle parallax.

---

## 1) Tech Stack & Project Structure

**Framework**: React 18 + Vite

**Styling**: Tailwind CSS (+ CSS variables for theme). Optional: shadcn/ui primitives if needed.

**Animation**: CSS keyframes + requestAnimationFrame; confetti via `canvas-confetti`.

**Data**: Google Sheets API (read‑only). Public read is okay if the sheet is published; otherwise use an API route (serverless) to keep credentials private.

**State**: Minimal local state via React hooks + a small Zustand store (optional), or pure useState + useReducer.

**Best Practices Reference**: Whenever implementing components, animations, or API calls, **consult official documentation and reputable online best‑practice guides** (React, Tailwind, accessibility, Google Sheets API). For creative filler content (e.g., F1 memes/quotes), search Google and community sites for inspiration beyond the safe placeholders listed here.

**Directory layout**

```
/ (repo root)
  vite.config.ts
  index.html
  /src
    /assets
    /components
      SpinnerWheel.tsx
      SpinButton.tsx
      SelectedTrackCard.tsx
      ConfettiLayer.tsx
      WeatherPicker.tsx
      TyreReel.tsx
      MemeBackdrop.tsx
    /lib
      googleSheets.ts
      random.ts
      easing.ts
      constants.ts
    /pages
      Home.tsx
      Weather.tsx
    /store (optional)
      useAppStore.ts
    main.tsx
    App.tsx
  /server (optional, if using serverless/proxy)
    sheetsProxy.ts
  /public
  .env (local only)
  .env.example
  tailwind.config.ts
  postcss.config.js
  package.json
  README.md
```

---

## 2) Google Sheets Backing Store

**Sheet columns (first row headers):**

* **Track** (string) — official 2021 F1 track/race name.
* **Details** (string) — if non‑empty, that track is considered **already raced** and should be **excluded**.
* (Optional) **Emoji** or **Notes** columns won’t affect filtering.

**Filter rule:** exclude any row where `Details.trim().length > 0`.

**Required ENV** (if accessing private sheet via service account):

```
VITE_SHEETS_DOC_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_SHEETS_RANGE="Tracks!A:B"
SHEETS_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

For a public/published sheet, client‑side fetch to the published CSV/JSON is acceptable. Prefer a serverless proxy if keys are required.

**Data fetching API**

* `GET /api/tracks` → `[{ track: string, details?: string }]` already filtered to **only un‑raced**.
* Implement either as a Vite dev proxy to `/server/sheetsProxy.ts` or deploy as a serverless function.

---

## 3) F1 2021 Calendar (Base Dataset)

The app should ship with this fallback list in case the sheet is empty/unavailable. Use these exact labels:

1. **Bahrain International Circuit (Bahrain GP)**
2. **Autodromo Enzo e Dino Ferrari – Imola (Emilia Romagna GP)**
3. **Autódromo Internacional do Algarve – Portimão (Portuguese GP)**
4. **Circuit de Barcelona‑Catalunya (Spanish GP)**
5. **Circuit de Monaco (Monaco GP)**
6. **Baku City Circuit (Azerbaijan GP)**
7. **Circuit Paul Ricard (French GP)**
8. **Red Bull Ring – Spielberg (Styrian GP)**
9. **Red Bull Ring – Spielberg (Austrian GP)**
10. **Silverstone Circuit (British GP)**
11. **Hungaroring (Hungarian GP)**
12. **Circuit de Spa‑Francorchamps (Belgian GP)**
13. **Circuit Zandvoort (Dutch GP)**
14. **Monza – Autodromo Nazionale (Italian GP)**
15. **Sochi Autodrom (Russian GP)**
16. **Intercity Istanbul Park (Turkish GP)**
17. **Circuit of the Americas – COTA (United States GP)**
18. **Autódromo Hermanos Rodríguez (Mexico City GP)**
19. **Interlagos – Autódromo José Carlos Pace (São Paulo GP)**
20. **Losail International Circuit (Qatar GP)**
21. **Jeddah Corniche Circuit (Saudi Arabian GP)**
22. **Yas Marina Circuit (Abu Dhabi GP)**

---

## 4) UX & Interaction Flow

### A) Home / Spinner

* **Backdrop**: `MemeBackdrop` shows rolling F1 quotes/memes in low‑contrast, parallax scroll, subtle blur.
* **Wheel**: `SpinnerWheel` renders a **tyre‑like wheel** (SVG or Canvas):

  * Outer **tread** is dark.
  * **Red Pirelli soft band** around the sidewall.
  * Evenly spaced **segment labels** with track names on the inner ring.
  * **Center hub** with F1‑styled spinner cap.
* **Spin Button**: `SpinButton` styled like an F1 **ERS/OVERTAKE** button.
* **Spin Behavior**:

  * Disable the button during spin.
  * Random target index chosen via **secure RNG** fallback: `crypto.getRandomValues` → `Math.random` fallback.
  * Animate with **ease‑out cubic** over 4–7s, 4–8 full rotations + offset to target.
  * **Confetti**: fire a burst at settle (using `canvas-confetti`).
* **Result**:

  * `SelectedTrackCard` appears/fades in, sticky at top/right.
  * Reveal **“Choose Weather”** button after confetti settles (e.g., 1.5s delay).

### B) Weather Picks Screen

* Title: “**Weather Choices**”.
* Instructions: “Tyres will stop left → right.”
* Three instances of `TyreReel`:

  * Each shows a spinning tyre with a **cycling rainbow band** overlay on the sidewall.
  * On start, all spin; then **stop in order** left, center, right — each resolves to a random compound from:

    * **Soft (Red)**, **Medium (Yellow)**, **Hard (White)**, **Intermediate (Green)**, **Wet (Blue)**
  * Duplicates allowed.
* Save the three results in state and display a small legend underneath.

### C) Persistent State

* Keep the **selected track** in memory (and `localStorage`) so refreshes still show the pick until a new spin.

---

## 5) Visual & Motion Spec

* **Colour tokens**

  * `--tyre-tread:#0a0a0a`, `--tyre-rim:#1a1a1a`
  * Compounds: Red, Yellow, White, Green, Blue (exact shades in `constants.ts`).
* **Wheel**

  * Implement as **SVG** (easier text on arcs) with a mask for the coloured band.
  * Segment labels curve along the inner circle; ensure legibility via arc‑text or place labels radially with collision avoidance.
* **Spin easing**: cubic‑bezier(0.15, 0.85, 0.2, 1) or programmatic easeOutCubic.
* **Confetti**: 120–240 particles, 30° spread, 0.8 scalar, 2–3 bursts.
* **Rainbow band animation** (weather screen): animated gradient background, hue‑rotate filter, or shader in canvas; slows and locks to final colour.
* **Accessibility**: focus ring styles, button ARIA, prefers‑reduced‑motion support (skip spinning/flash, switch to instant results).

---

## 6) Components (API contracts)

### `<SpinnerWheel />`

**Props**

* `segments: { id: string; label: string }[]`
* `selectedId?: string` (to render a small pointer/marker)
* `onSettled?: (segment: { id:string; label:string }) => void`
* `spinning: boolean`

**Methods via ref (optional)**

* `spinTo(index: number, opts?: { rotations?: number; durationMs?: number })`

### `<SpinButton />`

* ARIA: `aria-pressed`, loading state.

### `<SelectedTrackCard />`

* Shows the chosen track; includes a "Respin" action.

### `<ConfettiLayer />`

* Mounts a full‑screen canvas, exposes `burst()`.

### `<WeatherPicker />`

* Orchestrates three `<TyreReel />` children, left→right stopping sequence.

### `<TyreReel />`

**Emits** final compound `{ name: 'Soft'|'Medium'|'Hard'|'Intermediate'|'Wet', color: string }`.

### `<MemeBackdrop />`

* Cycles background quotations with slow parallax and low opacity.

---

## 7) Logic Details

**Random selection**

```ts
export function secureRandomInt(maxExclusive: number): number {
  if (window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % maxExclusive;
  }
  return Math.floor(Math.random() * maxExclusive);
}
```

**Spin math**

* Wheel uses degrees where **0°** aligns with a **fixed pointer** at top.
* For `n` segments and target index `k`, the center of segment `k` is at `θ = 360 * (k / n) + segmentOffset`.
* Total rotation = `baseRotations*360 + (360 - θ)` so the pointer lands on the chosen segment.

**Weather reel**

* Each reel spins independently; stop on timers (e.g., 2.0s, 3.0s, 4.0s) with ease‑out.

---

## 8) Google Sheets Integration

**Option A (Public Sheet)**

1. File → Share → Publish to web → as CSV.
2. Fetch CSV with `fetch(publishedCsvUrl)` and parse.
3. Filter out rows with non‑empty `Details`.

**Option B (Private Sheet via proxy)**

1. Create a Google Cloud project, enable Sheets API.
2. Create a **Service Account**; share the Sheet with that account (read‑only).
3. Put credentials in server env only; implement `/api/tracks` in `server/sheetsProxy.ts` with `googleapis`.
4. Vite dev proxy routes `/api/*` to that server.

**Caching**

* Cache for 60s to reduce API calls.

---

## 9) Non‑functional Requirements

* **Performance**: 60 FPS animations on mid‑range laptops; lazy‑render heavy SVG text.
* **Resilience**: If sheet fails, fall back to built‑in 2021 list.
* **A11y**: Keyboard activation for Spin; readable labels; reduced motion support.
* **Mobile**: Responsive layout; wheel scales down to 320px width.
* **Theming**: Dark theme default.

---

## 10) Sample Memes/Quotes (safe/useful placeholders)

* “Box, box.”
* “Leave me alone, I know what I’m doing.”
* “Is that Glock?”
* “Multi‑21, Seb.”
* “Valtteri, it’s James.”
* “Plan A. Plan B. Plan C.”
* “My tyres are gone!”

Render these as faint, rotated snippets in the background. The agent should also **search Google and F1 fan communities for additional non‑copyrighted funny quotes and memes** to enrich the backdrop dynamically, beyond these placeholders.

---

## 11) Tasks for the Agent

1. **Scaffold** Vite + React + Tailwind; add `canvas-confetti`.
2. **Implement** components listed in §6 with props above.
3. **Create** `lib/googleSheets.ts` with Option A (CSV) first; feature‑flag Option B.
4. **Build** the wheel SVG with segment labels; verify rotation math + pointer alignment.
5. **Wire** Spin button → RNG → animation → confetti → show `SelectedTrackCard`.
6. **Persist** selected track to `localStorage`.
7. **Route** to Weather screen; implement 3 `TyreReel`s with rainbow cycling and ordered stops.
8. **Backdrop** parallax quotes; add prefers‑reduced‑motion media query.
9. **Add** fallback dataset (§3) + filter logic.
10. **Write** unit tests for `random.ts` and `easing.ts`; add a visual regression storybook entry (optional).

---

## 12) Milestones

* **M1**: Wheel renders from fallback list; spins and lands deterministically (mock RNG).
* **M2**: Sheets fetch with filtering; confetti and selection card; persist.
* **M3**: Weather picks with ordered stops and duplicates support.
* **M4**: Backdrop memes + accessibility polish + mobile testing.

---

## 13) Acceptance Criteria

* Wheel looks like an **F1 tyre** (clear red soft band, center hub) and labels are readable.
* Tracks sourced from Google Sheets and **exclude** any with non‑empty **Details**.
* Pressing **Spin** triggers an animated spin, ends on a random track, and fires visible **confetti**.
* The **selected track** remains visible on screen and persists on refresh.
* A button appears post‑confetti: **“Choose Weather”** navigating to Weather screen.
* Weather screen shows **3 tyres spinning**, each **stops L→R** on a random compound from the 5, **duplicates allowed**.
* Background shows **rotating quotes/memes** tastefully and unobtrusively.
* Works on mobile and desktop; respects reduced‑motion.

---

## 14) Commands

```
# Dev
pnpm i
pnpm dev

# Lint/Test
pnpm lint
pnpm test

# Build
pnpm build
pnpm preview
```

---

## 15) Future Enhancements (Backlog)

* Write back to the Sheet: append the result (date, track) automatically.
* Admin toggle to mark a track as "raced".
* Shareable result card (image export) with the chosen track and tyres.
* Sound effects (start lights, crowd cheer) with a mute toggle.
* Theming: 2021 vs 2024 tyre branding.
* i18n.

---

## 16) Security & Privacy

* If using credentials, keep them **server‑side**; never ship private keys to the client.
* Avoid tracking; store only ephemeral UI state in `localStorage`.

---

## 17) Definition of Done

* All acceptance criteria met.
* README updated with env setup and Sheet link instructions.
* Lighthouse performance > 85 on mobile.
* Basic unit tests pass; manual QA list checked.


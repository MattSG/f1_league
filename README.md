# F1 League

Small React + Vite + Tailwind app for the F1 League that displays an F1‑style spinning wheel of tracks and a weather picker. This implementation ships with a fallback 2021 track list and omits Google Sheets integration by design.

Highlights:
- Bigger wedge-based spinner with labels on segments, PIRELLI band + hub.
- Centered multi-burst confetti celebration.
- Meme/quote backdrop with parallax, dark F1 theme.
- Track Selection page (instead of “Home”).
- Weather selector uses Dry (red), Wet (green), Very Wet (blue) tyres. PIRELLI sidewall text on all tyres.

## Scripts

- Dev: `pnpm i && pnpm dev`
- Test: `pnpm test`
- Build: `pnpm build` then `pnpm preview`

## Structure

- `src/components/SpinnerWheel.tsx` — SVG tyre‑like wheel with labels and spin animation.
- `src/components/SpinButton.tsx` — F1‑style action button.
- `src/components/SelectedTrackCard.tsx` — shows chosen track, with Respin.
- `src/components/ConfettiLayer.tsx` — canvas confetti bursts on settle.
- `src/components/MemeBackdrop.tsx` — rotating quotes with subtle parallax.
- `src/components/WeatherPicker.tsx`, `src/components/TyreReel.tsx` — three spinning tyres stop L→R on Dry/Wet/Very Wet.
- `src/lib/random.ts`, `src/lib/easing.ts` — utilities + tests.
- `src/lib/googleSheets.ts` — stub returning fallback tracks only.

## Notes

- Accessibility: focus styles, button ARIA, prefers‑reduced‑motion respected via CSS.
- Persistence: selected track is saved to `localStorage` and restored on refresh.
- Styling: Tailwind with dark theme default.

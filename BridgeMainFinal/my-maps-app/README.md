# CampusCare (Bridge) — Campus Services & Grievances, Mapped

**Part 1 of a semester evaluation project.** A client-only React + Vite app with real
multi-page routing, a light/dark theme, and a live Google Map — built from the CampusCare
reference design, wired up to the Bridge product spec in `Plan.MD`.

## Setup

```bash
npm install
```

Add a Google Maps JavaScript API key (free tier is enough):

1. In the [Google Cloud Console](https://console.cloud.google.com/apis/library), open
   **APIs & Services → Library**, search **"Maps JavaScript API"**, and click **Enable**.
   (Skip the marketing "solution" tiles on the Maps Platform landing page — none of them
   *are* the API, they're guided tutorials. Enabling the API directly is all you need.)
2. Create a key under **APIs & Services → Credentials**, and (recommended) restrict it to
   your dev origin (`http://localhost:5173`).
3. Paste it into `.env.local`:

   ```
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   ```

> **No key yet?** The app still runs. `MapContainer` detects the missing key and renders a
> styled, to-scale fallback preview instead of the live map on the Services page.

Then run it:

```bash
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Pages

| Route            | What's there                                                             |
| ----------------- | ------------------------------------------------------------------------- |
| `/`                | Landing page — hero, category teasers, how-it-works, CTAs                |
| `/services`        | The core deliverable: search + category filter + **live Google Map**     |
| `/report-issue`    | Controlled form; submissions land in a shared context                    |
| `/announcements`   | Mock announcement feed                                                   |
| `/community`       | Mock forum thread feed                                                   |
| `/track-admin`     | Public issue ledger — reads live from what's been reported               |

`/services?category=food` (etc.) pre-filters — Home's category cards link straight into it.

## Feature breakdown (mapped to the grading rubric)

**1. Semantic HTML & CSS**
- `<header>`/`<nav>` for the routed brand bar (`Header.jsx`); a second `<nav>` filters
  categories on the Services page.
- `<main>` wraps each page; `<aside>` holds Services' search + results; `<section>`/`<article>`
  structure the hero, feeds (`Announcements`, `Community`), and cards throughout;
  `<table>` drives the Track & Admin ledger; `<form>` drives Report Issue; `<footer>` closes
  every page.
- All color, type, and spacing values are CSS variables (`variables.css`), including a full
  dark-mode override block under `[data-theme='dark']`. Layout is Flexbox (nav, cards) and
  Grid (`app-grid` splitting the sidebar from the map).

**2. Clean code**
- Components are `PascalCase.jsx`; hooks are `camelCase` (`useGoogleMaps.js`); context
  providers live in `src/context/`; routed pages live in `src/pages/`.
- `categories.js`, `locations.json`, `announcements.json`, `communityPosts.json`, and
  `issues.json` are the single sources of truth for their respective pages — components stay
  presentational.
- ES6+ throughout: destructuring, arrow functions, template literals, array methods.

**3. DOM manipulation**
- `MapContainer.jsx` grabs a real DOM node with `useRef` and mounts the map directly:
  ```js
  const mapNodeRef = useRef(null);
  mapInstanceRef.current = new window.google.maps.Map(mapNodeRef.current, { ... });
  ```
- It also imperatively calls `mapInstanceRef.current.setOptions({ styles })` to re-skin the
  live map when the theme toggle flips — a second, distinct piece of direct API/DOM control.
- `useGoogleMaps.js` injects the SDK `<script>` tag once via `useEffect` and reports load
  state back to the component.

**4. Core React concepts**
- `useState` — every form, filter, and toggle.
- `useEffect` — SDK script loading, mounting the map once, re-skinning it on theme change,
  applying `data-theme` to `<html>`, clearing a stale map selection.
- `useRef` — direct DOM binding for the map canvas plus imperative marker/instance handles.
- `useMemo` — derived data (filtered locations, category counts, ledger stats) recomputed
  only when their inputs change.
- `useContext` — `ThemeContext` (light/dark) and `IssuesContext` (shared between Report Issue
  and Track & Admin) demonstrate state lifted above the component tree.
- Props — every presentational component is driven entirely by props from its page.

## Dark mode

`ThemeContext` reads `localStorage`/`prefers-color-scheme` on first load, exposes
`theme` + `toggleTheme`, and reflects the value onto `<html data-theme="...">`. A small inline
script in `index.html` applies the stored theme *before* React mounts, so there's no
light-mode flash for dark-mode users. `variables.css` holds every token that needs to flip;
fixed-identity brand surfaces (buttons, footer, the logo mark) intentionally stay put, the same
way most products don't invert their brand color in dark mode.

## Design notes

The visual language — cream background, deep forest green, a terracotta accent, Fraunces
paired with Inter — comes directly from the provided CampusCare reference. `index.html` lives
at the **project root** rather than under `public/`, since Vite only auto-processes a
root-level `index.html` as the module entry point; `public/` holds the static favicon.

## Next steps (Part 2 candidates)

- Swap the JSON files for a real backend/API.
- Persist Report Issue submissions server-side instead of in-memory context.
- User accounts so students can save favourite listings and track their own reports.

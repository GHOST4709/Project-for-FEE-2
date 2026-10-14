# Bridge — Your Campus, Connected (React + Vite)

The original multi-page HTML/CSS/JS prototype, rebuilt as a React single-page app.
The original stylesheet is reused **unchanged** (`src/styles/styles.css`), so every
screen looks the same as before.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build
```

Deploying to Vercel works as-is (`vercel.json` rewrites every URL to `index.html`).

## Environment (`.env`)

| Variable | Purpose |
| --- | --- |
| `VITE_GOOGLE_MAPS_API_KEY` | Key for the `/map` page. Blank → the to-scale fallback map is shown. |
| `VITE_USE_MOCK_API` | `true` (default) serves the REST API from an in-browser mock. `false` → real HTTP to `VITE_API_BASE_URL`. |
| `VITE_API_BASE_URL` | Base URL for the API (default `/api`). |
| `VITE_MOCK_FAILURE_RATE` | `0`–`1`. Try `0.4` to see loading / retry / error states. |

> The Maps key is bundled into the client (as it was in the original). In Google Cloud
> Console, restrict it to your domains (HTTP referrers) and to the Maps JavaScript API.

## Pages → routes

| Original file | Route | Needs login |
| --- | --- | --- |
| `index.html` | `/` | no |
| `login.html` | `/login` (`?tab=signup`) | no |
| `dashboard.html` | `/dashboard` | yes |
| `carpool.html` | `/carpool` | yes |
| `rooms.html` | `/rooms` | yes |
| `thrift.html` | `/thrift` | yes |
| `fix.html` | `/fix` | yes |
| `map.html` | `/map` (`?category=`, `?q=`, `?location=`) | yes |

Old URLs such as `/html/carpool.html` redirect to the new routes.

## Where each course topic lives

| Topic | Where |
| --- | --- |
| **Navigation layout & page structure, multi-page SPA** | `App.jsx` (route map), `components/layout/*` (`AppLayout`, `PublicLayout` with `<Outlet/>`, headers, footers, `ScrollManager`), `components/routing/ProtectedRoute.jsx`, lazy-loaded pages |
| **Context API** | `context/AuthContext.jsx`, `ThemeContext.jsx`, `ToastContext.jsx` |
| **Global vs local state** | Global: auth/theme/toast (Context) + server data (Redux). Local: form values, open tab, open modal, "requested" ride, favourites |
| **Redux Toolkit** | `store/` — `createResourceSlice.js` builds slice + `createAsyncThunk`s for rides, rooms, thrift, shops |
| **Async state, loading / error handling** | `status` / `error` in every slice, `components/ui/ResourceState.jsx`, `StateCards.jsx` |
| **Form handling** | `hooks/useForm.js` (controlled inputs, touched/blur/submit strategy) |
| **Validation strategies** | `utils/validators.js` (composable rules), used in Login/Signup, `RideForm`, `ThriftForm` |
| **Reusable input components** | `components/ui/InputField`, `SelectField`, `IconInput`, `SearchBar`, `Dropdown` |
| **Modal** | `components/ui/Modal.jsx` (portal, Esc, focus, scroll lock), `ConfirmDialog.jsx` |
| **Tabs** | `components/ui/Tabs.jsx` (Carpool, Thrift, Login) |
| **Dropdowns** | `components/ui/Dropdown.jsx` (filters + sort) |
| **Toast notifications** | `context/ToastContext.jsx` |
| **Search / filter / sort** | `hooks/useListQuery.js`; Rooms, Thrift, Carpool, Tech Fix, Map |
| **Registration form with validation** (mini project) | `pages/LoginPage.jsx` (Create account tab) |
| **Dashboard** (mini project) | `pages/DashboardPage.jsx` |
| **REST APIs with axios** | `services/http.js` (instance, interceptors), `services/api.js` |
| **Loading states, retry, error handling** | `services/http.js` (retry with back-off), `ResourceState`, "Try again" button |
| **Pagination** | `components/ui/Pagination.jsx` (Carpool, Rooms) — hidden while a list fits on one page |
| **Infinite scroll** | `hooks/useInfiniteScroll.js` (Thrift, IntersectionObserver) |
| **Debounce** | `hooks/useDebounce.js`, used by `useListQuery` for search boxes |
| **CRUD workflow** | Carpool + Thrift: create (post), read (list), update (Edit on your own listing), delete (confirm modal) |
| **Third-party APIs** | `hooks/useGoogleMaps.js` + `pages/MapPage.jsx` (Google Maps JS API with graceful fallback) |

## Project structure

```
src/
  App.jsx  main.jsx
  styles/       styles.css (original, untouched) · extras.css (new UI states only)
  context/      Auth, Theme, Toast
  store/        Redux Toolkit slices
  services/     http.js · api.js · mockServer.js
  hooks/        useForm, useListQuery, useDebounce, useResourceFetch, useInfiniteScroll, useGoogleMaps, …
  utils/        validators.js
  data/         seed data copied from the original pages
  components/   layout/ · routing/ · ui/ · carpool/ · rooms/ · thrift/ · fix/
  pages/        one component per route
```

## Notes

- Accounts and sessions use the same `localStorage` keys as the original, so existing
  accounts keep working. Passwords are stored in plain text — fine for a class project,
  never for production.
- Posted rides/items live in memory (like the original); a reload resets them.
- Page size is `PAGE_SIZE` in `services/mockServer.js` (6). Lower it to 2 to see pagination
  and infinite scroll with the seed data.

# Bridge — Project Structure

```
BridgeMain(BASIC)/
├── html/
│   ├── index.html        Landing page (public)
│   ├── login.html        Log in / create account (public)
│   ├── dashboard.html    Main app home (auth required)
│   ├── carpool.html      Carpool board (auth required)
│   ├── rooms.html        PG & Rooms listings (auth required)
│   ├── thrift.html       Campus Thrift marketplace (auth required)
│   ├── fix.html          Tech Fix directory (auth required)
│   └── map.html          Campus Map — Google Maps feature (auth required)
├── css/
│   └── styles.css        Single stylesheet for the whole site
├── js/
│   ├── script.js         Shared logic: theme, session/logout, toasts
│   └── map-config.js     Google Maps API key goes here
└── vercel.json           Deployment rewrites for the new layout
```

## Why this shape

- Every HTML page is a sibling inside `html/`, so links between pages
  (`href="dashboard.html"`, `href="map.html"`, etc.) work unchanged — the
  browser resolves them relative to whatever page you're already on.
- `css/` and `js/` sit next to `html/`, not inside it, so every page links
  out to them with `../css/styles.css` and `../js/script.js`.

## Running it locally

Since pages now live under `html/`, serve the project from its **root**
folder and open `html/index.html` — don't open `html/index.html` directly
from disk (`file://`), since some browsers restrict local script access
across folders. Easiest option:

```bash
cd "BridgeMain(BASIC)"
python3 -m http.server 8000
# then visit http://localhost:8000/html/index.html
```

## Deploying to Vercel

`vercel.json` already handles the new layout:

```json
{
  "rewrites": [
    { "source": "/", "destination": "/html/index.html" },
    { "source": "/:page.html", "destination": "/html/:page.html" }
  ]
}
```

The first rule sends your domain root to the landing page. The second
means a direct link or bookmark to `/dashboard.html` (no `html/` prefix)
still resolves correctly, in case anyone types or shares a bare URL.

```

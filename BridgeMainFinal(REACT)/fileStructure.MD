my-maps-app/
├── public/
│   ├── favicon.ico
│   └── index.html               # Base semantic HTML wrapper
├── src/
│   ├── assets/                  # SVG icons, markers, images
│   │   └── pin-marker.svg
│   ├── components/              # Reusable UI components
│   │   ├── common/
│   │   │   ├── Header.jsx       # Semantic <header> & <nav>
│   │   │   ├── Footer.jsx       # Semantic <footer>
│   │   │   └── SearchBar.jsx    # Controlled search input using useState
│   │   └── map/
│   │       ├── MapContainer.jsx # Google Maps canvas mounted via useRef
│   │       ├── LocationCard.jsx # Reusable location item (<article>) using Props
│   │       └── LocationList.jsx # Maps through arrays to render cards (<section>)
│   ├── data/                    # Local Mock Data (Replaces Backend for Part 1)
│   │   └── locations.json       # JSON array of coordinates, titles, and details
│   ├── styles/                  # Clean CSS architecture
│   │   ├── variables.css        # CSS variables (:root)
│   │   ├── global.css           # Resets and base element rules
│   │   └── App.css              # Main layout Grid / Flexbox styles
│   ├── App.jsx                  # Top-level state manager (search, filters, active item)
│   └── main.jsx                 # Entry point
├── .env.local                   # VITE_GOOGLE_MAPS_API_KEY
├── .gitignore                   # Exclude node_modules, .env.local
├── package.json
└── README.md                    # Setup guide and feature breakdown
# ITG Collect PWA

Share discoveries and find nearby recommendations. A mobile-first Progressive Web App for creating, browsing, and exploring location-based entries on an interactive map.

## Tech Stack

- **React 19** with TypeScript
- **Vite** — build tooling and dev server
- **Tailwind CSS v4** — utility-first styling
- **MobX** — state management
- **React Router v7** — client-side routing
- **Leaflet / React Leaflet** — interactive maps
- **Axios** — HTTP client with interceptors
- **vite-plugin-pwa** — service worker and manifest generation

## Getting Started

### Prerequisites

- Node.js >= 18

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_URL=<your-api-base-url>
VITE_GOOGLE_PLACES_API_KEY=<your-google-places-key>
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── api/            # Axios client and API service modules (auth, entries, feedback, location)
├── assets/         # Static images and icons
├── components/
│   ├── entries/    # EntryCard, EntryList
│   ├── layout/     # AppShell, AuthGuard, Header, TabBar
│   ├── maps/       # LeafletMap, InteractiveMap
│   ├── photos/     # PhotoPicker, PhotoGrid
│   └── ui/         # Shared UI primitives (CategoryPill, ConfirmDialog, etc.)
├── config/         # Google Places configuration
├── constants/      # Theme tokens and app constants
├── hooks/          # Custom hooks (geolocation, image picker, online status, install prompt)
├── pages/
│   └── create-entry/  # Multi-step entry creation wizard
├── services/       # Google Places service
├── stores/         # MobX stores (Root, App, User, Entries, Drafts, Feedback)
├── styles/         # Global CSS and Tailwind imports
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Key Features

- **Map-based browsing** — explore entries on an interactive Leaflet map with category filters
- **Entry creation wizard** — multi-step flow with map selection, location suggestions, tags, photos, and review
- **Search, filter & sort** — find entries by keyword, category, or proximity
- **Favourites** — save and revisit entries
- **Drafts** — auto-save in-progress entries to resume later
- **Offline support** — service worker caching with online/offline detection
- **PWA installable** — add to home screen on mobile and desktop

## Architecture Overview

- **State management** — MobX stores are provided via React context through a `RootStore`. Stores handle auth state, entries, drafts, and feedback.
- **API layer** — Axios instance with request/response interceptors for auth token injection and error handling. Tokens are persisted in `localStorage`.
- **Auth flow** — `AuthGuard` component wraps protected routes, redirecting unauthenticated users to the welcome screen.
- **Routing** — React Router v7 with a nested layout (`AppShell` + `TabBar`) and five main tabs: Home, Explore, Create, My Entries, and Account.

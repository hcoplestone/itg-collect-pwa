# ITG Collect: React Native → PWA Migration Tracker

## Phase 0: Project Scaffolding
- [x] 0.1 Init Vite + React + TS project
- [x] 0.2 Install core deps (mobx, axios, react-router, leaflet, react-leaflet)
- [x] 0.3 Configure Tailwind CSS v4 with custom theme
- [x] 0.4 Install shadcn/ui components (deferred — using Tailwind directly)
- [x] 0.5 Configure path aliases (`@/` → `src/`)
- [x] 0.6 Set up React Router v7 with all routes
- [x] 0.7 Set up vite-plugin-pwa with manifest + service worker
- [x] 0.8 Copy static assets to `public/`
- [x] 0.9 Create `.env` with API URL and Google Places key

## Phase 1: Copy Business Logic
- [x] 1.1 Copy 4 API service files (auth, entries, feedback, location-suggestions)
- [x] 1.2 Migrate `api/client.ts` — AsyncStorage → localStorage
- [x] 1.3 Copy 6 unchanged store files (RootStore, AppStore, FeedbackStore, EntriesStore, StoreContext, index)
- [x] 1.4 Migrate `stores/UserStore.ts` — AsyncStorage → localStorage
- [x] 1.5 Migrate `stores/DraftsStore.ts` — AsyncStorage → localStorage
- [x] 1.6 Copy `constants/theme.ts`
- [x] 1.7 Copy + migrate `config/googlePlaces.ts`
- [x] 1.8 Copy + migrate `services/googlePlaces.ts`
- [x] 1.9 Create `hooks/useGeolocation.ts`
- [x] 1.10 Create `hooks/useImagePicker.ts`
- [x] 1.11 Create `hooks/useOnlineStatus.ts`
- [x] 1.12 Create `hooks/useInstallPrompt.ts`
- [x] 1.13 Verify all stores + API compile (TypeScript clean, build succeeds)

## Phase 2: Layout & Navigation
- [x] 2.1 Build `App.tsx` — StoreProvider + RouterProvider
- [x] 2.2 Build `AppShell.tsx` — root layout (max-width 600px, centered, mobile-first)
- [x] 2.3 Build `AuthGuard.tsx` — redirect to /welcome if not authenticated
- [x] 2.4 Build `TabBar.tsx` — 5-tab bottom nav
- [x] 2.5 Build `Header.tsx` — reusable header with back button + title
- [x] 2.6 Wire all routes in `router.tsx` with layout nesting + auth guards

## Phase 3: Auth Screens
- [x] 3.1 Build `Welcome.tsx`
- [x] 3.2 Build `Login.tsx`
- [x] 3.3 Build `Register.tsx`
- [ ] 3.4 Test full auth flow (manual testing needed)

## Phase 4: Map Components
- [x] 4.1 Build `LeafletMap.tsx` — react-leaflet with entry markers, popups, click handlers
- [x] 4.2 Build `InteractiveMap.tsx` — click-to-select, draggable marker

## Phase 5: Core Screens
- [x] 5.1 Build `Home.tsx` — map + category tabs + bottom drawer
- [x] 5.2 Build `Explore.tsx` — search, filter, sort, entry list
- [x] 5.3 Build `EntryDetail.tsx` — photo carousel, details, favourite, mini map, delete
- [x] 5.4 Build `Account.tsx` — user info, menu, logout
- [x] 5.5 Build `Feedback.tsx` — text input, photo upload, submit
- [x] 5.6 Build `FeedbackScreenshots.tsx`
- [x] 5.7 Build `MyEntries.tsx` — list/map toggle
- [x] 5.8 Build `MyFavourites.tsx` — list/map toggle
- [x] 5.9 Build `Drafts.tsx` — draft list with resume/delete

## Phase 6: Entry Creation Wizard
- [x] 6.1 Build wizard layout with step progress bar
- [x] 6.2 Build `MapSelect.tsx` — InteractiveMap + confirm location
- [x] 6.3 Build `Location.tsx` — suggestions + manual entry
- [x] 6.4 Build `DidYouMean.tsx` — spelling suggestions
- [x] 6.5 Build `Details.tsx` — description textarea
- [x] 6.6 Build `Tags.tsx` — 12 category tags
- [x] 6.7 Build `Photos.tsx` — photo picker + gallery
- [x] 6.8 Build `Review.tsx` — summary, rating, review, submit
- [ ] 6.9 Test wizard end-to-end (manual testing needed)
- [ ] 6.10 Test drafts save/resume (manual testing needed)

## Phase 7: PWA Features
- [x] 7.1 Manifest configured (name, icons, theme_color, standalone)
- [x] 7.2 Service worker configured (cache-first static, stale-while-revalidate API)
- [x] 7.3 Offline detection banner (AppStore.isOnline)
- [x] 7.4 Install prompt hook ready (useInstallPrompt)
- [ ] 7.5 Lighthouse PWA audit

## Phase 8: Testing & Polish
- [ ] 8.1 Set up Vitest + React Testing Library
- [ ] 8.2 Unit tests for stores
- [ ] 8.3 Integration test: auth flow
- [ ] 8.4 Integration test: entry creation wizard
- [ ] 8.5 Mobile responsive testing
- [ ] 8.6 Performance audit (bundle size, Lighthouse)
- [ ] 8.7 Accessibility audit

## Build Status
- TypeScript: **CLEAN** (0 errors)
- Vite Build: **SUCCESS** (604 KB JS, 37 KB CSS)
- PWA: **Service worker generated, manifest configured**

## Files Created
- 16 business logic files (API, stores, constants, config, services)
- 4 custom hooks (geolocation, image picker, online status, install prompt)
- 4 layout components (AppShell, AuthGuard, TabBar, Header)
- 5 shared components (EntryCard, EntryList, CategoryPill, PhotoPicker, PhotoGrid)
- 2 map components (LeafletMap, InteractiveMap)
- 1 wizard layout component (WizardLayout)
- 13 page components (Welcome, Login, Register, Home, Explore, Account, Feedback, FeedbackScreenshots, EntryDetail, MyEntries, MyFavourites, Drafts)
- 7 wizard step pages (MapSelect, Location, DidYouMean, Details, Tags, Photos, Review)
- Router + App + Main entry point
- Tailwind CSS + custom theme
- Vite config with PWA plugin

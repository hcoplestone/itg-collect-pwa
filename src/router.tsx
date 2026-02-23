import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AuthGuard } from '@/components/layout/AuthGuard';
import { PageLoadingFallback } from '@/components/ui/PageLoadingFallback';

import Welcome from '@/pages/Welcome';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

const Home = lazy(() => import('@/pages/Home'));
const Explore = lazy(() => import('@/pages/Explore'));
const Account = lazy(() => import('@/pages/Account'));
const Feedback = lazy(() => import('@/pages/Feedback'));
const FeedbackScreenshots = lazy(() => import('@/pages/FeedbackScreenshots'));
const EntryDetail = lazy(() => import('@/pages/EntryDetail'));
const MyEntries = lazy(() => import('@/pages/MyEntries'));
const MyFavourites = lazy(() => import('@/pages/MyFavourites'));
const Drafts = lazy(() => import('@/pages/Drafts'));

const MapSelect = lazy(() => import('@/pages/create-entry/MapSelect'));
const Location = lazy(() => import('@/pages/create-entry/Location'));
const DidYouMean = lazy(() => import('@/pages/create-entry/DidYouMean'));
const Details = lazy(() => import('@/pages/create-entry/Details'));
const Tags = lazy(() => import('@/pages/create-entry/Tags'));
const Photos = lazy(() => import('@/pages/create-entry/Photos'));
const Review = lazy(() => import('@/pages/create-entry/Review'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoadingFallback />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  // Public routes
  { path: '/welcome', element: <Welcome /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  // Authenticated routes with tab layout
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/home', element: <SuspenseWrapper><Home /></SuspenseWrapper> },
          { path: '/explore', element: <SuspenseWrapper><Explore /></SuspenseWrapper> },
          { path: '/feedback', element: <SuspenseWrapper><Feedback /></SuspenseWrapper> },
          { path: '/account', element: <SuspenseWrapper><Account /></SuspenseWrapper> },
          { path: '/drafts', element: <SuspenseWrapper><Drafts /></SuspenseWrapper> },
        ],
      },

      // Full-screen authenticated routes (no tab bar)
      { path: '/entry/:id', element: <SuspenseWrapper><EntryDetail /></SuspenseWrapper> },
      { path: '/my-entries', element: <SuspenseWrapper><MyEntries /></SuspenseWrapper> },
      { path: '/my-favourites', element: <SuspenseWrapper><MyFavourites /></SuspenseWrapper> },
      { path: '/feedback-screenshots', element: <SuspenseWrapper><FeedbackScreenshots /></SuspenseWrapper> },

      // Entry creation wizard
      { path: '/create-entry/map-select', element: <SuspenseWrapper><MapSelect /></SuspenseWrapper> },
      { path: '/create-entry/location', element: <SuspenseWrapper><Location /></SuspenseWrapper> },
      { path: '/create-entry/did-you-mean', element: <SuspenseWrapper><DidYouMean /></SuspenseWrapper> },
      { path: '/create-entry/details', element: <SuspenseWrapper><Details /></SuspenseWrapper> },
      { path: '/create-entry/tags', element: <SuspenseWrapper><Tags /></SuspenseWrapper> },
      { path: '/create-entry/photos', element: <SuspenseWrapper><Photos /></SuspenseWrapper> },
      { path: '/create-entry/review', element: <SuspenseWrapper><Review /></SuspenseWrapper> },
    ],
  },

  // Default redirect
  { path: '/', element: <Welcome /> },
  { path: '*', element: <Welcome /> },
]);

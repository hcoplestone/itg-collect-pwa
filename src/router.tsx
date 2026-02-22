import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { AuthGuard } from '@/components/layout/AuthGuard';

import Welcome from '@/pages/Welcome';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Explore from '@/pages/Explore';
import Account from '@/pages/Account';
import Feedback from '@/pages/Feedback';
import FeedbackScreenshots from '@/pages/FeedbackScreenshots';
import EntryDetail from '@/pages/EntryDetail';
import MyEntries from '@/pages/MyEntries';
import MyFavourites from '@/pages/MyFavourites';
import Drafts from '@/pages/Drafts';

import MapSelect from '@/pages/create-entry/MapSelect';
import Location from '@/pages/create-entry/Location';
import DidYouMean from '@/pages/create-entry/DidYouMean';
import Details from '@/pages/create-entry/Details';
import Tags from '@/pages/create-entry/Tags';
import Photos from '@/pages/create-entry/Photos';
import Review from '@/pages/create-entry/Review';

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
          { path: '/home', element: <Home /> },
          { path: '/explore', element: <Explore /> },
          { path: '/feedback', element: <Feedback /> },
          { path: '/account', element: <Account /> },
          { path: '/drafts', element: <Drafts /> },
        ],
      },

      // Full-screen authenticated routes (no tab bar)
      { path: '/entry/:id', element: <EntryDetail /> },
      { path: '/my-entries', element: <MyEntries /> },
      { path: '/my-favourites', element: <MyFavourites /> },
      { path: '/feedback-screenshots', element: <FeedbackScreenshots /> },

      // Entry creation wizard
      { path: '/create-entry/map-select', element: <MapSelect /> },
      { path: '/create-entry/location', element: <Location /> },
      { path: '/create-entry/did-you-mean', element: <DidYouMean /> },
      { path: '/create-entry/details', element: <Details /> },
      { path: '/create-entry/tags', element: <Tags /> },
      { path: '/create-entry/photos', element: <Photos /> },
      { path: '/create-entry/review', element: <Review /> },
    ],
  },

  // Default redirect
  { path: '/', element: <Welcome /> },
  { path: '*', element: <Welcome /> },
]);

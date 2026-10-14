import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import PublicLayout from './components/layout/PublicLayout';
import ScrollManager from './components/layout/ScrollManager';
import ProtectedRoute from './components/routing/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Route-level code splitting: each signed-in page is downloaded only when first visited.
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CarpoolPage = lazy(() => import('./pages/CarpoolPage'));
const RoomsPage = lazy(() => import('./pages/RoomsPage'));
const ThriftPage = lazy(() => import('./pages/ThriftPage'));
const FixPage = lazy(() => import('./pages/FixPage'));
const MapPage = lazy(() => import('./pages/MapPage'));

/**
 * Route map (multi-page SPA):
 *
 *   PublicLayout  (rail + header + footer, no login needed)
 *     /           landing
 *     /login      log in / sign up   (?tab=signup)
 *     *           404  (also redirects old /html/*.html URLs)
 *
 *   ProtectedRoute -> AppLayout  (needs a session; shared app header + footer)
 *     /dashboard  /carpool  /rooms  /thrift  /fix  /map
 */
export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/carpool" element={<CarpoolPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/thrift" element={<ThriftPage />} />
            <Route path="/fix" element={<FixPage />} />
            <Route path="/map" element={<MapPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

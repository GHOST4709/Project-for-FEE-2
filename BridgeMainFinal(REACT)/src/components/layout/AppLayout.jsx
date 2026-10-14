import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import Footer from './Footer';

/**
 * Shell for every signed-in page: rail + header + <Outlet/> (the current page) + footer.
 * Pages only render their own <main>, the chrome is written once here.
 */
export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <div className="rail" aria-hidden="true" />
      <AppHeader />
      {/* Pages are code-split; keep the footer at the bottom while one loads. */}
      <Suspense fallback={<main style={{ minHeight: '60vh' }} />}>
        <Outlet />
      </Suspense>
      <Footer variant="app" backToMainSite={pathname === '/dashboard'} />
    </>
  );
}

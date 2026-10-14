import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthHeader from './AuthHeader';
import Footer from './Footer';
import LandingHeader from './LandingHeader';

/** Shell for the public pages: landing page ("/") gets the marketing header, the rest the minimal one. */
export default function PublicLayout() {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';

  return (
    <>
      <div className="rail" aria-hidden="true" />
      {isLanding ? <LandingHeader /> : <AuthHeader />}
      <Suspense fallback={<main style={{ minHeight: '60vh' }} />}>
        <Outlet />
      </Suspense>
      <Footer variant={isLanding ? 'landing' : 'auth'} />
    </>
  );
}

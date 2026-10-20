import { useState, useEffect } from 'react';
import './index.css';
import type { UserType } from './types/waitlist';
import { useWaitlist } from './hooks/useWaitlist';
import { useRole } from './context/RoleContext';
import { roleToUserType } from './config/roleConfig';
import RoleSelector from './components/RoleSelector';
import Navbar from './components/Navbar';
import CreatorScreen from './components/CreatorScreen';
import BusinessScreen from './components/BusinessScreen';
import Footer from './components/Footer';
import WaitlistModal from './components/WaitlistModal';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';

type Route = 'home' | 'privacy' | 'terms' | 'cookie';

function getRoute(): Route {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '/');

  if (hash.startsWith('/privacy-policy') || path === '/privacy-policy') return 'privacy';
  if (
    hash.startsWith('/terms-and-conditions') ||
    path === '/terms-and-conditions' ||
    hash.startsWith('/terms') ||
    path === '/terms'
  ) {
    return 'terms';
  }
  if (hash.startsWith('/cookie-policy') || path === '/cookie-policy') return 'cookie';

  return 'home';
}

export default function App() {
  const { role, isConfirmed, confirmRole, switchRole } = useRole();
  const { count, isSubmitting, response, submit, resetResponse } = useWaitlist();
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultUserType, setDefaultUserType] = useState<UserType | undefined>();
  const [siteEntering, setSiteEntering] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<Route>(getRoute);

  useEffect(() => {
    function handleLocationChange() {
      setCurrentRoute(getRoute());
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function handleLinkClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;
      // Anchor jumps on the page (e.g. #platform, #how-it-works)
      if (href.startsWith('#') && !href.startsWith('#/')) return;
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) return;

      const legalPaths = ['/', '/privacy-policy', '/terms-and-conditions', '/terms', '/cookie-policy'];
      if (legalPaths.includes(href)) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        handleLocationChange();
      }
    }

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('click', handleLinkClick);
    };
  }, []);

  function openModal(userType?: UserType) {
    setDefaultUserType(userType);
    resetResponse();
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setDefaultUserType(undefined);
  }

  function handleRoleConfirm() {
    confirmRole();
    setSiteEntering(true);
    setTimeout(() => setSiteEntering(false), 1200);
  }

  // Legal pages can be viewed regardless of role selection
  if (currentRoute === 'privacy') {
    return (
      <>
        <PrivacyPolicyPage />
        <CookieBanner />
      </>
    );
  }

  if (currentRoute === 'terms') {
    return (
      <>
        <TermsPage />
        <CookieBanner />
      </>
    );
  }

  if (currentRoute === 'cookie') {
    return (
      <>
        <CookiePolicyPage />
        <CookieBanner />
      </>
    );
  }

  // Show role selector if not confirmed or no role set
  if (!isConfirmed || !role) {
    return (
      <>
        <RoleSelector onConfirm={handleRoleConfirm} />
        <CookieBanner />
      </>
    );
  }

  const mappedUserType = roleToUserType(role);

  return (
    <div className={siteEntering ? 'site-entrance' : ''} data-role={role}>
      <Navbar
        onJoinClick={() => openModal(mappedUserType)}
        onSwitchRole={switchRole}
      />
      <main>
        {role === 'creator' ? (
          <CreatorScreen count={count} onJoinClick={openModal} />
        ) : (
          <BusinessScreen count={count} onJoinClick={openModal} />
        )}
      </main>
      <Footer />
      <WaitlistModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submit}
        isSubmitting={isSubmitting}
        response={response}
        defaultUserType={defaultUserType || mappedUserType}
      />
      <CookieBanner />
    </div>
  );
}

import { useState } from 'react';
import './index.css';
import type { UserType } from './types/waitlist';
import { useWaitlist } from './hooks/useWaitlist';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Platform from './components/Platform';
import HowItWorks from './components/HowItWorks';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import WaitlistModal from './components/WaitlistModal';

export default function App() {
  const { count, isSubmitting, response, submit, resetResponse } = useWaitlist();
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultUserType, setDefaultUserType] = useState<UserType | undefined>();

  function openModal(userType?: UserType) {
    setDefaultUserType(userType);
    resetResponse();
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setDefaultUserType(undefined);
  }

  return (
    <>
      <Navbar onJoinClick={() => openModal()} />
      <main>
        <Hero count={count} onJoinClick={openModal} />
        <Platform onJoinClick={openModal} />
        <HowItWorks />
        <FinalCTA count={count} onJoinClick={() => openModal()} />
      </main>
      <Footer />
      <WaitlistModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submit}
        isSubmitting={isSubmitting}
        response={response}
        defaultUserType={defaultUserType}
      />
    </>
  );
}

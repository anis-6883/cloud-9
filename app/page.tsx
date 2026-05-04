'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { AuthModal } from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { isModalOpen, closeAuthModal } = useAuth();
  
  return (
    <>
      <DashboardLayout />
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </>
  );
}

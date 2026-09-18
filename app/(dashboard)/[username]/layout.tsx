'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Search } from 'lucide-react';
import NotificationsDropdown from '@/components/NotificationsDropdown';

import {
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { AppSidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (!loading && user && !profile?.onboarding_completed) {
      router.push('/onboarding');
    }
  }, [user, profile, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full overflow-hidden">
        {/* SIDEBAR */}
        <div className="flex-shrink-0 h-full">
          <AppSidebar username={username} />
        </div>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* HEADER */}
          <header className="flex h-[69.5px] shrink-0 items-center justify-between border-b-[7px] border-[var(--color-secondary)] bg-white px-4">
            <SidebarTrigger />
            
            <div className="flex items-center gap-3">
              {/* Notifications avec Dropdown */}
              <NotificationsDropdown />

              {/* Avatar utilisateur */}
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[var(--color-secondary)] transition-all"
                  onClick={() => router.push(`/${username}/profile`)}
                />
              ) : (
                <div 
                  className="w-10 h-10 bg-[var(--color-secondary)] rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => router.push(`/${username}/profile`)}
                >
                  {(profile?.display_name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </header>

          {/* CONTENU SCROLLABLE */}
          <main className="flex-1 overflow-y-auto min-h-0 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
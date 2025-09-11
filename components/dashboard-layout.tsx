"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardNavbar from './dashboard-navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-foreground mb-2">
            Loading Dashboard...
          </h1>
          <p className="text-muted-foreground font-sans">
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main content */}
      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
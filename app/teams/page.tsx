"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Search } from 'lucide-react';
import Link from 'next/link';

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
            Loading Teams...
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-sans">
            Please wait while we load your teams.
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push('/auth/login');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Teams
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 font-sans">
              Manage your teams and find new opportunities
            </p>
          </div>
          <Button asChild className="font-display font-medium">
            <Link href="/teams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Link>
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-400 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-display font-semibold text-gray-900 dark:text-white mb-2">
                No Teams Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-4 font-sans">
                Start building your dream team by creating your first team
              </p>
              <Button asChild className="font-medium">
                <Link href="/teams/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Team
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Explore Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display font-semibold">Explore Teams</CardTitle>
            <CardDescription className="font-sans">
              Find teams that match your skills and interests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-sans">No teams available to explore yet</p>
              <p className="text-sm text-muted-foreground font-sans mt-2">
                Teams will appear here as other entrepreneurs create them
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 
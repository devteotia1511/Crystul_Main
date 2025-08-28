"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Team {
  id: string;
  name: string;
  description: string;
  founderId: string;
  members: any[];
  openRoles: string[];
  stage: string;
  industry: string;
  isPublic: boolean;
  createdAt: string;
}

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTeams();
    }
  }, [status]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();
      if (data.success) setTeams(data.teams);
    } catch (e) {}
    setLoading(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-foreground mb-2">
            Loading Teams...
          </h1>
          <p className="text-muted-foreground font-sans">
            Please wait while we load all teams.
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
            <h1 className="text-3xl font-bold text-primary font-serif p-3">
              All Teams
            </h1>
            <p className="text-muted-foreground mt-1 mx-3 font-sans">
              Browse all teams created on the platform
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
          {teams.length === 0 ? (
            <Card className='bg-card text-foreground'>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  No Teams Yet
                </h3>
                <p className="text-muted-foreground text-center mb-4 font-sans">
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
          ) : (
            teams.map((team) => (
              <Card key={team.id} className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
                <CardHeader>
                  <CardTitle className="font-display font-semibold">{team.name}</CardTitle>
                  <CardDescription className="font-sans">{team.industry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-sm line-clamp-2 overflow-hidden">{team.description}</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {team.openRoles && team.openRoles.map((role, idx) => (
                      <Badge key={idx} variant="outline" className="bg-slate-600">{role}</Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-300 mb-2">Stage: {team.stage}</div>
                  <Button asChild variant="secondary">
                    <Link href={`/teams/${team.id}`}>View Team</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Explore Section */}
        <Card className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
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
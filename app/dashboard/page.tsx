"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Target, Plus, TrendingUp, Calendar, Bell, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

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

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  interests: string[];
  experience: string;
  bio?: string;
  location?: string;
  compatibility: number;
}

interface DashboardStats {
  teamsCount: number;
  matchesCount: number;
  messagesCount: number;
  unreadMessagesCount: number;
  tasksCount: number;
  tasksDueToday: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchDashboardData();
    }
  }, [status, session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch teams
      const teamsResponse = await fetch('/api/teams');
      const teamsData = await teamsResponse.json();
      
      if (teamsData.success) {
        setTeams(teamsData.teams);
      }

      // Fetch matches
      const matchesResponse = await fetch('/api/users/matches');
      const matchesData = await matchesResponse.json();
      
      if (matchesData.success) {
        setMatches(matchesData.matches);
      }

      // Fetch stats
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while session is being determined
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
            Loading Dashboard...
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-sans">
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  // If no session, show error
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4 font-sans">
            Please sign in to access your dashboard.
          </p>
          <Button onClick={() => router.push('/auth/login')} className="font-medium">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Welcome back, {session.user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 font-sans">
              Here's what's happening with your teams today
            </p>
          </div>
          <Button asChild className="font-display font-medium">
            <Link href="/teams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium">Your Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold">{stats?.teamsCount || 0}</div>
                  <p className="text-xs text-muted-foreground font-sans">
                    Active teams
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium">Matches Found</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold">{stats?.matchesCount || 0}</div>
                  <p className="text-xs text-muted-foreground font-sans">
                    Potential matches
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold">{stats?.messagesCount || 0}</div>
                  <p className="text-xs text-muted-foreground font-sans">
                    {stats?.unreadMessagesCount || 0} unread messages
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium">Tasks</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold">{stats?.tasksCount || 0}</div>
                  <p className="text-xs text-muted-foreground font-sans">
                    {stats?.tasksDueToday || 0} due today
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display font-semibold">Your Teams</CardTitle>
              <CardDescription className="font-sans">
                Teams you've created or joined
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4 font-sans">You haven't joined any teams yet</p>
                  <Button asChild className="font-display font-medium">
                    <Link href="/teams/create">Create Your First Team</Link>
                  </Button>
                </div>
              ) : (
                teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">{team.name}</h3>
                      <p className="text-sm text-muted-foreground font-sans">{team.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{team.stage}</Badge>
                        <Badge variant="outline">{team.industry}</Badge>
                        <span className="text-xs text-muted-foreground font-sans">
                          {team.members.length + 1} members
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="font-medium">
                      <Link href={`/teams/${team.id}`}>View</Link>
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Potential Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display font-semibold">Potential Matches</CardTitle>
              <CardDescription className="font-sans">
                Entrepreneurs that match your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4 font-sans">No matches found yet</p>
                  <Button asChild className="font-display font-medium">
                    <Link href="/explore">Explore Users</Link>
                  </Button>
                </div>
              ) : (
                matches.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground font-sans">
                          {user.skills.slice(0, 2).join(', ')}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {user.compatibility}% match
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {user.experience}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="font-medium">
                      Connect
                    </Button>
                  </div>
                ))
              )}
              {matches.length > 3 && (
                <Button variant="outline" className="w-full font-medium" asChild>
                  <Link href="/explore">View All Matches</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display font-semibold">Recent Activity</CardTitle>
            <CardDescription className="font-sans">
              Latest updates from your teams and network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-sans">No recent activity</p>
              <p className="text-sm text-muted-foreground font-sans mt-2">
                Activity will appear here as you interact with teams
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
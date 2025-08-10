"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Target, Plus, TrendingUp, Calendar, Bell, Loader2, ArrowRight, Users2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [connectingUsers, setConnectingUsers] = useState<Set<string>>(new Set());
  const ROLE_OPTIONS = [
    'Technical Co-founder', 'Business Co-founder', 'CTO', 'CMO', 'CFO',
    'Head of Product', 'Head of Marketing', 'Head of Sales', 'Head of Design',
    'Backend Developer', 'Frontend Developer', 'Full Stack Developer',
    'Mobile Developer', 'UI/UX Designer', 'Data Scientist', 'DevOps Engineer'
  ];
  const [selectedSkill, setSelectedSkill] = useState<string>('all');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchDashboardData(selectedSkill);
    }
  }, [status, session, selectedSkill]);

  const fetchDashboardData = async (skillFilter?: string) => {
    try {
      setLoading(true);
      let teamsUrl = '/api/teams';
      if (skillFilter && skillFilter !== 'all') {
        teamsUrl += `?skills=${encodeURIComponent(skillFilter)}`;
      }
      const teamsResponse = await fetch(teamsUrl);
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

  const handleConnect = async (userId: string) => {
    try {
      setConnectingUsers(prev => new Set(prev).add(userId));
      
      const response = await fetch('/api/users/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Connection request sent successfully!');
        // Optionally refresh matches to update the UI
        fetchDashboardData();
      } else {
        toast.error(data.message || 'Failed to send connection request');
      }
    } catch (error) {
      console.error('Error connecting with user:', error);
      toast.error('Failed to send connection request');
    } finally {
      setConnectingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Show loading while session is being determined
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-gray-900 mb-2">
            Loading Dashboard...
          </h1>
          <p className="text-gray-600 font-sans">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-4 font-sans">
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
            <h1 className="text-2xl font-serif text-gray-700 font-semibold">
              Welcome back, {session.user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1 font-sans">
              Here's what's happening with your teams today
            </p>
          </div>
          <Button asChild className="font-display font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
            <Link href="/teams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium text-gray-700">Your Teams</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold text-gray-900">{stats?.teamsCount || 0}</div>
                  <p className="text-xs text-gray-500 font-sans">
                    Active teams
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium text-gray-700">Matches Found</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold text-gray-900">{stats?.matchesCount || 0}</div>
                  <p className="text-xs text-gray-500 font-sans">
                    Potential matches
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium text-gray-700">Messages</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold text-gray-900">{stats?.messagesCount || 0}</div>
                  <p className="text-xs text-gray-500 font-sans">
                    {stats?.unreadMessagesCount || 0} unread messages
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-display font-medium text-gray-700">Tasks</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-display font-bold text-gray-900">{stats?.tasksCount || 0}</div>
                  <p className="text-xs text-gray-500 font-sans">
                    {stats?.tasksDueToday || 0} due today
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skills Filter Dropdown */}
        <div className="mb-6 max-w-xs">
          <Select value={selectedSkill} onValueChange={(value) => setSelectedSkill(value)}>
            <SelectTrigger className="w-full font-display font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              <SelectValue placeholder="Filter by Skill (Open Role)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {ROLE_OPTIONS.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* All Teams Section (now first, grid-cols-2) */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="font-display font-semibold text-gray-900">All Teams</CardTitle>
                    <CardDescription className="font-sans text-gray-600">
                      Teams you've created or joined
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/teams">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
                  <p className="text-gray-600 mb-4 font-sans">Start building your dream team today</p>
                  <Button asChild className="bg-gradient-to-r from-blue-600  to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/teams/create">Create Your First Team</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {teams.map((team) => (
                    <div key={team.id} className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center p-4">
                              <span className="text-white font-bold text-sm">{team.name.charAt(0)}</span>
                            </div>
                            <div>
                              <h3 className="font-display font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {team.name}
                              </h3>
                              <p className="text-sm text-gray-600 font-sans line-clamp-2">
                                {team.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                              {team.stage}
                            </Badge>
                            <Badge variant="outline" className="text-xs text-slate-600 font-mono">
                              {team.industry}
                            </Badge>
                            <span className="text-xs text-gray-500 font-sans flex items-center">
                              <Users2 className="h-3 w-3 mr-1" />
                              {team.members.length} members
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/teams/${team.id}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Potential Matches Section (now below) */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="font-display font-semibold text-gray-900">Potential Matches</CardTitle>
                    <CardDescription className="font-sans text-gray-600">
                      Entrepreneurs that match your profile
                    </CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/explore">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found yet</h3>
                  <p className="text-gray-600 mb-4 font-sans">Complete your profile to find better matches</p>
                  <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    <Link href="/explore">Explore Users</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matches.slice(0, 6).map((user) => (
                    <div key={user.id} className="group p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-200 bg-white/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-display font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                              {user.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-sans">
                              {user.skills.slice(0, 2).join(', ')}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                                {user.compatibility}% match
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {user.experience}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleConnect(user.id)}
                          disabled={connectingUsers.has(user.id)}
                        >
                          {connectingUsers.has(user.id) ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connecting...
                            </>
                          ) : (
                            'Connect'
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {matches.length > 6 && (
                <Button variant="outline" className="w-full font-display font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:text-white shadow-lg hover:bg-black-50" asChild>
                  <Link href="/explore">View All Matches</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="font-display font-semibold text-gray-900">Recent Activity</CardTitle>
                <CardDescription className="font-sans text-gray-600">
                  Latest updates from your teams and network
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600 font-sans">Activity will appear here as you interact with teams</p>
              <p className="text-sm text-gray-500 font-sans mt-2">
                Start by creating a team or connecting with other entrepreneurs
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Target, Plus, TrendingUp, Calendar, Bell } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { isAuthenticated, currentUser, teams, getMatchingUsers } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Add error boundary
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Loading...
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we authenticate you.
          </p>
        </div>
      </div>
    );
  }

  try {
    const userTeams = teams.filter(team => 
      team.founderId === currentUser.id || 
      team.members.some(member => member.userId === currentUser.id)
    );

    const matchingUsers = getMatchingUsers(currentUser.id);

    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Welcome back, {currentUser.name}!
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
                <div className="text-2xl font-display font-bold">{userTeams.length}</div>
                <p className="text-xs text-muted-foreground font-sans">
                  +1 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-display font-medium">Matches Found</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">{matchingUsers.length}</div>
                <p className="text-xs text-muted-foreground font-sans">
                  Based on your profile
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-display font-medium">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">12</div>
                <p className="text-xs text-muted-foreground font-sans">
                  3 unread messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-display font-medium">Tasks</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-display font-bold">8</div>
                <p className="text-xs text-muted-foreground font-sans">
                  2 due today
                </p>
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
                {userTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4 font-sans">You haven't joined any teams yet</p>
                    <Button asChild className="font-display font-medium">
                      <Link href="/teams/create">Create Your First Team</Link>
                    </Button>
                  </div>
                ) : (
                  userTeams.map((team) => (
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
                {matchingUsers.slice(0, 3).map((user: any) => (
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
                ))}
                <Button variant="outline" className="w-full font-medium" asChild>
                  <Link href="/explore">View All Matches</Link>
                </Button>
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
              <div className="space-y-4">
                {[
                  {
                    icon: <Users className="h-4 w-4" />,
                    text: "Sarah joined your team 'EcoApp'",
                    time: "2 hours ago"
                  },
                  {
                    icon: <MessageSquare className="h-4 w-4" />,
                    text: "New message in 'TechFlow' team chat",
                    time: "4 hours ago"
                  },
                  {
                    icon: <Target className="h-4 w-4" />,
                    text: "Task 'Design wireframes' marked as complete",
                    time: "6 hours ago"
                  },
                  {
                    icon: <Bell className="h-4 w-4" />,
                    text: "You have 3 new potential matches",
                    time: "1 day ago"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                    <div className="text-muted-foreground">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-sans">{activity.text}</p>
                      <p className="text-xs text-muted-foreground font-sans">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            There was an error loading the dashboard.
          </p>
          <Button onClick={() => window.location.reload()} className="font-medium">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
}
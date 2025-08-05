"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Target, Settings, Plus, Crown, Calendar } from 'lucide-react';
import TeamChat from '@/components/team-chat';
import TeamTasks from '@/components/team-tasks';
import Link from 'next/link';



export default function TeamDetailPage() {
  const { id } = useParams();
  const { isAuthenticated, currentUser, teams, users } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  const team = teams.find(t => t.id === id);
  
  if (!team) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Team Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The team you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const founder = users.find(u => u.id === team.founderId);
  const teamMembers = team.members.map(member => ({
    ...member,
    user: users.find(u => u.id === member.userId)
  })).filter(member => member.user);

  const isFounder = team.founderId === currentUser.id;
  const isMember = team.members.some(member => member.userId === currentUser.id);
  const hasAccess = isFounder || isMember;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Team Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {team.name}
              </h1>
              <Badge variant="secondary">{team.stage}</Badge>
              <Badge variant="outline">{team.industry}</Badge>
              {team.isPublic && <Badge variant="default">Public</Badge>}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {team.description}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {teamMembers.length + 1} members
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Created {new Date(team.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!hasAccess && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Join Team
              </Button>
            )}
            {isFounder && (
              <Button variant="outline" asChild>
                <Link href={`/teams/${team.id}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Founder */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={founder?.avatar} alt={founder?.name} />
                  <AvatarFallback>{founder?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{founder?.name}</p>
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">Founder</p>
                </div>
              </div>
              
              {/* Members */}
              {teamMembers.map((member) => (
                <div key={member.userId} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user?.avatar} alt={member.user?.name} />
                    <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{member.user?.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Open Roles */}
          <Card>
            <CardHeader>
              <CardTitle>Open Roles</CardTitle>
              <CardDescription>Positions we're looking to fill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {team.openRoles.length > 0 ? (
                  team.openRoles.map((role) => (
                    <Badge key={role} variant="outline" className="mr-2 mb-2">
                      {role}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No open positions</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Messages</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-medium">5</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Content Tabs */}
        {hasAccess && (
          <Tabs defaultValue="chat" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <TeamChat teamId={team.id} />
            </TabsContent>

            <TabsContent value="tasks">
              <TeamTasks teamId={team.id} />
            </TabsContent>

            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage team members and their roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Founder */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={founder?.avatar} alt={founder?.name} />
                          <AvatarFallback>{founder?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{founder?.name}</h3>
                            <Crown className="w-4 h-4 text-yellow-500" />
                          </div>
                          <p className="text-sm text-muted-foreground">{founder?.email}</p>
                          <div className="flex gap-1 mt-2">
                            {founder?.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Badge variant="default">Founder</Badge>
                    </div>

                    {/* Members */}
                    {teamMembers.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.user?.avatar} alt={member.user?.name} />
                            <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.user?.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                            <div className="flex gap-1 mt-2">
                              {member.user?.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{member.role}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {teamMembers.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No team members yet. Share your team to invite others!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!hasAccess && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Join the team to access more features</h3>
              <p className="text-muted-foreground mb-6">
                Connect with the team to view chat, tasks, and collaborate together.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Request to Join
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
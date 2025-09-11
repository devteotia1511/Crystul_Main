"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Target, Settings, Plus, Crown, Calendar, Loader2, Bell } from 'lucide-react';
import TeamChat from '@/components/team-chat';
import TeamTasks from '@/components/team-tasks';
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
}

export default function TeamDetailPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [founder, setFounder] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approveEmail, setApproveEmail] = useState('');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', isPublic: true });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login');
      return;
    }

    if (status === "authenticated" && id) {
      fetchTeamData();
    }
  }, [status, id, router]);

  useEffect(() => {
    let interval: any;
    if (status === 'authenticated' && team && session?.user?.email) {
      const founderMatch = team.founderId === session.user.email;
      if (founderMatch) {
        fetchPendingRequests();
        interval = setInterval(fetchPendingRequests, 10000);
      }
    }
    return () => interval && clearInterval(interval);
  }, [status, team, session]);

  useEffect(() => {
    if (team) {
      setEditForm({ name: team.name, description: team.description, isPublic: team.isPublic });
    }
  }, [team]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      
      // Fetch team data
      const response = await fetch(`/api/teams/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setTeam(data.team);
        setFounder(data.founder);
      } else {
        console.error('Failed to fetch team:', data.message);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        const pending = data.notifications.filter((n: any) => n.type === 'team_join_request' && n.data?.teamId === id);
        setPendingRequests(pending);
      }
    } catch (e) {
      // ignore
    }
  };

  const requestToJoin = async () => {
    try {
      setRequesting(true);
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_join' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Join request sent to founder');
      } else {
        toast.error(data.message || 'Failed to send request');
      }
    } catch (e) {
      toast.error('Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const approveJoin = async (targetUserId: string) => {
    try {
      setApproving(true);
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve_join', targetUserId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User approved and added to team');
        fetchTeamData();
        fetchPendingRequests();
      } else {
        toast.error(data.message || 'Failed to approve');
      }
    } catch (e) {
      toast.error('Failed to approve');
    } finally {
      setApproving(false);
    }
  };

  const declineJoin = async (targetUserId: string) => {
    try {
      setDecliningId(targetUserId);
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline_join', targetUserId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Join request declined');
        fetchPendingRequests();
      } else {
        toast.error(data.message || 'Failed to decline');
      }
    } catch (e) {
      toast.error('Failed to decline');
    } finally {
      setDecliningId(null);
    }
  };

  const saveTeam = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/teams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', update: editForm })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Team updated');
        setEditing(false);
        fetchTeamData();
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (e) {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const deleteTeam = async () => {
    if (!confirm('Are you sure you want to delete this team? This cannot be undone.')) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/teams/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Team deleted');
        router.push('/teams');
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch (e) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading team...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!team) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Team Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The team you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const teamMembers = team.members || [];
  const isFounder = team.founderId === session?.user?.email;
  const isMember = teamMembers.some(member => member.userId === session?.user?.email);
  const hasAccess = isFounder || isMember;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Team Header */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-display font-bold text-foreground mb-3">
                    {team.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge className="bg-primary/20 text-primary border-primary/30">{team.stage}</Badge>
                    <Badge variant="outline" className="bg-secondary/20 text-secondary-foreground border-secondary/30">{team.industry}</Badge>
                    {team.isPublic && <Badge className="bg-primary text-primary-foreground">Public</Badge>}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                {team.description}
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium text-foreground">{teamMembers.length + 1}</span> members
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  Created <span className="font-medium text-foreground">{new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {!hasAccess && (
                <Button className="bg-primary text-primary-foreground hover:opacity-90" onClick={requestToJoin} disabled={requesting}>
                  <Plus className="mr-2 h-4 w-4" />
                  {requesting ? 'Requesting...' : 'Join Team'}
                </Button>
              )}
              {isFounder && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {!editing ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setEditing(true)} className="border-border hover:bg-primary/10 hover:text-primary">
                        Edit Team
                      </Button>
                      <Button variant="outline" asChild className="border-border hover:bg-primary/10 hover:text-primary">
                        <Link href={`/teams/${team.id}/settings`}>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={deleteTeam} disabled={deleting} className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                        {deleting ? 'Deleting...' : 'Delete Team'}
                      </Button>
                    </div>
                  ) : (
                    <div className="w-full bg-muted/50 p-4 rounded-lg border border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        <input
                          className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Team name"
                        />
                        <input
                          className="bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="Description"
                        />
                        <label className="text-sm flex items-center gap-2 text-foreground">
                          <input 
                            type="checkbox" 
                            checked={editForm.isPublic} 
                            onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          Public Team
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveTeam} disabled={saving} className="bg-primary text-primary-foreground hover:opacity-90">
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button variant="outline" onClick={() => setEditing(false)} className="border-border hover:bg-muted">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Members */}
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-200 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Users className="mr-2 h-5 w-5 text-primary" />
                Team Members
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {teamMembers.length + 1} total members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Founder */}
              {founder && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/30">
                    <AvatarImage src={founder.avatar} alt={founder.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{founder.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-foreground">{founder.name}</p>
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">Founder</p>
                  </div>
                </div>
              )}
              
              {/* Members */}
              {teamMembers.map((member) => (
                <div key={member.userId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">{member.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No additional members yet</p>
              )}
            </CardContent>
          </Card>

          {/* Open Roles */}
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-200 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-foreground">Open Roles</CardTitle>
              <CardDescription className="text-muted-foreground">Positions we&apos;re looking to fill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {team.openRoles && team.openRoles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {team.openRoles.map((role) => (
                      <Badge key={role} variant="outline" className="bg-primary/20 text-primary border-primary/30">
                        {role}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Target className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No open positions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-200 hover:border-primary/40">
            <CardHeader>
              <CardTitle className="text-foreground">Activity</CardTitle>
              <CardDescription className="text-muted-foreground">Team activity overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Messages</span>
                </div>
                <span className="font-semibold text-primary">0</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Tasks</span>
                </div>
                <span className="font-semibold text-primary">0</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Completed</span>
                </div>
                <span className="font-semibold text-primary">0</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Content Tabs */}
        {hasAccess && (
          <Tabs defaultValue="chat" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border">
              <TabsTrigger value="chat" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Target className="mr-2 h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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
              <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="text-foreground">Team Members</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage team members and their roles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Founder */}
                    {founder && (
                      <div className="flex items-center justify-between p-6 border border-border rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-primary/30">
                            <AvatarImage src={founder.avatar} alt={founder.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">{founder.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-foreground">{founder.name}</h3>
                              <Crown className="w-4 h-4 text-yellow-500" />
                            </div>
                            <p className="text-sm text-muted-foreground">{founder.email}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {founder.skills && founder.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} className="bg-primary/20 text-primary border-primary/30 text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">Founder</Badge>
                      </div>
                    )}

                    {/* Members */}
                    {teamMembers.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between p-6 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-secondary text-secondary-foreground">{member.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                            {member.skills && member.skills.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} className="bg-secondary/20 text-secondary-foreground border-secondary/30 text-xs">
                                {skill}
                              </Badge>
                            ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-border text-foreground">{member.role}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {teamMembers.length === 0 && (
                      <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No team members yet</h3>
                        <p className="text-muted-foreground">Share your team to invite others!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!hasAccess && (
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg">
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Join the team to access more features</h3>
              <p className="text-muted-foreground mb-6">
                Connect with the team to view chat, tasks, and collaborate together.
              </p>
              <Button onClick={requestToJoin} disabled={requesting} className="bg-primary text-primary-foreground hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                {requesting ? 'Requesting...' : 'Request to Join'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pending Join Requests for Founder */}
        {isFounder && (
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center">
                <Bell className="mr-2 h-5 w-5 text-primary" />
                Pending Join Requests
              </CardTitle>
              <CardDescription className="text-muted-foreground">Approve users who requested to join</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req: any) => (
                    <div key={req.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={req.sender?.avatar} />
                          <AvatarFallback className="bg-secondary text-secondary-foreground">{req.sender?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{req.sender?.name}</div>
                          <div className="text-xs text-muted-foreground">{req.sender?.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approveJoin(req.sender?.id)} disabled={approving} className="bg-primary text-primary-foreground hover:opacity-90">
                          {approving ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => declineJoin(req.sender?.id)} disabled={decliningId === req.sender?.id} className="border-border hover:bg-muted">
                          {decliningId === req.sender?.id ? 'Declining...' : 'Decline'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
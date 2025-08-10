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
import { MessageSquare, Users, Target, Settings, Plus, Crown, Calendar, Loader2 } from 'lucide-react';
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
            The team you're looking for doesn't exist or you don't have access to it.
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 font-serif p-3">
              <h1 className="text-3xl font-bold">
                {team.name}
              </h1>
              <Badge variant="secondary">{team.stage}</Badge>
              <Badge variant="outline" className='text-black-600'>{team.industry}</Badge>
              {team.isPublic && <Badge variant="default">Public</Badge>}
            </div>
            <p className="text-black text-lg">
              {team.description}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                {teamMembers.length + 1} members
              </div>
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-1 " />
                Created {new Date(team.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {!hasAccess && (
              <Button className='bg-emerald-500 hover:bg-blue-400 text-white' onClick={requestToJoin} disabled={requesting}>
                <Plus className="mr-2 h-4 w-4" />
                {requesting ? 'Requesting...' : 'Join Team'}
              </Button>
            )}
            {isFounder && (
              <div className="flex items-center gap-2">
                {!editing ? (
                  <>
                    <Button variant="outline" onClick={() => setEditing(true)}>
                      Edit Team
                    </Button>
                    <Button variant="destructive" onClick={deleteTeam} disabled={deleting}>
                      {deleting ? 'Deleting...' : 'Delete Team'}
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      className="border rounded px-3 py-2 text-sm"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Team name"
                    />
                    <input
                      className="border rounded px-3 py-2 text-sm w-64"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Description"
                    />
                    <label className="text-sm flex items-center gap-1">
                      <input type="checkbox" checked={editForm.isPublic} onChange={(e) => setEditForm({ ...editForm, isPublic: e.target.checked })} />
                      Public
                    </label>
                    <Button onClick={saveTeam} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                )}
                <Button variant="outline" asChild>
                  <Link href={`/teams/${team.id}/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Members */}
            <Card className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Founder */}
              {founder && (
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={founder.avatar} className='font-bold' alt={founder.name} />
                    <AvatarFallback>{founder.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{founder.name}</p>
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-sm text-slate-300">Founder</p>
                  </div>
                </div>
              )}
              
              {/* Members */}
              {teamMembers.map((member) => (
                <div key={member.userId} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Open Roles */}
          <Card className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
            <CardHeader>
              <CardTitle>Open Roles</CardTitle>
              <CardDescription className='text-gray-400'>Positions we're looking to fill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-white">
                {team.openRoles && team.openRoles.length > 0 ? (
                  team.openRoles.map((role) => (
                    <Badge key={role} variant="outline" className="mr-2 mb-2 text-white">
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
          <Card className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground text-slate-300">Messages</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground text-slate-300">Tasks</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground text-slate-300">Completed</span>
                <span className="font-medium">0</span>
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
                    {founder && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={founder.avatar} alt={founder.name} />
                            <AvatarFallback>{founder.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{founder.name}</h3>
                              <Crown className="w-4 h-4 text-yellow-500" />
                            </div>
                            <p className="text-sm text-muted-foreground">{founder.email}</p>
                            <div className="flex gap-1 mt-2">
                              {founder.skills && founder.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge variant="default">Founder</Badge>
                      </div>
                    )}

                    {/* Members */}
                    {teamMembers.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <div className="flex gap-1 mt-2">
                            {member.skills && member.skills.slice(0, 3).map((skill: string) => (
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
          <Card className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
            <CardContent className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Join the team to access more features</h3>
              <p className="text-muted-foreground mb-6">
                Connect with the team to view chat, tasks, and collaborate together.
              </p>
              <Button onClick={requestToJoin} disabled={requesting}>
                <Plus className="mr-2 h-4 w-4" />
                {requesting ? 'Requesting...' : 'Request to Join'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pending Join Requests for Founder */}
        {isFounder && (
          <Card className='bg-white'>
            <CardHeader>
              <CardTitle>Pending Join Requests</CardTitle>
              <CardDescription>Approve users who requested to join</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending requests</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req: any) => (
                    <div key={req.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={req.sender?.avatar} />
                          <AvatarFallback>{req.sender?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{req.sender?.name}</div>
                          <div className="text-xs text-muted-foreground">{req.sender?.email}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approveJoin(req.sender?.id)} disabled={approving}>
                          {approving ? 'Approving...' : 'Approve'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => declineJoin(req.sender?.id)} disabled={decliningId === req.sender?.id}>
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
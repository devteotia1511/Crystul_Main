"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function TeamsPage() {
  const { isAuthenticated, currentUser, teams, users } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

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

  const userTeams = teams.filter(team => 
    team.founderId === currentUser.id || 
    team.members.some(member => member.userId === currentUser.id)
  );

  const publicTeams = teams.filter(team => team.isPublic && !userTeams.includes(team));

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
              Manage your teams and discover new opportunities
            </p>
          </div>
          <Button asChild className="font-display font-medium">
            <Link href="/teams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Link>
          </Button>
        </div>

        {/* My Teams */}
        <div>
          <h2 className="text-2xl font-display font-semibold mb-6">My Teams</h2>
          {userTeams.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2 font-display">No teams yet</h3>
                <p className="text-muted-foreground mb-6 font-sans">
                  Create your first team or join an existing one to get started.
                </p>
                <Button asChild className="font-display font-medium">
                  <Link href="/teams/create">Create Your First Team</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTeams.map((team) => {
                const founder = users.find(u => u.id === team.founderId);
                return (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-display font-semibold">{team.name}</CardTitle>
                        <Badge variant="secondary">{team.stage}</Badge>
                      </div>
                      <CardDescription className="font-sans">{team.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={founder?.avatar} alt={founder?.name} />
                          <AvatarFallback className="text-xs">{founder?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground font-sans">
                          Founded by {founder?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{team.industry}</Badge>
                        <span className="text-xs text-muted-foreground font-sans">
                          {team.members.length + 1} members
                        </span>
                      </div>

                      <Button asChild className="w-full font-medium">
                        <Link href={`/teams/${team.id}`}>View Team</Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Public Teams */}
        {publicTeams.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-semibold mb-6">Discover Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicTeams.slice(0, 6).map((team) => {
                const founder = users.find(u => u.id === team.founderId);
                return (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-display font-semibold">{team.name}</CardTitle>
                        <Badge variant="outline">Public</Badge>
                      </div>
                      <CardDescription className="font-sans">{team.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={founder?.avatar} alt={founder?.name} />
                          <AvatarFallback className="text-xs">{founder?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground font-sans">
                          Founded by {founder?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{team.stage}</Badge>
                        <Badge variant="outline">{team.industry}</Badge>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium font-sans">Open Roles</h4>
                        <div className="flex flex-wrap gap-1">
                          {team.openRoles.slice(0, 2).map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button variant="outline" className="w-full font-medium">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 
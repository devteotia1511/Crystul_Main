"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Users, Filter } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Add Team and User interfaces for typing
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
  createdAt: string;
}

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, usersRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/users'),
      ]);
      const teamsData = await teamsRes.json();
      const usersData = await usersRes.json();
      if (teamsData.success) setTeams(teamsData.teams);
      if (usersData.success) setUsers(usersData.users);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filterBySearch = <T extends Record<string, any>>(arr: T[], keys: string[]): T[] => {
    if (!search) return arr;
    return arr.filter((item: T) =>
      keys.some((key: string) =>
        Array.isArray(item[key])
          ? item[key].some((val: string) => val.toLowerCase().includes(search.toLowerCase()))
          : (item[key] || '').toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  const filteredTeams = filterBySearch(teams, ['name', 'description', 'industry', 'openRoles']);
  const filteredUsers = filterBySearch(users, ['name', 'skills', 'interests', 'experience', 'bio', 'location']);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
            Loading Explore...
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-sans">
            Please wait while we load the explore page.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 font-serif p-3">
              Explore
            </h1>
            <p className="text-gray-600 dark:text-gray-500 mt-1 mx-3 font-sans">
              Discover entrepreneurs and teams that match your interests
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className='bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 text-white'>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for entrepreneurs, skills, teams, or interests..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Teams Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Teams</h2>
          {filteredTeams.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No teams found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team: Team) => (
                <Card key={team.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white h-56 flex flex-col">
                  <CardHeader className="pb-1 p-3">
                    <CardTitle className="font-display font-semibold text-base">{team.name}</CardTitle>
                    <CardDescription className="font-sans">{team.industry}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-3 pt-0 min-h-0">
                    <div className="mb-2 text-sm line-clamp-2 overflow-hidden">{team.description}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {team.openRoles && team.openRoles.map((role: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-slate-600">{role}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-300">Stage: {team.stage}</div>
                    <div className="mt-auto pt-2">
                      <Link href={`/teams/${team.id}`} className="text-blue-300 underline">View Team</Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Users Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Entrepreneurs</h2>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user: User) => (
                <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 text-white">
                  <CardHeader className="flex flex-row items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="font-display font-semibold">{user.name}</CardTitle>
                      <CardDescription className="font-sans">{user.location}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 text-sm">{user.bio}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {user.skills && user.skills.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-slate-600">{skill}</Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {user.interests && user.interests.map((interest: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-emerald-700">{interest}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-gray-300">Experience: {user.experience}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
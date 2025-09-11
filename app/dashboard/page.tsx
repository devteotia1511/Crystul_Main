"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  Plus, 
  Search, 
  MessageCircle, 
  Star,
  Building2,
  User,
  Loader2
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";

interface Team {
  id: string;
  name: string;
  description: string;
  members: number;
  skills: string[];
  lookingFor: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  avatar?: string;
}

interface Activity {
  id: string;
  type: 'team_created' | 'member_joined' | 'project_started';
  description: string;
  timestamp: string;
  user: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      // Simulate loading data
      setTimeout(() => {
        setIsLoading(false);
        // Mock data
        setTeams([
          {
            id: "1",
            name: "TechFlow",
            description: "Building the next generation of workflow automation tools",
            members: 3,
            skills: ["React", "Node.js", "AI/ML"],
            lookingFor: ["DevOps Engineer", "UI/UX Designer"]
          },
          {
            id: "2",
            name: "EcoCart",
            description: "Sustainable shopping platform for eco-conscious consumers",
            members: 2,
            skills: ["Python", "React Native", "Blockchain"],
            lookingFor: ["Marketing Specialist", "Backend Developer"]
          }
        ]);

        setPotentialMatches([
          {
            id: "1",
            name: "Sarah Chen",
            email: "sarah@example.com",
            skills: ["DevOps", "AWS", "Docker"],
            experience: "5+ years in cloud infrastructure"
          },
          {
            id: "2",
            name: "Marcus Johnson",
            email: "marcus@example.com",
            skills: ["UI/UX Design", "Figma", "Prototyping"],
            experience: "3+ years in product design"
          }
        ]);

        setRecentActivity([
          {
            id: "1",
            type: "team_created",
            description: "Created new team 'TechFlow'",
            timestamp: "2 hours ago",
            user: "You"
          },
          {
            id: "2",
            type: "member_joined",
            description: "Alex joined 'EcoCart' team",
            timestamp: "1 day ago",
            user: "Alex"
          }
        ]);
      }, 1000);
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Please sign in to continue</h2>
          <p className="text-muted-foreground mb-6">You need to be authenticated to view this page</p>
          <Link href="/auth/login">
            <Button className="bg-primary text-primary-foreground">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Welcome back, {session?.user?.name || "Entrepreneur"}! 👋🏻
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to build something amazing? Let&apos;s get your team together.
          </p>
          <div className="mt-6">
            <Link href="/teams/create">
              <Button className="bg-primary text-primary-foreground hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total Teams</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{teams.length}</div>
              <p className="text-xs text-muted-foreground">
                Active teams you&apos;re part of
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Team Members</CardTitle>
              <Target className="h-4 w-4 text-secondary-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-foreground">
                {teams.reduce((acc, team) => acc + team.members, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total team members across all teams
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-shadow hover:border-primary/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Potential Matches</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{potentialMatches.length}</div>
              <p className="text-xs text-muted-foreground">
                People matching your criteria
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Skills Filter */}
        <div className="flex items-center space-x-4">
          <span className="text-foreground font-medium">Filter by skill:</span>
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger className="w-[200px] bg-primary text-primary-foreground hover:opacity-90">
              <SelectValue placeholder="Select skill" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all" className="text-foreground hover:bg-primary/10">All Skills</SelectItem>
              <SelectItem value="react" className="text-foreground hover:bg-primary/10">React</SelectItem>
              <SelectItem value="node" className="text-foreground hover:bg-primary/10">Node.js</SelectItem>
              <SelectItem value="ai" className="text-foreground hover:bg-primary/10">AI/ML</SelectItem>
              <SelectItem value="design" className="text-foreground hover:bg-primary/10">UI/UX Design</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Teams and Matches Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* All Teams */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-foreground">All Teams</h2>
              <Link href="/teams">
                <Button variant="ghost" className="text-primary hover:text-foreground hover:bg-primary/10">
                  View All
                </Button>
              </Link>
            </div>

            {teams.length === 0 ? (
              <Card className="bg-card/50 border-border text-center py-8">
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-4">Start building your dream team today!</p>
                <Link href="/teams/create">
                  <Button className="bg-primary text-primary-foreground hover:opacity-90">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Team
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {teams.map((team) => (
                  <Card key={team.id} className="bg-card/50 border-border hover:border-primary hover:shadow-md transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-foreground">{team.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">{team.description}</CardDescription>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          {team.members} members
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {team.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Looking for:</p>
                          <div className="flex flex-wrap gap-2">
                            {team.lookingFor.map((role) => (
                              <Badge key={role} variant="outline" className="border-primary/30 text-primary">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Potential Matches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-foreground">Potential Matches</h2>
              <Link href="/explore">
                <Button variant="ghost" className="text-primary hover:text-foreground hover:bg-primary/10">
                  Explore More
                </Button>
              </Link>
            </div>

            {potentialMatches.length === 0 ? (
              <Card className="bg-card/50 border-border text-center py-8">
                <User className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                <Link href="/explore">
                  <Button className="bg-primary text-primary-foreground hover:opacity-90">
                    <Search className="mr-2 h-4 w-4" />
                    Explore Users
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {potentialMatches.map((user) => (
                  <Card key={user.id} className="bg-card/50 border-border hover:border-primary hover:shadow-md transition-all duration-200">
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-foreground">{user.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">{user.experience}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-secondary">
                            <MessageCircle className="mr-2 h-3 w-3" />
                            Connect
                          </Button>
                          <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                            <Star className="mr-2 h-3 w-3" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-foreground text-sm">
                        <span className="font-medium">{activity.user}</span> {activity.description}
                      </p>
                      <p className="text-muted-foreground text-xs">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
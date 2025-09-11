"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const INDUSTRY_OPTIONS = [
  'Technology', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce',
  'AI/ML', 'Blockchain', 'Gaming', 'Social Impact', 'Climate Tech',
  'Food & Beverage', 'Real Estate', 'Transportation', 'Entertainment'
];

const ROLE_OPTIONS = [
  'Technical Co-founder', 'Business Co-founder', 'CTO', 'CMO', 'CFO',
  'Head of Product', 'Head of Marketing', 'Head of Sales', 'Head of Design',
  'Backend Developer', 'Frontend Developer', 'Full Stack Developer',
  'Mobile Developer', 'UI/UX Designer', 'Data Scientist', 'DevOps Engineer'
];

export default function CreateTeamPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    stage: 'idea',
    isPublic: true
  });
  const [openRoles, setOpenRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.email) {
      toast.error('Please sign in to create a team');
      return;
    }

    if (!formData.name || !formData.description || !formData.industry) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          industry: formData.industry,
          stage: formData.stage,
          openRoles: openRoles
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Team created successfully!');
        router.push(`/teams/${data.team.id}`);
      } else {
        toast.error(data.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addRole = (role: string) => {
    if (!openRoles.includes(role)) {
      setOpenRoles([...openRoles, role]);
    }
  };

  const removeRole = (role: string) => {
    setOpenRoles(openRoles.filter(r => r !== role));
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Team</CardTitle>
            <CardDescription>
              Set up your startup team and define the roles you&apos;re looking to fill
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your team/startup name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your startup idea, vision, and what you're building..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Current Stage</Label>
                    <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Idea Stage</SelectItem>
                        <SelectItem value="mvp">MVP Development</SelectItem>
                        <SelectItem value="growth">Growth Stage</SelectItem>
                        <SelectItem value="scaling">Scaling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Open Roles */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Open Roles</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    What roles are you looking to fill on your team?
                  </p>
                </div>

                <Select onValueChange={addRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add roles you&apos;re looking for" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.filter(role => !openRoles.includes(role)).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2">
                  {openRoles.map((role) => (
                    <Badge key={role} variant="default" className="pr-1">
                      {role}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 ml-1"
                        onClick={() => removeRole(role)}
                      >
                        <X className="h-3 w-3 text-white" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">Public Team</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your team discoverable to other entrepreneurs
                  </p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Creating Team...' : 'Create Team'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
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

export default function ExplorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
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

  if (status === "unauthenticated") {
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
          <Button variant="outline" className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 font-medium text-white' >
            <Filter className="mr-2 h-4 w-4 " />
            Filters
          </Button>
        </div>

        {/* Search Bar */}
        <Card className='bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for entrepreneurs, skills, or interests..."
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* No Results */}
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4 text-slate-500" />
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
            No Results Found
          </h2>
          <p className="text-gray-600 dark:text-gray-500 mb-6 font-sans">
            Try adjusting your search criteria or explore different categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="cursor-pointer p-3 bg-slate-600 hover:bg-emerald-600">
              Web Development
            </Badge>
            <Badge variant="outline" className="cursor-pointer p-3 bg-slate-600  hover:bg-emerald-600">
              Product Management
            </Badge>
            <Badge variant="outline" className="cursor-pointer p-3 bg-slate-600  hover:bg-emerald-600">
              UI/UX Design
            </Badge>
            <Badge variant="outline" className="cursor-pointer p-3 bg-slate-600  hover:bg-emerald-600">
              Marketing
            </Badge>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white">
            <CardHeader>
              <CardTitle className="font-display font-semibold">Entrepreneurs</CardTitle>
              <CardDescription className="font-sans">
                Find co-founders and team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-sans">0 available</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white">
            <CardHeader>
              <CardTitle className="font-display font-semibold">Teams</CardTitle>
              <CardDescription className="font-sans">
                Join existing teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-sans">0 available</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white">
            <CardHeader>
              <CardTitle className="font-display font-semibold">Projects</CardTitle>
              <CardDescription className="font-sans">
                Find project opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-sans">0 available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
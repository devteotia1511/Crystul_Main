"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  Home, 
  Users, 
  Search, 
  Settings, 
  LogOut,
  Bell,
  MessageSquare
} from 'lucide-react';
import NotificationDropdown from './notification-dropdown';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Explore', href: '/explore', icon: Search },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-foreground mb-2">
            Loading Dashboard...
          </h1>
          <p className="text-muted-foreground font-sans">
            Please wait while we load your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left side - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden text-foreground hover:text-primary hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <img 
                src="/crystul.png" 
                alt="Crystul Logo" 
                className="w-8 h-8 object-contain group-hover:scale-105 transition-all duration-300"
              />
              <span className="text-xl font-display font-bold text-primary group-hover:text-primary/80 transition-all duration-300">
                Crystul
              </span>
            </Link>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary/10 transition-colors">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                    <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-border shadow-xl bg-card/95 backdrop-blur-sm" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Link href="/teams">
                    <Users className="mr-2 h-4 w-4" />
                    Teams
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Link href="/explore">
                    <Search className="mr-2 h-4 w-4" />
                    Explore
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Link href="/chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem asChild className="text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={() => signOut()} className="text-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-card/95 backdrop-blur-sm border-r border-border">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <img 
                  src="/crystul.png" 
                  alt="Crystul Logo" 
                  className="w-8 h-8 object-contain"
                />
                <h2 className="text-lg font-display font-bold text-primary">
                  Crystul
                </h2>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm'
                        : 'text-foreground hover:bg-primary/10 hover:text-primary hover:shadow-sm'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card/80 backdrop-blur-sm border-r border-border">
          <div className="flex h-16 shrink-0 items-center px-6">
            <Link href="/dashboard" className="flex items-center space-x-2 group">
              <img 
                src="/crystul.png" 
                alt="Crystul Logo" 
                className="w-8 h-8 object-contain group-hover:scale-105 transition-all duration-300"
              />
              <span className="text-xl font-display font-bold text-primary group-hover:text-primary/80 transition-all duration-300">
                Crystul
              </span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col px-6">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-300 ${
                            isActive
                              ? 'bg-primary/20 text-primary border border-primary/30 shadow-sm'
                              : 'text-foreground hover:text-primary hover:bg-primary/10 hover:shadow-sm'
                          }`}
                        >
                          <item.icon className={`h-6 w-6 shrink-0 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Content with top margin for fixed header */}
        <main className="pt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
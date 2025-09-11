"use client";

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/navbar-components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  Home, 
  Users, 
  Search, 
  Settings, 
  LogOut,
  MessageSquare,
  Bot,
  UserPlus
} from 'lucide-react';
import NotificationDropdown from './notification-dropdown';
import { cn } from '@/lib/utils';

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/ai-assistant', label: 'AI Assistant', icon: Bot },
  { href: '/connect-founders', label: 'Connect', icon: UserPlus },
];

export default function DashboardNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Logo />

          {/* Mobile menu trigger */}
          <div className="ml-4 lg:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-foreground hover:text-primary hover:bg-primary/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-56 p-2 bg-card/95 backdrop-blur-sm border-border shadow-xl" 
                align="start"
              >
                <div className="space-y-1">
                  {navigationLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={index}
                        href={link.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 w-full",
                          isActive
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "text-foreground hover:bg-primary/10 hover:text-primary"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Center - Main Navigation (Desktop) */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
          <NavigationMenu>
            <NavigationMenuList className="space-x-2">
              {navigationLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <NavigationMenuItem key={index}>
                    <Link href={link.href} legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "transition-all duration-200",
                          isActive
                            ? "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/25"
                            : "hover:bg-primary/10 hover:text-primary"
                        )}
                      >
                        {link.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side */}
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
  );
}

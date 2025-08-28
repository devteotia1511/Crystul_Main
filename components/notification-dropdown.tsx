"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, Check, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  isAccepted: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchNotifications();
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationAction = async (notificationId: string, action: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId, action }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(action === 'accept_connection' ? 'Connection accepted!' : 'Notification updated');
        // Optimistically remove the notification from local state
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        toast.error(data.message || 'Failed to update notification');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      toast.error('Failed to update notification');
    }
  };

  const handleTeamJoinAction = async (notification: Notification, accept: boolean) => {
    try {
      setActionLoadingId(notification.id);
      const teamId = notification.data?.teamId;
      const targetUserId = notification.sender?.id;
      if (!teamId || !targetUserId) {
        toast.error('Invalid team join request');
        return;
      }
      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: accept ? 'approve_join' : 'decline_join', targetUserId })
      });
      const data = await res.json();
      if (data.success) {
        // Mark notification as read to prevent re-appearing
        await fetch('/api/notifications', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notification.id, action: 'mark_read' })
        });
        // Remove locally and update count
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
        setUnreadCount((prev) => Math.max(0, prev - 1));
        toast.success(accept ? 'Join request approved' : 'Join request declined');
      } else {
        toast.error(data.message || 'Failed to process request');
      }
    } catch (e) {
      toast.error('Failed to process request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChat = async (senderId: string) => {
    try {
      // Create or get existing chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants: [senderId],
          chatType: 'direct'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to chat or open chat modal
        toast.success('Chat initiated!');
        // You can implement chat opening logic here
      } else {
        toast.error('Failed to start chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative rounded-full hover:bg-primary/10 text-foreground hover:text-primary">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 bg-card border-border">
        <DropdownMenuLabel className="flex items-center justify-between text-foreground">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border" />
        
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications
              .filter((n) => !n.isRead) // hide read notifications
              .slice(0, 10)
              .map((notification) => (
                <div key={notification.id} className="p-3 border-b border-border last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.sender?.avatar} alt={notification.sender?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {notification.sender?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{notification.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      
                      {notification.type === 'connection_request' && !notification.isAccepted && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleNotificationAction(notification.id, 'accept_connection')}
                            className="h-6 px-2 text-xs bg-primary text-primary-foreground hover:opacity-90"
                            disabled={actionLoadingId === notification.id}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {actionLoadingId === notification.id ? 'Working...' : 'Accept'}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleNotificationAction(notification.id, 'reject_connection')}
                            className="h-6 px-2 text-xs border-border text-foreground hover:bg-primary/10 hover:text-primary"
                            disabled={actionLoadingId === notification.id}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Decline
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleChat(notification.sender?.id || '')}
                            className="h-6 px-2 text-xs text-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      )}

                      {notification.type === 'team_join_request' && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleTeamJoinAction(notification, true)}
                            className="h-6 px-2 text-xs bg-primary text-primary-foreground hover:opacity-90"
                            disabled={actionLoadingId === notification.id}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            {actionLoadingId === notification.id ? 'Working...' : 'Approve'}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTeamJoinAction(notification, false)}
                            className="h-6 px-2 text-xs border-border text-foreground hover:bg-primary/10 hover:text-primary"
                            disabled={actionLoadingId === notification.id}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Decline
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleChat(notification.sender?.id || '')}
                            className="h-6 px-2 text-xs text-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        {notifications.length > 10 && (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-center text-sm text-muted-foreground hover:text-primary hover:bg-primary/10">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

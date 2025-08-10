"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Search,
  Plus,
  Loader2,
  Paperclip,
  Smile,
  Image,
  File,
  Video,
  Mic,
  MoreHorizontal,
  Phone,
  Volume2,
  VolumeX,
  Settings,
  UserPlus,
  Archive,
  Trash2,
  Edit,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Chat {
  id: string;
  chatType: 'direct' | 'team';
  teamId?: string;
  participants: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }[];
  lastMessage: string;
  messageCount: number;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  messageType: string;
  timestamp: string;
  isRead: boolean;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  teamName?: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetchChats();
    }
  }, [status, session]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  // Fetch all users for dropdown
  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchAllUsers();
    }
  }, [status, session]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat');
      const data = await response.json();
      
      if (data.success) {
        setChats(data.chats);
      } else {
        console.error('Failed to load chats:', data.message);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/chat/${selectedChat.id}/messages`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
      } else {
        console.error('Failed to load messages:', data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageContent = newMessage.trim();
    setNewMessage('');

    try {
      // Optimistically add message to UI
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        messageType: 'text',
        timestamp: new Date().toISOString(),
        isRead: false,
        sender: {
          id: session?.user?.email || '',
          name: session?.user?.name || 'You',
          email: session?.user?.email || '',
          avatar: session?.user?.image || ''
        }
      };

      setMessages(prev => [...prev, optimisticMessage]);

      const response = await fetch(`/api/chat/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: messageContent,
          messageType: 'text'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Replace optimistic message with real one
        setMessages(prev => prev.map(msg => 
          msg.id === optimisticMessage.id ? data.message : msg
        ));
        fetchChats(); // Refresh chat list to update last message
      } else {
        // Remove optimistic message if failed
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        setNewMessage(messageContent); // Restore message
        console.error('Failed to send message:', data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
      setNewMessage(messageContent); // Restore message
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChat) return;

    try {
      setLoading(true);
      const isImage = file.type.startsWith('image/');
      const filePath = `chat-uploads/${selectedChat.id}/${Date.now()}-${file.name}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      // Send message with URL
      const response = await fetch(`/api/chat/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: url,
          messageType: isImage ? 'image' : 'file'
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        fetchChats();
        toast.success('File sent');
      } else {
        toast.error('Failed to send file');
      }
    } catch (err) {
      console.error('File upload error:', err);
      toast.error('File upload failed');
    } finally {
      setLoading(false);
      // reset input
      (event.target as HTMLInputElement).value = '';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
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

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '👏', '🙏', '🤔', '😎', '🥳', '😍', '🤩', '😢', '😡', '🤯', '🥺', '🤗', '🤫', '🤐', '🤮', '🤧', '😷', '🤠', '🤡', '👻', '👽', '🤖', '💀', '👹', '👺', '👻', '👽', '🤖', '💀'];

  const filteredChats = chats.filter(chat => {
    const searchLower = searchQuery.toLowerCase();
    return chat.participants.some(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.email.toLowerCase().includes(searchLower)
    );
  });

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) setAllUsers(data.users);
    } catch (e) {}
  };

  // Start conversation with selected user
  const startConversation = async (user: User) => {
    try {
      setShowUserDropdown(false);
      setLoading(true);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: [user.id], chatType: 'direct' })
      });
      const data = await res.json();
      if (data.success && data.chat) {
        await fetchChats();
        setSelectedChat({
          id: data.chat.id,
          chatType: data.chat.chatType,
          teamId: data.chat.teamId,
          participants: [
            { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
            { id: session?.user?.email || '', name: session?.user?.name || '', email: session?.user?.email || '', avatar: session?.user?.image || '' }
          ],
          lastMessage: data.chat.lastMessage,
          messageCount: 0,
          unreadCount: 0
        });
      } else {
        toast.error('Failed to start conversation');
      }
    } catch (e) {
      toast.error('Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-display font-semibold text-gray-900 mb-2">
            Loading Chat...
          </h1>
          <p className="text-gray-600 font-sans">
            Please wait while we load your conversations.
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex">
        {/* Chat List */}
        <div className="w-80 border-r border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-display font-semibold text-gray-900">Messages</h1>
              <div className="relative">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 shadow-sm" onClick={() => setShowUserDropdown((v) => !v)}>
                  <Plus className="h-4 w-4" />
                </Button>
                {showUserDropdown && (
                  <div ref={dropdownRef} className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b font-semibold text-gray-900">Start Conversation</div>
                    {allUsers.length === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">No users found</div>
                    ) : (
                      allUsers.map((user) => (
                        <button key={user.id} className="w-full flex items-center px-4 py-2 hover:bg-blue-50 transition" onClick={() => startConversation(user)}>
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-medium text-gray-900 truncate">{user.name}</div>
                            {user.teamName && <div className="text-xs text-gray-500 truncate">{user.teamName}</div>}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 mb-4">Start connecting with other entrepreneurs</p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm">
                  Start a conversation
                </Button>
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${
                    selectedChat?.id === chat.id ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                      <AvatarImage src={chat.participants[0]?.avatar} alt={chat.participants[0]?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                        {chat.chatType === 'team' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          chat.participants[0]?.name?.charAt(0) || 'U'
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate text-gray-900">
                          {chat.chatType === 'team' 
                            ? `Team Chat (${chat.participants.length} members)`
                            : chat.participants.find(p => p.email !== session?.user?.email)?.name || 'Unknown'
                          }
                        </p>
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs bg-red-500">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(chat.lastMessage)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                      <AvatarImage src={selectedChat.participants[0]?.avatar} alt={selectedChat.participants[0]?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                        {selectedChat.chatType === 'team' ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          selectedChat.participants[0]?.name?.charAt(0) || 'U'
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {selectedChat.chatType === 'team' 
                          ? `Team Chat (${selectedChat.participants.length} members)`
                          : selectedChat.participants.find(p => p.email !== session?.user?.email)?.name || 'Unknown'
                        }
                      </h2>
                      <p className="text-sm text-gray-500">
                        {selectedChat.participants.length} participants
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`transition-colors ${isMuted ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                        <DropdownMenuItem className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <Settings className="mr-2 h-4 w-4" />
                          Chat Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                          <Archive className="mr-2 h-4 w-4" />
                          Archive Chat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600">Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.sender.email === session?.user?.email ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8 ring-1 ring-gray-200">
                        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                          {message.sender.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${
                          message.sender.email === session?.user?.email
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium opacity-90">
                            {message.sender.name}
                          </span>
                          <span className="text-xs px-3 opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="grid grid-cols-8 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => handleEmojiClick(emoji)}
                        className="p-2 hover:bg-gray-100 rounded text-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                      <DropdownMenuLabel className="text-gray-900">Add to chat</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => document.getElementById('file-upload')?.click()} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                        <File className="mr-2 h-4 w-4" />
                        Document
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => document.getElementById('file-upload')?.click()} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                        <Image className="mr-2 h-4 w-4" />
                        Photo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => document.getElementById('file-upload')?.click()} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                        <Video className="mr-2 h-4 w-4" />
                        Video
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                        <Users className="mr-2 h-4 w-4" />
                        Create Group
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                        <Phone className="mr-2 h-4 w-4" />
                        Voice Call
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-white text-black font-display"
                    disabled={loading}
                  />

                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Hidden file input */}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-600">Choose a chat from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 
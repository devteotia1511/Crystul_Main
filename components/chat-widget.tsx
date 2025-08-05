"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  X, 
  Users, 
  Minimize2, 
  Maximize2,
  Paperclip,
  Smile,
  Image,
  File,
  Video,
  Mic,
  MoreHorizontal,
  Plus,
  Settings,
  Search,
  Phone,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';

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

interface ChatWidgetProps {
  chatId?: string;
  participants?: string[];
  chatType?: 'direct' | 'team';
  teamId?: string;
  onClose?: () => void;
}

export default function ChatWidget({ 
  chatId, 
  participants = [], 
  chatType = 'direct', 
  teamId,
  onClose 
}: ChatWidgetProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentChatId) {
      fetchMessages();
    } else if (participants.length > 0) {
      createOrGetChat();
    }
  }, [currentChatId, participants]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createOrGetChat = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participants,
          chatType,
          teamId
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentChatId(data.chat.id);
        fetchMessages();
      } else {
        console.error('Failed to create chat:', data.message);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!currentChatId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/chat/${currentChatId}/messages`);
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
    if (!newMessage.trim() || !currentChatId) return;

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

      const response = await fetch(`/api/chat/${currentChatId}/messages`, {
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      toast.success(`File "${file.name}" uploaded successfully!`);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💯', '👏', '🙏', '🤔', '😎', '🥳'];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-3 w-3 text-white" />
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900">Chat</CardTitle>
                {chatType === 'team' && <Users className="h-3 w-3 text-purple-600" />}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(false)}
                  className="h-6 w-6 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                {onClose && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 h-96 shadow-xl border-0 bg-white/95 backdrop-blur-sm flex flex-col">
        <CardHeader className="pb-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-900">Chat</CardTitle>
              {chatType === 'team' && <Users className="h-3 w-3 text-purple-600" />}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={`h-6 w-6 p-0 transition-colors ${isMuted ? 'text-red-500 hover:text-red-600 hover:bg-red-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {loading ? (
              <div className="text-center text-sm text-gray-500">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-sm text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${
                    message.sender.email === session?.user?.email ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="h-6 w-6 ring-1 ring-gray-200">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                      {message.sender.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                      message.sender.email === session?.user?.email
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium opacity-90">
                        {message.sender.name}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="p-2 border-t border-gray-200 bg-white">
              <div className="grid grid-cols-6 gap-1">
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
          <div className="p-3 border-t border-gray-200 bg-gray-50/50">
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
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                    <File className="mr-2 h-4 w-4" />
                    Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                    <Image className="mr-2 h-4 w-4" />
                    Photo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="text-gray-700 hover:text-blue-600 hover:bg-blue-50">
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
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-white border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                disabled={loading}
              />

              <Button
                size="sm"
                onClick={sendMessage}
                disabled={!newMessage.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
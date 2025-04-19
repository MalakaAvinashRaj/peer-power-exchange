
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send, User, UserPlus, MessageSquare, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useConnections } from '@/hooks/useConnections';
import { useMessaging } from '@/hooks/useMessaging';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import StartChatDialog from '@/components/StartChatDialog';
import { supabase } from '@/integrations/supabase/client';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Messages = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showStartChatDialog, setShowStartChatDialog] = useState(false);
  const [showContactsList, setShowContactsList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { messages, isLoading, canSendMessages, sendMessage } = useMessaging(selectedUserId || undefined);
  const { getConnectionStatus, getPendingConnections } = useConnections();
  
  type Conversation = {
    id: string;
    name: string;
    avatar: string | null;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
  };
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  useEffect(() => {
    const loadConnections = async () => {
      if (!user) return;
      
      try {
        setIsLoadingConnections(true);
        
        const { data, error } = await supabase.rpc('get_connections', { 
          user_id_param: user.id 
        });
          
        if (error) throw error;
        setConnections(data || []);
        
        const urlParams = new URLSearchParams(window.location.search);
        const userIdParam = urlParams.get('user');
        if (userIdParam) {
          setSelectedUserId(userIdParam);
        }
      } catch (err) {
        console.error('Error loading connections:', err);
        toast.error('Failed to load connections');
      } finally {
        setIsLoadingConnections(false);
      }
    };
    
    loadConnections();
    
    const handleConnectionChange = () => {
      loadConnections();
    };
    
    window.addEventListener('connection-change', handleConnectionChange);
    
    return () => {
      window.removeEventListener('connection-change', handleConnectionChange);
    };
  }, [user]);
  
  useEffect(() => {
    if (!connections.length) return;
    
    const convs: Conversation[] = connections.map(conn => {
      return {
        id: conn.user_id,
        name: conn.name,
        avatar: conn.avatar_url,
        lastMessage: 'Start a conversation',
        timestamp: '',
        unread: false
      };
    });
    
    if (selectedUserId && messages.length > 0) {
      const selectedConvIndex = convs.findIndex(conv => conv.id === selectedUserId);
      if (selectedConvIndex >= 0) {
        const latestMessage = messages[messages.length - 1];
        convs[selectedConvIndex].lastMessage = latestMessage.content;
        convs[selectedConvIndex].timestamp = format(new Date(latestMessage.created_at), 'PP');
        convs[selectedConvIndex].unread = latestMessage.receiver_id === user?.id && !latestMessage.read;
      }
    }
    
    setConversations(convs);
  }, [connections, messages, selectedUserId, user?.id]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!user || !selectedUserId || !newMessage.trim() || !canSendMessages) return;
    
    const success = await sendMessage(user.id, selectedUserId, newMessage.trim());
    if (success) {
      setNewMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    if (isMobile) {
      setShowContactsList(false);
    }
  };
  
  // Render conversation list content
  const renderConversationList = () => (
    <Card className="h-[600px] flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages" className="pl-8" />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {isLoadingConnections ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground">Loading connections...</p>
            </div>
          ) : conversations.length > 0 ? (
            conversations.map(conversation => (
              <div 
                key={conversation.id} 
                className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-muted rounded-md ${
                  conversation.id === selectedUserId ? 'bg-muted' : ''
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <Avatar>
                  <AvatarImage src={conversation.avatar || ''} />
                  <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{conversation.name}</h3>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No conversations yet</p>
              <Button variant="outline" size="sm" onClick={() => setShowStartChatDialog(true)}>
                Start a new chat
              </Button>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
  
  // Render conversation detail content
  const renderConversationDetail = () => (
    <Card className="h-[600px] flex flex-col">
      {selectedUserId ? (
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="pb-4 border-b flex items-center gap-2">
            {isMobile && (
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => setShowContactsList(true)}>
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <Avatar>
              <AvatarImage src={conversations.find(c => c.id === selectedUserId)?.avatar || ''} />
              <AvatarFallback>
                {conversations.find(c => c.id === selectedUserId)?.name.charAt(0) || <User size={16} />}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium">{conversations.find(c => c.id === selectedUserId)?.name}</h2>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : (
              <div className="space-y-4 px-1">
                {messages.length > 0 ? (
                  messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] p-3 rounded-lg ${
                          message.sender_id === user?.id 
                            ? 'bg-skillsync-blue text-white rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.sender_id === user?.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {format(new Date(message.created_at), 'p')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">Start a conversation</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          
          <div className="pt-4 border-t mt-auto">
            <div className="flex gap-2">
              <Input 
                placeholder={canSendMessages ? "Type a message..." : "You can't message this user"} 
                className="flex-1" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!canSendMessages}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!canSendMessages || !newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Your Messages</h3>
          <p className="text-muted-foreground mb-4 text-center max-w-sm">
            Select a conversation from the sidebar or start a new chat with one of your connections.
          </p>
          <Button onClick={() => setShowStartChatDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Start a new chat
          </Button>
        </div>
      )}
    </Card>
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <Button onClick={() => setShowStartChatDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        
        {isMobile ? (
          <>
            {/* Mobile View */}
            <div className="block md:hidden">
              {showContactsList || !selectedUserId ? (
                <div>
                  {renderConversationList()}
                </div>
              ) : (
                <div>
                  {renderConversationDetail()}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden md:grid md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                {renderConversationList()}
              </div>
              <div className="md:col-span-3">
                {renderConversationDetail()}
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
      {showStartChatDialog && (
        <StartChatDialog 
          onClose={() => setShowStartChatDialog(false)}
          onSelectUser={(userId) => {
            setSelectedUserId(userId);
            setShowStartChatDialog(false);
            if (isMobile) {
              setShowContactsList(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default Messages;

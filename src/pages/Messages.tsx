
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, Send, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useConnections } from '@/hooks/useConnections';
import { useMessaging } from '@/hooks/useMessaging';

const Messages = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, canSendMessages, sendMessage } = useMessaging(selectedUserId || undefined);
  
  // Type for conversation
  type Conversation = {
    id: string;
    name: string;
    avatar: string | null;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
  };
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  
  // Load connections
  useEffect(() => {
    const loadConnections = async () => {
      if (!user) return;
      
      try {
        setIsLoadingConnections(true);
        const { data, error } = await supabase
          .from('connections')
          .select(`
            id,
            sender_id,
            receiver_id,
            sender:profiles!connections_sender_id_fkey(id, name, avatar_url),
            receiver:profiles!connections_receiver_id_fkey(id, name, avatar_url)
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .eq('status', 'accepted');
          
        if (error) throw error;
        setConnections(data || []);
      } catch (err) {
        console.error('Error loading connections:', err);
        toast.error('Failed to load connections');
      } finally {
        setIsLoadingConnections(false);
      }
    };
    
    loadConnections();
  }, [user]);
  
  // Generate conversations from connections and messages
  useEffect(() => {
    if (!connections.length) return;
    
    const convs: Conversation[] = connections.map(conn => {
      const isUserSender = conn.sender_id === user?.id;
      const otherUser = isUserSender ? conn.receiver : conn.sender;
      
      // Find the latest message between these users
      const latestMessage = messages.length ? messages[messages.length - 1] : null;
      
      return {
        id: otherUser.id,
        name: otherUser.name,
        avatar: otherUser.avatar_url,
        lastMessage: latestMessage?.content || 'Start a conversation',
        timestamp: latestMessage?.created_at ? format(new Date(latestMessage.created_at), 'PP') : '',
        unread: latestMessage ? latestMessage.receiver_id === user?.id && !latestMessage.read : false
      };
    });
    
    setConversations(convs);
  }, [connections, messages, user?.id]);
  
  // Scroll to bottom of messages
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
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Conversations sidebar */}
          <Card className="md:col-span-1 h-[600px] flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages" className="pl-8" />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1">
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
                      onClick={() => setSelectedUserId(conversation.id)}
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
                        <div className="w-2 h-2 rounded-full bg-skillsync-blue"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center h-full">
                    <p className="text-muted-foreground mb-2">No connections yet</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/network">Find Connections</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Conversation */}
          <Card className="md:col-span-3 h-[600px] flex flex-col">
            {selectedUserId ? (
              <CardContent className="p-4 flex-1 flex flex-col">
                {/* Conversation header */}
                <div className="pb-4 border-b flex items-center gap-2">
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
                
                {/* Messages */}
                {isLoading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <p className="text-muted-foreground">Loading messages...</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.length > 0 ? (
                      messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.sender_id === user?.id 
                                ? 'bg-skillsync-blue text-white rounded-tr-none' 
                                : 'bg-muted rounded-tl-none'
                            }`}
                          >
                            <p>{message.content}</p>
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
                
                {/* Message input */}
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
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;

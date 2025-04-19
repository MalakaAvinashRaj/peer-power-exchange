
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { useConnections } from '@/hooks/useConnections';
import StartChatDialog from '@/components/StartChatDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import MessageList from '@/components/MessageList';
import MessageView from '@/components/MessageView';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Messages = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showStartChatDialog, setShowStartChatDialog] = useState(false);
  const [showContactsList, setShowContactsList] = useState(false);
  const isMobile = useIsMobile();
  
  const { messages, isLoading, canSendMessages, sendMessage } = useMessaging(selectedUserId || undefined);
  const { getConnectionStatus } = useConnections();
  
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
  
  const handleSendMessage = async () => {
    if (!user || !selectedUserId || !newMessage.trim() || !canSendMessages) return;
    
    const success = await sendMessage(user.id, selectedUserId, newMessage.trim());
    if (success) {
      setNewMessage('');
    }
  };

  const selectedUser = conversations.find(c => c.id === selectedUserId) || null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <Button onClick={() => setShowStartChatDialog(true)}>
            Start new chat
          </Button>
        </div>
        
        {isMobile ? (
          <div className="block md:hidden">
            <Card className="h-[600px] flex flex-col">
              <CardContent className="p-4 flex-1 flex flex-col">
                {showContactsList || !selectedUserId ? (
                  <MessageList 
                    conversations={conversations}
                    selectedUserId={selectedUserId}
                    onSelectConversation={(userId) => {
                      setSelectedUserId(userId);
                      setShowContactsList(false);
                    }}
                    isLoading={isLoadingConnections}
                    onNewChat={() => setShowStartChatDialog(true)}
                  />
                ) : (
                  <MessageView 
                    selectedUser={selectedUser}
                    messages={messages}
                    isLoading={isLoading}
                    canSendMessages={canSendMessages}
                    onSendMessage={handleSendMessage}
                    newMessage={newMessage}
                    onNewMessageChange={(value) => setNewMessage(value)}
                    onMobileMenuClick={() => setShowContactsList(true)}
                    isMobile={true}
                    currentUserId={user?.id}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="hidden md:grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card className="h-[600px] flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <MessageList 
                    conversations={conversations}
                    selectedUserId={selectedUserId}
                    onSelectConversation={setSelectedUserId}
                    isLoading={isLoadingConnections}
                    onNewChat={() => setShowStartChatDialog(true)}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <MessageView 
                    selectedUser={selectedUser}
                    messages={messages}
                    isLoading={isLoading}
                    canSendMessages={canSendMessages}
                    onSendMessage={handleSendMessage}
                    newMessage={newMessage}
                    onNewMessageChange={(value) => setNewMessage(value)}
                    isMobile={false}
                    currentUserId={user?.id}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
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

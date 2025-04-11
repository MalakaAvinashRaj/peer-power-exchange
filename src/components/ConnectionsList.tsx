
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Connection = {
  id: string;
  user_id: string;
  name: string;
  username: string | null;
  avatar_url: string | null;
};

const ConnectionsList = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch connections where the current user is either sender or receiver
        const { data: sentConnections, error: sentError } = await supabase
          .from('connections')
          .select(`
            id,
            receiver_id,
            profiles:receiver_id (id, name, username, avatar_url)
          `)
          .eq('sender_id', user.id)
          .eq('status', 'accepted');
          
        if (sentError) throw sentError;
        
        const { data: receivedConnections, error: receivedError } = await supabase
          .from('connections')
          .select(`
            id,
            sender_id,
            profiles:sender_id (id, name, username, avatar_url)
          `)
          .eq('receiver_id', user.id)
          .eq('status', 'accepted');
          
        if (receivedError) throw receivedError;
        
        // Transform the data into a consistent format
        const formattedSentConnections = sentConnections.map(conn => ({
          id: conn.id,
          user_id: conn.receiver_id,
          name: (conn.profiles as Tables<'profiles'>).name,
          username: (conn.profiles as Tables<'profiles'>).username,
          avatar_url: (conn.profiles as Tables<'profiles'>).avatar_url
        }));
        
        const formattedReceivedConnections = receivedConnections.map(conn => ({
          id: conn.id,
          user_id: conn.sender_id,
          name: (conn.profiles as Tables<'profiles'>).name,
          username: (conn.profiles as Tables<'profiles'>).username,
          avatar_url: (conn.profiles as Tables<'profiles'>).avatar_url
        }));
        
        // Combine both sets of connections
        setConnections([...formattedSentConnections, ...formattedReceivedConnections]);
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load connections');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConnections();
  }, [user?.id]);

  if (isLoading) {
    return <div className="text-center py-4">Loading connections...</div>;
  }

  if (connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have no connections yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Connections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.map(connection => (
          <div key={connection.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={connection.avatar_url || ''} />
                <AvatarFallback>
                  {connection.name ? connection.name.charAt(0) : <User size={16} />}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link 
                  to={`/profile/${connection.user_id}`} 
                  className="font-medium hover:underline"
                >
                  {connection.name}
                </Link>
                {connection.username && (
                  <div className="text-sm text-muted-foreground">
                    @{connection.username}
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="px-3"
                asChild
              >
                <Link to={`/messages?user=${connection.user_id}`}>
                  <MessageSquare size={16} className="mr-1" /> Message
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectionsList;

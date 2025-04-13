
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
        
        // Use Supabase RPC function to get connections
        const { data, error } = await supabase
          .rpc('get_connections', { 
            user_id_param: user.id 
          });
          
        if (error) throw error;
        
        if (data) {
          setConnections(data as Connection[]);
        } else {
          setConnections([]);
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast.error('Failed to load connections');
        setConnections([]);
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

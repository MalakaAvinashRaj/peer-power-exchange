
import React, { useEffect, useState } from 'react';
import { useConnections } from '@/hooks/useConnections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Check, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ConnectionRequests = () => {
  const { user } = useAuth();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [connectionSubscribed, setConnectionSubscribed] = useState(false);
  
  const { 
    pendingConnections, 
    isLoadingPendingConnections, 
    getPendingConnections, 
    respondToConnectionRequest,
    subscribeToConnectionChanges
  } = useConnections();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initializeConnectionRequests = async () => {
      if (!user?.id) return;
      
      try {
        // Initial fetch of pending connections
        await getPendingConnections();
        
        // Set up subscription for real-time updates
        unsubscribe = subscribeToConnectionChanges(user.id);
        setConnectionSubscribed(true);
        
        // Listen for connection change events to refresh the list
        const handleConnectionChange = () => {
          console.log('Connection state changed, refreshing pending connections');
          getPendingConnections();
        };
        
        window.addEventListener('connection-change', handleConnectionChange);
        
        setIsFirstLoad(false);
        
        return () => {
          window.removeEventListener('connection-change', handleConnectionChange);
        };
      } catch (error) {
        console.error('Error initializing connection requests:', error);
        toast.error('Failed to load connection requests');
        setIsFirstLoad(false);
      }
    };
    
    initializeConnectionRequests();
    
    return () => {
      if (unsubscribe) {
        console.log('Unsubscribing from ConnectionRequests component');
        unsubscribe();
      }
    };
  }, [user?.id, getPendingConnections, subscribeToConnectionChanges]);

  const handleAccept = async (connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'accepted');
  };

  const handleDecline = async (connectionId: string) => {
    await respondToConnectionRequest(connectionId, 'declined');
  };

  if (isFirstLoad) {
    return <div className="text-center py-4">Loading connection requests...</div>;
  }

  if (isLoadingPendingConnections && pendingConnections.length === 0) {
    return <div className="text-center py-4">Loading connection requests...</div>;
  }

  if (!connectionSubscribed) {
    return <div className="text-center py-4">Setting up real-time updates...</div>;
  }

  if (pendingConnections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connection Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have no pending connection requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingConnections.map(connection => (
          <div key={connection.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={connection.sender_avatar_url || ''} />
                <AvatarFallback>
                  {connection.sender_name ? connection.sender_name.charAt(0) : <User size={16} />}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link 
                  to={`/profile/${connection.sender_id}`} 
                  className="font-medium hover:underline"
                >
                  {connection.sender_name}
                </Link>
                {connection.sender_username && (
                  <div className="text-sm text-muted-foreground">
                    @{connection.sender_username}
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(connection.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600 hover:text-green-700 border-green-600 hover:border-green-700"
                onClick={() => handleAccept(connection.id)}
              >
                <Check size={16} className="mr-1" /> Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                onClick={() => handleDecline(connection.id)}
              >
                <X size={16} className="mr-1" /> Decline
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ConnectionRequests;

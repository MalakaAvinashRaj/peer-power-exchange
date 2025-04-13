
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;
export type PendingConnection = {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_username: string;
  sender_avatar_url: string;
  created_at: string;
};

export type ConnectionStatus = 'none' | 'pending' | 'accepted' | 'declined';

export type SearchResults = {
  usernameMatches: Profile[];
  nameMatches: Profile[];
};

// Custom event for connection changes
const connectionChangeEvent = new CustomEvent('connection-change');

export const useConnections = () => {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    usernameMatches: [],
    nameMatches: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [pendingConnections, setPendingConnections] = useState<PendingConnection[]>([]);
  const [isLoadingPendingConnections, setIsLoadingPendingConnections] = useState(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);

  // Fetch all users (for search functionality)
  const fetchAllUsers = useCallback(async () => {
    try {
      setIsSearching(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(100);

      if (error) throw error;
      
      setAllProfiles(profiles || []);
      setIsInitialFetchDone(true);
    } catch (error) {
      console.error('Error fetching all users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialFetchDone) {
      fetchAllUsers();
    }
  }, [isInitialFetchDone, fetchAllUsers]);

  // Search users from the cached profiles
  const searchUsers = useCallback((query: string) => {
    if (!query.trim() || !isInitialFetchDone) {
      setSearchResults({
        usernameMatches: [],
        nameMatches: []
      });
      return;
    }

    try {
      setIsSearching(true);
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // Get current user ID
      supabase.auth.getUser().then(({ data }) => {
        const userId = data.user?.id;
        
        // Filter matches from the cached profiles
        const usernameMatches = allProfiles.filter(profile => 
          profile.id !== userId && 
          profile.username?.toLowerCase().includes(normalizedQuery)
        ).slice(0, 5);
        
        const usernameIds = new Set(usernameMatches.map(p => p.id));
        const nameMatches = allProfiles.filter(profile => 
          profile.id !== userId && 
          !usernameIds.has(profile.id) &&
          profile.name?.toLowerCase().includes(normalizedQuery)
        ).slice(0, 5);

        setSearchResults({
          usernameMatches,
          nameMatches
        });
        
        setIsSearching(false);
      });
    } catch (error) {
      console.error('Error filtering users:', error);
      setIsSearching(false);
    }
  }, [allProfiles, isInitialFetchDone]);

  // Send a connection request
  const sendConnectionRequest = async (receiverId: string) => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user?.id) {
        toast.error('You must be logged in to send connection requests');
        return false;
      }
      
      const response = await supabase
        .rpc('create_connection', { 
          sender_id_param: user.id,
          receiver_id_param: receiverId 
        });

      if (response.error) {
        if (response.error.message.includes('Connection request already exists')) {
          toast.error('Connection request already exists');
        } else {
          throw response.error;
        }
        return false;
      }

      // Emit the connection change event to update UI
      window.dispatchEvent(connectionChangeEvent);
      toast.success('Connection request sent');
      return true;
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
      return false;
    }
  };

  // Get connection status between current user and another user
  const getConnectionStatus = async (otherUserId: string): Promise<ConnectionStatus> => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user?.id) {
        return 'none';
      }
      
      const response = await supabase
        .rpc('get_connection_status', { 
          user_id_param: user.id,
          other_user_id_param: otherUserId 
        });

      if (response.error) throw response.error;
      return response.data as ConnectionStatus;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return 'none';
    }
  };

  // Get pending connection requests
  const getPendingConnections = useCallback(async () => {
    try {
      setIsLoadingPendingConnections(true);
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      
      if (!user?.id) {
        setPendingConnections([]);
        return;
      }
      
      const response = await supabase
        .rpc('get_pending_connections', { 
          user_id_param: user.id 
        });

      if (response.error) throw response.error;
      
      console.log('Pending connections:', response.data);
      setPendingConnections(response.data || []);
    } catch (error) {
      console.error('Error getting pending connections:', error);
      toast.error('Failed to get pending connection requests');
    } finally {
      setIsLoadingPendingConnections(false);
    }
  }, []);

  // Respond to a connection request (accept or decline)
  const respondToConnectionRequest = async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      const response = await supabase
        .rpc('update_connection_status', { 
          connection_id_param: connectionId,
          status_param: status 
        });

      if (response.error) throw response.error;
      
      setPendingConnections(prev => prev.filter(conn => conn.id !== connectionId));
      
      // Emit the connection change event to update UI
      window.dispatchEvent(connectionChangeEvent);
      
      toast.success(`Connection request ${status}`);
      return true;
    } catch (error) {
      console.error(`Error ${status} connection request:`, error);
      toast.error(`Failed to ${status} connection request`);
      return false;
    }
  };

  // Create subscription for real-time updates
  const subscribeToConnectionChanges = useCallback((userId: string) => {
    if (!userId) return undefined;
    
    console.log('Subscribing to connection changes for user:', userId);
    
    // Set up a channel to listen for real-time connection changes
    const channel = supabase
      .channel(`connection-changes-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
        filter: `sender_id=eq.${userId}`,
      }, () => {
        console.log('Connection change detected (as sender)');
        // Emit the connection change event to update UI
        window.dispatchEvent(connectionChangeEvent);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
        filter: `receiver_id=eq.${userId}`,
      }, () => {
        console.log('Connection change detected (as receiver)');
        // Emit the connection change event to update UI
        window.dispatchEvent(connectionChangeEvent);
      })
      .subscribe();
      
    return () => {
      console.log('Unsubscribing from connection changes');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    searchResults,
    isSearching,
    pendingConnections,
    isLoadingPendingConnections,
    searchUsers,
    sendConnectionRequest,
    getConnectionStatus,
    getPendingConnections,
    respondToConnectionRequest,
    fetchAllUsers,
    isInitialFetchDone,
    subscribeToConnectionChanges
  };
};

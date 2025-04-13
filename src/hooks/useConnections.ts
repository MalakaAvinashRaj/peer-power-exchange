
import { useState } from 'react';
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

export const useConnections = () => {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    usernameMatches: [],
    nameMatches: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [pendingConnections, setPendingConnections] = useState<PendingConnection[]>([]);
  const [isLoadingPendingConnections, setIsLoadingPendingConnections] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({
        usernameMatches: [],
        nameMatches: []
      });
      return;
    }

    try {
      setIsSearching(true);
      
      // Search for username matches
      const usernameResponse = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .limit(5);

      // Search for name matches
      const nameResponse = await supabase
        .from('profiles')
        .select('*')
        .ilike('name', `%${query}%`)
        .not('id', 'in', usernameResponse.data?.map(user => user.id) || [])
        .limit(5);

      if (usernameResponse.error) throw usernameResponse.error;
      if (nameResponse.error) throw nameResponse.error;

      setSearchResults({
        usernameMatches: usernameResponse.data || [],
        nameMatches: nameResponse.data || []
      });
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const sendConnectionRequest = async (receiverId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await supabase
        .rpc('create_connection', { 
          sender_id_param: user?.id,
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

      toast.success('Connection request sent');
      return true;
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
      return false;
    }
  };

  const getConnectionStatus = async (otherUserId: string): Promise<ConnectionStatus> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await supabase
        .rpc('get_connection_status', { 
          user_id_param: user?.id,
          other_user_id_param: otherUserId 
        });

      if (response.error) throw response.error;
      return response.data as ConnectionStatus;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return 'none';
    }
  };

  const getPendingConnections = async () => {
    try {
      setIsLoadingPendingConnections(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const response = await supabase
        .rpc('get_pending_connections', { 
          user_id_param: user?.id 
        });

      if (response.error) throw response.error;
      setPendingConnections(response.data || []);
    } catch (error) {
      console.error('Error getting pending connections:', error);
      toast.error('Failed to get pending connection requests');
    } finally {
      setIsLoadingPendingConnections(false);
    }
  };

  const respondToConnectionRequest = async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      const response = await supabase
        .rpc('update_connection_status', { 
          connection_id_param: connectionId,
          status_param: status 
        });

      if (response.error) throw response.error;
      
      // Update local state to remove the connection
      setPendingConnections(prev => prev.filter(conn => conn.id !== connectionId));
      
      toast.success(`Connection request ${status}`);
      return true;
    } catch (error) {
      console.error(`Error ${status} connection request:`, error);
      toast.error(`Failed to ${status} connection request`);
      return false;
    }
  };

  return {
    searchResults,
    isSearching,
    pendingConnections,
    isLoadingPendingConnections,
    searchUsers,
    sendConnectionRequest,
    getConnectionStatus,
    getPendingConnections,
    respondToConnectionRequest
  };
};

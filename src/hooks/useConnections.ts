
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

export const useConnections = () => {
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pendingConnections, setPendingConnections] = useState<PendingConnection[]>([]);
  const [isLoadingPendingConnections, setIsLoadingPendingConnections] = useState(false);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const { data, error } = await (supabase
        .rpc('search_users', { search_query: query }) as any);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const sendConnectionRequest = async (receiverId: string) => {
    try {
      const { data, error } = await (supabase
        .rpc('create_connection', { 
          sender_id_param: supabase.auth.getUser()?.data?.user?.id,
          receiver_id_param: receiverId 
        }) as any);

      if (error) {
        if (error.message.includes('Connection request already exists')) {
          toast.error('Connection request already exists');
        } else {
          throw error;
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
      const { data, error } = await (supabase
        .rpc('get_connection_status', { 
          user_id_param: supabase.auth.getUser()?.data?.user?.id,
          other_user_id_param: otherUserId 
        }) as any);

      if (error) throw error;
      return data as ConnectionStatus;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return 'none';
    }
  };

  const getPendingConnections = async () => {
    try {
      setIsLoadingPendingConnections(true);
      const { data, error } = await (supabase
        .rpc('get_pending_connections', { 
          user_id_param: supabase.auth.getUser()?.data?.user?.id 
        }) as any);

      if (error) throw error;
      setPendingConnections(data || []);
    } catch (error) {
      console.error('Error getting pending connections:', error);
      toast.error('Failed to get pending connection requests');
    } finally {
      setIsLoadingPendingConnections(false);
    }
  };

  const respondToConnectionRequest = async (connectionId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await (supabase
        .rpc('update_connection_status', { 
          connection_id_param: connectionId,
          status_param: status 
        }) as any);

      if (error) throw error;
      
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

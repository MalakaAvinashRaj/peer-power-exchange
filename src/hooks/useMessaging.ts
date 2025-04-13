
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
};

export const useMessaging = (otherUserId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canSendMessages, setCanSendMessages] = useState(false);

  const checkCanMessage = async (userId: string, otherUserId: string) => {
    try {
      const response = await supabase
        .rpc('can_message', { 
          user1_id: userId,
          user2_id: otherUserId 
        });

      if (response.error) throw response.error;
      return response.data as boolean;
    } catch (error) {
      console.error('Error checking if users can message:', error);
      return false;
    }
  };

  const fetchMessages = async (userId: string, otherId: string) => {
    try {
      setIsLoading(true);
      
      // Check if users can message each other
      const canMessage = await checkCanMessage(userId, otherId);
      setCanSendMessages(canMessage);
      
      if (!canMessage) {
        return;
      }
      
      // Fetch messages between users
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .or(`sender_id.eq.${otherId},receiver_id.eq.${otherId}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Filter to only include messages between these two users
      const filteredMessages = data.filter(msg => 
        (msg.sender_id === userId && msg.receiver_id === otherId) ||
        (msg.sender_id === otherId && msg.receiver_id === userId)
      );
      
      setMessages(filteredMessages);
      
      // Mark unread messages as read
      const unreadMessageIds = filteredMessages
        .filter(msg => msg.receiver_id === userId && !msg.read)
        .map(msg => msg.id);
        
      if (unreadMessageIds.length > 0) {
        await supabase
          .from('messages')
          .update({ read: true })
          .in('id', unreadMessageIds);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (userId: string, receiverId: string, content: string) => {
    try {
      // Check if users can message each other
      const canMessage = await checkCanMessage(userId, receiverId);
      if (!canMessage) {
        toast.error('You cannot message this user');
        return false;
      }
      
      const response = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: receiverId,
          content,
          read: false
        })
        .select()
        .single();

      if (response.error) throw response.error;
      
      // The real-time subscription should handle this, but let's also update the state
      // to provide immediate feedback to the user
      setMessages(prev => [...prev, response.data]);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return false;
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!otherUserId) return;

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) return;

      // Initial fetch
      await fetchMessages(user.id, otherUserId);

      // Create a more reliable channel for real-time updates
      const channel = supabase
        .channel(`messages-realtime-${user.id}-${otherUserId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${otherUserId},receiver_id=eq.${user.id}`,
        }, async (payload) => {
          console.log('New message received:', payload);
          // Fetch all messages again to ensure everything is up to date
          await fetchMessages(user.id, otherUserId);
        })
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id},receiver_id=eq.${otherUserId}`,
        }, async (payload) => {
          console.log('Message sent from self:', payload);
          // Refresh all messages
          await fetchMessages(user.id, otherUserId);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${otherUserId},receiver_id=eq.${user.id}`,
        }, async () => {
          console.log('Message updated (read status)');
          await fetchMessages(user.id, otherUserId);
        })
        .subscribe((status) => {
          console.log(`Realtime status for messages: ${status}`);
          if (status !== 'SUBSCRIBED') {
            console.error('Failed to subscribe to messages channel:', status);
          }
        });

      return () => {
        console.log('Unsubscribing from messages channel');
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtime();
    return () => {
      if (cleanup) {
        cleanup.then(unsub => {
          if (unsub) unsub();
        });
      }
    };
  }, [otherUserId]);

  return {
    messages,
    isLoading,
    canSendMessages,
    sendMessage,
    fetchMessages
  };
};

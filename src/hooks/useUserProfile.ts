
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

export const useUserProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url,
          username: data.username,
          bio: data.bio,
          isTeacher: data.is_teacher || false,
          is_onboarded: data.is_onboarded,
          updated_at: data.updated_at
        };
      }
      return null;
    } catch (error) {
      console.error('Error during user fetching:', error);
      return null;
    }
  };

  const updateUserData = async (userId: string): Promise<User | null> => {
    if (!userId) return null;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (data) {
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url,
          username: data.username,
          bio: data.bio,
          isTeacher: data.is_teacher || false,
          is_onboarded: data.is_onboarded,
          updated_at: data.updated_at
        };
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error in updateUserData:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchUserProfile,
    updateUserData,
    isLoading
  };
};

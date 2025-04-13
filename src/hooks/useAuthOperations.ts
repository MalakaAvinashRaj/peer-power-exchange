
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthResponse } from '@supabase/supabase-js';
import { UserFormData } from '@/types/auth';

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await supabase.auth.signInWithPassword({ email, password });
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: UserFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      console.log('Creating user with username:', userData.username);
      
      // First update the auth.users table with user metadata including the username
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            username: userData.username,
          },
        },
      });

      if (response.error) {
        console.error('Error creating auth user:', response.error);
        return response;
      }

      if (response.data.user) {
        console.log('User created with id:', response.data.user.id);
        console.log('Inserting profile with username:', userData.username);
        
        // Then create the profile in the profiles table with the username
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: response.data.user.id,
              email: response.data.user.email,
              name: userData.name,
              username: userData.username, // Make sure username is saved
              updated_at: new Date().toISOString(),
            },
          ]);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error in signUp function:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isLoading
  };
};

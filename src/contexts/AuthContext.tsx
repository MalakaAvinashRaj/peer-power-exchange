
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserFormData {
  name: string;
  username: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  username: string | null;
  bio: string | null;
  isTeacher: boolean;
  is_onboarded?: boolean;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, userData: UserFormData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; 
  updateUserData: () => Promise<void>;
  generateUsername: (fullName: string) => Promise<string>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state by checking for existing session
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // If we have a session, fetch the user profile
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Fetch user profile data from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url,
          username: data.username,
          bio: data.bio,
          isTeacher: data.is_teacher || false,
          is_onboarded: data.is_onboarded,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error('Error during user fetching:', error);
    }
  };

  const generateUsername = async (fullName: string): Promise<string> => {
    let baseUsername = fullName.toLowerCase().replace(/\s+/g, '');
    baseUsername = baseUsername.replace(/[^\w]/g, '');
    let username = baseUsername;
    let isUnique = false;
    let attempt = 0;
    
    while (!isUnique) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking username uniqueness:', error);
        throw error;
      }
      
      if (!data) {
        isUnique = true;
      } else {
        attempt += 1;
        username = `${baseUsername}${attempt}`;
      }
    }
    
    return username;
  };

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
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url,
          username: data.username,
          bio: data.bio,
          isTeacher: data.is_teacher || false,
          is_onboarded: data.is_onboarded,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error('Error in updateUserData:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    logout: signOut,
    updateUserData,
    generateUsername,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

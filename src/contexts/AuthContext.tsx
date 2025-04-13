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
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, userData: UserFormData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user.id) {
        setIsLoading(false);
        return;
      }

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
          setUser(data as User);
        }
      } catch (error) {
        console.error('Error during user fetching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUser();
    } else {
      setUser(null);
      setIsLoading(false);
    }
  }, [session]);

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

      if (response.data.user) {
        await supabase
          .from('profiles')
          .insert([
            {
              id: response.data.user.id,
              email: response.data.user.email,
              name: userData.name,
              username: userData.username,
              updated_at: new Date().toISOString(),
            },
          ]);
      }
      return response;
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
        setUser(data as User);
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
    updateUserData,
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

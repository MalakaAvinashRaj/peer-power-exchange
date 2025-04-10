
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'student' | 'teacher' | 'admin';
  isTeacher: boolean;
  is_onboarded?: boolean;
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isTeacher: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession);
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent Supabase Auth deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Got session:', currentSession);
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch additional user profile data from our profiles table
  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log('Fetching profile for user:', authUser.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      if (data) {
        console.log('Profile data:', data);
        // Cast the role to the correct type
        const userRole = (data.role || 'student') as 'student' | 'teacher' | 'admin';
        
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          avatar_url: data.avatar_url,
          role: userRole,
          isTeacher: data.is_teacher || false,
          is_onboarded: data.is_onboarded
        };
        
        setUser(userProfile);
        console.log('User profile set:', userProfile);
      } else {
        console.log('No profile found, creating one');
        // If no profile exists, create one based on auth data
        const newProfile = {
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata.name || 'User',
          avatar_url: authUser.user_metadata.avatar_url,
          role: 'student' as const,
          is_teacher: authUser.user_metadata.is_teacher || false,
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          setUser({
            ...newProfile,
            isTeacher: newProfile.is_teacher
          });
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add refreshUser method
  const refreshUser = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isTeacher: boolean) => {
    setIsLoading(true);
    
    try {
      console.log('Registering user:', email, name, isTeacher);
      // Register the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
            is_teacher: isTeacher,
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        throw error;
      }
      
      // If auto-confirm is disabled in Supabase, show a different message
      if (!data.session) {
        toast.success('Registration successful! Please check your email to confirm your account.');
        navigate('/login');
        setIsLoading(false);
        return;
      }
      
      toast.success('Account created successfully!');
      
      // Profile will be created by the onAuthStateChange handler
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      navigate('/');
      toast.success('Logged out successfully!');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Logout failed. Please try again.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

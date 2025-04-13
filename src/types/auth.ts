
import { AuthResponse } from '@supabase/supabase-js';

export interface UserFormData {
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

export interface AuthContextType {
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

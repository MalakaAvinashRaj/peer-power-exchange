
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  isTeacher: boolean;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isTeacher: boolean) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('skillsync_user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('skillsync_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock login - would be replaced with actual API call to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'admin@skillsync.com' && password === 'password') {
        const userData: User = {
          id: '1',
          email,
          name: 'Admin User',
          avatar: 'https://i.pravatar.cc/150?u=admin',
          role: 'admin',
          isTeacher: true
        };
        
        setUser(userData);
        localStorage.setItem('skillsync_user', JSON.stringify(userData));
        toast.success('Logged in successfully!');
        navigate('/dashboard');
        return;
      }
      
      if (email === 'teacher@skillsync.com' && password === 'password') {
        const userData: User = {
          id: '2',
          email,
          name: 'Teacher User',
          avatar: 'https://i.pravatar.cc/150?u=teacher',
          role: 'teacher',
          isTeacher: true
        };
        
        setUser(userData);
        localStorage.setItem('skillsync_user', JSON.stringify(userData));
        toast.success('Logged in successfully!');
        navigate('/dashboard');
        return;
      }
      
      if (email === 'student@skillsync.com' && password === 'password') {
        const userData: User = {
          id: '3',
          email,
          name: 'Student User',
          avatar: 'https://i.pravatar.cc/150?u=student',
          role: 'student',
          isTeacher: false
        };
        
        setUser(userData);
        localStorage.setItem('skillsync_user', JSON.stringify(userData));
        toast.success('Logged in successfully!');
        navigate('/dashboard');
        return;
      }
      
      // If we reach here, credentials are invalid
      toast.error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isTeacher: boolean) => {
    setIsLoading(true);
    
    try {
      // This is a mock registration - would be replaced with actual API call to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const userData: User = {
        id: Math.random().toString(36).substring(2, 9), // Random ID
        email,
        name,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        role: isTeacher ? 'teacher' : 'student',
        isTeacher
      };
      
      setUser(userData);
      localStorage.setItem('skillsync_user', JSON.stringify(userData));
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skillsync_user');
    navigate('/');
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

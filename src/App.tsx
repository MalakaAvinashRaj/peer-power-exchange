import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';
import Explore from '@/pages/Explore';
import HowItWorks from '@/pages/HowItWorks';
import About from '@/pages/About';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Network from '@/pages/Network';
import Sessions from '@/pages/Sessions';
import Notifications from '@/pages/Notifications';
import { Toaster } from 'sonner';
import Messages from './pages/Messages';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

function App() {
  const { initializeAuth } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    initializeAuth().then(() => setHydrated(true));
  }, [initializeAuth]);

  if (!hydrated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/register',
            element: <Register />,
          },
          {
            path: '/profile/:id',
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: '/profile',
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: '/edit-profile',
            element: (
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            ),
          },
          {
            path: '/explore',
            element: <Explore />,
          },
          {
            path: '/how-it-works',
            element: <HowItWorks />,
          },
          {
            path: '/about',
            element: <About />,
          },
          {
            path: '/dashboard',
            element: (
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: '/settings',
            element: (
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            ),
          },
          {
            path: '/network',
            element: (
              <ProtectedRoute>
                <Network />
              </ProtectedRoute>
            ),
          },
          {
            path: '/sessions',
            element: (
              <ProtectedRoute>
                <Sessions />
              </ProtectedRoute>
            ),
          },
          {
            path: '/notifications',
            element: (
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            ),
          },
          {
            path: '/messages',
            element: (
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            ),
          },
        ])}
      />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;

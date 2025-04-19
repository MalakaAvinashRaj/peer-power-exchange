
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  Outlet,
  Navigate,
} from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from '@/pages/Profile';
import EditProfile from './pages/EditProfile';
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
import UserSkillsSelection from './pages/UserSkillsSelection';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
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
            path: '/user-skills',
            element: (
              <ProtectedRoute>
                <UserSkillsSelection />
              </ProtectedRoute>
            ),
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

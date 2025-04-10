
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  User, 
  MessageSquare, 
  Calendar, 
  Bell, 
  Menu,
  LogOut,
  Users
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import SearchDialog from './SearchDialog';

const Navbar = () => {
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
      <div className="container flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-skillsync-blue to-skillsync-purple flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-skillsync-blue to-skillsync-purple bg-clip-text text-transparent">
            SkillSync
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <div className="flex items-center gap-6">
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Explore
            </Link>
            <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
          </div>
        )}

        {/* Right side: Search & Actions */}
        <div className="flex items-center gap-2">
          <SearchDialog />
          
          {isAuthenticated && user ? (
            <>
              {!isMobile && (
                <>
                  <Button variant="outline" size="icon" className="text-muted-foreground" asChild>
                    <Link to="/messages">
                      <MessageSquare size={18} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="text-muted-foreground" asChild>
                    <Link to="/network">
                      <Users size={18} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="text-muted-foreground" asChild>
                    <Link to="/sessions">
                      <Calendar size={18} />
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="text-muted-foreground" asChild>
                    <Link to="/notifications">
                      <Bell size={18} />
                    </Link>
                  </Button>
                </>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full overflow-hidden">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.name}
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/network">Network</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {!isMobile && (
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
              <Button className="bg-skillsync-blue hover:bg-skillsync-blue/90" asChild>
                <Link to="/register">
                  {isMobile ? "Join" : "Join SkillSync"}
                </Link>
              </Button>
            </>
          )}
          
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/explore">Explore</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/how-it-works">How It Works</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/about">About</Link>
                </DropdownMenuItem>
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/messages">Messages</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/network">Network</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/sessions">Sessions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notifications">Notifications</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-500 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

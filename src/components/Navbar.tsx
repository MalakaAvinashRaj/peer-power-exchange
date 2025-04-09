
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  User, 
  MessageSquare, 
  Calendar, 
  Bell, 
  Menu
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false); // Demo state - replace with actual auth

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
          <Button variant="outline" size="icon" className="text-muted-foreground">
            <Search size={18} />
          </Button>
          
          {isAuthenticated ? (
            <>
              {!isMobile && (
                <>
                  <Button variant="outline" size="icon" className="text-muted-foreground">
                    <MessageSquare size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="text-muted-foreground">
                    <Calendar size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="text-muted-foreground">
                    <Bell size={18} />
                  </Button>
                </>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsAuthenticated(false)}>
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
                      <Link to="/sessions">Sessions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notifications">Notifications</Link>
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

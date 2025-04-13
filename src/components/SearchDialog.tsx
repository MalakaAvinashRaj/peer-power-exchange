
import React, { useState, useEffect } from 'react';
import { Search, User, UserPlus, Clock, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useConnections, type ConnectionStatus } from '@/hooks/useConnections';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';

const SearchDialog = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const { 
    searchResults, 
    isSearching, 
    searchUsers, 
    sendConnectionRequest,
    getConnectionStatus,
    fetchAllUsers,
    isInitialFetchDone
  } = useConnections();
  
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, ConnectionStatus>>({});

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchTerm('');
    }
  }, [open]);

  // Initial fetch of users when component mounts
  useEffect(() => {
    if (open && !isInitialFetchDone) {
      fetchAllUsers();
    }
  }, [open, fetchAllUsers, isInitialFetchDone]);

  // Run search when debounced search term changes
  useEffect(() => {
    if (open) {
      searchUsers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchUsers, open]);

  // Get connection status for each search result
  useEffect(() => {
    const fetchConnectionStatuses = async () => {
      const statuses: Record<string, ConnectionStatus> = {};
      const allResults = [
        ...searchResults.usernameMatches, 
        ...searchResults.nameMatches
      ];
      
      for (const profile of allResults) {
        if (profile.id !== user?.id) {
          statuses[profile.id] = await getConnectionStatus(profile.id);
        }
      }
      
      setConnectionStatuses(statuses);
    };
    
    if (open && (searchResults.usernameMatches.length > 0 || searchResults.nameMatches.length > 0)) {
      fetchConnectionStatuses();
    }
  }, [searchResults, getConnectionStatus, user?.id, open]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleConnect = async (userId: string) => {
    const success = await sendConnectionRequest(userId);
    if (success) {
      setConnectionStatuses(prev => ({
        ...prev,
        [userId]: 'pending'
      }));
    }
  };

  const renderConnectionButton = (userId: string) => {
    const status = connectionStatuses[userId];
    
    switch (status) {
      case 'accepted':
        return (
          <Button variant="ghost" size="sm" className="px-2" disabled>
            <Check size={16} className="mr-1" /> Connected
          </Button>
        );
      case 'pending':
        return (
          <Button variant="ghost" size="sm" className="px-2" disabled>
            <Clock size={16} className="mr-1" /> Pending
          </Button>
        );
      default:
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-2" 
            onClick={() => handleConnect(userId)}
          >
            <UserPlus size={16} className="mr-1" /> Connect
          </Button>
        );
    }
  };

  const renderUserCard = (profile: any) => (
    <Card key={profile.id} className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback>
                {profile.name ? profile.name.charAt(0) : <User size={16} />}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link 
                to={`/profile/${profile.id}`} 
                className="font-medium hover:underline"
                onClick={() => setOpen(false)}
              >
                {profile.name}
              </Link>
              {profile.username && (
                <div className="text-sm text-muted-foreground">
                  @{profile.username}
                </div>
              )}
            </div>
          </div>
          
          {profile.id !== user?.id && renderConnectionButton(profile.id)}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="text-muted-foreground">
          <Search size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input 
            placeholder="Search by name or username..." 
            value={searchTerm}
            onChange={handleSearch}
            autoFocus
          />
          
          {isSearching ? (
            <div className="text-center py-4">Searching...</div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {searchResults.usernameMatches.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Username matches</h3>
                  {searchResults.usernameMatches
                    .filter(profile => profile.id !== user?.id)
                    .map(profile => renderUserCard(profile))
                  }
                </div>
              )}
              
              {searchResults.nameMatches.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Name matches</h3>
                  {searchResults.nameMatches
                    .filter(profile => profile.id !== user?.id)
                    .map(profile => renderUserCard(profile))
                  }
                </div>
              )}

              {searchTerm && 
               searchResults.usernameMatches.length === 0 && 
               searchResults.nameMatches.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No users found</div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;


import React, { useState } from 'react';
import { Search, User, UserPlus, Clock, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useConnections, type ConnectionStatus } from '@/hooks/useConnections';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const UserSearch = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { 
    searchResults, 
    isSearching, 
    searchUsers, 
    sendConnectionRequest,
    getConnectionStatus 
  } = useConnections();
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, ConnectionStatus>>({});

  React.useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      searchUsers(debouncedSearchTerm.trim());
    } else {
      // Reset search results when search term is empty
      searchResults.length = 0;
    }
  }, [debouncedSearchTerm, searchUsers]);

  React.useEffect(() => {
    // Get connection status for each search result
    const fetchConnectionStatuses = async () => {
      const statuses: Record<string, ConnectionStatus> = {};
      
      for (const profile of searchResults) {
        if (profile.id !== user?.id) { // Skip current user
          statuses[profile.id] = await getConnectionStatus(profile.id);
        }
      }
      
      setConnectionStatuses(statuses);
    };
    
    if (searchResults.length > 0) {
      fetchConnectionStatuses();
    }
  }, [searchResults, getConnectionStatus, user?.id]);

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
      case 'declined':
        return (
          <Button variant="ghost" size="sm" className="px-2" disabled>
            <X size={16} className="mr-1" /> Declined
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

  return (
    <div className="w-full">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search users by name or username..." 
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {isSearching ? (
        <div className="text-center py-4">Searching...</div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-2">
          {searchResults.map(profile => (
            profile.id !== user?.id && (
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
                    
                    {renderConnectionButton(profile.id)}
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      ) : searchTerm && (
        <div className="text-center py-4 text-muted-foreground">No users found</div>
      )}
    </div>
  );
};

export default UserSearch;

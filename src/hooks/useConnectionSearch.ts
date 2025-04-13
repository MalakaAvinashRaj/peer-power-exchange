
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, SearchResults } from '@/types/connections';

export const useConnectionSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResults>({
    usernameMatches: [],
    nameMatches: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);

  // Fetch all users (for search functionality)
  const fetchAllUsers = useCallback(async () => {
    try {
      setIsSearching(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(100);

      if (error) throw error;
      
      setAllProfiles(profiles || []);
      setIsInitialFetchDone(true);
    } catch (error) {
      console.error('Error fetching all users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialFetchDone) {
      fetchAllUsers();
    }
  }, [isInitialFetchDone, fetchAllUsers]);

  // Search users from the cached profiles
  const searchUsers = useCallback((query: string) => {
    if (!query.trim() || !isInitialFetchDone) {
      setSearchResults({
        usernameMatches: [],
        nameMatches: []
      });
      return;
    }

    try {
      setIsSearching(true);
      
      const normalizedQuery = query.toLowerCase().trim();
      
      // Get current user ID
      supabase.auth.getUser().then(({ data }) => {
        const userId = data.user?.id;
        
        // Filter matches from the cached profiles
        const usernameMatches = allProfiles.filter(profile => 
          profile.id !== userId && 
          profile.username?.toLowerCase().includes(normalizedQuery)
        ).slice(0, 5);
        
        const usernameIds = new Set(usernameMatches.map(p => p.id));
        const nameMatches = allProfiles.filter(profile => 
          profile.id !== userId && 
          !usernameIds.has(profile.id) &&
          profile.name?.toLowerCase().includes(normalizedQuery)
        ).slice(0, 5);

        setSearchResults({
          usernameMatches,
          nameMatches
        });
        
        setIsSearching(false);
      });
    } catch (error) {
      console.error('Error filtering users:', error);
      setIsSearching(false);
    }
  }, [allProfiles, isInitialFetchDone]);

  return {
    searchResults,
    isSearching,
    searchUsers,
    fetchAllUsers,
    isInitialFetchDone
  };
};

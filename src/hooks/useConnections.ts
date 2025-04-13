
import { useConnectionSearch } from './useConnectionSearch';
import { useConnectionRequests } from './useConnectionRequests';
import { useConnectionActions } from './useConnectionActions';
import { ConnectionStatus, PendingConnection, Profile, SearchResults } from '@/types/connections';

// Re-export the connection-related types
export type { ConnectionStatus, PendingConnection, Profile, SearchResults };

export const useConnections = () => {
  const { 
    searchResults, 
    isSearching, 
    searchUsers, 
    fetchAllUsers,
    isInitialFetchDone
  } = useConnectionSearch();

  const {
    pendingConnections,
    isLoadingPendingConnections,
    hasPendingRequests,
    getPendingConnections,
    respondToConnectionRequest
  } = useConnectionRequests();

  const {
    sendConnectionRequest,
    getConnectionStatus,
    subscribeToConnectionChanges
  } = useConnectionActions();

  return {
    // From useConnectionSearch
    searchResults,
    isSearching,
    searchUsers,
    fetchAllUsers,
    isInitialFetchDone,
    
    // From useConnectionRequests
    pendingConnections,
    isLoadingPendingConnections,
    hasPendingRequests,
    getPendingConnections,
    respondToConnectionRequest,
    
    // From useConnectionActions
    sendConnectionRequest,
    getConnectionStatus,
    subscribeToConnectionChanges
  };
};

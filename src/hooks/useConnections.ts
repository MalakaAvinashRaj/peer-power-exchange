
import { useConnectionSearch } from './useConnectionSearch';
import { useConnectionRequests } from './useConnectionRequests';
import { useConnectionActions } from './useConnectionActions';
import { ConnectionStatus, PendingConnection, Profile, SearchResults } from '@/types/connections';

// Re-export the connection-related types
export type { ConnectionStatus, PendingConnection, Profile, SearchResults };

export const useConnections = () => {
  // Use these hooks directly inside the function body, not in conditionals
  const searchHook = useConnectionSearch();
  const requestsHook = useConnectionRequests();
  const actionsHook = useConnectionActions();

  return {
    // From useConnectionSearch
    searchResults: searchHook.searchResults,
    isSearching: searchHook.isSearching,
    searchUsers: searchHook.searchUsers,
    fetchAllUsers: searchHook.fetchAllUsers,
    isInitialFetchDone: searchHook.isInitialFetchDone,
    
    // From useConnectionRequests
    pendingConnections: requestsHook.pendingConnections,
    isLoadingPendingConnections: requestsHook.isLoadingPendingConnections,
    hasPendingRequests: requestsHook.hasPendingRequests,
    getPendingConnections: requestsHook.getPendingConnections,
    respondToConnectionRequest: requestsHook.respondToConnectionRequest,
    
    // From useConnectionActions
    sendConnectionRequest: actionsHook.sendConnectionRequest,
    getConnectionStatus: actionsHook.getConnectionStatus,
    subscribeToConnectionChanges: actionsHook.subscribeToConnectionChanges
  };
};


import type { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export type PendingConnection = {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_username: string;
  sender_avatar_url: string;
  created_at: string;
};

export type ConnectionStatus = 'none' | 'pending' | 'accepted';

export type SearchResults = {
  usernameMatches: Profile[];
  nameMatches: Profile[];
};

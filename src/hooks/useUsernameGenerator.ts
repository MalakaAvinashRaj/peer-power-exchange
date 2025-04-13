
import { supabase } from '@/integrations/supabase/client';

export const useUsernameGenerator = () => {
  const generateUsername = async (fullName: string): Promise<string> => {
    let baseUsername = fullName.toLowerCase().replace(/\s+/g, '');
    baseUsername = baseUsername.replace(/[^\w]/g, '');
    let username = baseUsername;
    let isUnique = false;
    let attempt = 0;
    
    while (!isUnique) {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking username uniqueness:', error);
        throw error;
      }
      
      if (!data) {
        isUnique = true;
      } else {
        attempt += 1;
        username = `${baseUsername}${attempt}`;
      }
    }
    
    return username;
  };

  return { generateUsername };
};

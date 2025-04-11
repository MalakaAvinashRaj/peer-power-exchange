
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export type UserSkill = {
  id: string;
  user_id: string;
  skill_name: string;
  type: 'teaching' | 'learning';
  created_at: string;
};

type UserSkillsResponse = {
  teachingSkills: string[];
  learningSkills: string[];
  isLoading: boolean;
  error: Error | null;
  fetchUserSkills: (userId: string) => Promise<void>;
  addUserSkill: (userId: string, skillName: string, type: 'teaching' | 'learning') => Promise<boolean>;
  removeUserSkill: (userId: string, skillName: string, type: 'teaching' | 'learning') => Promise<boolean>;
};

export const useUserSkills = (userId?: string): UserSkillsResponse => {
  const [teachingSkills, setTeachingSkills] = useState<string[]>([]);
  const [learningSkills, setLearningSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserSkills = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cast the function call to any to bypass TypeScript's type checking
      const { data: teachSkills, error: teachError } = await (supabase
        .rpc('get_user_skills_by_type', { 
          user_id_param: id, 
          type_param: 'teaching' 
        }) as any);
        
      if (teachError) throw teachError;
      
      // Cast the function call to any to bypass TypeScript's type checking
      const { data: learnSkills, error: learnError } = await (supabase
        .rpc('get_user_skills_by_type', { 
          user_id_param: id, 
          type_param: 'learning' 
        }) as any);
        
      if (learnError) throw learnError;
      
      setTeachingSkills(teachSkills || []);
      setLearningSkills(learnSkills || []);
    } catch (err) {
      console.error('Error fetching user skills:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user skills'));
    } finally {
      setIsLoading(false);
    }
  };

  const addUserSkill = async (id: string, skillName: string, type: 'teaching' | 'learning'): Promise<boolean> => {
    try {
      // Cast the function call to any to bypass TypeScript's type checking
      const { error } = await (supabase
        .rpc('add_user_skill', { 
          user_id_param: id, 
          skill_name_param: skillName,
          type_param: type
        }) as any);
        
      if (error) throw error;
      
      // Update local state
      if (type === 'teaching') {
        setTeachingSkills(prev => [...prev, skillName]);
      } else {
        setLearningSkills(prev => [...prev, skillName]);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding user skill:', err);
      toast.error('Failed to add skill');
      return false;
    }
  };

  const removeUserSkill = async (id: string, skillName: string, type: 'teaching' | 'learning'): Promise<boolean> => {
    try {
      // Cast the function call to any to bypass TypeScript's type checking
      const { error } = await (supabase
        .rpc('remove_user_skill', { 
          user_id_param: id, 
          skill_name_param: skillName,
          type_param: type
        }) as any);
        
      if (error) throw error;
      
      // Update local state
      if (type === 'teaching') {
        setTeachingSkills(prev => prev.filter(skill => skill !== skillName));
      } else {
        setLearningSkills(prev => prev.filter(skill => skill !== skillName));
      }
      
      return true;
    } catch (err) {
      console.error('Error removing user skill:', err);
      toast.error('Failed to remove skill');
      return false;
    }
  };

  // If userId is provided, fetch skills on mount
  useEffect(() => {
    if (userId) {
      fetchUserSkills(userId);
    }
  }, [userId]);

  return {
    teachingSkills,
    learningSkills,
    isLoading,
    error,
    fetchUserSkills,
    addUserSkill,
    removeUserSkill
  };
};

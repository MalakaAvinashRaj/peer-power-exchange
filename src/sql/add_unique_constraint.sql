
-- Add unique constraint to user_skills to prevent duplicates
ALTER TABLE public.user_skills 
ADD CONSTRAINT user_skills_unique_constraint UNIQUE (user_id, skill_name, type);

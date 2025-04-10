
-- Function to get user skills by type
CREATE OR REPLACE FUNCTION get_user_skills_by_type(user_id_param UUID, type_param TEXT)
RETURNS TEXT[] AS $$
DECLARE
  result TEXT[];
BEGIN
  SELECT array_agg(skill_name)
  INTO result
  FROM user_skills
  WHERE user_id = user_id_param AND type = type_param;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to add a user skill
CREATE OR REPLACE FUNCTION add_user_skill(user_id_param UUID, skill_name_param TEXT, type_param TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_skills (user_id, skill_name, type)
  VALUES (user_id_param, skill_name_param, type_param)
  ON CONFLICT (user_id, skill_name, type) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to remove a user skill
CREATE OR REPLACE FUNCTION remove_user_skill(user_id_param UUID, skill_name_param TEXT, type_param TEXT)
RETURNS VOID AS $$
BEGIN
  DELETE FROM user_skills
  WHERE user_id = user_id_param AND skill_name = skill_name_param AND type = type_param;
END;
$$ LANGUAGE plpgsql;

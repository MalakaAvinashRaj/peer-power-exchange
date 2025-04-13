import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Skill {
  value: string;
  label: string;
}

const UserSkillsSelection = () => {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillType, setSkillType] = useState<string>('learning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isLoading, updateUserData } = useAuth();
  
  const skillOptions: Skill[] = [
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'Project Management', label: 'Project Management' },
    { value: 'Digital Marketing', label: 'Digital Marketing' },
    { value: 'Financial Analysis', label: 'Financial Analysis' },
    { value: 'Content Creation', label: 'Content Creation' },
    { value: 'Graphic Design', label: 'Graphic Design' },
  ];
  
  const addUserSkill = async (userId: string, skillName: string, type: string) => {
    const { error } = await supabase.rpc('add_user_skill', {
      user_id_param: userId,
      skill_name_param: skillName,
      type_param: type,
    });
    
    if (error) {
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSkills.length < 3) {
      toast.error('Please select at least 3 skills');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add user skills to the database
      for (const skill of selectedSkills) {
        await addUserSkill(user?.id!, skill, skillType);
      }
      
      // Update user's onboarding status
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ is_onboarded: true })
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
      }
      
      // Refresh the user data
      await updateUserData();
      
      toast.success('Skills saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('Failed to save your skills. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect based on user state
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (user?.is_onboarded) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Tell us about your skills
          </CardTitle>
          <CardDescription>
            Select at least 3 skills you are interested in learning or teaching.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skillType">I am primarily...</Label>
              <div className="flex gap-2">
                <Button
                  variant={skillType === 'learning' ? 'default' : 'outline'}
                  onClick={() => setSkillType('learning')}
                  disabled={isSubmitting}
                >
                  Learning
                </Button>
                <Button
                  variant={skillType === 'teaching' ? 'default' : 'outline'}
                  onClick={() => setSkillType('teaching')}
                  disabled={isSubmitting}
                >
                  Teaching
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <MultiSelect
                id="skills"
                options={skillOptions}
                value={selectedSkills}
                onChange={(values) => setSelectedSkills(values as string[])}
                placeholder="Select your skills"
                disabled={isSubmitting}
              />
            </div>
            
            <Button type="submit" className="w-full bg-skillsync-blue hover:bg-skillsync-blue/90" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving skills...
                </>
              ) : 'Save skills'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSkillsSelection;

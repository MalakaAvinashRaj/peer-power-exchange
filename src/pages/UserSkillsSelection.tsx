import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUserSkills } from '@/hooks/useUserSkills';

// Placeholder skill categories - these would come from the database
const skillCategories = [
  {
    name: 'Programming',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C#', 'PHP']
  },
  {
    name: 'Design',
    skills: ['UI/UX', 'Graphic Design', 'Illustration', 'Photoshop', 'Figma', 'Adobe XD']
  },
  {
    name: 'Languages',
    skills: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Korean']
  },
  {
    name: 'Music',
    skills: ['Piano', 'Guitar', 'Violin', 'Drums', 'Singing', 'Music Theory', 'Production']
  },
  {
    name: 'Other',
    skills: ['Cooking', 'Photography', 'Writing', 'Public Speaking', 'Dancing', 'Fitness']
  }
];

const UserSkillsSelection = () => {
  const { user, isLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { teachingSkills, learningSkills, isLoading: skillsLoading } = useUserSkills(user?.id);
  const [selectedTeachingSkills, setSelectedTeachingSkills] = useState<string[]>([]);
  const [selectedLearningSkills, setSelectedLearningSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with existing skills when they load
  useEffect(() => {
    if (!skillsLoading) {
      setSelectedTeachingSkills(teachingSkills);
      setSelectedLearningSkills(learningSkills);
    }
  }, [teachingSkills, learningSkills, skillsLoading]);

  useEffect(() => {
    // If user already has skills set and is onboarded, navigate to dashboard
    if (!isLoading && user?.is_onboarded) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleTeachingToggle = (skill: string) => {
    setSelectedTeachingSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleLearningToggle = (skill: string) => {
    setSelectedLearningSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (selectedTeachingSkills.length === 0 && selectedLearningSkills.length === 0) {
      toast.error("Please select at least one skill you can teach or want to learn");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use rpc calls to handle skills addition
      const addSkillPromises = [
        ...selectedTeachingSkills.map(skill => 
          supabase.rpc('add_user_skill', { 
            user_id_param: user.id, 
            skill_name_param: skill,
            type_param: 'teaching'
          })
        ),
        ...selectedLearningSkills.map(skill => 
          supabase.rpc('add_user_skill', { 
            user_id_param: user.id, 
            skill_name_param: skill,
            type_param: 'learning'
          })
        )
      ];
      
      await Promise.all(addSkillPromises);
      
      // Update user is_onboarded status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_onboarded: true })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Refresh user data to get updated profile
      await refreshUser();
      
      toast.success("Your skills have been saved successfully");
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error("Failed to save your skills. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to SkillSync!</CardTitle>
            <CardDescription>
              Help us personalize your experience by telling us what skills you have and what you'd like to learn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Skills I can teach others:</h3>
                <div className="space-y-6">
                  {skillCategories.map((category) => (
                    <div key={`teach-${category.name}`} className="space-y-2">
                      <h4 className="font-medium text-muted-foreground">{category.name}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {category.skills.map((skill) => (
                          <div key={`teach-${skill}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`teach-${skill}`} 
                              checked={selectedTeachingSkills.includes(skill)}
                              onCheckedChange={() => handleTeachingToggle(skill)}
                            />
                            <label 
                              htmlFor={`teach-${skill}`}
                              className="text-sm cursor-pointer"
                            >
                              {skill}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Skills I want to learn:</h3>
                <div className="space-y-6">
                  {skillCategories.map((category) => (
                    <div key={`learn-${category.name}`} className="space-y-2">
                      <h4 className="font-medium text-muted-foreground">{category.name}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {category.skills.map((skill) => (
                          <div key={`learn-${skill}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`learn-${skill}`} 
                              checked={selectedLearningSkills.includes(skill)}
                              onCheckedChange={() => handleLearningToggle(skill)}
                            />
                            <label 
                              htmlFor={`learn-${skill}`}
                              className="text-sm cursor-pointer"
                            >
                              {skill}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-skillsync-blue hover:bg-skillsync-blue/90"
                >
                  {isSubmitting ? 'Saving...' : 'Save and Continue'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default UserSkillsSelection;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  const [teachingSkills, setTeachingSkills] = useState<string[]>([]);
  const [learningSkills, setLearningSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If user already has skills set, navigate to dashboard
    const checkUserSkills = async () => {
      if (!user || isLoading) return;
      
      const { data: teachSkills, error: teachError } = await supabase
        .from('user_skills')
        .select('skill_name')
        .eq('user_id', user.id)
        .eq('type', 'teaching');
        
      const { data: learnSkills, error: learnError } = await supabase
        .from('user_skills')
        .select('skill_name')
        .eq('user_id', user.id)
        .eq('type', 'learning');
        
      if (teachError || learnError) {
        console.error('Error fetching skills:', teachError || learnError);
        return;
      }
      
      if ((teachSkills && teachSkills.length > 0) || (learnSkills && learnSkills.length > 0)) {
        // User already has skills, navigate to dashboard
        navigate('/dashboard');
      }
    };
    
    checkUserSkills();
  }, [user, isLoading, navigate]);

  const handleTeachingToggle = (skill: string) => {
    setTeachingSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleLearningToggle = (skill: string) => {
    setLearningSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (teachingSkills.length === 0 && learningSkills.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one skill you can teach or want to learn",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare skills for insertion
      const skillsToInsert = [
        ...teachingSkills.map(skill => ({
          user_id: user.id,
          skill_name: skill,
          type: 'teaching'
        })),
        ...learningSkills.map(skill => ({
          user_id: user.id,
          skill_name: skill,
          type: 'learning'
        }))
      ];
      
      // Insert skills
      const { error } = await supabase
        .from('user_skills')
        .insert(skillsToInsert);
        
      if (error) throw error;
      
      // Update user is_onboarded status if needed
      await supabase
        .from('profiles')
        .update({ is_onboarded: true })
        .eq('id', user.id);
      
      // Refresh user data to get updated profile
      await refreshUser();
      
      toast({
        title: "Skills Saved",
        description: "Your skills have been saved successfully",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving skills:', error);
      toast({
        title: "Error",
        description: "Failed to save your skills. Please try again.",
        variant: "destructive",
      });
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
                              checked={teachingSkills.includes(skill)}
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
                              checked={learningSkills.includes(skill)}
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

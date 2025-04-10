
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SkillCarousel from '@/components/SkillCarousel';
import { popularSkills, recentSkills, trendingSkills } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Explore = () => {
  const { user } = useAuth();
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [userLearningSkills, setUserLearningSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserLearningSkills = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_skills')
          .select('skill_name')
          .eq('user_id', user.id)
          .eq('type', 'learning');
          
        if (error) throw error;
        
        setUserLearningSkills(data.map(item => item.skill_name));
        
        // In a real app, we would fetch recommended skills based on the user's learning skills
        // For now, we'll filter the mock data to simulate personalization
        const recommended = popularSkills.filter(skill => 
          userLearningSkills.some(userSkill => 
            skill.tags && skill.tags.includes(userSkill)
          )
        );
        
        setRecommendedSkills(recommended.length > 0 ? recommended : popularSkills.slice(0, 4));
      } catch (error) {
        console.error('Error fetching user learning skills:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserLearningSkills();
  }, [user, userLearningSkills.length]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Explore Skills</h1>
        
        <div className="space-y-12">
          {user && !isLoading && (
            <SkillCarousel 
              title="Recommended for You" 
              description="Based on your learning interests"
              skills={recommendedSkills}
            />
          )}
          
          <SkillCarousel 
            title="Popular Skills" 
            description="Most sought-after skills with excellent reviews"
            skills={popularSkills}
          />
          
          <SkillCarousel 
            title="Newly Added" 
            description="The latest skills added to our platform"
            skills={recentSkills}
          />
          
          <SkillCarousel 
            title="Trending Now" 
            description="Skills gaining popularity this month"
            skills={trendingSkills}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;

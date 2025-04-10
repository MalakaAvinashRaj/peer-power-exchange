
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillCarousel from '@/components/SkillCarousel';
import { popularSkills, recentSkills, trendingSkills } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSkills } from '@/hooks/useUserSkills';

const Explore = () => {
  const { user } = useAuth();
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const { learningSkills, isLoading } = useUserSkills(user?.id);

  // Generate recommended skills based on user's learning interests
  useEffect(() => {
    if (user && !isLoading && learningSkills.length > 0) {
      // In a real app, we would fetch recommended skills based on the user's learning skills
      // For now, we'll filter the mock data to simulate personalization
      const recommended = popularSkills.filter(skill => 
        skill.tags && 
        skill.tags.some(tag => learningSkills.includes(tag))
      );
      
      setRecommendedSkills(recommended.length > 0 ? recommended : popularSkills.slice(0, 4));
    }
  }, [user, learningSkills, isLoading]);

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


import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SkillCarousel from '@/components/SkillCarousel';
import { popularSkills, recentSkills, trendingSkills } from '@/utils/mockData';

const Explore = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Explore Skills</h1>
        
        <div className="space-y-12">
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

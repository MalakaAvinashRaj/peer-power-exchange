
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import SkillCarousel from '@/components/SkillCarousel';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import StatsSection from '@/components/StatsSection';
import CategorySection from '@/components/CategorySection';
import { popularSkills, recentSkills, trendingSkills } from '@/utils/mockData';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        
        <section className="py-16">
          <div className="container space-y-16">
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
        </section>
        
        <CategorySection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

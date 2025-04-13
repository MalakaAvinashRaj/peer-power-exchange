
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import TestimonialsSection from '@/components/TestimonialsSection';
import StatsSection from '@/components/StatsSection';
import SkillCarousel from '@/components/SkillCarousel';
import CategorySection from '@/components/CategorySection';
import { popularSkills, recentSkills, trendingSkills } from '@/utils/mockData';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CategorySection />
        <section className="py-16">
          <div className="container space-y-16">
            <SkillCarousel 
              title="Popular Skills" 
              skills={popularSkills}
            />
          </div>
        </section>
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

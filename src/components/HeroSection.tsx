
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="hero-gradient text-white">
      <div className="container py-20 md:py-28">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Share Knowledge, Grow Together
          </h1>
          <p className="text-xl md:text-2xl text-white/80">
            SkillSync connects people who want to teach their skills with those eager to learn. Join our community of knowledge exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-white text-skillsync-blue hover:bg-white/90" asChild>
              <Link to="/explore">
                Explore Skills
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/register" className="flex items-center gap-2">
                Become a Teacher <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 h-full w-1/3 pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-1/4 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 h-60 w-60 rounded-full bg-skillsync-purple/30 blur-3xl"></div>
      </div>
    </div>
  );
};

export default HeroSection;

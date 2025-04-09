
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 hero-gradient text-white relative overflow-hidden">
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-white/80">
            Join thousands of people teaching and learning on SkillSync. It takes less than 2 minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" className="bg-white text-skillsync-blue hover:bg-white/90" asChild>
              <Link to="/register">Join as Student</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/register?teacher=true">Become a Teacher</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5"></div>
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-white/5"></div>
      </div>
    </section>
  );
};

export default CTASection;

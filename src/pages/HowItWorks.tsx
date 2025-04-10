
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up and tell us about your skills and what you're interested in learning."
    },
    {
      title: "Find Skills or Teachers",
      description: "Browse through available skills or search for specific teachers that match your learning goals."
    },
    {
      title: "Book a Session",
      description: "Schedule a time that works for both you and your teacher."
    },
    {
      title: "Learn and Exchange",
      description: "Attend your session, learn new skills, and optionally teach something in return."
    },
    {
      title: "Rate and Review",
      description: "After your session, provide feedback to help others find great teachers."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">How SkillSync Works</h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Our platform makes it easy to learn new skills from peers and share your own expertise.
          </p>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-skillsync-blue/10 p-3 flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-skillsync-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Step {index + 1}: {step.title}
                      </h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;

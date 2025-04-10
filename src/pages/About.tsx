
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { UsersRound, Heart, Lightbulb, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <UsersRound className="h-8 w-8" />,
      title: "Community First",
      description: "We believe in the power of community and peer-to-peer learning to create meaningful connections."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Passion Driven",
      description: "We're passionate about helping people share their skills and discover new ones."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Continuous Learning",
      description: "We promote lifelong learning and the joy of discovering new abilities at any age."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Perspective",
      description: "We celebrate diverse knowledge from all cultures and backgrounds."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-muted py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">About SkillSync</h1>
              <p className="text-xl text-muted-foreground">
                We're reimagining how skills are shared and exchanged between individuals. Our mission is to create a platform where everyone can be both a teacher and a student.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 container">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full bg-skillsync-blue/10 p-4 mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <p className="text-lg mb-4">
                SkillSync began with a simple idea: what if we could create a platform where people could easily exchange skills and knowledge without traditional barriers?
              </p>
              <p className="text-lg mb-4">
                Founded in 2023, we've been working to build a community where experts in any field can share their knowledge, and where anyone can find someone to learn from.
              </p>
              <p className="text-lg">
                Today, SkillSync connects thousands of learners and teachers across the globe, facilitating the exchange of skills from cooking to coding, painting to public speaking.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

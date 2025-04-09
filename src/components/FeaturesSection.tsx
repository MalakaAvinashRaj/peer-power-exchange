
import React from 'react';
import { BookOpen, Users, Calendar, Video, MessageSquare, Award } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="h-10 w-10 text-skillsync-blue" />,
    title: 'Learn Anything',
    description: 'Access a diverse range of skills taught by real people in our community.'
  },
  {
    icon: <Users className="h-10 w-10 text-skillsync-purple" />,
    title: 'Teach Your Skills',
    description: 'Share your expertise with others and help them grow while reinforcing your knowledge.'
  },
  {
    icon: <Calendar className="h-10 w-10 text-skillsync-blue" />,
    title: 'Flexible Scheduling',
    description: 'Book sessions that fit your schedule with our intuitive availability system.'
  },
  {
    icon: <Video className="h-10 w-10 text-skillsync-purple" />,
    title: 'Virtual Sessions',
    description: 'Connect via high-quality video calls designed for optimal learning experiences.'
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-skillsync-blue" />,
    title: 'Direct Communication',
    description: 'Message your teacher or students directly to discuss details and ask questions.'
  },
  {
    icon: <Award className="h-10 w-10 text-skillsync-purple" />,
    title: 'Skill Verification',
    description: 'Earn certificates and badges to showcase your newly acquired skills.'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How SkillSync Works</h2>
          <p className="text-lg text-muted-foreground">
            Our platform makes it easy to connect, learn, and teach in a collaborative environment
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

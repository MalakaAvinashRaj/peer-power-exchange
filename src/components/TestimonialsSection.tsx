
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "SkillSync helped me learn Spanish in just two months through weekly sessions with a native speaker. The scheduling was flexible and the video quality was excellent!",
    author: "Sarah Johnson",
    role: "Marketing Manager",
    avatar: "",
    initials: "SJ"
  },
  {
    id: 2,
    content: "I've been teaching guitar for years, but SkillSync made it easy to connect with students online. The platform is intuitive and the session management tools are fantastic.",
    author: "Michael Rodriguez",
    role: "Musician & Teacher",
    avatar: "",
    initials: "MR"
  },
  {
    id: 3,
    content: "As someone looking to switch careers, I found SkillSync invaluable. I connected with a UX designer who helped me understand the industry and build my portfolio.",
    author: "Jamie Chen",
    role: "Career Switcher",
    avatar: "",
    initials: "JC"
  },
  {
    id: 4,
    content: "The peer-to-peer model makes learning so much more engaging. My photography skills improved dramatically after just a few sessions with an expert on the platform.",
    author: "David Wilson",
    role: "Hobbyist Photographer",
    avatar: "",
    initials: "DW"
  },
  {
    id: 5,
    content: "I never thought I'd be able to teach coding, but SkillSync gave me the confidence and tools to share my knowledge. Now I have regular students who are making great progress!",
    author: "Priya Patel",
    role: "Software Developer",
    avatar: "",
    initials: "PP"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-lg text-muted-foreground">
            Real stories from teachers and learners who have experienced the power of skill exchange
          </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                          <AvatarFallback>{testimonial.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="italic">{testimonial.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;

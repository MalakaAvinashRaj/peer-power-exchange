
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import SkillCard, { SkillCardProps } from './SkillCard';

interface SkillCarouselProps {
  title: string;
  description?: string;
  skills: SkillCardProps[];
}

const SkillCarousel = ({ title, description, skills }: SkillCarouselProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {skills.map((skill) => (
            <CarouselItem key={skill.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <SkillCard {...skill} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default SkillCarousel;


import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export interface SkillCardProps {
  id: string;
  title: string;
  category: string;
  teacherName: string;
  teacherAvatar?: string;
  teacherInitials: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  sessionLength: number;
  tags: string[];
}

const SkillCard = ({
  id,
  title,
  category,
  teacherName,
  teacherAvatar,
  teacherInitials,
  rating,
  reviewsCount,
  studentsCount,
  sessionLength,
  tags
}: SkillCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{category}</p>
            <h3 className="text-lg font-semibold mt-1">{title}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-muted-foreground">({reviewsCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={teacherAvatar} alt={teacherName} />
            <AvatarFallback>{teacherInitials}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{teacherName}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users size={14} />
            <span>{studentsCount} students</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={14} />
            <span>{sessionLength} min</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <span key={index} className={index % 2 === 0 ? "skill-tag" : "skill-tag-purple"}>
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/skill/${id}`}>View Details</Link>
          </Button>
          <Button className="w-full bg-skillsync-blue hover:bg-skillsync-blue/90" asChild>
            <Link to={`/skill/${id}/request`}>Request</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;

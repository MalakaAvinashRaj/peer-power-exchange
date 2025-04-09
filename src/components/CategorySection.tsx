
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Languages, 
  Music, 
  Paintbrush, 
  Camera, 
  DollarSign, 
  LineChart, 
  Dumbbell, 
  ChefHat,
  Leaf,
  BookOpen,
  HeartPulse
} from 'lucide-react';

const categories = [
  { name: 'Programming', icon: <Code />, route: '/category/programming', color: 'bg-blue-100 text-blue-700' },
  { name: 'Languages', icon: <Languages />, route: '/category/languages', color: 'bg-green-100 text-green-700' },
  { name: 'Music', icon: <Music />, route: '/category/music', color: 'bg-purple-100 text-purple-700' },
  { name: 'Art & Design', icon: <Paintbrush />, route: '/category/art-design', color: 'bg-pink-100 text-pink-700' },
  { name: 'Photography', icon: <Camera />, route: '/category/photography', color: 'bg-amber-100 text-amber-700' },
  { name: 'Finance', icon: <DollarSign />, route: '/category/finance', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Business', icon: <LineChart />, route: '/category/business', color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Fitness', icon: <Dumbbell />, route: '/category/fitness', color: 'bg-red-100 text-red-700' },
  { name: 'Cooking', icon: <ChefHat />, route: '/category/cooking', color: 'bg-orange-100 text-orange-700' },
  { name: 'Gardening', icon: <Leaf />, route: '/category/gardening', color: 'bg-lime-100 text-lime-700' },
  { name: 'Academic', icon: <BookOpen />, route: '/category/academic', color: 'bg-cyan-100 text-cyan-700' },
  { name: 'Health', icon: <HeartPulse />, route: '/category/health', color: 'bg-rose-100 text-rose-700' },
];

const CategorySection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Skills by Category</h2>
          <p className="text-muted-foreground">
            Discover the perfect skill to learn or teach from our diverse range of categories
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className={`h-auto flex-col py-6 gap-3 ${category.color}`}
              asChild
            >
              <Link to={category.route}>
                <div className="text-2xl">{category.icon}</div>
                <span>{category.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;


import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SkillCard } from '@/components/SkillCard';
import { popularSkills, recentSkills } from '@/utils/mockData';
import { Star, Calendar, Clock, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  // Sample mock data
  const teachingSkills = popularSkills.slice(0, 2);
  const learningSkills = recentSkills.slice(0, 3);
  const upcomingSessions = [
    { 
      id: 1, 
      title: 'JavaScript Fundamentals', 
      date: '2025-04-15', 
      time: '15:00', 
      duration: 60, 
      type: 'teaching' 
    },
    { 
      id: 2, 
      title: 'Watercolor Basics', 
      date: '2025-04-17', 
      time: '18:30', 
      duration: 90, 
      type: 'learning' 
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                  <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex gap-2 mt-2 justify-center md:justify-start">
                      <Badge variant={user.isTeacher ? "default" : "outline"}>
                        {user.isTeacher ? "Teacher" : "Student"}
                      </Badge>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined April 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>10 Sessions Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>5 Skills</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teaching</CardTitle>
                <CardDescription>Skills you're currently teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teachingSkills.map(skill => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Learning</CardTitle>
                <CardDescription>Skills you're currently learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {learningSkills.map(skill => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled teaching and learning sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-start gap-4 p-3 rounded-lg border">
                      <div className={`rounded-full p-2 ${
                        session.type === 'teaching' 
                          ? 'bg-skillsync-blue/10' 
                          : 'bg-skillsync-purple/10'
                      }`}>
                        <Calendar className={`h-5 w-5 ${
                          session.type === 'teaching' 
                            ? 'text-skillsync-blue' 
                            : 'text-skillsync-purple'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {session.type === 'teaching' ? 'Teaching' : 'Learning'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{session.date}</span>
                          <Clock className="h-3.5 w-3.5 ml-2" />
                          <span>{session.time} ({session.duration} min)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reviews</CardTitle>
                <CardDescription>Reviews from your students and teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-muted-foreground">No reviews yet</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

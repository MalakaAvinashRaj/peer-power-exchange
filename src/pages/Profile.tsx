
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SkillCard from '@/components/SkillCard';
import { popularSkills } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user?.name || 'User Name'}</h2>
                <p className="text-muted-foreground mb-4">{user?.email || 'email@example.com'}</p>
                <Button className="w-full mb-2">Edit Profile</Button>
                <Button variant="outline" className="w-full">Share Profile</Button>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Skills I Teach</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag">JavaScript</span>
                  <span className="skill-tag-purple">React</span>
                  <span className="skill-tag">Web Development</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Skills I Want to Learn</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag-purple">Machine Learning</span>
                  <span className="skill-tag">Data Science</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="teaching">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="teaching">Teaching</TabsTrigger>
                <TabsTrigger value="learning">Learning</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="teaching" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Skills I Teach</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularSkills.slice(0, 2).map((skill) => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="learning" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Skills I'm Learning</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularSkills.slice(2, 4).map((skill) => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Session History</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((session) => (
                    <Card key={session}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">JavaScript Session #{session}</h4>
                            <p className="text-sm text-muted-foreground">April {session + 1}, 2025</p>
                          </div>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

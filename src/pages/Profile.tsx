
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SkillCard from '@/components/SkillCard';
import { popularSkills } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Plus } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [teachingSkills, setTeachingSkills] = useState<string[]>([]);
  const [learningSkills, setLearningSkills] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user skills on component mount
  useEffect(() => {
    const fetchUserSkills = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch teaching skills
        const { data: teachSkills, error: teachError } = await supabase
          .from('user_skills')
          .select('skill_name')
          .eq('user_id', user.id)
          .eq('type', 'teaching');
          
        if (teachError) throw teachError;
        
        // Fetch learning skills
        const { data: learnSkills, error: learnError } = await supabase
          .from('user_skills')
          .select('skill_name')
          .eq('user_id', user.id)
          .eq('type', 'learning');
          
        if (learnError) throw learnError;
        
        if (teachSkills) {
          setTeachingSkills(teachSkills.map(item => item.skill_name));
        }
        
        if (learnSkills) {
          setLearningSkills(learnSkills.map(item => item.skill_name));
        }
      } catch (error) {
        console.error('Error fetching user skills:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserSkills();
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
    // This would open a profile editing modal or redirect to edit page
  };

  const renderSkillTag = (skill: string, type: 'teaching' | 'learning') => {
    const colorClass = type === 'teaching' ? 'skill-tag' : 'skill-tag-purple';
    return (
      <span key={`${type}-${skill}`} className={colorClass}>{skill}</span>
    );
  };

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
                <Button className="w-full mb-2" onClick={handleEditProfile}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full">Share Profile</Button>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Skills I Teach</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add teaching skill</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading skills...</p>
                  ) : teachingSkills.length > 0 ? (
                    teachingSkills.map(skill => renderSkillTag(skill, 'teaching'))
                  ) : (
                    <p className="text-sm text-muted-foreground">No teaching skills added yet</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Skills I Want to Learn</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add learning skill</span>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading skills...</p>
                  ) : learningSkills.length > 0 ? (
                    learningSkills.map(skill => renderSkillTag(skill, 'learning'))
                  ) : (
                    <p className="text-sm text-muted-foreground">No learning skills added yet</p>
                  )}
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
                {isLoading ? (
                  <p>Loading teaching skills...</p>
                ) : teachingSkills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularSkills.filter(skill => 
                      teachingSkills.includes(skill.title)
                    ).slice(0, 4).map((skill) => (
                      <SkillCard key={skill.id} {...skill} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="mb-4 text-muted-foreground">You haven't added any teaching skills yet.</p>
                      <Button>Add Skills</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="learning" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Skills I'm Learning</h3>
                {isLoading ? (
                  <p>Loading learning skills...</p>
                ) : learningSkills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {popularSkills.filter(skill => 
                      learningSkills.includes(skill.title)
                    ).slice(0, 4).map((skill) => (
                      <SkillCard key={skill.id} {...skill} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="mb-4 text-muted-foreground">You haven't added any learning skills yet.</p>
                      <Button>Add Skills</Button>
                    </CardContent>
                  </Card>
                )}
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

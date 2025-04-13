
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SkillCard from '@/components/SkillCard';
import { popularSkills } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Pencil, Plus, Share } from 'lucide-react';
import { useUserSkills } from '@/hooks/useUserSkills';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { teachingSkills, learningSkills, isLoading: skillsLoading } = useUserSkills(user?.id);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // If still loading or not authenticated, don't render the profile content
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Don't render anything as we're redirecting
  }

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user?.name}'s Profile`,
        text: `Check out ${user?.name}'s profile on SkillShare!`,
        url: window.location.href
      }).then(() => {
        console.log('Profile shared successfully');
      }).catch((error) => {
        console.error('Error sharing profile:', error);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile link copied to clipboard!');
    }
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
                {user?.username && (
                  <p className="text-muted-foreground">@{user.username}</p>
                )}
                <p className="text-muted-foreground mb-4">{user?.email || 'email@example.com'}</p>
                <Button className="w-full mb-2" onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full" onClick={handleShareProfile}>
                  <Share className="mr-2 h-4 w-4" />
                  Share Profile
                </Button>
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
              
              {user?.bio && (
                <div className="mt-6 text-left">
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-sm">{user.bio}</p>
                </div>
              )}
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
      
      <EditProfileDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
    </div>
  );
};

export default Profile;

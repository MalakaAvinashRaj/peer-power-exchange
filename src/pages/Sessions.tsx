
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, Users, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Sessions = () => {
  const { user } = useAuth();
  
  // Sample data for sessions
  const upcomingSessions = [
    {
      id: 1,
      title: 'JavaScript Basics',
      description: 'Introduction to variables, functions, and basic programming concepts',
      teacher: 'Alex Wang',
      teacherAvatar: '',
      date: '2025-04-15',
      time: '15:00',
      duration: 60,
      type: 'learning'
    },
    {
      id: 2,
      title: 'Introduction to Watercolor',
      description: 'Learn basic watercolor techniques and color mixing',
      teacher: 'Maria Rodriguez',
      teacherAvatar: '',
      date: '2025-04-17',
      time: '18:30',
      duration: 90,
      type: 'learning'
    },
    {
      id: 3,
      title: 'Guitar for Beginners',
      description: 'Teaching basic chords and strumming patterns',
      students: ['James Wilson', 'Lisa Chen'],
      date: '2025-04-18',
      time: '17:00',
      duration: 45,
      type: 'teaching'
    }
  ];
  
  const pastSessions = [
    {
      id: 4,
      title: 'Python Programming',
      description: 'Introduction to Python syntax and data structures',
      teacher: 'David Kim',
      teacherAvatar: '',
      date: '2025-04-05',
      time: '14:00',
      duration: 60,
      type: 'learning',
      completed: true,
      reviewed: true
    },
    {
      id: 5,
      title: 'Cooking Basics',
      description: 'Teaching knife skills and basic cooking techniques',
      students: ['Emily Johnson'],
      date: '2025-04-03',
      time: '19:00',
      duration: 90,
      type: 'teaching',
      completed: true,
      reviewed: false
    }
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Sessions</h1>
          <Button className="bg-skillsync-blue hover:bg-skillsync-blue/90">Schedule a Session</Button>
        </div>
        
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-6">
            {upcomingSessions.length > 0 ? (
              <div className="space-y-6">
                {upcomingSessions.map(session => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-2/3">
                          <h2 className="text-xl font-bold mb-2">{session.title}</h2>
                          <p className="text-muted-foreground mb-4">{session.description}</p>
                          
                          {session.type === 'learning' ? (
                            <div className="flex items-center gap-2 mb-4">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={session.teacherAvatar} />
                                <AvatarFallback>{session.teacher?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm">Teacher: <span className="font-medium">{session.teacher}</span></p>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4">
                              <p className="text-sm mb-1">Students:</p>
                              <div className="flex items-center gap-2">
                                {session.students?.map((student, index) => (
                                  <Avatar key={index} className="h-8 w-8">
                                    <AvatarFallback>{student[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{session.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{session.time} ({session.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm capitalize">{session.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-1/3 flex flex-col gap-2 justify-center items-center md:items-end mt-4 md:mt-0">
                          <Button className="w-full md:w-auto">Join Session</Button>
                          <Button variant="outline" className="w-full md:w-auto">View Details</Button>
                          <Button variant="ghost" className="w-full md:w-auto text-red-500 hover:text-red-600 hover:bg-red-50">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Upcoming Sessions</h3>
                  <p className="text-muted-foreground mb-6">You don't have any sessions scheduled yet.</p>
                  <Button className="bg-skillsync-blue hover:bg-skillsync-blue/90">Schedule a Session</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-6">
            {pastSessions.length > 0 ? (
              <div className="space-y-6">
                {pastSessions.map(session => (
                  <Card key={session.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-2/3">
                          <h2 className="text-xl font-bold mb-2">{session.title}</h2>
                          <p className="text-muted-foreground mb-4">{session.description}</p>
                          
                          {session.type === 'learning' ? (
                            <div className="flex items-center gap-2 mb-4">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={session.teacherAvatar} />
                                <AvatarFallback>{session.teacher?.[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm">Teacher: <span className="font-medium">{session.teacher}</span></p>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4">
                              <p className="text-sm mb-1">Students:</p>
                              <div className="flex items-center gap-2">
                                {session.students?.map((student, index) => (
                                  <Avatar key={index} className="h-8 w-8">
                                    <AvatarFallback>{student[0]}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{session.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{session.time} ({session.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm capitalize">{session.type}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full md:w-1/3 flex flex-col gap-2 justify-center items-center md:items-end mt-4 md:mt-0">
                          <Button className="w-full md:w-auto" disabled={session.reviewed}>
                            {session.reviewed ? 'Reviewed' : 'Leave Review'}
                          </Button>
                          <Button variant="outline" className="w-full md:w-auto">Schedule Again</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Past Sessions</h3>
                  <p className="text-muted-foreground mb-6">You haven't completed any sessions yet.</p>
                  <Button className="bg-skillsync-blue hover:bg-skillsync-blue/90">Explore Skills</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Sessions;

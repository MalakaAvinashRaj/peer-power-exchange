
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, BookOpen, Star, MessageSquare } from 'lucide-react';
import { popularSkills } from '@/utils/mockData';
import SkillCard from '@/components/SkillCard';

const Dashboard = () => {
  // Mock data for upcoming sessions
  const upcomingSessions = [
    { id: 1, title: 'JavaScript Basics', teacher: 'Alex Wang', date: '2025-04-12', time: '15:00', duration: 60 },
    { id: 2, title: 'Introduction to Watercolor', teacher: 'Maria Rodriguez', date: '2025-04-15', time: '18:30', duration: 90 },
  ];

  // Mock data for user stats
  const userStats = {
    sessionsCompleted: 8,
    skillsLearned: 5,
    skillsTaught: 2,
    averageRating: 4.7,
  };

  // Mock data for recent messages
  const recentMessages = [
    { id: 1, from: 'David Kim', message: 'Thanks for the great session!', time: '2 hours ago' },
    { id: 2, from: 'Sarah Johnson', message: 'Are we still on for tomorrow?', time: '1 day ago' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Welcome back, User!</h1>
          <Button className="bg-skillsync-blue hover:bg-skillsync-blue/90" asChild>
            <Link to="/add-skill">Share a New Skill</Link>
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="teaching">Teaching</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="rounded-full bg-skillsync-blue/10 p-3 mb-2">
                    <Users className="h-6 w-6 text-skillsync-blue" />
                  </div>
                  <p className="text-2xl font-bold">{userStats.sessionsCompleted}</p>
                  <p className="text-muted-foreground">Sessions Completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="rounded-full bg-skillsync-blue/10 p-3 mb-2">
                    <BookOpen className="h-6 w-6 text-skillsync-blue" />
                  </div>
                  <p className="text-2xl font-bold">{userStats.skillsLearned}</p>
                  <p className="text-muted-foreground">Skills Learned</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="rounded-full bg-skillsync-blue/10 p-3 mb-2">
                    <BookOpen className="h-6 w-6 text-skillsync-blue" />
                  </div>
                  <p className="text-2xl font-bold">{userStats.skillsTaught}</p>
                  <p className="text-muted-foreground">Skills Taught</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="rounded-full bg-skillsync-blue/10 p-3 mb-2">
                    <Star className="h-6 w-6 text-skillsync-blue" />
                  </div>
                  <p className="text-2xl font-bold">{userStats.averageRating}</p>
                  <p className="text-muted-foreground">Average Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled learning and teaching sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="rounded-full bg-skillsync-purple/10 p-2">
                          <Calendar className="h-5 w-5 text-skillsync-purple" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{session.title}</h3>
                          <p className="text-sm text-muted-foreground">with {session.teacher}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{session.date}</span>
                            <Clock className="h-3.5 w-3.5 ml-2" />
                            <span>{session.time} ({session.duration} min)</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/sessions/${session.id}`}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No upcoming sessions scheduled</p>
                    <Button variant="outline" className="mt-2" asChild>
                      <Link to="/explore">Find Skills to Learn</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest conversations with your peers</CardDescription>
              </CardHeader>
              <CardContent>
                {recentMessages.length > 0 ? (
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div key={message.id} className="flex items-start gap-4 p-3 rounded-lg border">
                        <div className="rounded-full bg-skillsync-blue/10 p-2">
                          <MessageSquare className="h-5 w-5 text-skillsync-blue" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{message.from}</h3>
                          <p className="text-sm text-muted-foreground">{message.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{message.time}</p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/messages">Reply</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No recent messages</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills You're Learning</CardTitle>
                <CardDescription>Explore your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularSkills.slice(0, 3).map((skill) => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link to="/explore">Discover More Skills</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teaching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills You're Teaching</CardTitle>
                <CardDescription>Manage your teaching portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularSkills.slice(3, 5).map((skill) => (
                    <SkillCard key={skill.id} {...skill} />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button className="bg-skillsync-blue hover:bg-skillsync-blue/90" asChild>
                    <Link to="/add-skill">Share a New Skill</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

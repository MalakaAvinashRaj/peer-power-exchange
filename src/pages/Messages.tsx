
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Send } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  
  // Sample data for conversations
  const conversations = [
    {
      id: 1,
      name: 'Alex Wang',
      avatar: '',
      lastMessage: 'Thanks for the great session!',
      timestamp: '10:30 AM',
      unread: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: '',
      lastMessage: 'Are we still on for tomorrow?',
      timestamp: 'Yesterday',
      unread: false
    },
    {
      id: 3,
      name: 'David Kim',
      avatar: '',
      lastMessage: 'I really enjoyed our JavaScript lesson!',
      timestamp: 'Apr 8',
      unread: false
    }
  ];
  
  // Sample data for current conversation
  const currentConversation = {
    id: 1,
    name: 'Alex Wang',
    avatar: '',
    messages: [
      {
        id: 1,
        sender: 'Alex Wang',
        text: 'Hi there! I was wondering if you would be available for another JavaScript session next week?',
        timestamp: '10:15 AM',
        isOwn: false
      },
      {
        id: 2,
        sender: user?.name || 'You',
        text: 'Hi Alex! Yes, I should be available. What day works best for you?',
        timestamp: '10:20 AM',
        isOwn: true
      },
      {
        id: 3,
        sender: 'Alex Wang',
        text: 'Would Tuesday at 3pm work for you?',
        timestamp: '10:25 AM',
        isOwn: false
      },
      {
        id: 4,
        sender: 'Alex Wang',
        text: 'Thanks for the great session by the way!',
        timestamp: '10:30 AM',
        isOwn: false
      }
    ]
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Conversations sidebar */}
          <Card className="md:col-span-1 h-[600px] flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages" className="pl-8" />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1">
                {conversations.map(conversation => (
                  <div 
                    key={conversation.id} 
                    className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-muted rounded-md ${
                      conversation.id === currentConversation.id ? 'bg-muted' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unread ? 'font-medium' : 'text-muted-foreground'}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="w-2 h-2 rounded-full bg-skillsync-blue"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Conversation */}
          <Card className="md:col-span-3 h-[600px] flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col">
              {/* Conversation header */}
              <div className="pb-4 border-b flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={currentConversation.avatar} />
                  <AvatarFallback>{currentConversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{currentConversation.name}</h2>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {currentConversation.messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isOwn 
                          ? 'bg-skillsync-blue text-white rounded-tr-none' 
                          : 'bg-muted rounded-tl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message input */}
              <div className="pt-4 border-t mt-auto">
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" />
                  <Button size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;

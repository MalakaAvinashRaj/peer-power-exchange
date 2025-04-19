
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Conversation = {
  id: string;
  name: string;
  avatar: string | null;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
};

type MessageListProps = {
  conversations: Conversation[];
  selectedUserId: string | null;
  onSelectConversation: (userId: string) => void;
  isLoading: boolean;
  onNewChat: () => void;
};

const MessageList: React.FC<MessageListProps> = ({
  conversations,
  selectedUserId,
  onSelectConversation,
  isLoading,
  onNewChat
}) => {
  return (
    <ScrollArea className="flex-1">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages" className="pl-8" />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      ) : conversations.length > 0 ? (
        conversations.map(conversation => (
          <div 
            key={conversation.id} 
            className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-muted rounded-md ${
              conversation.id === selectedUserId ? 'bg-muted' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <Avatar>
              <AvatarImage src={conversation.avatar || ''} />
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
              <Badge variant="default" className="h-2 w-2 rounded-full p-0" />
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">No conversations yet</p>
          <Button variant="outline" size="sm" onClick={onNewChat}>
            Start a new chat
          </Button>
        </div>
      )}
    </ScrollArea>
  );
};

export default MessageList;

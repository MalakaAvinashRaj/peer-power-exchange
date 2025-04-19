
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Menu, MessageSquare, Send, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Message } from '@/hooks/useMessaging';

type MessageViewProps = {
  selectedUser: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
  messages: Message[];
  isLoading: boolean;
  canSendMessages: boolean;
  onSendMessage: () => void;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onMobileMenuClick?: () => void;
  isMobile: boolean;
  currentUserId?: string;
};

const MessageView: React.FC<MessageViewProps> = ({
  selectedUser,
  messages,
  isLoading,
  canSendMessages,
  onSendMessage,
  newMessage,
  onNewMessageChange,
  onMobileMenuClick,
  isMobile,
  currentUserId
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Your Messages</h3>
        <p className="text-muted-foreground mb-4 text-center max-w-sm">
          Select a conversation from the sidebar or start a new chat with one of your connections.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="pb-4 border-b flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={onMobileMenuClick}>
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <Avatar>
          <AvatarImage src={selectedUser.avatar || ''} />
          <AvatarFallback>
            {selectedUser.name.charAt(0) || <User size={16} />}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium">{selectedUser.name}</h2>
          <p className="text-xs text-muted-foreground">Connected</p>
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : (
          <div className="space-y-4 px-1">
            {messages.length > 0 ? (
              messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-lg ${
                      message.sender_id === currentUserId 
                        ? 'bg-skillsync-blue text-white rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender_id === currentUserId ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {format(new Date(message.created_at), 'p')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-muted-foreground">Start a conversation</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="pt-4 border-t mt-auto">
        <div className="flex gap-2">
          <Input 
            placeholder={canSendMessages ? "Type a message..." : "You can't message this user"} 
            className="flex-1" 
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!canSendMessages}
          />
          <Button 
            size="icon" 
            onClick={onSendMessage}
            disabled={!canSendMessages || !newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default MessageView;

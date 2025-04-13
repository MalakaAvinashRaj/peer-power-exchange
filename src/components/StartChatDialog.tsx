
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type StartChatDialogProps = {
  onClose: () => void;
  onSelectUser: (userId: string) => void;
};

const StartChatDialog = ({ onClose, onSelectUser }: StartChatDialogProps) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadConnections = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase.rpc('get_connections', { 
          user_id_param: user.id 
        });
          
        if (error) {
          console.error('Error loading connections:', error);
          toast.error('Failed to load connections');
          return;
        }
        
        setConnections(data || []);
      } catch (err) {
        console.error('Error loading connections:', err);
        toast.error('Failed to load connections');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConnections();
  }, [user]);
  
  const filteredConnections = searchTerm.trim() === ''
    ? connections
    : connections.filter(connection => 
        connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (connection.username && connection.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
  const handleSelectUser = (userId: string) => {
    onSelectUser(userId);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start a new chat</DialogTitle>
          <DialogDescription>
            Select a connection to start a conversation
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-2 mb-4">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search connections" 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <ScrollArea className="max-h-[300px] pr-4">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading connections...</p>
            </div>
          ) : filteredConnections.length > 0 ? (
            <div className="space-y-2">
              {filteredConnections.map(connection => (
                <div 
                  key={connection.user_id}
                  className="flex items-center gap-3 p-3 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() => handleSelectUser(connection.user_id)}
                >
                  <Avatar>
                    <AvatarImage src={connection.avatar_url || ''} />
                    <AvatarFallback>
                      {connection.name ? connection.name.charAt(0) : <User size={16} />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{connection.name}</p>
                    {connection.username && (
                      <p className="text-sm text-muted-foreground">
                        @{connection.username}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm.trim() !== '' ? 
                  'No connections found' : 
                  'You have no connections yet'}
              </p>
              {searchTerm.trim() === '' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  asChild
                >
                  <a href="/network">Find connections</a>
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default StartChatDialog;

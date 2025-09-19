import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  AtSign, 
  Edit2, 
  Trash2, 
  MoreHorizontal,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Comment, User } from '@/types';
import { format, formatRelative } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CommentSectionProps {
  comments: Comment[];
  currentUser: User;
  users: User[];
  onAddComment: (content: string, mentions: User[]) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

export default function CommentSection({
  comments,
  currentUser,
  users,
  onAddComment,
  onEditComment,
  onDeleteComment
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [selectedMentions, setSelectedMentions] = useState<User[]>([]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, selectedMentions);
      setNewComment('');
      setSelectedMentions([]);
      toast.success('Comment added');
    }
  };

  const handleEditComment = (commentId: string) => {
    if (editContent.trim() && onEditComment) {
      onEditComment(commentId, editContent);
      setEditingCommentId(null);
      setEditContent('');
      toast.success('Comment updated');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (onDeleteComment) {
      onDeleteComment(commentId);
      toast.success('Comment deleted');
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleMentionSelect = (user: User) => {
    if (!selectedMentions.find(u => u.id === user.id)) {
      setSelectedMentions([...selectedMentions, user]);
      setNewComment(newComment + `@${user.name} `);
    }
    setShowMentions(false);
    setMentionSearch('');
  };

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    
    // Detect @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true);
      setMentionSearch('');
    } else if (lastAtIndex !== -1 && value[lastAtIndex - 1] === ' ') {
      const searchTerm = value.substring(lastAtIndex + 1);
      setMentionSearch(searchTerm);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="group">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>
                    {comment.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelative(comment.createdAt, new Date())}
                    </span>
                    {comment.editedAt && (
                      <span className="text-xs text-muted-foreground italic">
                        (edited)
                      </span>
                    )}
                    
                    {comment.author.id === currentUser.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEditing(comment)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[60px]"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      {comment.mentions && comment.mentions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {comment.mentions.map(user => (
                            <Badge key={user.id} variant="secondary" className="text-xs">
                              <AtSign className="h-3 w-3 mr-1" />
                              {user.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment */}
      <div className="relative">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>
              {currentUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Add a comment... Use @ to mention someone"
              className="min-h-[80px]"
            />
            
            {selectedMentions.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {selectedMentions.map(user => (
                  <Badge key={user.id} variant="secondary" className="text-xs">
                    <AtSign className="h-3 w-3 mr-1" />
                    {user.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMentions(!showMentions)}
              >
                <AtSign className="h-4 w-4 mr-2" />
                Mention
              </Button>
              
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mentions Dropdown */}
        {showMentions && (
          <div className="absolute bottom-full mb-2 bg-popover border rounded-lg shadow-lg p-2 z-50 w-64">
            <div className="text-xs text-muted-foreground mb-2">
              Select user to mention
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleMentionSelect(user)}
                  className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors text-left"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
}

export default function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    urgent: 'priority-urgent',
    high: 'priority-high',
    medium: 'priority-medium',
    low: 'priority-low',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "bg-background p-4 rounded-lg border cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:border-primary/50",
        (isDragging || isSortableDragging) && "opacity-50 shadow-xl",
        "animate-fade-in"
      )}
    >
      <div className="space-y-3">
        {/* Priority Badge */}
        <div className="flex items-start justify-between">
          <Badge 
            variant="outline" 
            className={priorityColors[task.priority]}
          >
            {task.priority}
          </Badge>
          {task.tags.length > 0 && (
            <div className="flex gap-1">
              {task.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <h4 className="font-medium line-clamp-2">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{task.dueDate.toLocaleDateString()}</span>
              </div>
            )}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            )}
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachments.length}</span>
              </div>
            )}
          </div>

          {/* Assignees */}
          {task.assignees.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignees.slice(0, 2).map(assignee => (
                <Avatar key={assignee.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={assignee.avatar} />
                  <AvatarFallback className="text-xs">{assignee.name[0]}</AvatarFallback>
                </Avatar>
              ))}
              {task.assignees.length > 2 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                  <span className="text-xs">+{task.assignees.length - 2}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
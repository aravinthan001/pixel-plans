import { useDroppable } from '@dnd-kit/core';
import { Task } from '@/types';
import TaskCard from './TaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function KanbanColumn({ id, title, color, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-card rounded-lg glass-card transition-all duration-200",
        isOver && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("h-3 w-3 rounded-full", color)} />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3 min-h-[400px]">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
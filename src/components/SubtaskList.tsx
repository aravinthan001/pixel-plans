import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, GripVertical } from 'lucide-react';
import { Subtask } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SubtaskListProps {
  subtasks: Subtask[];
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onReorderSubtasks?: (subtasks: Subtask[]) => void;
}

export default function SubtaskList({
  subtasks,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onReorderSubtasks
}: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask);
      setNewSubtask('');
      setShowAddForm(false);
      toast.success('Subtask added');
    }
  };

  const handleDragStart = (e: React.DragEvent, subtaskId: string) => {
    setDraggedItem(subtaskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetId || !onReorderSubtasks) return;
    
    const draggedIndex = subtasks.findIndex(s => s.id === draggedItem);
    const targetIndex = subtasks.findIndex(s => s.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newSubtasks = [...subtasks];
    const [removed] = newSubtasks.splice(draggedIndex, 1);
    newSubtasks.splice(targetIndex, 0, removed);
    
    onReorderSubtasks(newSubtasks);
    setDraggedItem(null);
  };

  const completedCount = subtasks.filter(s => s.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtasks List */}
      <div className="space-y-2">
        {subtasks.map(subtask => (
          <div
            key={subtask.id}
            draggable={!!onReorderSubtasks}
            onDragStart={(e) => handleDragStart(e, subtask.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, subtask.id)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border bg-card transition-all",
              "hover:bg-muted/50",
              draggedItem === subtask.id && "opacity-50",
              subtask.completed && "opacity-60"
            )}
          >
            {onReorderSubtasks && (
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            )}
            
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => onToggleSubtask(subtask.id)}
              className="data-[state=checked]:bg-primary"
            />
            
            <span 
              className={cn(
                "flex-1 text-sm",
                subtask.completed && "line-through text-muted-foreground"
              )}
            >
              {subtask.title}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDeleteSubtask(subtask.id);
                toast.success('Subtask removed');
              }}
              className="h-6 w-6 p-0 opacity-0 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Subtask Form */}
      {showAddForm ? (
        <div className="flex gap-2">
          <Input
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
            placeholder="Enter subtask title..."
            autoFocus
            className="flex-1"
          />
          <Button onClick={handleAddSubtask} size="sm">
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAddForm(false);
              setNewSubtask('');
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subtask
        </Button>
      )}
    </div>
  );
}
import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { Task } from '@/types';
import { toast } from 'sonner';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
];

export default function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
  const [boardTasks, setBoardTasks] = useState(tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = boardTasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    setBoardTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus }
          : task
      )
    );

    const task = boardTasks.find(t => t.id === taskId);
    if (task) {
      toast.success(`Moved "${task.title}" to ${newStatus.replace('-', ' ')}`);
    }

    setActiveTask(null);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return boardTasks
      .filter(task => task.status === status)
      .sort((a, b) => a.order - b.order);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => {
          const columnTasks = getTasksByStatus(column.id as Task['status']);
          const taskIds = columnTasks.map(t => t.id);

          return (
            <SortableContext
              key={column.id}
              items={taskIds}
              strategy={verticalListSortingStrategy}
            >
              <KanbanColumn
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={columnTasks}
                onTaskClick={onTaskClick}
              />
            </SortableContext>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, LayoutGrid, List, Calendar } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';
import TaskModal from '@/components/TaskModal';
import { mockProjects, mockTasks } from '@/lib/mockData';
import { Task } from '@/types';

export default function ProjectDetail() {
  const { id } = useParams();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeView, setActiveView] = useState('board');

  const project = mockProjects.find(p => p.id === id);
  const projectTasks = mockTasks.filter(t => t.projectId === id);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project not found</h2>
          <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-card rounded-lg p-6 glass-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div
              className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: project.color }}
            >
              {project.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground mt-1">{project.description}</p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
                <div className="flex gap-2">
                  {project.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Button 
            onClick={handleCreateTask}
            className="btn-gradient text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Project Team */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Team:</span>
          <div className="flex -space-x-2">
            {project.members.map((member) => (
              <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <Plus className="h-3 w-3 mr-1" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Views */}
      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="board" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Board
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-6">
          <KanbanBoard 
            tasks={projectTasks} 
            onTaskClick={handleTaskClick}
          />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <div className="bg-card rounded-lg glass-card">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Task List</h2>
              <div className="space-y-2">
                {projectTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Badge 
                      variant="outline"
                      className={
                        task.priority === 'urgent' ? 'priority-urgent' :
                        task.priority === 'high' ? 'priority-high' :
                        task.priority === 'medium' ? 'priority-medium' :
                        'priority-low'
                      }
                    >
                      {task.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge 
                      className={
                        task.status === 'done' ? 'status-done' :
                        task.status === 'in-progress' ? 'status-in-progress' :
                        'status-todo'
                      }
                    >
                      {task.status}
                    </Badge>
                    <div className="flex -space-x-2">
                      {task.assignees.map(assignee => (
                        <Avatar key={assignee.id} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={assignee.avatar} />
                          <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <div className="bg-card rounded-lg glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Calendar View</h2>
            <p className="text-muted-foreground">Calendar view coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projectId={project.id}
      />
    </div>
  );
}
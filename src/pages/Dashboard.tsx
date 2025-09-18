import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { mockProjects, mockTasks, mockUsers } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  // Calculate statistics
  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = mockTasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = mockTasks.filter(t => t.status === 'todo').length;
  const urgentTasks = mockTasks.filter(t => t.priority === 'urgent').length;
  
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    {
      title: 'Total Projects',
      value: mockProjects.length,
      icon: FolderOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Tasks',
      value: inProgressTasks,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Team Members',
      value: mockUsers.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const upcomingTasks = mockTasks
    .filter(t => t.dueDate && t.status !== 'done')
    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your project overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Overview */}
        <Card className="lg:col-span-2 glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Task Overview
            </CardTitle>
            <CardDescription>Current sprint progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall Completion</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{todoTasks}</div>
                <div className="text-xs text-muted-foreground">To Do</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>

            {urgentTasks > 0 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm">
                  <span className="font-medium text-red-600">{urgentTasks}</span>
                  <span className="text-red-600/80"> urgent {urgentTasks === 1 ? 'task' : 'tasks'} require attention</span>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Upcoming Tasks</span>
              <Link to="/projects">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Badge 
                    variant="outline" 
                    className={`mt-0.5 ${
                      task.priority === 'urgent' ? 'priority-urgent' :
                      task.priority === 'high' ? 'priority-high' :
                      task.priority === 'medium' ? 'priority-medium' :
                      'priority-low'
                    }`}
                  >
                    {task.priority}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {task.dueDate?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Your current project assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.filter(p => p.status === 'active').map((project) => (
                <Link 
                  key={project.id} 
                  to={`/projects/${project.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: project.color }}
                  >
                    {project.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">{project.members.length} members</p>
                  </div>
                  <Badge variant="secondary">{project.tags[0]}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
            <CardDescription>Recent updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUsers[1].avatar} />
                  <AvatarFallback>{mockUsers[1].name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{mockUsers[1].name}</span>
                    <span className="text-muted-foreground"> completed </span>
                    <span className="font-medium">Design homepage mockup</span>
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUsers[2].avatar} />
                  <AvatarFallback>{mockUsers[2].name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{mockUsers[2].name}</span>
                    <span className="text-muted-foreground"> started </span>
                    <span className="font-medium">API Integration</span>
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mockUsers[0].avatar} />
                  <AvatarFallback>{mockUsers[0].name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{mockUsers[0].name}</span>
                    <span className="text-muted-foreground"> created new project </span>
                    <span className="font-medium">Mobile App</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
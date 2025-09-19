// Core application types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: User;
  members: User[];
  status: 'active' | 'archived' | 'completed';
  tags: string[];
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  assignees: User[];
  dueDate?: Date;
  projectId: string;
  order: number;
  tags: string[];
  attachments?: Attachment[];
  comments?: Comment[];
  subtasks?: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  taskId: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  taskId: string;
  mentions?: User[];
  createdAt: Date;
  editedAt?: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  userId: string;
  link?: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    taskUpdates: boolean;
    mentions: boolean;
    projectInvites: boolean;
  };
  language: string;
  timezone: string;
}

export interface TeamMember extends User {
  department?: string;
  location?: string;
  phone?: string;
  lastActive?: Date;
  projects: string[];
}
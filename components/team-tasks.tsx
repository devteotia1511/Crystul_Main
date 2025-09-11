"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Calendar, Flag, X } from 'lucide-react';
import { toast } from 'sonner';

interface TeamTasksProps {
  teamId: string;
}

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-gray-200' },
  { id: 'in-progress', title: 'In Progress', color: 'border-blue-200' },
  { id: 'review', title: 'Review', color: 'border-yellow-200' },
  { id: 'done', title: 'Done', color: 'border-green-200' }
];

export default function TeamTasks({ teamId }: TeamTasksProps) {
  const { currentUser, getTeamTasks, addTask, updateTask, deleteTask, users, teams } = useStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: ''
  });

  const tasks = getTeamTasks(teamId);
  const team = teams.find(t => t.id === teamId);
  const teamMembers = team ? [
    users.find(u => u.id === team.founderId),
    ...team.members.map(m => users.find(u => u.id === m.userId))
  ].filter(Boolean) : [];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newTask.title.trim()) return;

    const task = {
      id: Date.now().toString(),
      teamId,
      title: newTask.title.trim(),
      description: newTask.description.trim() || undefined,
      assignedTo: newTask.assignedTo || undefined,
      status: 'todo' as const,
      priority: newTask.priority as 'low' | 'medium' | 'high',
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addTask(task);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', dueDate: '' });
    setShowCreateForm(false);
    toast.success('Task created successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    toast.success('Task deleted successfully!');
  };

  const getAssignedUser = (userId?: string) => {
    return userId ? users.find(u => u.id === userId) : null;
  };

  const tasksByStatus = COLUMNS.reduce((acc, column) => {
    acc[column.id] = tasks.filter(task => task.status === column.id);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Task Board</h2>
          <p className="text-muted-foreground font-sans">
            Manage and track your team&apos;s progress
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="font-display font-medium"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold">Create New Task</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-medium">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="font-sans"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium">Description</Label>
              <Textarea
                id="description"
                placeholder="Task description (optional)"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="font-sans"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-medium">Assign to</Label>
                <Select value={newTask.assignedTo} onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member: any) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Priority</Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="font-medium">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="font-sans"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)} className="font-medium">
                Cancel
              </Button>
              <Button type="submit" className="font-display font-semibold">Create Task</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map((column) => (
          <Card key={column.id} className={`border-t-4 ${column.color}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-display font-semibold flex items-center justify-between">
                {column.title}
                <Badge variant="secondary" className="ml-2">
                  {tasksByStatus[column.id]?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasksByStatus[column.id]?.map((task) => {
                const assignedUser = getAssignedUser(task.assignedTo);
                
                return (
                  <Card key={task.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm leading-5 font-sans">{task.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 font-sans">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={`text-xs ${PRIORITY_COLORS[task.priority]}`}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority}
                        </Badge>
                        
                        {assignedUser && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
                            <AvatarFallback className="text-xs">
                              {assignedUser.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center text-xs text-muted-foreground font-sans">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
              
              {tasksByStatus[column.id]?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm font-sans">No tasks yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
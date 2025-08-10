import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  experience: 'Beginner' | 'intermediate' | 'Expert';
  lookingFor: string[];
  location?: string;
  timezone?: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  founderId: string;
  members: TeamMember[];
  openRoles: string[];
  stage: 'idea' | 'mvp' | 'growth' | 'scaling';
  industry: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface TeamMember {
  userId: string;
  role: string;
  permissions: string[];
  joinedAt: Date;
}

export interface Message {
  id: string;
  teamId: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

export interface Task {
  id: string;
  teamId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;

  // Teams
  teams: Team[];
  currentTeam: Team | null;
  addTeam: (team: Team) => void;
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  deleteTeam: (teamId: string) => void;
  setCurrentTeam: (team: Team | null) => void;
  joinTeam: (teamId: string, userId: string, role: string) => void;

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  getTeamMessages: (teamId: string) => Message[];

  // Tasks
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTeamTasks: (teamId: string) => Task[];

  // Users
  users: User[];
  addUser: (user: User) => void;
  getMatchingUsers: (currentUserId: string) => User[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      isAuthenticated: false,
      login: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false, currentTeam: null }),
      updateProfile: (updates) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
        users: state.users.map(user => 
          user.id === state.currentUser?.id ? { ...user, ...updates } : user
        )
      })),

      // Teams
      teams: [],
      currentTeam: null,
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      updateTeam: (teamId, updates) => set((state) => ({
        teams: state.teams.map(team => team.id === teamId ? { ...team, ...updates } : team),
        currentTeam: state.currentTeam?.id === teamId ? { ...state.currentTeam, ...updates } : state.currentTeam
      })),
      deleteTeam: (teamId) => set((state) => ({
        teams: state.teams.filter(team => team.id !== teamId),
        currentTeam: state.currentTeam?.id === teamId ? null : state.currentTeam
      })),
      setCurrentTeam: (team) => set({ currentTeam: team }),
      joinTeam: (teamId, userId, role) => set((state) => {
        const teamIndex = state.teams.findIndex(t => t.id === teamId);
        if (teamIndex === -1) return state;
        
        const updatedTeams = [...state.teams];
        const newMember: TeamMember = {
          userId,
          role,
          permissions: ['read', 'write'],
          joinedAt: new Date()
        };
        updatedTeams[teamIndex].members.push(newMember);
        
        return { teams: updatedTeams };
      }),

      // Messages
      messages: [],
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      getTeamMessages: (teamId) => get().messages.filter(m => m.teamId === teamId),

      // Tasks
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
        )
      })),
      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),
      getTeamTasks: (teamId) => get().tasks.filter(t => t.teamId === teamId),

      // Users
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      getMatchingUsers: (currentUserId) => {
        const state = get();
        const currentUser = state.users.find(u => u.id === currentUserId);
        if (!currentUser) return [];

        return state.users
          .filter(u => u.id !== currentUserId)
          .map(user => ({
            ...user,
            compatibility: calculateCompatibility(currentUser, user)
          }))
          .sort((a, b) => (b as any).compatibility - (a as any).compatibility)
          .slice(0, 10);
      }
    }),
    {
      name: 'teamup-storage',
    }
  )
);

function calculateCompatibility(user1: User, user2: User): number {
  let score = 0;
  
  // Skill complementarity
  const skillMatch = user1.skills.filter(skill => user2.skills.includes(skill)).length;
  const skillComplement = user1.lookingFor.filter(need => user2.skills.includes(need)).length;
  score += (skillMatch * 2) + (skillComplement * 5);
  
  // Interest alignment
  const interestMatch = user1.interests.filter(interest => user2.interests.includes(interest)).length;
  score += interestMatch * 3;
  
  // Experience diversity
  if (user1.experience !== user2.experience) score += 2;
  
  return Math.min(score, 100);
}
// src/pages/proscreens/tasks/models/projectsmodel.ts
export enum ProjectStatus {
  ALL = 'all',
  TODO = 'todo',
  INPROGRESS = 'inprogress',
  COMPLETED = 'completed',
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  amount: number;
  status: ProjectStatus;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  description: string;
  duration: string;
}

// Add any helper functions you need here
export const getStatusDisplayTitle = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.ALL:
      return 'All Tasks';
    case ProjectStatus.TODO:
      return 'To Do';
    case ProjectStatus.INPROGRESS:
      return 'In-Progress';
    case ProjectStatus.COMPLETED:
      return 'Completed';
  }
};

export const getStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case ProjectStatus.ALL:
      return 'bg-gray-100';
    case ProjectStatus.TODO:
      return 'bg-black';
    case ProjectStatus.INPROGRESS:
      return 'bg-amber-500';
    case ProjectStatus.COMPLETED:
      return 'bg-green-500';
  }
};
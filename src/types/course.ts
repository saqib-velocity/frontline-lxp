export interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  duration: string; // e.g. "15 min"
  rating: number; // 0-5
  progress?: string; // e.g. "4/5"
  type?: string;
}

export interface TrainingPlan {
  id: string;
  title: string;
  status: 'on-track' | 'at-risk' | 'overdue';
  dueDate: string;
  courses: {
    total: number;
    completed: number;
  };
  events: number;
  startHereCourse?: Course;
}

export type FilterTab = 'todo' | 'my-learning' | 'events';

export interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  duration: string; // e.g. "15 min"
  rating: number; // 0-5
  progress?: string; // e.g. "4/5"
  type?: string;
}

export type DueDateStatus = 'overdue' | 'warning' | 'due' | 'none';

export interface LearningCourse extends Course {
  dueDate?: string;
  dueDateStatus?: DueDateStatus;
}

export type LocationType = 'webinar' | 'location' | 'link';
export type EventStatus = 'invited' | 'requested' | 'attending' | 'attended';

export interface CalendarEvent {
  id: string;
  title: string;
  date: { day: string; month: string };
  time: string;
  locationType: LocationType;
  locationValue: string;
  status: EventStatus;
  // detail-screen fields
  description?: string;
  meetingLink?: string;
  locationLabel?: string;
  isMandatory?: boolean;
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
export type LearningSubFilter = 'assigned' | 'in-progress' | 'saved' | 'complete';
export type EventSubFilter = 'assigned' | 'available' | 'attended';

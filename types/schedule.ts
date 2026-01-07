import type { UUID, Timestamp } from './common';

export type ScheduleType =
  | 'study'
  | 'rest'
  | 'meal'
  | 'exercise'
  | 'play'
  | 'class'
  | 'homework'
  | 'sleep'
  | 'other';

export type RepeatPattern =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'weekdays'
  | 'weekends';

export type ReminderType = 'none' | 'notification' | 'sound' | 'both';

export type SchedulePriority = 'low' | 'medium' | 'high';

export type ScheduleStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'skipped';

export interface Schedule {
  id: string;
  childId: UUID;
  title: string;
  description?: string;
  type: ScheduleType;
  startTime: Date;
  endTime: Date;
  repeat?: RepeatPattern;
  reminder?: ReminderType;
  priority?: SchedulePriority;
  status?: ScheduleStatus;
  aiGenerated?: boolean;
  completed?: boolean;
  color?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  participants?: string[];
  attachments?: string[];
  recurrenceRule?: RecurrenceRule;
  reminderTime?: number;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ScheduleFormData {
  title: string;
  description?: string;
  type: ScheduleType;
  startTime: string | Date;
  endTime: string | Date;
  repeat?: RepeatPattern;
  reminder?: ReminderType;
  priority?: SchedulePriority;
  color?: string;
  location?: string;
  notes?: string;
  tags?: string[];
  participants?: string[];
  reminderTime?: number;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  until?: Date;
  count?: number;
  byDay?: number[];
  byMonth?: number[];
  byMonthDay?: number[];
}

export interface AISchedulePreferences {
  wakeUpTime: string;
  sleepTime: string;
  studyFocus: string[];
  breakFrequency: number;
  mealTimes?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  exerciseDuration?: number;
  freePlayTime?: number;
  homeworkTime?: string;
  napTime?: {
    start?: string;
    duration?: number;
  };
  excludeTypes?: ScheduleType[];
  includeActivities?: string[];
}

export interface ScheduleTemplate {
  id: UUID;
  name: string;
  description?: string;
  category: 'daily' | 'weekly' | 'study' | 'weekend' | 'holiday' | 'custom';
  ageGroup: string[];
  schedules: Omit<Schedule, 'id' | 'childId' | 'createdAt' | 'updatedAt'>[];
  isDefault: boolean;
  createdBy: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ScheduleConflict {
  id: string;
  scheduleId: string;
  conflictingScheduleId: string;
  conflictType: 'overlap' | 'adjacent' | 'resource';
  severity: 'low' | 'medium' | 'high';
  suggestedResolution?: string;
  resolved: boolean;
  resolvedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface ScheduleReminder {
  id: UUID;
  scheduleId: string;
  userId: UUID;
  childId: UUID;
  reminderTime: Timestamp;
  reminderType: ReminderType;
  message: string;
  sent: boolean;
  sentAt?: Timestamp;
  acknowledged: boolean;
  acknowledgedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface ScheduleAnalytics {
  totalSchedules: number;
  completedSchedules: number;
  missedSchedules: number;
  completionRate: number;
  onTimeRate: number;
  averageDuration: number;
  typeDistribution: Record<ScheduleType, number>;
  weeklyDistribution: Record<number, number>;
  hourlyDistribution: Record<number, number>;
  mostActiveDay: string;
  mostActiveHour: number;
  aiGeneratedCount: number;
  manualCreatedCount: number;
}

export interface ScheduleGoal {
  id: UUID;
  childId: UUID;
  type: 'daily' | 'weekly' | 'monthly';
  targetType:
    | 'completion_rate'
    | 'study_hours'
    | 'exercise_hours'
    | 'reading_time';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Timestamp;
  endDate: Timestamp;
  achieved: boolean;
  achievedAt?: Timestamp;
  reward?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ScheduleEvent {
  id: UUID;
  scheduleId: string;
  eventType:
    | 'created'
    | 'updated'
    | 'deleted'
    | 'completed'
    | 'skipped'
    | 'reminder_sent';
  eventData: Record<string, unknown>;
  userId: UUID;
  timestamp: Timestamp;
}

export interface CalendarView {
  view: 'day' | 'week' | 'month' | 'agenda';
  date: Date;
  schedules: Schedule[];
  conflicts?: ScheduleConflict[];
  reminders?: ScheduleReminder[];
}

export interface TimeBlock {
  startTime: Date;
  endTime: Date;
  available: boolean;
  schedule?: Schedule;
}

export interface ScheduleSync {
  id: UUID;
  source: 'google' | 'apple' | 'outlook' | 'local';
  externalId?: string;
  lastSyncAt: Timestamp;
  syncStatus: 'synced' | 'pending' | 'failed';
  conflictCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ScheduleExport {
  format: 'json' | 'csv' | 'ical' | 'pdf';
  dateRange: {
    start: Date;
    end: Date;
  };
  includeCompleted: boolean;
  includeNotes: boolean;
  includeAttachments: boolean;
}

export interface ScheduleImport {
  source: 'json' | 'csv' | 'ical' | 'google' | 'apple' | 'outlook';
  data: string | File;
  mapping?: Record<string, string>;
  mergeStrategy: 'replace' | 'merge' | 'skip_conflicts';
}

export interface ScheduleFilter {
  childId?: UUID;
  type?: ScheduleType[];
  status?: ScheduleStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: SchedulePriority[];
  aiGenerated?: boolean;
  tags?: string[];
  searchQuery?: string;
}

export interface ScheduleSort {
  field: 'startTime' | 'endTime' | 'title' | 'priority' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface ScheduleStatistics {
  today: {
    total: number;
    completed: number;
    remaining: number;
  };
  week: {
    total: number;
    completed: number;
    completionRate: number;
  };
  month: {
    total: number;
    completed: number;
    completionRate: number;
  };
  byType: Record<ScheduleType, { total: number; completed: number }>;
  byHour: Record<number, number>;
  streakDays: number;
  longestStreak: number;
}

export interface ScheduleColor {
  type: ScheduleType;
  color: string;
  backgroundColor: string;
  textColor: string;
}

export type GetScheduleColorFn = (type: ScheduleType) => string;

export const SCHEDULE_TYPE_CONFIG: Record<
  ScheduleType,
  { icon: string; label: string; color: string }
> = {
  study: { icon: '📚', label: '学习', color: 'blue' },
  rest: { icon: '😴', label: '休息', color: 'purple' },
  meal: { icon: '🍽️', label: '用餐', color: 'orange' },
  exercise: { icon: '🏃', label: '运动', color: 'green' },
  play: { icon: '🎮', label: '游戏', color: 'pink' },
  class: { icon: '🎓', label: '课程', color: 'indigo' },
  homework: { icon: '✏️', label: '作业', color: 'cyan' },
  sleep: { icon: '🌙', label: '睡眠', color: 'slate' },
  other: { icon: '📌', label: '其他', color: 'gray' },
};

export const getScheduleColor: GetScheduleColorFn = (type: ScheduleType) => {
  const colors: Record<ScheduleType, string> = {
    study: 'bg-blue-500',
    rest: 'bg-purple-500',
    meal: 'bg-orange-500',
    exercise: 'bg-green-500',
    play: 'bg-pink-500',
    class: 'bg-indigo-500',
    homework: 'bg-cyan-500',
    sleep: 'bg-slate-500',
    other: 'bg-gray-500',
  };
  return colors[type] || colors.other;
};

export const getScheduleIcon = (type: ScheduleType): string => {
  return SCHEDULE_TYPE_CONFIG[type]?.icon || '📌';
};

export const getScheduleLabel = (type: ScheduleType): string => {
  return SCHEDULE_TYPE_CONFIG[type]?.label || '其他';
};

export interface ScheduleValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ScheduleBatchOperation {
  operation: 'delete' | 'complete' | 'update' | 'move';
  scheduleIds: string[];
  data?: Partial<ScheduleFormData>;
  targetDate?: Date;
}

export interface ScheduleShare {
  id: UUID;
  scheduleId: string;
  sharedWith: UUID;
  sharedBy: UUID;
  permission: 'view' | 'edit' | 'admin';
  expiresAt?: Timestamp;
  createdAt: Timestamp;
}

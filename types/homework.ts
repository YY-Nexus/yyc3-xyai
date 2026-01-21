/**
 * 作业相关类型定义
 */

export interface Homework {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
  progress?: number;
}

export type HomeworkStatus = 'pending' | 'completed' | 'overdue';

export interface HomeworkResult {
  id: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
  score?: number;
}

export interface VoiceRecording {
  url: string;
  duration: number;
  transcript: string;
}

export interface HomeworkSubmission {
  homeworkId: string;
  submittedAt: Date;
  results: HomeworkResult[];
  attachments?: string[];
  voiceRecording?: VoiceRecording;
  writtenAnswer?: string;
}

export interface HomeworkFeedback {
  resultId: string;
  feedback: string;
  suggestions?: string[];
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
}

export interface HomeworkStats {
  totalHomework: number;
  completedHomework: number;
  averageScore: number;
  totalTimeSpent: number;
  subjectBreakdown: Record<string, {
    count: number;
    averageScore: number;
  }>;
}

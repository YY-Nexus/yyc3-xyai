/**
 * AI视频生成类型定义
 */

export interface AIVideoProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  duration?: number;
  resolution: '720p' | '1080p' | '4k';
  style: VideoStyle;
  type?: VideoStyle;
  scenes: VideoScene[];
  settings: VideoSettings;
  viewCount?: number;
  isFavorite?: boolean;
}

// 类型别名：用于兼容性
export type GeneratedVideo = AIVideoProject;
export type VideoType = VideoStyle;

export type VideoStyle =
  | 'cartoon'
  | 'realistic'
  | 'anime'
  | 'watercolor'
  | '3d-animation'
  | 'clay-animation';

export interface VideoScene {
  id: string;
  order: number;
  description: string;
  duration: number;
  imageUrl?: string;
  audioUrl?: string;
}

export interface VideoSettings {
  backgroundMusic: boolean;
  voiceover: boolean;
  subtitles: boolean;
  aspectRatio: '16:9' | '9:16' | '4:3';
  fps: 24 | 30 | 60;
}

export interface VideoGenerationRequest {
  projectId: string;
  prompt: string;
  style: VideoStyle;
  scenes: Omit<VideoScene, 'id'>[];
  settings: VideoSettings;
}

export interface VideoGenerationResponse {
  projectId: string;
  status: 'generating' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  error?: string;
}

// 视频风格配置
export const VIDEO_STYLE_CONFIG: Record<
  VideoStyle,
  { name: string; color: string }
> = {
  cartoon: { name: '卡通', color: 'from-purple-500 to-pink-500' },
  realistic: { name: '写实', color: 'from-blue-500 to-green-500' },
  anime: { name: '动漫', color: 'from-pink-500 to-red-500' },
  watercolor: { name: '水彩', color: 'from-cyan-500 to-blue-500' },
  '3d-animation': { name: '3D动画', color: 'from-orange-500 to-yellow-500' },
  'clay-animation': { name: '粘土动画', color: 'from-green-500 to-teal-500' },
};

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
  type?: VideoType;
  scenes: VideoScene[];
  settings: VideoSettings;
  viewCount?: number;
  isFavorite?: boolean;
}

// 类型别名：用于兼容性
export type GeneratedVideo = AIVideoProject;

export type VideoType =
  | 'slideshow'
  | 'image-to-video'
  | 'story-animation'
  | 'memory-recap';

export type VideoStyle =
  | 'cartoon'
  | 'realistic'
  | 'anime'
  | 'watercolor'
  | '3d-animation'
  | 'clay-animation'
  | 'warm'
  | 'dreamy'
  | 'happy'
  | 'calm'
  | 'lullaby';

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
  warm: { name: '温馨', color: 'from-amber-500 to-orange-500' },
  dreamy: { name: '梦幻', color: 'from-violet-500 to-purple-500' },
  happy: { name: '欢快', color: 'from-yellow-500 to-amber-500' },
  calm: { name: '宁静', color: 'from-teal-500 to-cyan-500' },
  lullaby: { name: '摇篮曲', color: 'from-indigo-500 to-violet-500' },
};

// 视频模板接口
export interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  suitableFor: VideoType[];
  defaultStyle: VideoStyle;
  defaultDuration: number;
  features: string[];
}

// 视频模板配置
export const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: 'template-memory-recap',
    name: '成长回忆',
    description: '将照片和视频片段转化为温馨的成长回忆视频',
    thumbnail: '/templates/memory-recap.jpg',
    suitableFor: ['memory-recap'],
    defaultStyle: 'warm',
    defaultDuration: 30,
    features: ['背景音乐', '文字说明', '流畅转场']
  },
  {
    id: 'template-story-animation',
    name: '故事动画',
    description: '将文字故事转化为生动的动画视频',
    thumbnail: '/templates/story-animation.jpg',
    suitableFor: ['story-animation'],
    defaultStyle: 'dreamy',
    defaultDuration: 60,
    features: ['角色动画', '语音旁白', '背景音效']
  },
  {
    id: 'template-image-to-video',
    name: '照片转视频',
    description: '将多张照片组合成精美的幻灯片视频',
    thumbnail: '/templates/image-to-video.jpg',
    suitableFor: ['image-to-video', 'slideshow'],
    defaultStyle: 'cartoon',
    defaultDuration: 45,
    features: ['照片特效', '背景音乐', '文字标题']
  }
];

// 回忆视频配置接口
export interface MemoryRecapConfig {
  childId: string;
  period: {
    name: string;
    startDate: Date;
    endDate: Date;
  };
  maxDuration: number;
  includeVoiceover: boolean;
  includeMusic: boolean;
  includeCaptions: boolean;
}

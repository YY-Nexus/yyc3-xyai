'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  type VideoGenerationRequest as ApiVideoGenerationRequest,
  type GeneratedVideo,
  type VideoType,
  type VideoStyle,
  type MemoryRecapConfig,
  type VideoTemplate,
  VIDEO_TEMPLATES,
} from '@/types/ai-video';

interface ExtendedVideoGenerationRequest {
  childId: string;
  type: VideoType;
  title: string;
  sourceImages?: string[];
  duration?: number;
  style: VideoStyle;
  voiceover?: {
    enabled: boolean;
    text?: string;
    voice?: string;
    language?: string;
    emotion?: string;
    speed?: number;
  };
  music?: {
    enabled: boolean;
    style?: string;
    volume?: number;
    fadeIn?: boolean;
    fadeOut?: boolean;
  };
  captions?: boolean;
  storyText?: string;
}

const VIDEO_STORAGE_KEY = 'yyc3_videos';

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useAIVideo() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState<string>('');

  // 加载视频列表
  const loadVideos = useCallback(() => {
    try {
      const stored = localStorage.getItem(VIDEO_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setVideos(
          parsed.map((v: GeneratedVideo) => ({
            ...v,
            createdAt: new Date(v.createdAt),
          }))
        );
      }
    } catch (error) {
      console.error('加载视频列表失败:', error);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // 保存视频
  const saveVideo = useCallback((video: GeneratedVideo) => {
    setVideos(prev => {
      const updated = [video, ...prev];
      localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 更新视频
  const updateVideo = useCallback(
    (videoId: string, updates: Partial<GeneratedVideo>) => {
      setVideos(prev => {
        const updated = prev.map(v =>
          v.id === videoId ? { ...v, ...updates } : v
        );
        localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  // 模拟视频生成过程
  const simulateGeneration = useCallback(
    async (request: ExtendedVideoGenerationRequest): Promise<GeneratedVideo> => {
      const steps = [
        { progress: 10, task: '分析图片内容...' },
        { progress: 25, task: '生成动画序列...' },
        { progress: 40, task: '添加转场效果...' },
        { progress: 55, task: '合成背景音乐...' },
        { progress: 70, task: '生成语音配音...' },
        { progress: 85, task: '渲染最终视频...' },
        { progress: 95, task: '优化视频质量...' },
        { progress: 100, task: '完成!' },
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationProgress(step.progress);
        setCurrentTask(step.task);
      }

      // 生成模拟视频数据
      const video: GeneratedVideo = {
        id: generateId('video'),
        type: request.type,
        title: request.title,
        description: `${request.type === 'memory-recap' ? '成长回忆' : '创意视频'} - ${request.title}`,
        thumbnail: `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(request.title + ' thumbnail')}`,
        thumbnailUrl: `/placeholder.svg?height=180&width=320&query=${encodeURIComponent(request.title + ' thumbnail')}`,
        duration: request.duration ?? 30,
        resolution: '1080p',
        style: request.style,
        scenes: [],
        settings: {
          backgroundMusic: request.music?.enabled ?? false,
          voiceover: request.voiceover?.enabled ?? false,
          subtitles: false,
          aspectRatio: '16:9',
          fps: 30,
        },
        status: 'completed',
        isFavorite: false,
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(request.voiceover?.text && { voiceoverText: request.voiceover.text }),
      };

      return video;
    },
    []
  );

  // 生成视频
  const generateVideo = useCallback(
    async (request: ExtendedVideoGenerationRequest): Promise<GeneratedVideo> => {
      setIsGenerating(true);
      setGenerationProgress(0);
      setCurrentTask('准备生成...');

      try {
        // 调用API或模拟生成
        const video = await simulateGeneration(request);
        saveVideo(video);
        return video;
      } catch (error) {
        console.error('视频生成失败:', error);
        throw error;
      } finally {
        setIsGenerating(false);
        setGenerationProgress(0);
        setCurrentTask('');
      }
    },
    [simulateGeneration, saveVideo]
  );

  // 生成成长回忆视频
  const generateMemoryRecap = useCallback(
    async (config: MemoryRecapConfig): Promise<GeneratedVideo> => {
      // 构建回忆视频请求
      const request: ExtendedVideoGenerationRequest = {
        childId: config.childId,
        type: 'memory-recap',
        title: `${config.period.name}成长回忆`,
        sourceImages: [], // 会从成长记录中提取
        duration: config.maxDuration,
        style: 'warm',
        voiceover: {
          enabled: true,
          text: `这是宝贝在${config.period.name}期间的美好回忆...`,
          voice: 'xiaoyu',
          language: 'zh-CN',
          emotion: 'storytelling',
          speed: 1.0,
        },
        music: {
          enabled: true,
          style: 'calm',
          volume: 30,
          fadeIn: true,
          fadeOut: true,
        },
        captions: true,
      };

      return generateVideo(request);
    },
    [generateVideo]
  );

  // 图片转视频
  const imageToVideo = useCallback(
    async (
      childId: string,
      images: string[],
      title: string,
      style: VideoStyle,
      duration: number
    ): Promise<GeneratedVideo> => {
      const request: ExtendedVideoGenerationRequest = {
        childId,
        type: 'image-to-video',
        title,
        sourceImages: images,
        duration,
        style,
        music: {
          enabled: true,
          style: 'happy',
          volume: 40,
          fadeIn: true,
          fadeOut: true,
        },
      };

      return generateVideo(request);
    },
    [generateVideo]
  );

  // 故事动画化
  const animateStory = useCallback(
    async (
      childId: string,
      storyText: string,
      title: string,
      images: string[]
    ): Promise<GeneratedVideo> => {
      const request: ExtendedVideoGenerationRequest = {
        childId,
        type: 'story-animation',
        title,
        sourceImages: images,
        storyText,
        duration: Math.ceil(storyText.length / 5), // 估算时长
        style: 'dreamy',
        voiceover: {
          enabled: true,
          text: storyText,
          voice: 'xiaoyu',
          language: 'zh-CN',
          emotion: 'storytelling',
          speed: 0.9,
        },
        music: {
          enabled: true,
          style: 'lullaby',
          volume: 25,
          fadeIn: true,
          fadeOut: true,
        },
        captions: true,
      };

      return generateVideo(request);
    },
    [generateVideo]
  );

  // 切换收藏
  const toggleFavorite = useCallback(
    (videoId: string) => {
      updateVideo(videoId, {
        isFavorite: !videos.find(v => v.id === videoId)?.isFavorite,
      });
    },
    [videos, updateVideo]
  );

  // 增加观看次数
  const incrementViewCount = useCallback(
    (videoId: string) => {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        updateVideo(videoId, { viewCount: (video.viewCount ?? 0) + 1 });
      }
    },
    [videos, updateVideo]
  );

  // 删除视频
  const deleteVideo = useCallback((videoId: string) => {
    setVideos(prev => {
      const updated = prev.filter(v => v.id !== videoId);
      localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 获取模板列表
  const getTemplates = useCallback((type?: VideoType): VideoTemplate[] => {
    if (!type) return VIDEO_TEMPLATES;
    return VIDEO_TEMPLATES.filter(t => t.suitableFor.includes(type));
  }, []);

  // 按类型筛选视频
  const getVideosByType = useCallback(
    (type: VideoType): GeneratedVideo[] => {
      return videos.filter(v => v.type === type);
    },
    [videos]
  );

  // 获取收藏视频
  const getFavoriteVideos = useCallback((): GeneratedVideo[] => {
    return videos.filter(v => v.isFavorite);
  }, [videos]);

  return {
    videos,
    isGenerating,
    generationProgress,
    currentTask,
    loadVideos,
    generateVideo,
    generateMemoryRecap,
    imageToVideo,
    animateStory,
    toggleFavorite,
    incrementViewCount,
    deleteVideo,
    getTemplates,
    getVideosByType,
    getFavoriteVideos,
  };
}

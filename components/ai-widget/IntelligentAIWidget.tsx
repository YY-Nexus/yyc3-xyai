/**
 * YYC³ 智能预测系统 - 智能拖拽AI助手组件
 * 支持拖拽移动、智能布局、多视图切换和实时交互
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import Image from 'next/image';
import { useDrag, useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import {
  MessageCircle,
  BarChart3,
  Settings2,
  Maximize2,
  Minimize2,
  X,
  RefreshCw,
  Info,
  TrendingUp,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Mic,
  MicOff,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// AI组件
import ModelSelector from './ModelSelector';
import PerformanceMonitor from './PerformanceMonitor';

// 语音交互组件
import { VoiceInteraction } from '../voice/VoiceInteraction';

// 样式文件
import './IntelligentAIWidget.css';

// 主题色Hook
import { useThemeColor } from '@/hooks/useThemeColor';

// 响应式Hook
import { useResponsive, type Breakpoint } from '@/hooks/useResponsive';

// 动画组件
import { FadeIn, SlideIn, ScaleIn, BounceIn } from '../animations/Animations';

// 图标组件
import AgenticCore from '../../core/AgenticCore';
import { AI_ROLES, selectRoleByContext, type AIRole } from '@/lib/ai_roles';
import type {
  UserInput,
  AgentResponse,
  AgentTask,
  SystemStatus,
} from '../../core/AgenticCore';
import { characterManager } from '@/lib/character-manager';
import { selectCurrentUser } from '@/lib/store';

// AI服务适配器
import {
  AIServiceManager,
  OllamaServiceAdapter,
  createAIServiceAdapter,
  type AIServiceAdapter,
  type ChatMessage,
  type ChatOptions,
  type ModelInfo,
  type HealthStatus,
  type ServiceMetrics,
} from '@/services/ai/AIServiceAdapter';
import { LocalAIGatewayAdapter } from '@/services/ai/LocalAIGatewayAdapter';

// 拖拽类型定义
export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface WidgetState {
  isVisible: boolean;
  isMinimized: boolean;
  isFullscreen: boolean;
  currentView: 'chat' | 'dashboard' | 'tools' | 'insights' | 'settings';
  mode: 'floating' | 'docked' | 'modal';
  position: WidgetPosition;
  sessionId: string;
  unreadCount: number;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  isDragging: boolean;
  isResizing: boolean;
}

interface WidgetProps {
  // API端点配置（预留）
  apiEndpoint?: string;
  userId?: string;
  // 工作空间ID（预留）
  workspaceId?: string;
  initialPosition?: string;
  initialRole?: AIRole;
  onRoleChange?: (role: AIRole) => void;
  theme?: 'light' | 'dark' | 'auto';
  // 权限配置（预留）
  permissions?: string[];
  onStateChange?: (state: WidgetState) => void;
  onError?: (error: Error) => void;
  width?: number;
  height?: number;
  className?: string;
  // AI服务配置
  aiServiceType?: 'ollama' | 'local-gateway';
  aiServiceBaseUrl?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'failed';
  metadata?: Record<string, unknown>;
}

// 拖拽项类型定义
interface DragItem {
  type: string;
  id: string;
}

export const IntelligentAIWidget: React.FC<WidgetProps> = ({
  apiEndpoint: _apiEndpoint = '/api/ai-agent',
  userId = 'default-user',
  workspaceId: _workspaceId = 'default-workspace',
  initialPosition = 'bottom-right',
  initialRole,
  onRoleChange,
  theme = 'auto',
  permissions: _permissions = ['basic'],
  onStateChange,
  onError,
  width = 400,
  height = 600,
  className = '',
  aiServiceType = 'ollama',
  aiServiceBaseUrl,
}) => {
  // 获取当前用户信息
  const currentUser = useSelector(selectCurrentUser);
  const userGender = currentUser?.gender || 'female'; // 默认使用女性角色

  const [state, setState] = useState<WidgetState>(() => ({
    isVisible: true,
    isMinimized: false,
    isFullscreen: false,
    currentView: 'chat',
    mode: 'floating',
    position: getInitialPosition(initialPosition, width, height),
    sessionId: generateSessionId(),
    unreadCount: 0,
    connectionStatus: 'connected',
    isDragging: false,
    isResizing: false,
  }));

  const [currentRole, setCurrentRole] = useState<AIRole>(
    initialRole || 'companion'
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTasks, setActiveTasks] = useState<AgentTask[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  const [currentModel, setCurrentModel] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [aiServiceHealth, setAiServiceHealth] = useState<HealthStatus | null>(
    null
  );
  const [aiServiceMetrics, setAiServiceMetrics] =
    useState<ServiceMetrics | null>(null);

  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceResponse, setVoiceResponse] = useState('');

  const { themeColors } = useThemeColor(currentRole);
  const responsive = useResponsive();

  const widgetRef = useRef<HTMLDivElement>(null);
  const agenticCoreRef = useRef<AgenticCore | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const addNotificationRef = useRef<
    | ((
        message: string,
        type: 'info' | 'success' | 'error' | 'warning'
      ) => void)
    | null
  >(null);
  const aiServiceManagerRef = useRef<AIServiceManager | null>(null);

  // 拖拽实现
  const [{ isDragging }, drag] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: 'ai-widget',
    item: { type: 'ai-widget', id: 'ai-widget' },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !state.isMinimized && state.mode === 'floating',
    end: (_item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        handleDragEnd(delta);
      }
    },
  });

  // 放置目标
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ['ai-widget', 'ai-widget-dock'],
    drop: (item, _monitor) => {
      if (item.type === 'ai-widget-dock') {
        handleDock();
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  // 合并refs
  const setWidgetRef = useCallback(
    (node: HTMLDivElement | null) => {
      widgetRef.current = node;
      if (node) {
        drag(drop(node));
      }
    },
    [drag, drop]
  );

  // 处理拖拽结束
  const handleDragEnd = useCallback(
    (delta: { x: number; y: number }) => {
      if (!widgetRef.current) return;

      setState(prev => {
        const newPosition = {
          ...prev.position,
          x: prev.position.x + delta.x,
          y: prev.position.y + delta.y,
          zIndex: Math.max(prev.position.zIndex, 1000),
        };

        const optimizedPosition = optimizePosition(
          newPosition,
          window.innerWidth,
          window.innerHeight
        );

        const newState = {
          ...prev,
          position: optimizedPosition,
          isDragging: false,
        };
        onStateChange?.(newState);
        return newState;
      });
    },
    [onStateChange]
  );

  // 处理停靠
  const handleDock = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'docked',
      position: { ...prev.position, x: 0, y: 0 },
    }));
  }, []);

  // 处理消息发送
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = {
        id: generateMessageId(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
        status: 'sending',
      };

      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsProcessing(true);

      try {
        // 优先使用AI服务适配器
        if (
          aiServiceManagerRef.current &&
          state.connectionStatus === 'connected'
        ) {
          const adapter = aiServiceManagerRef.current.getAdapter();
          const chatMessages: ChatMessage[] = [
            {
              role: 'system',
              content: AI_ROLES[currentRole].systemPrompt,
            },
            ...messages.map(m => ({
              role: m.role,
              content: m.content,
            })),
            {
              role: 'user',
              content: text,
            },
          ];

          const response = await adapter.chat(chatMessages, {
            model: currentModel,
            temperature: 0.7,
            max_tokens: 2048,
          });

          const assistantMessage: Message = {
            id: generateMessageId(),
            role: 'assistant',
            content: response.message.content,
            timestamp: Date.now(),
            status: 'sent',
            metadata: {
              model: response.model,
              usage: response.usage,
              thinkingTime: response.thinking_time,
              role: currentRole,
            },
          };

          setMessages(prev => [...prev, assistantMessage]);
        } else if (agenticCoreRef.current) {
          // 回退到AgenticCore
          const userInput: UserInput = {
            text: inputValue,
            timestamp: Date.now(),
            sessionId: state.sessionId,
            userId,
            context: {
              source: 'web',
              additionalData: {
                role: currentRole,
                roleConfig: AI_ROLES[currentRole],
              },
            },
          };

          const response: AgentResponse =
            await agenticCoreRef.current.processInput(userInput);

          const assistantMessage: Message = {
            id: generateMessageId(),
            role: 'assistant',
            content: response.message,
            timestamp: Date.now(),
            metadata: {
              taskId: response.taskId,
              status: response.status,
              estimatedTime: response.estimatedTime,
              role: currentRole,
            },
          };

          setMessages(prev => [...prev, assistantMessage]);

          // 如果有替代方案，提供选择
          if (response.alternatives && response.alternatives.length > 0) {
            setTimeout(() => {
              setMessages(prev => [
                ...prev,
                {
                  id: generateMessageId(),
                  role: 'assistant',
                  content: '您可以选择以下替代方案：',
                  timestamp: Date.now(),
                  metadata: {
                    alternatives: response.alternatives,
                  },
                },
              ]);
            }, 500);
          }
        } else {
          throw new Error('AI服务不可用');
        }
      } catch (error) {
        console.error('发送消息失败:', error);
        const errorMessage: Message = {
          id: generateMessageId(),
          role: 'assistant',
          content: `抱歉，处理您的请求时出现错误：${(error as Error).message}`,
          timestamp: Date.now(),
          status: 'failed',
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      agenticCoreRef,
      userId,
      state.sessionId,
      currentRole,
      messages,
      currentModel,
      state.connectionStatus,
    ]
  );

  // 任务事件处理
  const handleTaskCreated = useCallback((task: AgentTask) => {
    setActiveTasks(prev => [...prev, task]);
    addNotificationRef.current?.(`任务 "${task.goal}" 已创建`, 'info');
  }, []);

  const handleTaskStarted = useCallback((task: AgentTask) => {
    setActiveTasks(prev =>
      prev.map(t => (t.id === task.id ? { ...t, status: 'executing' } : t))
    );
  }, []);

  const handleTaskCompleted = useCallback((task: AgentTask) => {
    setActiveTasks(prev => prev.filter(t => t.id !== task.id));
    addNotificationRef.current?.(`任务 "${task.goal}" 已完成`, 'success');
  }, []);

  const handleTaskFailed = useCallback(
    ({ task, error }: { task: AgentTask; error: Error }) => {
      setActiveTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...t, status: 'failed' } : t))
      );
      addNotificationRef.current?.(
        `任务 "${task.goal}" 失败: ${error.message}`,
        'error'
      );
    },
    []
  );

  const handleError = useCallback((error: Error) => {
    console.error('Agent核心错误:', error);
    addNotificationRef.current?.(`系统错误: ${error.message}`, 'error');
  }, []);

  // 添加通知
  const addNotification = useCallback(
    (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
      const notification: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: message,
        timestamp: Date.now(),
        metadata: { type, isNotification: true },
      };

      setMessages(prev => [...prev, notification]);

      setState(prev => {
        const newUnreadCount = prev.isMinimized
          ? prev.unreadCount + 1
          : prev.unreadCount;
        return { ...prev, unreadCount: newUnreadCount };
      });
    },
    []
  );

  // 存储 addNotification 到 ref 供其他函数使用
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  // 切换视图
  const switchView = useCallback((view: WidgetState['currentView']) => {
    setState(prev => ({
      ...prev,
      currentView: view,
      isMinimized: false,
    }));
  }, []);

  // 切换最小化状态
  const toggleMinimize = useCallback(() => {
    setState(prev => {
      const newMinimized = !prev.isMinimized;
      return {
        ...prev,
        isMinimized: newMinimized,
        unreadCount: newMinimized ? 0 : prev.unreadCount,
      };
    });
  }, []);

  // 切换全屏状态
  const toggleFullscreen = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  }, []);

  // 处理角色切换
  const handleRoleChange = useCallback(
    (newRole: AIRole) => {
      setCurrentRole(newRole);
      onRoleChange?.(newRole);
      addNotificationRef.current?.(`已切换到角色: ${newRole}`, 'info');
    },
    [onRoleChange]
  );

  // 关闭组件
  const handleClose = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isVisible: false };
      onStateChange?.(newState);
      return newState;
    });
  }, [onStateChange]);

  // 调整大小处理
  const handleResizeStart = useCallback((_direction: string) => {
    setState(prev => ({ ...prev, isResizing: true }));
  }, []);

  const handleResize = useCallback(
    (_direction: string, deltaX: number, deltaY: number) => {
      setState(prev => {
        if (!prev.isResizing) return prev;

        const newSize = calculateNewSize(
          prev.position,
          _direction,
          deltaX,
          deltaY
        );

        return {
          ...prev,
          position: { ...prev.position, ...newSize },
        };
      });
    },
    []
  );

  const handleResizeEnd = useCallback(() => {
    setState(prev => ({ ...prev, isResizing: false }));
  }, []);

  // 初始化Widget
  const initializeWidget = useCallback(async () => {
    let statusInterval: NodeJS.Timeout | null = null;
    let healthCheckInterval: NodeJS.Timeout | null = null;

    try {
      // 创建Agent核心引擎实例
      const agentCore = new AgenticCore({
        maxConcurrentTasks: 5,
        learningEnabled: true,
        autoOptimization: true,
        privacyMode: 'normal',
      });

      agenticCoreRef.current = agentCore;

      // 监听事件
      agentCore.on('taskCreated', handleTaskCreated);
      agentCore.on('taskStarted', handleTaskStarted);
      agentCore.on('taskCompleted', handleTaskCompleted);
      agentCore.on('taskFailed', handleTaskFailed);
      agentCore.on('error', handleError);

      // 定期更新系统状态
      statusInterval = setInterval(() => {
        const status = agentCore.getSystemStatus();
        setSystemStatus(status);
      }, 5000);

      // 初始化AI服务管理器
      let aiAdapter: AIServiceAdapter;

      if (aiServiceType === 'local-gateway') {
        aiAdapter = new LocalAIGatewayAdapter({
          baseUrl: aiServiceBaseUrl || 'http://localhost:8081',
        });
      } else {
        aiAdapter = new OllamaServiceAdapter();
      }

      const aiServiceManager = new AIServiceManager(aiAdapter);
      aiServiceManagerRef.current = aiServiceManager;

      // 检查本地AI服务可用性
      await checkAIServiceAvailability();

      // 定期检查AI服务健康状态
      healthCheckInterval = setInterval(async () => {
        await checkAIServiceAvailability();
        await updateAIServiceMetrics();
      }, 10000); // 每10秒检查一次

      // 加载可用模型列表
      await loadAvailableModels();
    } catch (error) {
      console.error('Widget初始化失败:', error);
      onError?.(error as Error);
    }

    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }
      if (aiServiceManagerRef.current) {
        aiServiceManagerRef.current.cleanup();
      }
    };
  }, [
    handleTaskCreated,
    handleTaskStarted,
    handleTaskCompleted,
    handleTaskFailed,
    handleError,
    onError,
  ]);

  // 检查AI服务可用性
  const checkAIServiceAvailability = useCallback(async () => {
    if (!aiServiceManagerRef.current) return;

    try {
      const health = await aiServiceManagerRef.current
        .getAdapter()
        .healthCheck();
      setAiServiceHealth(health);

      if (health.status === 'healthy') {
        setState(prev => ({ ...prev, connectionStatus: 'connected' }));
        const currentModel = aiServiceManagerRef.current
          .getAdapter()
          .getCurrentModel();
        setCurrentModel(currentModel);
      } else if (health.status === 'degraded') {
        setState(prev => ({ ...prev, connectionStatus: 'reconnecting' }));
      } else {
        setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
        addNotificationRef.current?.(
          '本地AI服务不可用，请检查服务状态',
          'warning'
        );
      }
    } catch (error) {
      console.error('AI服务检查失败:', error);
      setState(prev => ({ ...prev, connectionStatus: 'disconnected' }));
      setAiServiceHealth(null);
    }
  }, []);

  // 更新AI服务指标
  const updateAIServiceMetrics = useCallback(async () => {
    if (!aiServiceManagerRef.current) return;

    try {
      const metrics = await aiServiceManagerRef.current
        .getAdapter()
        .getMetrics();
      setAiServiceMetrics(metrics);
    } catch (error) {
      console.error('获取AI服务指标失败:', error);
    }
  }, []);

  // 加载可用模型列表
  const loadAvailableModels = useCallback(async () => {
    if (!aiServiceManagerRef.current) return;

    try {
      const models = await aiServiceManagerRef.current
        .getAdapter()
        .listModels();
      setAvailableModels(models);

      if (models.length > 0 && !currentModel) {
        setCurrentModel(models[0].name);
      }
    } catch (error) {
      console.error('加载模型列表失败:', error);
    }
  }, [currentModel]);

  // 切换AI模型
  const handleModelChange = useCallback(
    async (modelName: string) => {
      if (!aiServiceManagerRef.current || modelName === currentModel) return;

      try {
        setIsProcessing(true);
        await aiServiceManagerRef.current.getAdapter().switchModel(modelName);
        setCurrentModel(modelName);
        addNotificationRef.current?.(`已切换到模型: ${modelName}`, 'success');
      } catch (error) {
        console.error('切换模型失败:', error);
        addNotificationRef.current?.(
          `切换模型失败: ${(error as Error).message}`,
          'error'
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [currentModel]
  );

  // 处理语音转录
  const handleVoiceTranscript = useCallback(
    (text: string, isFinal: boolean) => {
      setVoiceTranscript(text);

      if (isFinal && text.trim()) {
        setInputValue(text);
        setTimeout(() => {
          handleSendMessage(text);
        }, 500);
      }
    },
    [handleSendMessage]
  );

  // 处理语音响应
  const handleVoiceResponse = useCallback((text: string) => {
    setVoiceResponse(text);
  }, []);

  // 处理语音错误
  const handleVoiceError = useCallback((error: string) => {
    addNotificationRef.current?.(`语音错误: ${error}`, 'error');
  }, []);

  // 初始化
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initializeWidget().then(cleanupFn => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializeWidget]);

  // 自动滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setState(prev => {
        if (prev.mode === 'floating') {
          const newPosition = optimizePosition(
            prev.position,
            window.innerWidth,
            window.innerHeight
          );
          return { ...prev, position: newPosition };
        }
        return prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 渲染主组件
  if (!state.isVisible) return null;

  const getResponsiveWidth = (): number => {
    switch (responsive.breakpoint) {
      case 'xs':
        return Math.min(window.innerWidth * 0.9, 600);
      case 'sm':
        return Math.min(window.innerWidth * 0.85, 600);
      case 'md':
        return Math.min(window.innerWidth * 0.75, 600);
      case 'lg':
      case 'xl':
      case '2xl':
      default:
        return state.position.width;
    }
  };

  const getResponsiveHeight = (): number => {
    switch (responsive.breakpoint) {
      case 'xs':
        return Math.min(window.innerHeight * 0.6, 800);
      case 'sm':
        return Math.min(window.innerHeight * 0.65, 800);
      case 'md':
        return Math.min(window.innerHeight * 0.7, 800);
      case 'lg':
      case 'xl':
      case '2xl':
      default:
        return state.position.height;
    }
  };

  const getResponsivePosition = (): { x: number; y: number } => {
    if (responsive.isMobile || responsive.isTablet) {
      return {
        x: (window.innerWidth - getResponsiveWidth()) / 2,
        y: (window.innerHeight - getResponsiveHeight()) / 2,
      };
    }
    return { x: state.position.x, y: state.position.y };
  };

  const responsivePosition = getResponsivePosition();
  const responsiveWidth = getResponsiveWidth();
  const responsiveHeight = getResponsiveHeight();

  return (
    <div
      ref={setWidgetRef}
      className={`ai-widget ${className} ${state.mode} ${state.isMinimized ? 'minimized' : ''} ${
        state.isFullscreen ? 'fullscreen' : ''
      } ${isDragging ? 'dragging' : ''} ${isOver ? 'over' : ''}`}
      style={{
        position: state.mode === 'floating' ? 'fixed' : 'relative',
        left: state.mode === 'floating' ? `${responsivePosition.x}px` : 'auto',
        top: state.mode === 'floating' ? `${responsivePosition.y}px` : 'auto',
        width: state.isFullscreen ? '100%' : `${responsiveWidth}px`,
        height: state.isMinimized
          ? '60px'
          : state.isFullscreen
            ? '100%'
            : `${responsiveHeight}px`,
        zIndex: state.position.zIndex,
        minWidth: state.isMinimized ? 'auto' : '280px',
        minHeight: state.isMinimized ? 'auto' : '350px',
        maxWidth: state.isFullscreen ? '100%' : '650px',
        maxHeight: state.isFullscreen ? '100%' : '800px',
      }}
    >
      {/* 头部 */}
      <div
        className='widget-header'
        onMouseDown={state.mode === 'floating' ? undefined : undefined}
      >
        <div className='header-left'>
          <div className='status-indicator'>
            <div className={`status-dot ${state.connectionStatus}`} />
            <span className='status-text'>
              {state.connectionStatus === 'connected'
                ? '在线'
                : state.connectionStatus === 'reconnecting'
                  ? '重连中'
                  : '离线'}
            </span>
          </div>

          {!state.isMinimized && (
            <h3 className='widget-title flex items-center gap-2'>
              <Image
                src={characterManager.getAIAvatarPath(userGender)}
                alt='AI助手头像'
                width={32}
                height={32}
                className='rounded-full border-2 border-white shadow-sm'
              />
              YYC³ AI助手
              {activeTasks.length > 0 && (
                <Badge variant='secondary' className='ml-2'>
                  {activeTasks.length}
                </Badge>
              )}
            </h3>
          )}
        </div>

        <div className='header-right'>
          {!state.isMinimized && (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => switchView('chat')}
                className={state.currentView === 'chat' ? 'active' : ''}
              >
                <MessageCircle size={16} />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => switchView('dashboard')}
                className={state.currentView === 'dashboard' ? 'active' : ''}
              >
                <BarChart3 size={16} />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => switchView('tools')}
                className={state.currentView === 'tools' ? 'active' : ''}
              >
                <Settings2 size={16} />
              </Button>

              <Separator orientation='vertical' className='mx-1' />
            </>
          )}

          {state.mode === 'floating' && !state.isFullscreen && (
            <Button variant='ghost' size='sm' onClick={toggleMinimize}>
              {state.isMinimized ? (
                <Maximize2 size={16} />
              ) : (
                <Minimize2 size={16} />
              )}
            </Button>
          )}

          <Button variant='ghost' size='sm' onClick={toggleFullscreen}>
            {state.isFullscreen ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </Button>

          <Button variant='ghost' size='sm' onClick={handleClose}>
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* 内容区域 */}
      {!state.isMinimized && (
        <div className='widget-content'>
          {state.currentView === 'chat' && (
            <ChatView
              messages={messages}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
              inputRef={messagesEndRef}
              currentRole={currentRole}
              onRoleChange={handleRoleChange}
              currentModel={currentModel}
              availableModels={availableModels}
              onModelChange={handleModelChange}
              aiService={aiServiceManagerRef.current?.getAdapter() || null}
              aiServiceHealth={aiServiceHealth}
              aiServiceMetrics={aiServiceMetrics}
              voiceEnabled={voiceEnabled}
              onVoiceEnabledChange={setVoiceEnabled}
              onVoiceTranscript={handleVoiceTranscript}
              onVoiceResponse={handleVoiceResponse}
              onVoiceError={handleVoiceError}
              voiceTranscript={voiceTranscript}
              voiceResponse={voiceResponse}
            />
          )}

          {state.currentView === 'dashboard' && (
            <DashboardView
              systemStatus={systemStatus}
              activeTasks={activeTasks}
              agenticCore={agenticCoreRef.current}
            />
          )}

          {state.currentView === 'tools' && (
            <ToolsView
              onToolSelected={tool => handleSendMessage(`使用工具: ${tool}`)}
            />
          )}

          {state.currentView === 'insights' && (
            <InsightsView
              systemStatus={systemStatus}
              completedTasks={
                agenticCoreRef.current?.getSystemStatus().completedTasks || 0
              }
            />
          )}

          {state.currentView === 'settings' && (
            <SettingsView
              theme={theme}
              onThemeChange={() => {}}
              aiService={aiServiceManagerRef.current?.getAdapter() || null}
              aiServiceHealth={aiServiceHealth}
              aiServiceMetrics={aiServiceMetrics}
            />
          )}
        </div>
      )}

      {/* 调整大小手柄 */}
      {state.mode === 'floating' &&
        !state.isMinimized &&
        !state.isFullscreen && (
          <ResizeHandles
            onResizeStart={handleResizeStart}
            onResize={handleResize}
            onResizeEnd={handleResizeEnd}
          />
        )}

      {/* 未读消息指示器 */}
      {state.isMinimized && state.unreadCount > 0 && (
        <div className='unread-indicator'>
          <Badge variant='destructive' className='animate-pulse'>
            {state.unreadCount}
          </Badge>
        </div>
      )}
    </div>
  );
};

// 子组件：聊天视图
const ChatView: React.FC<{
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  inputRef: React.RefObject<HTMLDivElement | null>;
  currentRole: AIRole;
  onRoleChange: (role: AIRole) => void;
  currentModel: string;
  availableModels: ModelInfo[];
  onModelChange: (modelName: string) => void;
  aiService: AIServiceAdapter | null;
  aiServiceHealth: HealthStatus | null;
  aiServiceMetrics: ServiceMetrics | null;
  voiceEnabled: boolean;
  onVoiceEnabledChange: (enabled: boolean) => void;
  onVoiceTranscript: (text: string, isFinal: boolean) => void;
  onVoiceResponse: (text: string) => void;
  onVoiceError: (error: string) => void;
  voiceTranscript: string;
  voiceResponse: string;
}> = ({
  messages,
  inputValue,
  setInputValue,
  onSendMessage,
  isProcessing,
  inputRef,
  currentRole,
  onRoleChange,
  currentModel,
  availableModels,
  onModelChange,
  aiService,
  aiServiceHealth,
  aiServiceMetrics,
  voiceEnabled,
  onVoiceEnabledChange,
  onVoiceTranscript,
  onVoiceResponse,
  onVoiceError,
  voiceTranscript,
  voiceResponse,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(inputValue);
    }
  };

  return (
    <div className='chat-view'>
      <FadeIn delay={0.1} duration={0.3}>
        <div className='role-selector'>
          <Label className='text-xs text-gray-500'>AI角色:</Label>
          <div className='flex gap-2 flex-wrap'>
            {Object.entries(AI_ROLES).map(([key, role]) => (
              <Button
                key={key}
                variant={currentRole === key ? 'default' : 'outline'}
                size='sm'
                onClick={() => onRoleChange(key as AIRole)}
                className='text-xs'
              >
                {role.name}
              </Button>
            ))}
          </div>
        </div>
      </FadeIn>

      {aiService && (
        <FadeIn delay={0.2} duration={0.3}>
          <ModelSelector
            currentModel={currentModel}
            availableModels={availableModels}
            onModelChange={onModelChange}
            aiService={aiService}
            isLoading={isProcessing}
          />
        </FadeIn>
      )}

      <ScrollArea className='messages-area' ref={inputRef}>
        <div className='messages-container'>
          {messages.map((message, index) => (
            <SlideIn
              key={message.id}
              delay={index * 0.05}
              duration={0.3}
              direction={message.role === 'user' ? 'right' : 'left'}
            >
              <div className={`message ${message.role}`}>
                <div className='message-content'>{message.content}</div>
                <div className='message-time'>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </SlideIn>
          ))}

          {isProcessing && (
            <FadeIn delay={0.1} duration={0.3}>
              <div className='message assistant'>
                <div className='message-content'>
                  <div className='typing-indicator'>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </ScrollArea>

      <FadeIn delay={0.3} duration={0.3}>
        <div className='input-area'>
          <div className='flex-1 flex flex-col gap-2'>
            <Textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder='输入您的问题...'
              disabled={isProcessing}
              rows={2}
              className='flex-1 mr-2'
            />

            {voiceEnabled && (
              <VoiceInteraction
                onTranscript={onVoiceTranscript}
                onResponse={onVoiceResponse}
                onError={onVoiceError}
                language='zh-CN'
                autoPlayResponse={true}
                continuousListening={true}
                showSettings={true}
                compact={true}
              />
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Button
              variant={voiceEnabled ? 'default' : 'outline'}
              size='sm'
              onClick={() => onVoiceEnabledChange(!voiceEnabled)}
              title={voiceEnabled ? '关闭语音' : '开启语音'}
            >
              {voiceEnabled ? <Mic size={16} /> : <MicOff size={16} />}
            </Button>

            <Button
              onClick={() => onSendMessage(inputValue)}
              disabled={!inputValue.trim() || isProcessing}
              className='send-button'
            >
              <MessageCircle size={16} />
            </Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

// 子组件：仪表板视图
const DashboardView: React.FC<{
  systemStatus: SystemStatus | null;
  activeTasks: AgentTask[];
  agenticCore: AgenticCore | null;
}> = ({ systemStatus, activeTasks, agenticCore }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (agenticCore) {
      // 模拟刷新延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setRefreshing(false);
  };

  return (
    <div className='dashboard-view'>
      <div className='status-overview'>
        <div className='status-card'>
          <h4>系统状态</h4>
          <div className='status-item'>
            <span>当前状态:</span>
            <Badge
              variant={systemStatus?.state === 'idle' ? 'secondary' : 'default'}
            >
              {systemStatus?.state || '未知'}
            </Badge>
          </div>
          <div className='status-item'>
            <span>活跃任务:</span>
            <Badge variant='outline'>{activeTasks.length}</Badge>
          </div>
          <div className='status-item'>
            <span>成功率:</span>
            <span>
              {systemStatus
                ? (systemStatus.successRate * 100).toFixed(1)
                : '--'}
              %
            </span>
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className='refresh-button'
        >
          <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
        </Button>
      </div>

      <div className='active-tasks'>
        <h4>活跃任务</h4>
        {activeTasks.length === 0 ? (
          <div className='empty-state'>
            <Info size={24} />
            <p>暂无活跃任务</p>
          </div>
        ) : (
          <div className='task-list'>
            {activeTasks.map(task => (
              <div key={task.id} className='task-item'>
                <div className='task-header'>
                  <span className='task-title'>{task.goal}</span>
                  <Badge
                    variant={
                      task.status === 'executing' ? 'default' : 'secondary'
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
                <div className='task-progress'>
                  <Progress
                    value={calculateTaskProgress(task)}
                    className='w-full'
                  />
                  <span className='progress-text'>
                    {calculateTaskProgress(task)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 子组件：工具视图
const ToolsView: React.FC<{
  onToolSelected: (tool: string) => void;
}> = ({ onToolSelected }) => {
  const tools = [
    {
      id: 'prediction',
      name: '预测分析',
      icon: <TrendingUp size={16} />,
      description: '数据预测和趋势分析',
    },
    {
      id: 'optimization',
      name: '模型优化',
      icon: <Zap size={16} />,
      description: '模型参数调优',
    },
    {
      id: 'evaluation',
      name: '性能评估',
      icon: <Activity size={16} />,
      description: '模型性能评估',
    },
    {
      id: 'diagnosis',
      name: '故障诊断',
      icon: <AlertTriangle size={16} />,
      description: '系统故障检测',
    },
  ];

  return (
    <div className='tools-view'>
      <div className='tools-grid'>
        {tools.map(tool => (
          <Card
            key={tool.id}
            className='tool-card'
            onClick={() => onToolSelected(tool.name)}
          >
            <CardContent className='tool-content'>
              <div className='tool-icon'>{tool.icon}</div>
              <div className='tool-info'>
                <h5>{tool.name}</h5>
                <p>{tool.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 子组件：洞察视图
const InsightsView: React.FC<{
  systemStatus: SystemStatus | null;
  completedTasks: number;
}> = ({ systemStatus, completedTasks }) => {
  return (
    <div className='insights-view'>
      <div className='insight-card'>
        <h4>性能洞察</h4>
        <div className='insight-metrics'>
          <div className='metric'>
            <span>总任务数:</span>
            <span className='metric-value'>{completedTasks}</span>
          </div>
          <div className='metric'>
            <span>平均执行时间:</span>
            <span className='metric-value'>
              {systemStatus
                ? (systemStatus.averageExecutionTime / 1000).toFixed(1)
                : '--'}
              s
            </span>
          </div>
          <div className='metric'>
            <span>学习进度:</span>
            <span className='metric-value'>
              {systemStatus?.learningProgress.learningRate
                ? (systemStatus.learningProgress.learningRate * 100).toFixed(1)
                : '--'}
              %
            </span>
          </div>
        </div>
      </div>

      <div className='insight-card'>
        <h4>系统建议</h4>
        <div className='suggestions'>
          <div className='suggestion'>
            <CheckCircle size={16} className='suggestion-icon success' />
            <span>模型性能良好，建议继续使用当前配置</span>
          </div>
          <div className='suggestion'>
            <Info size={16} className='suggestion-icon info' />
            <span>可以考虑启用自动优化功能以提升性能</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 子组件：设置视图
const SettingsView: React.FC<{
  theme: string;
  onThemeChange: () => void;
  aiService: AIServiceAdapter | null;
  aiServiceHealth: HealthStatus | null;
  aiServiceMetrics: ServiceMetrics | null;
}> = ({
  theme,
  onThemeChange,
  aiService,
  aiServiceHealth,
  aiServiceMetrics,
}) => {
  return (
    <div className='settings-view'>
      {aiService && (
        <div className='mb-4'>
          <PerformanceMonitor
            aiService={aiService}
            autoRefresh={true}
            refreshInterval={5000}
          />
        </div>
      )}

      <div className='setting-group'>
        <h4>界面设置</h4>
        <div className='setting-item'>
          <Label>主题模式</Label>
          <div className='theme-options'>
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onThemeChange()}
            >
              浅色
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onThemeChange()}
            >
              深色
            </Button>
            <Button
              variant={theme === 'auto' ? 'default' : 'outline'}
              size='sm'
              onClick={() => onThemeChange()}
            >
              自动
            </Button>
          </div>
        </div>
      </div>

      <div className='setting-group'>
        <h4>功能设置</h4>
        <div className='setting-item'>
          <div className='flex items-center justify-between'>
            <Label>自动优化</Label>
            <Switch defaultChecked />
          </div>
        </div>
        <div className='setting-item'>
          <div className='flex items-center justify-between'>
            <Label>学习模式</Label>
            <Switch defaultChecked />
          </div>
        </div>
        <div className='setting-item'>
          <div className='flex items-center justify-between'>
            <Label>隐私保护</Label>
            <Switch />
          </div>
        </div>
      </div>

      <div className='setting-group'>
        <h4>AI服务状态</h4>
        <div className='setting-item'>
          <div className='flex items-center justify-between'>
            <Label>服务类型</Label>
            <Badge variant='outline' className='text-xs'>
              {aiService?.getType() || '无'}
            </Badge>
          </div>
        </div>
        {aiServiceHealth && (
          <div className='setting-item'>
            <div className='flex items-center justify-between'>
              <Label>健康状态</Label>
              <Badge
                variant={
                  aiServiceHealth.status === 'healthy' ? 'default' : 'secondary'
                }
                className='text-xs'
              >
                {aiServiceHealth.status === 'healthy'
                  ? '健康'
                  : aiServiceHealth.status === 'degraded'
                    ? '降级'
                    : '异常'}
              </Badge>
            </div>
          </div>
        )}
        {aiServiceMetrics && (
          <div className='setting-item'>
            <div className='flex items-center justify-between'>
              <Label>总请求数</Label>
              <span className='text-sm font-medium'>
                {aiServiceMetrics.total_requests}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 子组件：调整大小手柄
const ResizeHandles: React.FC<{
  onResizeStart: (direction: string) => void;
  onResize: (direction: string, deltaX: number, deltaY: number) => void;
  onResizeEnd: () => void;
}> = ({ onResizeStart, onResize, onResizeEnd }) => {
  const [resizing, setResizing] = useState<string | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    setResizing(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    onResizeStart(direction);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) return;

      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      onResize(resizing, deltaX, deltaY);
    },
    [resizing, startPos, onResize]
  );

  const handleMouseUp = useCallback(() => {
    if (resizing) {
      setResizing(null);
      onResizeEnd();
    }
  }, [resizing, onResizeEnd]);

  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
    return undefined;
  }, [resizing, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        className='resize-handle resize-se'
        onMouseDown={e => handleMouseDown('se', e)}
      />
      <div
        className='resize-handle resize-sw'
        onMouseDown={e => handleMouseDown('sw', e)}
      />
      <div
        className='resize-handle resize-ne'
        onMouseDown={e => handleMouseDown('ne', e)}
      />
      <div
        className='resize-handle resize-nw'
        onMouseDown={e => handleMouseDown('nw', e)}
      />
      <div
        className='resize-handle resize-e'
        onMouseDown={e => handleMouseDown('e', e)}
      />
      <div
        className='resize-handle resize-w'
        onMouseDown={e => handleMouseDown('w', e)}
      />
      <div
        className='resize-handle resize-s'
        onMouseDown={e => handleMouseDown('s', e)}
      />
      <div
        className='resize-handle resize-n'
        onMouseDown={e => handleMouseDown('n', e)}
      />
    </>
  );
};

// 辅助函数
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function getInitialPosition(
  position: string,
  width: number,
  height: number
): WidgetPosition {
  const margin = 20;
  const viewportWidth =
    typeof window !== 'undefined' ? window.innerWidth : 1920;
  const viewportHeight =
    typeof window !== 'undefined' ? window.innerHeight : 1080;

  switch (position) {
    case 'top-left':
      return { x: margin, y: margin, width, height, zIndex: 1000 };
    case 'top-right':
      return {
        x: viewportWidth - width - margin,
        y: margin,
        width,
        height,
        zIndex: 1000,
      };
    case 'bottom-left':
      return {
        x: margin,
        y: viewportHeight - height - margin,
        width,
        height,
        zIndex: 1000,
      };
    case 'bottom-right':
      return {
        x: viewportWidth - width - margin,
        y: viewportHeight - height - margin,
        width,
        height,
        zIndex: 1000,
      };
    case 'center':
      return {
        x: (viewportWidth - width) / 2,
        y: (viewportHeight - height) / 2,
        width,
        height,
        zIndex: 1000,
      };
    default:
      return {
        x: viewportWidth - width - margin,
        y: viewportHeight - height - margin,
        width,
        height,
        zIndex: 1000,
      };
  }
}

function optimizePosition(
  position: WidgetPosition,
  viewportWidth: number,
  viewportHeight: number
): WidgetPosition {
  const margin = 20;
  const maxX = viewportWidth - position.width - margin;
  const maxY = viewportHeight - position.height - margin;

  return {
    ...position,
    x: Math.max(margin, Math.min(position.x, maxX)),
    y: Math.max(margin, Math.min(position.y, maxY)),
  };
}

function calculateNewSize(
  position: WidgetPosition,
  direction: string,
  deltaX: number,
  deltaY: number
): Partial<WidgetPosition> {
  const minWidth = 320;
  const minHeight = 400;
  const maxWidth = 600;
  const maxHeight = 800;

  let newWidth = position.width;
  let newHeight = position.height;

  switch (direction) {
    case 'e':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, position.width + deltaX)
      );
      break;
    case 'w':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, position.width - deltaX)
      );
      break;
    case 's':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, position.height + deltaY)
      );
      break;
    case 'n':
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, position.height - deltaY)
      );
      break;
    case 'se':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, position.width + deltaX)
      );
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, position.height + deltaY)
      );
      break;
    case 'sw':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, position.width - deltaX)
      );
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, position.height + deltaY)
      );
      break;
    case 'ne':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, position.width + deltaX)
      );
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, position.height - deltaY)
      );
      break;
    case 'nw':
      newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, position.width - deltaX)
      );
      newHeight = Math.max(
        minHeight,
        Math.min(maxHeight, position.height - deltaY)
      );
      break;
  }

  return { width: newWidth, height: newHeight };
}

function calculateTaskProgress(task: AgentTask): number {
  const completed = task.subtasks.filter(s => s.status === 'completed').length;
  return task.subtasks.length > 0
    ? (completed / task.subtasks.length) * 100
    : 0;
}

export default IntelligentAIWidget;

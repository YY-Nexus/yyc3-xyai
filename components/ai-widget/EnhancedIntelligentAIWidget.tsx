/**
 * @file EnhancedIntelligentAIWidget.tsx
 * @description YYC³ AI浮窗系统增强版 - 集成移动性、自适应、连续性引擎
 * @module components/ai-widget
 * @author YYC³
 * @version 2.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
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
  Move,
  Smartphone,
  Monitor,
  Globe,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Clock,
  Shield,
  Zap as ZapIcon,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
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

import ModelSelector from './ModelSelector';
import PerformanceMonitor from './PerformanceMonitor';
import { VoiceInteraction } from '../voice/VoiceInteraction';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useResponsive, type Breakpoint } from '@/hooks/useResponsive';
import { FadeIn, SlideIn, ScaleIn, BounceIn } from '../animations/Animations';
import { useAIMobility } from '@/hooks/useAIMobility';

import { AI_ROLES, selectRoleByContext, type AIRole } from '@/lib/ai_roles';
import { characterManager } from '@/lib/character-manager';
import { selectCurrentUser } from '@/lib/store';

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
  currentView: 'chat' | 'dashboard' | 'tools' | 'insights' | 'settings' | 'mobility';
  mode: 'floating' | 'docked' | 'modal';
  position: WidgetPosition;
  sessionId: string;
  unreadCount: number;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  isDragging: boolean;
  isResizing: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'failed';
  metadata?: Record<string, unknown>;
}

interface DragItem {
  type: string;
  id: string;
}

const getInitialPosition = (
  initialPosition: string,
  width: number,
  height: number
): WidgetPosition => {
  if (typeof window === 'undefined') {
    return { x: 0, y: 0, width, height, zIndex: 1000 };
  }

  const margin = 20;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  switch (initialPosition) {
    case 'top-left':
      return { x: margin, y: margin, width, height, zIndex: 1000 };
    case 'top-right':
      return { x: screenWidth - width - margin, y: margin, width, height, zIndex: 1000 };
    case 'bottom-left':
      return { x: margin, y: screenHeight - height - margin, width, height, zIndex: 1000 };
    case 'bottom-right':
    default:
      return { x: screenWidth - width - margin, y: screenHeight - height - margin, width, height, zIndex: 1000 };
  }
};

const optimizePosition = (
  position: WidgetPosition,
  screenWidth: number,
  screenHeight: number
): WidgetPosition => {
  const margin = 20;
  let { x, y, width, height, zIndex } = position;

  x = Math.max(margin, Math.min(x, screenWidth - width - margin));
  y = Math.max(margin, Math.min(y, screenHeight - height - margin));

  return { x, y, width, height, zIndex };
};

const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

interface EnhancedWidgetProps {
  apiEndpoint?: string;
  userId?: string;
  workspaceId?: string;
  initialPosition?: string;
  initialRole?: AIRole;
  onRoleChange?: (role: AIRole) => void;
  theme?: 'light' | 'dark' | 'auto';
  permissions?: string[];
  onStateChange?: (state: WidgetState) => void;
  onError?: (error: Error) => void;
  width?: number;
  height?: number;
  className?: string;
  aiServiceType?: 'ollama' | 'local-gateway';
  aiServiceBaseUrl?: string;
  enableMobility?: boolean;
  enableAdaptability?: boolean;
  enableContinuity?: boolean;
}

export const EnhancedIntelligentAIWidget: React.FC<EnhancedWidgetProps> = ({
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
  enableMobility = true,
  enableAdaptability = true,
  enableContinuity = true,
}) => {
  const currentUser = useSelector(selectCurrentUser);
  const userGender = currentUser?.gender || 'female';

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

  const [currentModel, setCurrentModel] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [aiServiceHealth, setAiServiceHealth] = useState<HealthStatus | null>(
    null
  );
  const [aiServiceMetrics, setAiServiceMetrics] =
    useState<ServiceMetrics | null>(null);

  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const { themeColors } = useThemeColor(currentRole);
  const responsive = useResponsive();
  const { state: mobilityState, actions: mobilityActions, isInitialized: mobilityInitialized } = useAIMobility();

  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const aiServiceManagerRef = useRef<AIServiceManager | null>(null);

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

  const setWidgetRef = useCallback(
    (node: HTMLDivElement | null) => {
      widgetRef.current = node;
      if (node) {
        drag(drop(node));
      }
    },
    [drag, drop]
  );

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

  const handleDock = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'docked',
      position: { ...prev.position, x: 0, y: 0 },
    }));
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: Message = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: '感谢您的提问！我会尽快为您提供相关信息。',
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, onError]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMinimize = useCallback(() => {
    setState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setState(prev => ({
      ...prev,
      isFullscreen: !prev.isFullscreen,
    }));
  }, []);

  const handleClose = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  const handleViewChange = useCallback((view: WidgetState['currentView']) => {
    setState(prev => ({
      ...prev,
      currentView: view,
    }));
  }, []);

  const handleRoleChange = useCallback((role: AIRole) => {
    setCurrentRole(role);
    onRoleChange?.(role);
  }, [onRoleChange]);

  const handleVoiceToggle = useCallback(() => {
    setVoiceEnabled(prev => !prev);
  }, []);

  const handleMobilityAction = useCallback(async (action: 'move' | 'adapt' | 'maintain') => {
    try {
      switch (action) {
        case 'move':
          await mobilityActions.mobility.moveTo({
            type: 'virtual',
            path: '/new-location',
          });
          break;
        case 'adapt':
          await mobilityActions.adaptability.adapt();
          break;
        case 'maintain':
          await mobilityActions.continuity.maintain();
          break;
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [mobilityActions, onError]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup resources when component unmounts
  useEffect(() => {
    return () => {
      // Clean up AI service manager
      if (aiServiceManagerRef.current) {
        // Implement dispose method if available
        if (typeof aiServiceManagerRef.current.cleanup === 'function') {
          aiServiceManagerRef.current.cleanup();
        }
      }
    };
  }, [mobilityInitialized, mobilityActions]);

  if (!state.isVisible) return null;

  const widgetStyle = state.isFullscreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }
    : state.mode === 'docked'
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        zIndex: 1000,
      }
    : {
        position: 'fixed' as const,
        left: `${state.position.x}px`,
        top: `${state.position.y}px`,
        width: state.isMinimized ? '240px' : `${state.position.width}px`,
        height: state.isMinimized ? '48px' : `${state.position.height}px`,
        zIndex: state.position.zIndex,
      };

  return (
    <div
      ref={setWidgetRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${className}`}
      style={widgetStyle}
    >
      <FadeIn>
        <Card className="h-full rounded-none border-0">
          <CardContent className="p-0 h-full flex flex-col">
            {state.isMinimized ? (
              <MinimizedHeader
                onToggleMinimize={toggleMinimize}
                onClose={handleClose}
                themeColors={themeColors}
                unreadCount={state.unreadCount}
                mobilityState={mobilityState}
              />
            ) : (
              <>
                <WidgetHeader
                  currentRole={currentRole}
                  onRoleChange={handleRoleChange}
                  onToggleMinimize={toggleMinimize}
                  onToggleFullscreen={toggleFullscreen}
                  onClose={handleClose}
                  onViewChange={handleViewChange}
                  currentView={state.currentView}
                  themeColors={themeColors}
                  isDragging={isDragging}
                  enableMobility={enableMobility}
                  enableAdaptability={enableAdaptability}
                  enableContinuity={enableContinuity}
                  mobilityState={mobilityState}
                  onMobilityAction={handleMobilityAction}
                  userGender={userGender}
                />

                <Separator />

                <div className="flex-1 overflow-hidden">
                  {state.currentView === 'chat' && (
                    <ChatView
                      messages={messages}
                      inputValue={inputValue}
                      onInputChange={setInputValue}
                      onSendMessage={handleSendMessage}
                      onKeyPress={handleKeyPress}
                      isProcessing={isProcessing}
                      voiceEnabled={voiceEnabled}
                      onVoiceToggle={handleVoiceToggle}
                      themeColors={themeColors}
                      messagesEndRef={messagesEndRef}
                    />
                  )}

                  {state.currentView === 'dashboard' && (
                    <DashboardView
                      aiServiceHealth={aiServiceHealth}
                      aiServiceMetrics={aiServiceMetrics}
                      themeColors={themeColors}
                    />
                  )}

                  {state.currentView === 'mobility' && (
                    <MobilityView
                      mobilityState={mobilityState}
                      mobilityInitialized={mobilityInitialized}
                      onMobilityAction={handleMobilityAction}
                      themeColors={themeColors}
                    />
                  )}

                  {state.currentView === 'settings' && (
                    <SettingsView
                      currentRole={currentRole}
                      onRoleChange={handleRoleChange}
                      themeColors={themeColors}
                    />
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
};

const MinimizedHeader: React.FC<{
  onToggleMinimize: () => void;
  onClose: () => void;
  themeColors: any;
  unreadCount: number;
  mobilityState: any;
}> = ({ onToggleMinimize, onClose, themeColors, unreadCount, mobilityState }) => {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 cursor-pointer"
      style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
      onClick={onToggleMinimize}
    >
      <div className="flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-white font-medium text-sm">AI助手</span>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-xs">
            {unreadCount}
          </Badge>
        )}
      </div>

      <div className="flex items-center space-x-1">
        {mobilityState.mobility.isMoving && (
          <Activity className="w-4 h-4 text-white animate-pulse" />
        )}
        <X className="w-4 h-4 text-white hover:text-gray-200" onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} />
      </div>
    </div>
  );
};

const WidgetHeader: React.FC<{
  currentRole: AIRole;
  onRoleChange: (role: AIRole) => void;
  onToggleMinimize: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
  onViewChange: (view: WidgetState['currentView']) => void;
  currentView: WidgetState['currentView'];
  themeColors: any;
  isDragging: boolean;
  enableMobility: boolean;
  enableAdaptability: boolean;
  enableContinuity: boolean;
  mobilityState: any;
  onMobilityAction: (action: 'move' | 'adapt' | 'maintain') => void;
  userGender: 'male' | 'female';
}> = ({
  currentRole,
  onToggleMinimize,
  onToggleFullscreen,
  onClose,
  onViewChange,
  currentView,
  themeColors,
  isDragging,
  enableMobility,
  enableAdaptability,
  enableContinuity,
  mobilityState,
  onMobilityAction,
  userGender,
}) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
    >
      <div className="flex items-center space-x-3">
        <img
          src={characterManager.getAIAvatarPath(userGender)}
          alt="AI助手"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div>
          <h3 className="text-white font-semibold">AI助手</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs bg-white/20 text-white hover:bg-white/30">
              {currentRole}
            </Badge>
            {isDragging && (
              <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                拖拽中
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {enableMobility && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => onViewChange('mobility')}
            title="移动性"
          >
            <Move className="w-4 h-4" />
          </Button>
        )}

        {enableAdaptability && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => onMobilityAction('adapt')}
            title="自适应"
          >
            <Zap className="w-4 h-4" />
          </Button>
        )}

        {enableContinuity && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={() => onMobilityAction('maintain')}
            title="连续性"
          >
            <Shield className="w-4 h-4" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={onToggleMinimize}
          title="最小化"
        >
          <Minimize2 className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={onToggleFullscreen}
          title="全屏"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={onClose}
          title="关闭"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const ChatView: React.FC<{
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isProcessing: boolean;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  themeColors: any;
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
}> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isProcessing,
  voiceEnabled,
  onVoiceToggle,
  themeColors,
  messagesEndRef,
}) => {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef as React.RefObject<HTMLDivElement>} />
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <Textarea
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="输入消息..."
            className="flex-1 min-h-[80px] max-h-[200px] resize-none"
          />
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onVoiceToggle}
              className={voiceEnabled ? 'bg-blue-100 dark:bg-blue-900' : ''}
            >
              {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              style={{ backgroundColor: themeColors.primary }}
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardView: React.FC<{
  aiServiceHealth: HealthStatus | null;
  aiServiceMetrics: ServiceMetrics | null;
  themeColors: any;
}> = ({ aiServiceHealth, aiServiceMetrics, themeColors }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">仪表板</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">系统状态</span>
            </div>
            <p className="text-2xl font-bold">正常</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">性能指标</span>
            </div>
            <p className="text-2xl font-bold">良好</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MobilityView: React.FC<{
  mobilityState: any;
  mobilityInitialized: boolean;
  onMobilityAction: (action: 'move' | 'adapt' | 'maintain') => void;
  themeColors: any;
}> = ({ mobilityState, mobilityInitialized, onMobilityAction, themeColors }) => {
  if (!mobilityInitialized) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">正在初始化移动性引擎...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">移动性控制</h3>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Move className="w-5 h-5 text-blue-500" />
                <span className="font-medium">移动状态</span>
              </div>
              {mobilityState.mobility.isMoving ? (
                <Badge variant="outline" className="animate-pulse">
                  移动中
                </Badge>
              ) : (
                <Badge variant="secondary">空闲</Badge>
              )}
            </div>

            {mobilityState.mobility.isMoving && (
              <Progress value={mobilityState.mobility.state.moveProgress} className="mb-2" />
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">总移动次数:</span>
                <span className="ml-2 font-medium">{mobilityState.mobility.metrics.totalMoves}</span>
              </div>
              <div>
                <span className="text-gray-500">成功率:</span>
                <span className="ml-2 font-medium">
                  {mobilityState.mobility.metrics.totalMoves > 0
                    ? ((mobilityState.mobility.metrics.successfulMoves / mobilityState.mobility.metrics.totalMoves) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">平均耗时:</span>
                <span className="ml-2 font-medium">{mobilityState.mobility.metrics.averageMoveTime.toFixed(0)}ms</span>
              </div>
              <div>
                <span className="text-gray-500">失败次数:</span>
                <span className="ml-2 font-medium">{mobilityState.mobility.metrics.failedMoves}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">自适应状态</span>
              </div>
              {mobilityState.adaptability.isAdapting ? (
                <Badge variant="outline" className="animate-pulse">
                  适应中
                </Badge>
              ) : (
                <Badge variant="secondary">空闲</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">总适应次数:</span>
                <span className="ml-2 font-medium">{mobilityState.adaptability.context?.adaptationMetrics.totalAdaptations || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">成功率:</span>
                <span className="ml-2 font-medium">
                  {mobilityState.adaptability.context?.adaptationMetrics.totalAdaptations > 0
                    ? ((mobilityState.adaptability.context.adaptationMetrics.successfulAdaptations / mobilityState.adaptability.context.adaptationMetrics.totalAdaptations) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">平均响应:</span>
                <span className="ml-2 font-medium">{mobilityState.adaptability.context?.adaptationMetrics.averageResponseTime.toFixed(0) || 0}ms</span>
              </div>
              <div>
                <span className="text-gray-500">用户满意度:</span>
                <span className="ml-2 font-medium">{(mobilityState.adaptability.context?.adaptationMetrics.averageUserSatisfaction * 100 || 0).toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="font-medium">连续性状态</span>
              </div>
              {mobilityState.continuity.isMaintaining ? (
                <Badge variant="outline" className="animate-pulse">
                  维护中
                </Badge>
              ) : (
                <Badge variant="secondary">空闲</Badge>
              )}
            </div>

            {mobilityState.continuity.isMaintaining && (
              <Progress value={mobilityState.continuity.state.maintenanceProgress} className="mb-2" />
            )}

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">总维护次数:</span>
                <span className="ml-2 font-medium">{mobilityState.continuity.state.totalMaintenanceCount}</span>
              </div>
              <div>
                <span className="text-gray-500">成功率:</span>
                <span className="ml-2 font-medium">
                  {mobilityState.continuity.state.totalMaintenanceCount > 0
                    ? ((mobilityState.continuity.state.successfulMaintenanceCount / mobilityState.continuity.state.totalMaintenanceCount) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div>
                <span className="text-gray-500">连续性成功率:</span>
                <span className="ml-2 font-medium">{(mobilityState.continuity.metrics.continuitySuccessRate * 100 || 0).toFixed(0)}%</span>
              </div>
              <div>
                <span className="text-gray-500">用户满意度:</span>
                <span className="ml-2 font-medium">{(mobilityState.continuity.metrics.userSatisfactionScore * 100 || 0).toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button
            onClick={() => onMobilityAction('move')}
            disabled={mobilityState.mobility.isMoving}
            className="flex-1"
            style={{ backgroundColor: themeColors.primary }}
          >
            <Move className="w-4 h-4 mr-2" />
            移动
          </Button>
          <Button
            onClick={() => onMobilityAction('adapt')}
            disabled={mobilityState.adaptability.isAdapting}
            variant="outline"
            className="flex-1"
          >
            <Zap className="w-4 h-4 mr-2" />
            自适应
          </Button>
          <Button
            onClick={() => onMobilityAction('maintain')}
            disabled={mobilityState.continuity.isMaintaining}
            variant="outline"
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" />
            连续性
          </Button>
        </div>
      </div>
    </div>
  );
};

const SettingsView: React.FC<{
  currentRole: AIRole;
  onRoleChange: (role: AIRole) => void;
  themeColors: any;
}> = ({ currentRole, onRoleChange, themeColors }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">设置</h3>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <Label className="text-sm font-medium">AI角色</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(AI_ROLES).map(([key, role]) => (
                <Button
                  key={key}
                  variant={currentRole === key ? 'default' : 'outline'}
                  onClick={() => onRoleChange(key as AIRole)}
                  className="text-sm"
                  style={currentRole === key ? { backgroundColor: themeColors.primary } : {}}
                >
                  {role.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedIntelligentAIWidget;

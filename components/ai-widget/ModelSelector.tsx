/**
 * @file ModelSelector.tsx
 * @description YYC³ AI小语智能成长守护系统 - AI模型选择器组件，用于切换和管理AI模型
 * @module components/ai-widget
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-19
 * @updated 2026-01-19
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RefreshCw, Download, Check, AlertCircle, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ModelInfo, AIServiceAdapter } from '@/services/ai/AIServiceAdapter';

interface ModelSelectorProps {
  currentModel: string;
  availableModels: ModelInfo[];
  onModelChange: (modelName: string) => void;
  aiService: AIServiceAdapter;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  availableModels,
  onModelChange,
  aiService,
  isLoading = false,
  disabled = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [modelDetails, setModelDetails] = useState<ModelInfo | null>(null);

  useEffect(() => {
    if (currentModel && availableModels.length > 0) {
      const details = availableModels.find(m => m.name === currentModel);
      setModelDetails(details || null);
    }
  }, [currentModel, availableModels]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const models = await aiService.listModels();
      onModelChange?.(currentModel);
    } catch (error) {
      console.error('刷新模型列表失败:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleModelChange = async (modelName: string) => {
    if (modelName === currentModel || disabled) return;

    setIsSwitching(true);
    try {
      await aiService.switchModel(modelName);
      onModelChange(modelName);
    } catch (error) {
      console.error('切换模型失败:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  const formatModelSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const getModelFamilyColor = (family: string): string => {
    const colors: Record<string, string> = {
      llama: 'bg-blue-100 text-blue-700',
      mistral: 'bg-purple-100 text-purple-700',
      qwen: 'bg-green-100 text-green-700',
      gemma: 'bg-orange-100 text-orange-700',
      phi: 'bg-pink-100 text-pink-700',
    };
    return colors[family.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="model-selector">
      <div className="flex items-center gap-2 mb-2">
        <Label className="text-xs text-gray-500 font-medium">AI模型:</Label>
        <Select
          value={currentModel}
          onValueChange={handleModelChange}
          disabled={isLoading || isRefreshing || isSwitching || disabled}
        >
          <SelectTrigger className="w-[200px] h-8 text-xs">
            <SelectValue placeholder="选择模型" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.length === 0 ? (
              <div className="p-2 text-center text-xs text-gray-500">
                暂无可用模型
              </div>
            ) : (
              availableModels.map(model => (
                <SelectItem key={model.name} value={model.name} className="text-xs">
                  <div className="flex items-center gap-2 w-full">
                    <span className="flex-1 truncate">{model.name}</span>
                    {model.name === currentModel && (
                      <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing || disabled}
                className="h-8 w-8 p-0"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">刷新模型列表</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {isSwitching && (
          <Badge variant="secondary" className="text-xs h-6">
            切换中...
          </Badge>
        )}
      </div>

      {modelDetails && (
        <div className="model-details mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className={`text-xs ${getModelFamilyColor(modelDetails.details.family)}`}
                >
                  {modelDetails.details.family}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {modelDetails.details.parameter_size}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {modelDetails.details.quantization_level}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="font-medium">大小:</span>
                  <span className="truncate">{formatModelSize(modelDetails.size)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">格式:</span>
                  <span className="truncate">{modelDetails.details.format}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {availableModels.length === 0 && !isLoading && (
        <div className="no-models mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-yellow-800 font-medium mb-1">
                未检测到可用模型
              </p>
              <p className="text-xs text-yellow-700">
                请先下载AI模型，或检查Ollama服务是否正常运行。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 h-7 text-xs"
                onClick={() => {
                  window.open(
                    'https://ollama.com/library',
                    '_blank'
                  );
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                浏览模型库
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;

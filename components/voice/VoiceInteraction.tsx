'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { VoiceRecognition } from './VoiceRecognition';
import { VoiceSynthesis } from './VoiceSynthesis';
import { VoiceInteractionManager, type VoiceInteractionOptions, type VoiceInteractionState } from './VoiceInteractionManager';

interface VoiceInteractionProps {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onResponse?: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  autoPlayResponse?: boolean;
  continuousListening?: boolean;
  showSettings?: boolean;
  compact?: boolean;
}

export const VoiceInteraction: React.FC<VoiceInteractionProps> = ({
  onTranscript,
  onResponse,
  onError,
  language = 'zh-CN',
  autoPlayResponse = true,
  continuousListening = true,
  showSettings = true,
  compact = false,
}) => {
  const [state, setState] = useState<VoiceInteractionState>({
    isListening: false,
    isSpeaking: false,
    lastTranscript: '',
    lastResponse: '',
  });

  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showResponse, setShowResponse] = useState(true);

  const managerRef = useRef<VoiceInteractionManager | null>(null);

  useEffect(() => {
    const options: VoiceInteractionOptions = {
      language,
      autoPlayResponse,
      continuousListening,
      onTranscript: (text, isFinal) => {
        setState(prev => ({ ...prev, lastTranscript: text, isListening: !isFinal }));
        onTranscript?.(text, isFinal);
      },
      onResponse: (text) => {
        setState(prev => ({ ...prev, lastResponse: text }));
        onResponse?.(text);
      },
      onError: (error) => {
        onError?.(error);
      },
    };

    const manager = new VoiceInteractionManager(options);
    managerRef.current = manager;

    return () => {
      manager.stop();
    };
  }, [language, autoPlayResponse, continuousListening, onTranscript, onResponse, onError]);

  const handleTranscript = (text: string, isFinal: boolean) => {
    managerRef.current?.handleTranscript(text, isFinal);
  };

  const handleResponse = (text: string) => {
    onResponse?.(text);
  };

  const handleError = (error: string) => {
    managerRef.current?.handleError(error);
  };

  const toggleSettings = () => {
    setShowSettingsPanel(!showSettingsPanel);
  };

  const toggleTranscript = () => {
    setShowTranscript(!showTranscript);
  };

  const toggleResponse = () => {
    setShowResponse(!showResponse);
  };

  const stopAll = () => {
    managerRef.current?.stop();
    setState(prev => ({
      ...prev,
      isListening: false,
      isSpeaking: false,
    }));
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            state.isListening 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            {state.isListening ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-gray-600" />
            )}
          </div>
          {state.isListening && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>

        <div className="relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            state.isSpeaking 
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            {state.isSpeaking ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-600" />
            )}
          </div>
        </div>

        {showSettings && (
          <button
            onClick={toggleSettings}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">语音交互</h3>
        </div>

        {showSettings && (
          <button
            onClick={toggleSettings}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            设置
            {showSettingsPanel ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">语音输入</span>
            {state.isListening && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
          <VoiceRecognition
            onResult={handleTranscript}
            onError={handleError}
            language={language}
            continuous={continuousListening}
            showVisualizer={true}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">语音输出</span>
            {state.isSpeaking && (
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            )}
          </div>
          <VoiceSynthesis
            text={state.lastResponse}
            onPlay={() => setState(prev => ({ ...prev, isSpeaking: true }))}
            onPause={() => setState(prev => ({ ...prev, isSpeaking: false }))}
            onEnd={() => setState(prev => ({ ...prev, isSpeaking: false }))}
            onError={handleError}
            autoPlay={autoPlayResponse}
            language={language}
            showControls={true}
          />
        </div>
      </div>

      {showSettingsPanel && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">显示设置</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTranscript}
                  onChange={toggleTranscript}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">显示语音输入</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showResponse}
                  onChange={toggleResponse}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">显示语音输出</span>
              </label>
            </div>

            <button
              onClick={stopAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              停止所有语音交互
            </button>
          </div>
        </div>
      )}

      {(showTranscript && state.lastTranscript) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Mic className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">语音输入</span>
          </div>
          <div className="text-sm text-gray-800">
            {state.lastTranscript}
          </div>
        </div>
      )}

      {(showResponse && state.lastResponse) && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">语音输出</span>
          </div>
          <div className="text-sm text-gray-800">
            {state.lastResponse}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInteraction;

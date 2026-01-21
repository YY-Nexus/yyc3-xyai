'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface VoiceSynthesisProps {
  text: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  autoPlay?: boolean;
  language?: string;
  showControls?: boolean;
}

interface VoiceOption {
  name: string;
  lang: string;
  localService: boolean;
  voiceURI: string;
}

interface SynthesisState {
  isPlaying: boolean;
  isPaused: boolean;
  isSupported: boolean;
  voices: VoiceOption[];
  selectedVoice: VoiceOption | null;
  rate: number;
  pitch: number;
  volume: number;
  currentTime: number;
  duration: number;
}

export const VoiceSynthesis: React.FC<VoiceSynthesisProps> = ({
  text,
  onPlay,
  onPause,
  onEnd,
  onError,
  autoPlay = false,
  language = 'zh-CN',
  showControls = true,
}) => {
  const [state, setState] = useState<SynthesisState>({
    isPlaying: false,
    isPaused: false,
    isSupported: false,
    voices: [],
    selectedVoice: null,
    rate: 1,
    pitch: 1,
    volume: 1,
    currentTime: 0,
    duration: 0,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setState(prev => ({ ...prev, isSupported: true }));

      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const filteredVoices = voices.filter(voice => 
          voice.lang.startsWith(language) || voice.lang.startsWith('en')
        );

        setState(prev => ({
          ...prev,
          voices: filteredVoices.map(voice => ({
            name: voice.name,
            lang: voice.lang,
            localService: voice.localService,
            voiceURI: voice.voiceURI,
          })),
          selectedVoice: filteredVoices.length > 0 ? {
            name: filteredVoices[0].name,
            lang: filteredVoices[0].lang,
            localService: filteredVoices[0].localService,
            voiceURI: filteredVoices[0].voiceURI,
          } : null,
        }));
      };

      loadVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      onError?.('您的浏览器不支持语音合成功能');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, [language, onError]);

  useEffect(() => {
    if (autoPlay && text && state.isSupported && !state.isPlaying) {
      speak();
    }
  }, [text, autoPlay, state.isSupported, state.isPlaying]);

  const speak = useCallback(() => {
    if (!text || !state.isSupported) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = state.rate;
    utterance.pitch = state.pitch;
    utterance.volume = state.volume;

    if (state.selectedVoice) {
      const voice = window.speechSynthesis.getVoices().find(
        v => v.voiceURI === state.selectedVoice?.voiceURI
      );
      if (voice) {
        utterance.voice = voice;
      }
    }

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
      onPlay?.();
      
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          const newTime = prev.currentTime + 0.1;
          return { ...prev, currentTime: newTime };
        });
      }, 100);
    };

    utterance.onpause = () => {
      setState(prev => ({ ...prev, isPaused: true }));
      onPause?.();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    utterance.onresume = () => {
      setState(prev => ({ ...prev, isPaused: false }));
      onPlay?.();
      
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          const newTime = prev.currentTime + 0.1;
          return { ...prev, currentTime: newTime };
        });
      }, 100);
    };

    utterance.onend = () => {
      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false,
        currentTime: 0,
      }));
      onEnd?.();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      console.error('语音合成错误:', event.error);
      
      let errorMessage = '语音合成发生错误';
      switch (event.error) {
        case 'canceled':
          errorMessage = '语音合成已取消';
          break;
        case 'interrupted':
          errorMessage = '语音合成被中断';
          break;
        case 'not-allowed':
          errorMessage = '语音合成权限被拒绝';
          break;
        case 'synthesis-unavailable':
          errorMessage = '语音合成不可用';
          break;
      }

      setState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        isPaused: false,
        currentTime: 0,
      }));
      onError?.(errorMessage);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, language, state.rate, state.pitch, state.volume, state.selectedVoice, state.isSupported, onPlay, onPause, onEnd, onError]);

  const pause = useCallback(() => {
    if (state.isPlaying && !state.isPaused) {
      window.speechSynthesis.pause();
    }
  }, [state.isPlaying, state.isPaused]);

  const resume = useCallback(() => {
    if (state.isPlaying && state.isPaused) {
      window.speechSynthesis.resume();
    }
  }, [state.isPlaying, state.isPaused]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false,
      currentTime: 0,
    }));
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!state.isPlaying) {
      speak();
    } else if (state.isPaused) {
      resume();
    } else {
      pause();
    }
  }, [state.isPlaying, state.isPaused, speak, resume, pause]);

  const handleRateChange = (value: number) => {
    setState(prev => ({ ...prev, rate: value }));
  };

  const handlePitchChange = (value: number) => {
    setState(prev => ({ ...prev, pitch: value }));
  };

  const handleVolumeChange = (value: number) => {
    setState(prev => ({ ...prev, volume: value }));
  };

  const handleVoiceChange = (voiceURI: string) => {
    const voice = state.voices.find(v => v.voiceURI === voiceURI);
    if (voice) {
      setState(prev => ({ ...prev, selectedVoice: voice }));
    }
  };

  if (!state.isSupported) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
        <VolumeX className="w-5 h-5 text-red-500" />
        <span className="text-sm text-red-700">您的浏览器不支持语音合成功能</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {showControls && (
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            title={state.isPlaying && !state.isPaused ? '暂停' : '播放'}
          >
            {state.isPlaying && !state.isPaused ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>

          <button
            onClick={stop}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            title="停止"
          >
            <SkipForward className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={state.volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-8">语速</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={state.rate}
                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500 w-8">音调</span>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={state.pitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {state.voices.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">选择语音</label>
          <select
            value={state.selectedVoice?.voiceURI || ''}
            onChange={(e) => handleVoiceChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {state.voices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </div>
      )}

      {text && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-sm text-gray-800">
            {text}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {state.isPlaying && !state.isPaused && '正在播放...'}
            {state.isPaused && '已暂停'}
            {!state.isPlaying && '准备播放'}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSynthesis;

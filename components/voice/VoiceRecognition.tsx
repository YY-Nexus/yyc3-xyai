'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';

interface VoiceRecognitionProps {
  onResult: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
  autoStart?: boolean;
  showVisualizer?: boolean;
}

interface RecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
}

export const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  onResult,
  onError,
  language = 'zh-CN',
  continuous = true,
  autoStart = false,
  showVisualizer = true,
}) => {
  const [state, setState] = useState<RecognitionState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
  });

  const [isInitializing, setIsInitializing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setState(prev => ({ ...prev, isSupported: false }));
      onError?.('您的浏览器不支持语音识别功能，请使用Chrome、Edge或Safari浏览器');
      return;
    }

    setState(prev => ({ ...prev, isSupported: true }));

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (confidence > maxConfidence) {
          maxConfidence = confidence;
        }

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          onResult(transcript, true);
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        transcript: finalTranscript,
        interimTranscript,
        confidence: maxConfidence,
      }));

      if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('语音识别错误:', event.error);
      
      let errorMessage = '语音识别发生错误';
      switch (event.error) {
        case 'no-speech':
          errorMessage = '未检测到语音输入';
          break;
        case 'audio-capture':
          errorMessage = '无法访问麦克风';
          break;
        case 'not-allowed':
          errorMessage = '麦克风权限被拒绝';
          break;
        case 'network':
          errorMessage = '网络连接错误';
          break;
        case 'aborted':
          errorMessage = '语音识别已中止';
          break;
      }

      setState(prev => ({ ...prev, isListening: false }));
      onError?.(errorMessage);
    };

    recognitionRef.current = recognition;

    if (autoStart) {
      startListening();
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [language, continuous, autoStart, onResult, onError]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current || state.isListening) return;

    try {
      setIsInitializing(true);
      
      if (showVisualizer) {
        await setupAudioVisualizer();
      }

      recognitionRef.current.start();
      setIsInitializing(false);
    } catch (error) {
      console.error('启动语音识别失败:', error);
      setIsInitializing(false);
      onError?.('启动语音识别失败，请检查麦克风权限');
    }
  }, [state.isListening, showVisualizer, onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !state.isListening) return;

    recognitionRef.current.stop();
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.suspend();
    }
  }, [state.isListening]);

  const setupAudioVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      drawVisualizer();
    } catch (error) {
      console.error('设置音频可视化失败:', error);
    }
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i] ?? 0;
        barHeight = value / 2;

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#667EEA');
        gradient.addColorStop(1, '#764BA2');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const toggleListening = () => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!state.isSupported) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="text-sm text-red-700">您的浏览器不支持语音识别功能</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleListening}
          disabled={isInitializing}
          className={`
            relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
            ${state.isListening 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30' 
              : 'bg-gray-100 hover:bg-gray-200'
            }
            ${isInitializing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={state.isListening ? '停止语音识别' : '开始语音识别'}
        >
          {isInitializing ? (
            <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
          ) : state.isListening ? (
            <Mic className="w-6 h-6 text-white" />
          ) : (
            <MicOff className="w-6 h-6 text-gray-600" />
          )}
          
          {state.isListening && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>

        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">
            {state.isListening ? '正在聆听...' : '点击开始语音输入'}
          </div>
          {state.confidence > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              识别置信度: {Math.round(state.confidence * 100)}%
            </div>
          )}
        </div>
      </div>

      {showVisualizer && state.isListening && (
        <div className="relative h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
          <canvas
            ref={canvasRef}
            width={400}
            height={64}
            className="w-full h-full"
          />
        </div>
      )}

      {(state.transcript || state.interimTranscript) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          {state.transcript && (
            <div className="text-sm text-gray-800 mb-1">
              {state.transcript}
            </div>
          )}
          {state.interimTranscript && (
            <div className="text-sm text-gray-500 italic">
              {state.interimTranscript}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceRecognition;

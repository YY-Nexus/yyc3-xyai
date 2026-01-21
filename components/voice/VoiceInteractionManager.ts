'use client';

import { VoiceRecognition } from './VoiceRecognition';
import { VoiceSynthesis } from './VoiceSynthesis';

export interface VoiceInteractionOptions {
  language?: string;
  autoPlayResponse?: boolean;
  continuousListening?: boolean;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onResponse?: (text: string) => void;
  onError?: (error: string) => void;
}

export interface VoiceInteractionState {
  isListening: boolean;
  isSpeaking: boolean;
  lastTranscript: string;
  lastResponse: string;
}

export class VoiceInteractionManager {
  private options: VoiceInteractionOptions;
  private state: VoiceInteractionState;
  private responseQueue: string[] = [];
  private isProcessingResponse = false;

  constructor(options: VoiceInteractionOptions = {}) {
    this.options = {
      language: 'zh-CN',
      autoPlayResponse: true,
      continuousListening: true,
      ...options,
    };

    this.state = {
      isListening: false,
      isSpeaking: false,
      lastTranscript: '',
      lastResponse: '',
    };
  }

  getState(): VoiceInteractionState {
    return { ...this.state };
  }

  handleTranscript(text: string, isFinal: boolean): void {
    this.state.lastTranscript = text;
    this.state.isListening = isFinal;

    this.options.onTranscript?.(text, isFinal);

    if (isFinal && text.trim()) {
      this.processUserInput(text);
    }
  }

  handlePlay(): void {
    this.state.isSpeaking = true;
  }

  handlePause(): void {
    this.state.isSpeaking = false;
  }

  handleEnd(): void {
    this.state.isSpeaking = false;
    this.processNextResponse();
  }

  handleError(error: string): void {
    this.options.onError?.(error);
  }

  async processUserInput(text: string): Promise<void> {
    if (this.isProcessingResponse) {
      return;
    }

    this.isProcessingResponse = true;

    try {
      const response = await this.generateResponse(text);
      this.state.lastResponse = response;
      this.options.onResponse?.(response);

      if (this.options.autoPlayResponse) {
        this.responseQueue.push(response);
        this.processNextResponse();
      }
    } catch (error) {
      console.error('处理用户输入失败:', error);
      this.handleError('处理您的请求时发生错误');
    } finally {
      this.isProcessingResponse = false;
    }
  }

  async generateResponse(text: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = [
          `我听到了您说的"${text}"，让我来帮您处理。`,
          `好的，我理解了您的意思："${text}"。`,
          `收到，您说的是"${text}"，我正在为您处理。`,
          `明白了，我会根据"${text}"为您提供帮助。`,
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        resolve(randomResponse || `我听到了您说的"${text}"，让我来帮您处理。`);
      }, 500);
    });
  }

  processNextResponse(): void {
    if (this.responseQueue.length === 0 || this.state.isSpeaking) {
      return;
    }

    const nextResponse = this.responseQueue.shift();
    if (nextResponse) {
      this.speak(nextResponse);
    }
  }

  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.options.language || 'zh-CN';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      this.handlePlay();
    };

    utterance.onend = () => {
      this.handleEnd();
    };

    utterance.onerror = (event) => {
      console.error('语音合成错误:', event.error);
      this.handleError('语音合成发生错误');
    };

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    window.speechSynthesis.cancel();
    this.state.isSpeaking = false;
    this.responseQueue = [];
  }

  clearQueue(): void {
    this.responseQueue = [];
  }

  updateOptions(options: Partial<VoiceInteractionOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export default VoiceInteractionManager;

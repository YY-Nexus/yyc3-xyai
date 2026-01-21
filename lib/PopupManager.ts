'use client';

export type PopupType = 'modal' | 'dialog' | 'notification' | 'confirm' | 'custom';

export interface PopupOptions {
  id?: string;
  type: PopupType;
  title?: string;
  content: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  duration?: number;
  priority?: number;
  zIndex?: number;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface PopupState {
  id: string;
  type: PopupType;
  title?: string;
  content: React.ReactNode;
  priority: number;
  zIndex: number;
  createdAt: number;
  options: PopupOptions;
}

export class PopupManager {
  private static instance: PopupManager;
  private popups: Map<string, PopupState> = new Map();
  private currentZIndex: number = 1000;
  private maxZIndex: number = 9999;
  private queue: PopupOptions[] = [];
  private isProcessingQueue: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  public static getInstance(): PopupManager {
    if (!PopupManager.instance) {
      PopupManager.instance = new PopupManager();
    }
    return PopupManager.instance;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      const topPopup = this.getTopPopup();
      if (topPopup && topPopup.options.closeOnEscape !== false) {
        this.close(topPopup.id);
      }
    }
  };

  public create(options: PopupOptions): string {
    const id = options.id || `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const popupState: PopupState = {
      id,
      type: options.type || 'modal',
      title: options.title,
      content: options.content,
      priority: options.priority || 0,
      zIndex: this.getNextZIndex(),
      createdAt: Date.now(),
      options: { ...options, id },
    };

    this.popups.set(id, popupState);
    this.sortPopupsByPriority();

    return id;
  }

  public close(id: string): void {
    const popup = this.popups.get(id);
    if (popup) {
      if (popup.options.onClose) {
        popup.options.onClose();
      }
      this.popups.delete(id);
      this.processQueue();
    }
  }

  public closeAll(): void {
    this.popups.forEach((popup, id) => {
      if (popup.options.onClose) {
        popup.options.onClose();
      }
    });
    this.popups.clear();
  }

  public closeByType(type: PopupType): void {
    const toClose: string[] = [];
    this.popups.forEach((popup, id) => {
      if (popup.type === type) {
        if (popup.options.onClose) {
          popup.options.onClose();
        }
        toClose.push(id);
      }
    });
    toClose.forEach(id => this.popups.delete(id));
  }

  public getPopup(id: string): PopupState | undefined {
    return this.popups.get(id);
  }

  public getPopupsByType(type: PopupType): PopupState[] {
    return Array.from(this.popups.values()).filter(popup => popup.type === type);
  }

  public getTopPopup(): PopupState | undefined {
    if (this.popups.size === 0) return undefined;
    
    const sortedPopups = Array.from(this.popups.values())
      .sort((a, b) => b.zIndex - a.zIndex);
    
    return sortedPopups[0];
  }

  public updateZIndex(id: string, zIndex: number): void {
    const popup = this.popups.get(id);
    if (popup) {
      popup.zIndex = zIndex;
      this.currentZIndex = Math.max(this.currentZIndex, zIndex);
    }
  }

  public bringToFront(id: string): void {
    const popup = this.popups.get(id);
    if (popup) {
      popup.zIndex = this.getNextZIndex();
      this.sortPopupsByPriority();
    }
  }

  public addToQueue(options: PopupOptions): void {
    this.queue.push(options);
    this.processQueue();
  }

  private processQueue(): void {
    if (this.isProcessingQueue || this.queue.length === 0) return;

    this.isProcessingQueue = true;

    const nextPopup = this.queue.shift();
    if (nextPopup) {
      this.create(nextPopup);
    }

    setTimeout(() => {
      this.isProcessingQueue = false;
      this.processQueue();
    }, 100);
  }

  public clearQueue(): void {
    this.queue = [];
  }

  private getNextZIndex(): number {
    this.currentZIndex += 1;
    if (this.currentZIndex > this.maxZIndex) {
      this.currentZIndex = 1000;
    }
    return this.currentZIndex;
  }

  private sortPopupsByPriority(): void {
    const sortedPopups = Array.from(this.popups.entries())
      .sort(([, a], [, b]) => b.priority - a.priority);
    
    sortedPopups.forEach(([id, popup], index) => {
      popup.zIndex = this.getNextZIndex();
      this.popups.set(id, popup);
    });
  }

  public getPopupCount(): number {
    return this.popups.size;
  }

  public getPopupCountByType(type: PopupType): number {
    return this.getPopupsByType(type).length;
  }

  public destroy(): void {
    this.closeAll();
    this.clearQueue();
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }
}

export default PopupManager;

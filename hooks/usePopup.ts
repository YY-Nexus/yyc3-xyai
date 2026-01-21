'use client';

import { useCallback } from 'react';
import { create } from 'zustand';
import PopupManager, { PopupOptions, PopupType } from '@/lib/PopupManager';

interface PopupStore {
  popups: Map<string, PopupOptions>;
  addPopup: (popup: PopupOptions & { id: string }) => void;
  removePopup: (id: string) => void;
  clearPopups: () => void;
}

const usePopupStore = create<PopupStore>((set) => ({
  popups: new Map(),
  addPopup: (popup) =>
    set((state) => {
      const newPopups = new Map(state.popups);
      if (popup.id) {
        newPopups.set(popup.id, popup);
      }
      return { popups: newPopups };
    }),
  removePopup: (id) =>
    set((state) => {
      const newPopups = new Map(state.popups);
      newPopups.delete(id);
      return { popups: newPopups };
    }),
  clearPopups: () => set({ popups: new Map() }),
}));

export const usePopup = () => {
  const { popups, addPopup, removePopup, clearPopups } = usePopupStore();

  const show = useCallback((options: PopupOptions) => {
    const manager = PopupManager.getInstance();
    const id = manager.create(options);
    addPopup({ ...options, id });
    return id;
  }, [addPopup]);

  const hide = useCallback((id: string) => {
    const manager = PopupManager.getInstance();
    manager.close(id);
    removePopup(id);
  }, [removePopup]);

  const hideAll = useCallback(() => {
    const manager = PopupManager.getInstance();
    manager.closeAll();
    clearPopups();
  }, [clearPopups]);

  const hideByType = useCallback((type: PopupType) => {
    const manager = PopupManager.getInstance();
    manager.closeByType(type);
    
    const toRemove: string[] = [];
    popups.forEach((popup, id) => {
      if (popup.type === type) {
        toRemove.push(id);
      }
    });
    toRemove.forEach(id => removePopup(id));
  }, [popups, removePopup]);

  const showNotification = useCallback((
    content: React.ReactNode,
    options?: Partial<PopupOptions>
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return show({
      id,
      type: 'notification',
      content,
      ...options,
    });
  }, [show]);

  const showSuccess = useCallback((
    content: React.ReactNode,
    options?: Partial<PopupOptions>
  ) => {
    return showNotification(content, { ...options, variant: 'success' });
  }, [showNotification]);

  const showError = useCallback((
    content: React.ReactNode,
    options?: Partial<PopupOptions>
  ) => {
    return showNotification(content, { ...options, variant: 'error' });
  }, [showNotification]);

  const showWarning = useCallback((
    content: React.ReactNode,
    options?: Partial<PopupOptions>
  ) => {
    return showNotification(content, { ...options, variant: 'warning' });
  }, [showNotification]);

  const showInfo = useCallback((
    content: React.ReactNode,
    options?: Partial<PopupOptions>
  ) => {
    return showNotification(content, { ...options, variant: 'info' });
  }, [showNotification]);

  const showModal = useCallback((
    content: React.ReactNode,
    options?: Partial<PopupOptions>
  ) => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return show({
      id,
      type: 'modal',
      content,
      ...options,
    });
  }, [show]);

  const showDialog = useCallback((
    content: React.ReactNode,
    options?: Partial<PopupOptions>
  ) => {
    const id = `dialog-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return show({
      id,
      type: 'dialog',
      content,
      ...options,
    });
  }, [show]);

  const showConfirm = useCallback((
    content: React.ReactNode,
    onConfirm: () => void,
    options?: Partial<PopupOptions>
  ) => {
    const id = `confirm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return show({
      id,
      type: 'confirm',
      content,
      onConfirm,
      ...options,
    });
  }, [show]);

  const bringToFront = useCallback((id: string) => {
    const manager = PopupManager.getInstance();
    manager.bringToFront(id);
  }, []);

  const getPopup = useCallback((id: string) => {
    const manager = PopupManager.getInstance();
    return manager.getPopup(id);
  }, []);

  const getTopPopup = useCallback(() => {
    const manager = PopupManager.getInstance();
    return manager.getTopPopup();
  }, []);

  const getPopupCount = useCallback(() => {
    const manager = PopupManager.getInstance();
    return manager.getPopupCount();
  }, []);

  const getPopupCountByType = useCallback((type: PopupType) => {
    const manager = PopupManager.getInstance();
    return manager.getPopupCountByType(type);
  }, []);

  return {
    popups,
    show,
    hide,
    hideAll,
    hideByType,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showModal,
    showDialog,
    showConfirm,
    bringToFront,
    getPopup,
    getTopPopup,
    getPopupCount,
    getPopupCountByType,
  };
};

export default usePopup;

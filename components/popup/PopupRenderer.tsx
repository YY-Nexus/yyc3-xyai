'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Modal, Dialog, Notification, Confirm } from './PopupComponents';
import { usePopup } from '@/hooks/usePopup';
import { PopupOptions } from '@/lib/PopupManager';

export const PopupRenderer: React.FC = () => {
  const { popups, hide, hideAll } = usePopup();

  useEffect(() => {
    const handleBeforeUnload = () => {
      hideAll();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hideAll]);

  const renderPopup = (options: PopupOptions) => {
    const commonProps = {
      isOpen: true,
      onClose: () => {
        if (options.onClose) {
          options.onClose();
        }
        if (options.id) {
          hide(options.id);
        }
      },
    };

    switch (options.type) {
      case 'modal':
        return (
          <Modal
            key={options.id}
            {...commonProps}
            title={options.title}
            size={options.size as any}
            showCloseButton={options.showCloseButton}
            closeOnOverlayClick={options.closeOnOverlayClick}
            closeOnEscape={options.closeOnEscape}
          >
            {options.content}
          </Modal>
        );

      case 'dialog':
        return (
          <Dialog
            key={options.id}
            {...commonProps}
            title={options.title}
            showCloseButton={options.showCloseButton}
          >
            {options.content}
          </Dialog>
        );

      case 'notification':
        return (
          <Notification
            key={options.id}
            {...commonProps}
            title={options.title}
            variant={options.variant}
            duration={options.duration}
            position={options.position as any}
          >
            {options.content}
          </Notification>
        );

      case 'confirm':
        return (
          <Confirm
            key={options.id}
            {...commonProps}
            title={options.title}
            confirmText={options.confirmText}
            cancelText={options.cancelText}
            variant={options.variant as any}
            onConfirm={() => {
              if (options.onConfirm) {
                options.onConfirm();
              }
              if (options.id) {
                hide(options.id);
              }
            }}
          >
            {options.content}
          </Confirm>
        );

      case 'custom':
        return (
          <div key={options.id} className="fixed inset-0 z-50 flex items-center justify-center">
            {options.content}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      {Array.from(popups.values()).map((options) => renderPopup(options))}
    </AnimatePresence>
  );
};

export default PopupRenderer;

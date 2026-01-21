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
            {...(options.title !== undefined && { title: options.title })}
            size={options.size as any}
            {...(options.showCloseButton !== undefined && { showCloseButton: options.showCloseButton })}
            {...(options.closeOnOverlayClick !== undefined && { closeOnOverlayClick: options.closeOnOverlayClick })}
            {...(options.closeOnEscape !== undefined && { closeOnEscape: options.closeOnEscape })}
          >
            {options.content}
          </Modal>
        );

      case 'dialog':
        return (
          <Dialog
            key={options.id}
            {...commonProps}
            {...(options.title !== undefined && { title: options.title })}
            {...(options.showCloseButton !== undefined && { showCloseButton: options.showCloseButton })}
          >
            {options.content}
          </Dialog>
        );

      case 'notification':
        return (
          <Notification
            key={options.id}
            {...commonProps}
            {...(options.title !== undefined && { title: options.title })}
            {...(options.variant !== undefined && { variant: options.variant })}
            {...(options.duration !== undefined && { duration: options.duration })}
            {...(options.position !== undefined && { position: options.position as any })}
          >
            {options.content}
          </Notification>
        );

      case 'confirm':
        return (
          <Confirm
            key={options.id}
            {...commonProps}
            {...(options.title !== undefined && { title: options.title })}
            {...(options.confirmText !== undefined && { confirmText: options.confirmText })}
            {...(options.cancelText !== undefined && { cancelText: options.cancelText })}
            {...(options.variant !== undefined && { variant: options.variant as any })}
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

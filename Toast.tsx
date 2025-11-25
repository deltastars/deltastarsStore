import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { XIcon } from './lib/Icons';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastMessage['type'], string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

const BORDER_COLORS: Record<ToastMessage['type'], string> = {
  success: 'border-green-500',
  error: 'border-red-500',
  info: 'border-blue-500',
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`relative w-full max-w-sm p-4 bg-white rounded-lg shadow-lg border-l-4 ${BORDER_COLORS[toast.type]} animate-fade-in-right pointer-events-auto`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="text-xl">{ICONS[toast.type]}</div>
        <p className="flex-1 text-sm font-semibold text-gray-800">{toast.message}</p>
        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Dismiss"
        >
          <XIcon />
        </button>
      </div>
    </div>
  );
};
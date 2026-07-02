import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable Confirm Dialog Modal
 * Props:
 *  - isOpen: boolean
 *  - title: string
 *  - message: string
 *  - confirmLabel: string (default "Confirm")
 *  - cancelLabel: string (default "Cancel")
 *  - variant: "danger" | "warning" | "info"  (default "danger")
 *  - onConfirm: () => void
 *  - onCancel: () => void
 */
const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const variantConfig = {
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      btnClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      btnClass: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400',
    },
    info: {
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      btnClass: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    },
  };

  const cfg = variantConfig[variant] || variantConfig.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className={`mx-auto flex items-center justify-center h-14 w-14 rounded-full ${cfg.iconBg} mb-4`}>
          <AlertTriangle className={`h-7 w-7 ${cfg.iconColor}`} />
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${cfg.btnClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

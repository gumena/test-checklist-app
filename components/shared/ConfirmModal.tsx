'use client';

import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        {/* Icon and Message */}
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 p-3 rounded-full ${
              variant === 'danger'
                ? 'bg-red-500/10'
                : variant === 'warning'
                ? 'bg-yellow-500/10'
                : 'bg-blue-500/10'
            }`}
          >
            <AlertTriangle
              className={`w-6 h-6 ${
                variant === 'danger'
                  ? 'text-red-500'
                  : variant === 'warning'
                  ? 'text-yellow-500'
                  : 'text-blue-500'
              }`}
            />
          </div>
          <div className="flex-1 pt-1">
            <p className="text-sm text-zinc-300 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Processing...' : confirmText}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

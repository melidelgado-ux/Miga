import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmActionModal({
  isOpen,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-action-heading"
      aria-describedby="confirm-action-description"
      className="fixed inset-0 z-[70] bg-[#2D2D2D]/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[#FFFFFF] rounded-t-[24px] sm:rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 py-5 bg-[#FFF8D6] border-b border-[#E8E8E8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#FFD6C9] flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-[#FFA500]" strokeWidth={2} />
            </div>
            <h2
              id="confirm-action-heading"
              className="font-display text-[20px] sm:text-[22px] font-semibold leading-[1.3] text-[#2D2D2D]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="min-h-[48px] min-w-[48px] rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:bg-[#FFD6C9]/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p
            id="confirm-action-description"
            className="text-[14px] leading-[1.6] text-[#747474]"
          >
            {description}
          </p>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="min-h-[48px] px-6 py-3 rounded-[16px] border-2 border-[#FF4B8A] bg-transparent text-[#2D2D2D] font-semibold text-[14px] hover:bg-[#E8D4F8]/40 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#FFA500] text-[#2D2D2D] font-semibold text-[14px] hover:brightness-95 active:scale-[0.98] transition-all cursor-pointer"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

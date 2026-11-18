import React, { useEffect } from 'react';
import { BookOpen, Folder, Mail, User, X } from 'lucide-react';
import { GreetingKitchenIllustration } from './KitchenIllustrations';

interface ProfileModalProps {
  isOpen: boolean;
  ownCount: number;
  receivedCount: number;
  collectionsCount: number;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onClose: () => void;
}

export function ProfileModal({
  isOpen,
  ownCount,
  receivedCount,
  collectionsCount,
  theme,
  onThemeChange,
  onClose,
}: ProfileModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-heading"
      className="fixed inset-0 z-50 bg-[#2D2D2D]/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#FFFFFF] rounded-t-[24px] sm:rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-[#FFF8D6] border-b border-[#E8E8E8] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#FFD6C9] border-2 border-[#FF6B4A] flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-[#2D2D2D]" strokeWidth={2} />
            </div>
            <div>
              <h2
                id="profile-modal-heading"
                className="font-display text-[22px] font-bold text-[#2D2D2D] leading-tight"
              >
                Sofi
              </h2>
              <p className="text-[14px] text-[#747474] mt-0.5">
                Biblioteca privada en Miga
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar perfil"
            className="min-h-[44px] min-w-[44px] rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:bg-[#FFD6C9]/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-[16px] bg-[#FFD6C9]/55 text-center space-y-1">
              <BookOpen className="w-4 h-4 text-[#FF6B4A] mx-auto" strokeWidth={2} />
              <p className="font-display text-[20px] font-bold text-[#2D2D2D] tabular-nums">
                {ownCount}
              </p>
              <p className="text-[12px] text-[#2D2D2D]/80">Propias</p>
            </div>

            <div className="p-3.5 rounded-[16px] bg-[#E8D4F8]/65 text-center space-y-1">
              <Mail className="w-4 h-4 text-[#FF4B8A] mx-auto" strokeWidth={2} />
              <p className="font-display text-[20px] font-bold text-[#2D2D2D] tabular-nums">
                {receivedCount}
              </p>
              <p className="text-[12px] text-[#2D2D2D]/80">Recibidas</p>
            </div>

            <div className="p-3.5 rounded-[16px] bg-[#D4F8E8]/70 text-center space-y-1">
              <Folder className="w-4 h-4 text-[#52C41A] mx-auto" strokeWidth={2} />
              <p className="font-display text-[20px] font-bold text-[#2D2D2D] tabular-nums">
                {collectionsCount}
              </p>
              <p className="text-[12px] text-[#2D2D2D]/80">Colecciones</p>
            </div>
          </div>

          <div className="p-4 rounded-[16px] bg-[#FFF8D6]/50 border border-[#E8E8E8] flex items-center gap-3.5">
            <GreetingKitchenIllustration className="w-12 h-12 shrink-0" />
            <p className="text-[13px] leading-[1.5] text-[#2D2D2D]/85">
              Tus recetas se mantienen privadas y puedes recibir nuevas de familiares o
              amigos aunque no tengan la app.
            </p>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] px-5 py-2.5 rounded-[16px] border-2 border-[#E8E8E8] text-[#2D2D2D] font-semibold text-[15px] hover:border-[#FF6B4A] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

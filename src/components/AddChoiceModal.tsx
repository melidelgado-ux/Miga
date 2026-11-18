import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, Link2, Plus, RefreshCw, X } from 'lucide-react';
import {
  CreateRecipeIllustration,
  ReceivedShareIllustration,
} from './KitchenIllustrations';

interface AddChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseCreateOwn: () => void;
  onCreateInvite: () => Promise<string>;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

export function AddChoiceModal({
  isOpen,
  onClose,
  onChooseCreateOwn,
  onCreateInvite,
  onNotify,
}: AddChoiceModalProps) {
  const [step, setStep] = useState<'choice' | 'request-link'>('choice');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStep('choice');
      setGeneratedLink('');
      setCopied(false);
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectRequestLink = async () => {
    setCopied(false);
    setStep('request-link');
    await handleCreateLink();
  };

  const handleCreateLink = async () => {
    if (isCreatingLink) return;
    setIsCreatingLink(true);
    try { setGeneratedLink(await onCreateInvite()); }
    catch { onNotify?.('No se pudo generar el enlace. Intentá otra vez.', 'error'); }
    finally { setIsCreatingLink(false); }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    try { await navigator.clipboard.writeText(generatedLink); }
    catch { onNotify?.('No se pudo copiar automáticamente. Seleccioná y copiá el enlace.', 'error'); return; }
    setCopied(true);
    onNotify?.('Enlace copiado al portapapeles.', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-choice-heading"
      className="fixed inset-0 z-50 bg-[#2D2D2D]/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-lg bg-[#FFFFFF] rounded-t-[24px] sm:rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Cabecera */}
        <div className="px-6 py-5 bg-[#FFF8D6] border-b border-[#E8E8E8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {step === 'request-link' && (
              <button
                type="button"
                onClick={() => {
                  setStep('choice');
                  setCopied(false);
                }}
                aria-label="Volver a opciones"
                className="min-h-[44px] min-w-[44px] rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:bg-[#FFD6C9]/40 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </button>
            )}
            <div className="min-w-0">
              <h2
                id="add-choice-heading"
                className="font-display text-[20px] sm:text-[22px] font-semibold leading-[1.3] text-[#2D2D2D]"
              >
                {step === 'choice'
                  ? '¿Qué quieres hacer?'
                  : 'Enlace listo para compartir'}
              </h2>
              <p className="text-[14px] text-[#747474]">
                {step === 'choice'
                  ? 'Elegí si querés anotar una receta propia o pedirle una a alguien.'
                  : 'Quien reciba este link podrá cargar su receta sin tener Miga.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="min-h-[44px] min-w-[44px] rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:bg-[#FFD6C9]/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Cuerpo */}
        {step === 'choice' ? (
          <div className="p-6 space-y-4">
            {/* Opción 1: Crear receta propia */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onChooseCreateOwn();
              }}
              className="miga-card w-full p-5 bg-[#FFD6C9]/70 border-2 border-[#FF6B4A]/30 hover:border-[#FF6B4A] text-left flex items-center gap-4 cursor-pointer"
            >
              <CreateRecipeIllustration className="w-14 h-14 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 font-display text-[18px] font-semibold text-[#2D2D2D]">
                  <Plus className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2.5} />
                  <span>Crear receta propia</span>
                </span>
                <p className="text-[14px] leading-[1.5] text-[#2D2D2D]/80 mt-0.5">
                  Registrá tus ingredientes y pasos en menos de un minuto.
                </p>
              </div>
            </button>

            {/* Opción 2: Generar link directo sin pedir datos */}
            <button
              type="button"
              onClick={handleSelectRequestLink}
              className="miga-card w-full p-5 bg-[#E8D4F8]/65 border-2 border-[#FF4B8A]/25 hover:border-[#FF4B8A] text-left flex items-center gap-4 cursor-pointer"
            >
              <ReceivedShareIllustration className="w-14 h-14 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 font-display text-[18px] font-semibold text-[#2D2D2D]">
                  <Link2 className="w-4 h-4 text-[#FF4B8A]" strokeWidth={2.2} />
                  <span>Pedir receta</span>
                </span>
                <p className="text-[14px] leading-[1.5] text-[#2D2D2D]/80 mt-0.5">
                  Obtené un enlace para que alguien comparta su receta.
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div className="p-5 rounded-[20px] bg-[#E8D4F8]/45 border border-[#E8D4F8] space-y-3">
              <div className="flex items-center gap-2 text-[14px] font-medium text-[#2D2D2D]">
                <Link2 className="w-4 h-4 text-[#FF4B8A] shrink-0" strokeWidth={2} />
                <span>Enlace para pedir una receta</span>
              </div>

              <p className="text-[13px] leading-[1.5] text-[#747474]">
                El enlace acepta una receta, vence en 30 días y solo se puede usar una vez.
              </p>

              <input
                type="text"
                readOnly
                value={generatedLink}
                aria-label="Enlace para solicitar receta"
                onClick={(e) => e.currentTarget.select()}
                className="miga-input w-full min-h-[48px] text-[14px] bg-[#FFFFFF] text-[#2D2D2D]"
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="miga-btn-primary flex-1 min-h-[52px] px-6 py-3 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                      <span>Enlace copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" strokeWidth={2} />
                      <span>Copiar enlace</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    void handleCreateLink();
                    setCopied(false);
                  }}
                  disabled={isCreatingLink}
                  className="min-h-[52px] px-5 py-3 rounded-[16px] border-2 border-[#FF4B8A] text-[#FF4B8A] bg-[#FFFFFF] font-semibold text-[15px] hover:bg-[#E8D4F8]/30 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" strokeWidth={2} />
                  <span>Generar otro enlace</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

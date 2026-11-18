import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, FolderPlus, Pencil, Trash2, X } from 'lucide-react';
import { Collection } from '../data/mockRecipes';
import { CollectionShelfIllustration } from './KitchenIllustrations';
import { ConfirmActionModal } from './ConfirmActionModal';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (collection: Collection) => void;
  collection?: Collection | null;
  onUpdate?: (collection: Collection) => void;
  onDelete?: (collectionId: string) => void;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

const PASTEL_OPTIONS: { value: Collection['pastelBg']; label: string }[] = [
  { value: '#FFD6C9', label: 'Melocotón' },
  { value: '#E8D4F8', label: 'Lavanda' },
  { value: '#D4F8E8', label: 'Menta' },
  { value: '#FFF8D6', label: 'Crema' },
];

export function CreateCollectionModal({
  isOpen,
  onClose,
  onCreate,
  collection = null,
  onUpdate,
  onDelete,
  onNotify,
}: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pastelBg, setPastelBg] = useState<Collection['pastelBg']>('#FFD6C9');
  const [nameError, setNameError] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setPastelBg('#FFD6C9');
      setNameError(false);
      setIsConfirmingDelete(false);
      return;
    }
    setName(collection?.name ?? '');
    setDescription(collection?.description ?? '');
    setPastelBg(collection?.pastelBg ?? '#FFD6C9');
    setNameError(false);
    setIsConfirmingDelete(false);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setNameError(true);
      onNotify?.('Escribí un nombre para tu colección.', 'error');
      return;
    }

    if (collection) {
      onUpdate?.({
        ...collection,
        name: cleanName,
        description: description.trim(),
        pastelBg,
      });
    } else {
      onCreate({
        id: `col-${Date.now()}`,
        name: cleanName,
        description:
          description.trim() || 'Colección creada en tu biblioteca personal.',
        pastelBg,
        isExample: false,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!collection) return;
    onDelete?.(collection.id);
    onClose();
  };

  if (!isOpen) return null;
  if (isConfirmingDelete && collection) {
    return (
      <ConfirmActionModal
        isOpen
        title={`¿Eliminar «${collection.name}»?`}
        description="Se quitará la colección. Las recetas seguirán en tu biblioteca, sin estar asignadas a ella."
        confirmLabel="Eliminar colección"
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={handleDelete}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-modal-heading"
      className="fixed inset-0 z-50 bg-[#2D2D2D]/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[#FFFFFF] rounded-t-[24px] sm:rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera al estilo del modal de elección */}
        <div className="px-6 py-5 bg-[#FFF8D6] border-b border-[#E8E8E8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <CollectionShelfIllustration className="w-12 h-12 shrink-0" />
            <div className="min-w-0">
              <h2
                id="collection-modal-heading"
                className="font-display text-[20px] sm:text-[22px] font-semibold leading-[1.3] text-[#2D2D2D]"
              >
                {collection ? 'Editar colección' : 'Nueva colección'}
              </h2>
              <p className="text-[14px] text-[#747474]">
                {collection
                  ? 'Editá el nombre y el detalle de esta colección.'
                  : 'Agrupa recetas propias y recibidas en una carpeta.'}
              </p>
            </div>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          <div>
              <label
              htmlFor="collection-name-input"
              className="block text-[14px] font-medium text-[#2D2D2D] mb-2"
            >
              Nombre de la colección *
            </label>
            <div className="relative">
              <input
                id="collection-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError && e.target.value.trim()) setNameError(false);
                }}
                placeholder="Ej: Almuerzos de verano"
                aria-invalid={nameError}
                className={`w-full min-h-[48px] px-4 py-3 rounded-[16px] text-[14px] text-[#2D2D2D] placeholder:text-[#747474] bg-[#FFFFFF] transition-all focus:outline-none ${
                  nameError
                    ? 'border-2 border-[#FFA500] bg-[#FFF8D6]/40 pr-11'
                    : name.trim()
                    ? 'border-2 border-[#D4F8E8] focus:border-[#FF6B4A] pr-11'
                    : 'border-2 border-[#E8E8E8] focus:border-[#FF6B4A]'
                }`}
              />
              {nameError && (
                <AlertCircle
                  className="w-5 h-5 text-[#FFA500] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  strokeWidth={2}
                />
              )}
              {!nameError && name.trim() && (
                <Check
                  className="w-5 h-5 text-[#52C41A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  strokeWidth={2}
                />
              )}
            </div>
            {nameError && (
              <p className="mt-1.5 text-[12px] font-medium text-[#2D2D2D] flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[#FFA500]" />
                Escribí un nombre para tu colección.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="collection-desc-input"
              className="block text-[14px] font-medium text-[#2D2D2D] mb-2"
            >
              Detalle (opcional)
            </label>
            <input
              id="collection-desc-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Platos frescos y rápidos para días de calor"
              className="miga-input w-full min-h-[48px] text-[14px]"
            />
          </div>

          <div>
            <span className="block text-[14px] font-medium text-[#2D2D2D] mb-2">
              Color de la tarjeta
            </span>
            <div className="grid grid-cols-4 gap-2.5">
              {PASTEL_OPTIONS.map((opt) => {
                const selected = pastelBg === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPastelBg(opt.value)}
                    className={`min-h-[48px] px-2 py-2 rounded-[16px] text-[12px] font-medium text-[#2D2D2D] transition-all cursor-pointer border-2 ${
                      selected
                        ? 'border-[#FF6B4A] shadow-[0_2px_4px_rgba(0,0,0,0.08)]'
                        : 'border-[#E8E8E8] hover:border-[#FF6B4A]/50'
                    }`}
                    style={{ backgroundColor: opt.value }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#E8E8E8] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            {collection && (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="sm:mr-auto min-h-[48px] px-4 py-3 rounded-[16px] border-2 border-[#FFA500]/70 bg-[#FFF8D6]/60 text-[#2D2D2D] font-semibold text-[14px] hover:bg-[#FFF8D6] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
                Eliminar colección
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] px-6 py-3 rounded-[16px] border-2 border-[#FF4B8A] bg-transparent text-[#2D2D2D] font-semibold text-[16px] hover:bg-[#E8D4F8]/40 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="miga-btn-primary min-h-[52px] px-7 py-3 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer"
            >
              {collection ? (
                <Pencil className="w-4 h-4" strokeWidth={2} />
              ) : (
                <FolderPlus className="w-5 h-5" strokeWidth={2} />
              )}
              <span>{collection ? 'Guardar cambios' : 'Crear colección'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

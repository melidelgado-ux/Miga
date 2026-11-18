import React, { useEffect, useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { RecipeIngredient, RecipeStep } from '../data/mockRecipes';

export type SheetTab = 'ingrediente' | 'paso';

interface AddItemSheetProps {
  isOpen: boolean;
  initialTab: SheetTab;
  editingIngredient?: RecipeIngredient | null;
  editingStep?: RecipeStep | null;
  nextStepNumber: number;
  onClose: () => void;
  onSaveIngredient: (ingredient: RecipeIngredient, keepOpen: boolean) => void;
  onSaveStep: (step: RecipeStep, keepOpen: boolean) => void;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

const UNITS = [
  { value: 'g', label: 'gramos (g)' },
  { value: 'ml', label: 'mililitros (ml)' },
  { value: 'tazas', label: 'tazas' },
  { value: 'cda', label: 'cucharadas (cda)' },
  { value: 'cdita', label: 'cucharaditas (cdita)' },
  { value: 'unid', label: 'unidades (unid)' },
];

export function AddItemSheet({
  isOpen,
  initialTab,
  editingIngredient,
  editingStep,
  nextStepNumber,
  onClose,
  onSaveIngredient,
  onSaveStep,
  onNotify,
}: AddItemSheetProps) {
  // Estado Ingrediente
  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState('100');
  const [ingUnit, setIngUnit] = useState('g');
  const [ingNote, setIngNote] = useState('');

  // Estado Paso
  const [stepTitle, setStepTitle] = useState('');
  const [stepInstruction, setStepInstruction] = useState('');
  const [stepTip, setStepTip] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (editingIngredient) {
      setIngName(editingIngredient.name);
      setIngQty(editingIngredient.quantity);
      setIngUnit(editingIngredient.unit);
      setIngNote(editingIngredient.note ?? '');
    } else {
      setIngName('');
      setIngQty('100');
      setIngUnit('g');
      setIngNote('');
    }

    if (editingStep) {
      setStepTitle(editingStep.title ?? '');
      setStepInstruction(editingStep.instruction);
      setStepTip(editingStep.tip ?? '');
    } else {
      setStepTitle('');
      setStepInstruction('');
      setStepTip('');
    }
  }, [isOpen, initialTab, editingIngredient, editingStep]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const resetIngredientFields = () => {
    setIngName('');
    setIngQty('100');
    setIngUnit('g');
    setIngNote('');
  };

  const resetStepFields = () => {
    setStepTitle('');
    setStepInstruction('');
    setStepTip('');
  };

  const handleSubmit = (keepOpen: boolean) => {
    if (initialTab === 'ingrediente') {
      if (!ingName.trim()) {
        onNotify?.('Escribí el nombre del ingrediente.', 'error');
        return;
      }
      const item: RecipeIngredient = {
        id: editingIngredient?.id ?? `ing-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        name: ingName.trim(),
        quantity: ingQty.trim() || '1',
        unit: ingUnit,
        note: ingNote.trim() || undefined,
      };
      onSaveIngredient(item, keepOpen);
      if (keepOpen) resetIngredientFields();
    } else {
      if (!stepInstruction.trim()) {
        onNotify?.('Escribí la instrucción del paso.', 'error');
        return;
      }
      const step: RecipeStep = {
        id: editingStep?.id ?? `step-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        title: stepTitle.trim() || undefined,
        instruction: stepInstruction.trim(),
        tip: stepTip.trim() || undefined,
      };
      onSaveStep(step, keepOpen);
      if (keepOpen) resetStepFields();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2D2D2D]/40 backdrop-blur-[3px] p-0 sm:p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-item-sheet-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[92vh] bg-[#FFFFFF] rounded-t-[28px] sm:rounded-[24px] shadow-[0_-8px_32px_rgba(45,45,45,0.18)] flex flex-col overflow-hidden"
      >
        {/* Drag handle en móvil */}
        <div className="w-full pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#E8E8E8]" />
        </div>

        {/* Cabecera sin tabs */}
        <div className="px-6 pt-3 pb-4 flex items-center justify-between gap-3 border-b border-[#E8E8E8]">
          <h2
            id="add-item-sheet-title"
            className="font-display text-[18px] font-bold text-[#2D2D2D]"
          >
            {initialTab === 'ingrediente'
              ? editingIngredient
                ? 'Editar ingrediente'
                : 'Añadir ingrediente'
              : editingStep
              ? 'Editar paso'
              : 'Añadir paso'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="min-h-[40px] min-w-[40px] rounded-full bg-[#FFD6C9]/45 text-[#2D2D2D] flex items-center justify-center hover:bg-[#FFD6C9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="overflow-y-auto px-6 py-5 space-y-4">
          {initialTab === 'ingrediente' ? (
            <div className="p-4 rounded-[20px] bg-[#FFD6C9]/30 space-y-4">
              <p className="font-display text-[16px] font-semibold text-[#2D2D2D]">
                ¿Qué ingrediente vas a sumar?
              </p>

              <div>
                <label
                  htmlFor="sheet-ing-name"
                  className="flex items-center justify-between text-[14px] font-semibold text-[#2D2D2D] mb-2"
                >
                  <span>Nombre del ingrediente</span>
                  <span className="text-[11px] font-semibold text-[#2D2D2D] bg-[#FFD6C9] px-2.5 py-0.5 rounded-[8px]">
                    Requerido
                  </span>
                </label>
                <input
                  id="sheet-ing-name"
                  type="text"
                  value={ingName}
                  onChange={(e) => setIngName(e.target.value)}
                  placeholder="Ej: Manteca pomada, Harina 0000..."
                  className="miga-input w-full min-h-[52px] text-[14px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="sheet-ing-qty"
                    className="block text-[14px] font-semibold text-[#2D2D2D] mb-2"
                  >
                    Cantidad
                  </label>
                  <input
                    id="sheet-ing-qty"
                    type="text"
                    value={ingQty}
                    onChange={(e) => setIngQty(e.target.value)}
                    placeholder="200"
                    className="miga-input w-full min-h-[52px] text-[14px] tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sheet-ing-unit"
                    className="block text-[14px] font-semibold text-[#2D2D2D] mb-2"
                  >
                    Unidad
                  </label>
                  <div className="relative">
                    <select
                      id="sheet-ing-unit"
                      value={ingUnit}
                      onChange={(e) => setIngUnit(e.target.value)}
                      className="miga-input w-full min-h-[52px] appearance-none pr-9 text-[14px] font-medium cursor-pointer"
                    >
                      {UNITS.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#747474] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="sheet-ing-note"
                  className="flex items-center justify-between text-[14px] font-semibold text-[#2D2D2D] mb-2"
                >
                  <span>Nota o detalle</span>
                  <span className="text-[11px] font-medium text-[#747474] bg-[#FFFFFF] px-2 py-0.5 rounded-[8px]">
                    Opcional
                  </span>
                </label>
                <input
                  id="sheet-ing-note"
                  type="text"
                  value={ingNote}
                  onChange={(e) => setIngNote(e.target.value)}
                  placeholder="Ej: A temperatura ambiente, cortada en cubos..."
                  className="miga-input w-full min-h-[52px] text-[14px]"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-[20px] bg-[#FFD6C9]/30 space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#FF4B8A] text-[#FFFFFF] text-[13px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                  {nextStepNumber}
                </span>
                <p className="font-display text-[16px] font-semibold text-[#2D2D2D]">
                  ¿Qué hacemos en este paso?
                </p>
              </div>

              <div>
                <label
                  htmlFor="sheet-step-title"
                  className="flex items-center justify-between text-[14px] font-semibold text-[#2D2D2D] mb-2"
                >
                  <span>Título del paso</span>
                  <span className="text-[11px] font-medium text-[#747474] bg-[#FFFFFF] px-2 py-0.5 rounded-[8px]">
                    Opcional
                  </span>
                </label>
                <input
                  id="sheet-step-title"
                  type="text"
                  value={stepTitle}
                  onChange={(e) => setStepTitle(e.target.value)}
                  placeholder="Ej: Batir la manteca y el azúcar..."
                  className="miga-input w-full min-h-[52px] text-[14px]"
                />
              </div>

              <div>
                <label
                  htmlFor="sheet-step-instruction"
                  className="flex items-center justify-between text-[14px] font-semibold text-[#2D2D2D] mb-2"
                >
                  <span>Instrucción detallada</span>
                  <span className="text-[11px] font-semibold text-[#2D2D2D] bg-[#FFD6C9] px-2.5 py-0.5 rounded-[8px]">
                    Requerido
                  </span>
                </label>
                <textarea
                  id="sheet-step-instruction"
                  rows={3}
                  value={stepInstruction}
                  onChange={(e) => setStepInstruction(e.target.value)}
                  placeholder="Ej: Batir la manteca pomada con el azúcar rubia hasta obtener una crema suave..."
                  className="miga-input w-full text-[14px]"
                />
              </div>

              <div className="p-3.5 rounded-[16px] bg-[#FFF8D6] space-y-2">
                <label
                  htmlFor="sheet-step-tip"
                  className="flex items-center justify-between text-[13px] font-semibold text-[#2D2D2D]"
                >
                  <span>Miga Tip / Consejo</span>
                  <span className="text-[11px] font-medium text-[#747474] bg-[#FFFFFF] px-2 py-0.5 rounded-[8px]">
                    Opcional
                  </span>
                </label>
                <input
                  id="sheet-step-tip"
                  type="text"
                  value={stepTip}
                  onChange={(e) => setStepTip(e.target.value)}
                  placeholder="Ej: Asegurate de que la manteca esté bien blanda"
                  className="miga-input w-full min-h-[48px] text-[14px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Barra de acciones fija inferior */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-t border-[#E8E8E8] pb-safe space-y-2">
          <div className="flex items-center gap-3">
            {!editingIngredient && !editingStep && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="flex-1 min-h-[52px] px-4 rounded-[16px] bg-[#E8D4F8] text-[#2D2D2D] font-semibold text-[14px] flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#FF4B8A]" strokeWidth={2.5} />
                <span>{initialTab === 'ingrediente' ? 'Añadir otro ingrediente' : 'Añadir otro paso'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="miga-btn-primary flex-[1.4] min-h-[52px] px-6 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_6px_16px_rgba(255,107,74,0.3)]"
            >
              <span>
                {editingIngredient || editingStep ? 'Guardar cambio' : 'Listo, agregar'}
              </span>
            </button>
          </div>
          <p className="text-center text-[11px] text-[#747474]">
            Se guarda directamente en tu receta de Miga
          </p>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Edit2,
  FolderPlus,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import { Collection, Recipe } from '../data/mockRecipes';

interface RecipeDetailPageProps {
  recipe: Recipe;
  collections: Collection[];
  onBack: () => void;
  onEdit: (recipe: Recipe) => void;
  onAssignCollection: (recipeId: string, collectionId: string) => void;
}

function parseQuantityValue(raw: string): number | null {
  const cleaned = raw.trim().replace(',', '.');
  if (!cleaned) return null;

  // Fracción mixta: "1 1/2"
  const mixedMatch = cleaned.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const num = Number(mixedMatch[2]);
    const den = Number(mixedMatch[3]);
    if (den > 0) return whole + num / den;
  }

  // Fracción simple: "1/2"
  const fracMatch = cleaned.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fracMatch) {
    const num = Number(fracMatch[1]);
    const den = Number(fracMatch[2]);
    if (den > 0) return num / den;
  }

  // Número decimal o entero
  if (/^\d+(\.\d+)?$/.test(cleaned)) {
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatScaledQuantity(rawQty: string, baseServings: number, targetServings: number): string {
  if (baseServings <= 0 || targetServings === baseServings) return rawQty;

  const parsed = parseQuantityValue(rawQty);
  if (parsed === null || parsed <= 0) return rawQty;

  const scaled = (parsed * targetServings) / baseServings;

  let formattedNumber: number;
  if (Math.abs(scaled - Math.round(scaled)) < 0.01) {
    formattedNumber = Math.round(scaled);
  } else if (Math.abs(scaled * 4 - Math.round(scaled * 4)) < 0.02) {
    formattedNumber = Math.round(scaled * 4) / 4;
  } else {
    formattedNumber = Math.round(scaled * 10) / 10;
  }

  if (formattedNumber <= 0) {
    formattedNumber = 0.1;
  }

  return String(formattedNumber).replace('.', ',');
}

function formatReceivedDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Fecha de recepción no disponible';
  return `Recibida el ${date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;
}

function formatAuthorName(author?: string): string {
  const name = author?.trim() ?? '';
  const selfName = name.match(/^Vos\s*\((.+)\)$/i)?.[1] ?? name.replace(/^Vos\s*/i, '');
  return selfName.trim() || 'Sofía M.';
}

export function RecipeDetailPage({
  recipe,
  collections,
  onBack,
  onEdit,
  onAssignCollection,
}: RecipeDetailPageProps) {
  const baseServings = Math.max(1, recipe.servings);
  const [servings, setServings] = useState<number>(baseServings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setServings(Math.max(1, recipe.servings));
    setCheckedIngredients({});
  }, [recipe.id, recipe.servings]);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isScaled = servings !== baseServings;

  const isReceived = recipe.origin === 'received';
  const authorName = formatAuthorName(recipe.author);
  const avatarName = isReceived ? recipe.senderName || recipe.author : authorName;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Barra superior con botón volver */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-4 py-2 rounded-[16px] bg-[#FFFFFF] border-2 border-[#E8E8E8] text-[#2D2D2D] font-semibold text-[14px] hover:border-[#FF6B4A] hover:bg-[#FFD6C9]/25 transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2.2} />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(recipe)}
            className="min-h-[48px] px-4 py-2 rounded-[16px] bg-[#FFF8D6] border border-[#E8E8E8] text-[#2D2D2D] font-semibold text-[13px] hover:border-[#FF6B4A] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#FF6B4A]" strokeWidth={2} />
            <span>Editar receta</span>
          </button>
        </div>
      </div>

      {/* Cabecera de título, descripción y autor */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-[8px] bg-[#FFD6C9] text-[12px] font-semibold text-[#2D2D2D]">
            {recipe.category}
          </span>
          <span className="px-3 py-1 rounded-[8px] bg-[#D4F8E8] text-[12px] font-semibold text-[#2D2D2D]">
            {recipe.difficulty}
          </span>
          {recipe.isExample && (
            <span className="text-[12px] text-[#747474]">Receta de ejemplo</span>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-[28px] sm:text-[32px] font-bold leading-[1.2] text-[#2D2D2D]">
            {recipe.title}
          </h1>
          <p className="text-[16px] leading-[1.6] text-[#747474]">
            {recipe.description}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E8E8E8] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FF4B8A] text-[#FFFFFF] flex items-center justify-center text-[12px] font-bold shrink-0">
            {(avatarName || 'M').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#2D2D2D] leading-tight">
              {isReceived
                ? `Compartida por ${recipe.senderName || recipe.author || 'alguien'}`
                : authorName}
            </p>
            <p className="text-[11px] text-[#747474]">
              {isReceived ? formatReceivedDate(recipe.createdAt) : 'Recetario personal'}
            </p>
          </div>
        </div>
      </section>

      {/* Colección */}
      <section className="p-4 sm:px-6 sm:py-4 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[12px] bg-[#E8D4F8]/70 flex items-center justify-center shrink-0">
            <FolderPlus className="w-4 h-4 text-[#FF4B8A]" strokeWidth={2} />
          </div>
          <div>
            <label
              htmlFor="detail-collection-select"
              className="block text-[13px] font-semibold text-[#2D2D2D]"
            >
              Colección
            </label>
            <p className="text-[11px] text-[#747474]">
              Organizá esta receta en tu biblioteca
            </p>
          </div>
        </div>

        <select
          id="detail-collection-select"
          aria-label="Guardar en colección"
          value={recipe.collectionId ?? ''}
          onChange={(e) => onAssignCollection(recipe.id, e.target.value)}
          className="miga-input w-full sm:w-auto sm:min-w-[200px] min-h-[44px] py-2 px-3 text-[13px] bg-[#FFFFFF] cursor-pointer"
        >
          <option value="">Sin colección</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
      </section>

      {/* Portada fotográfica */}
      <section className="relative rounded-[24px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-[#FFF8D6] border border-[#E8E8E8]">
        <div className="relative w-full h-60 sm:h-72 flex items-center justify-center">
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-[#747474]">
              <UtensilsCrossed className="w-10 h-10 text-[#FF6B4A]" strokeWidth={2} />
              <span className="text-[14px]">Sin fotografía adjunta</span>
            </div>
          )}

          {recipe.featured && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#FFF8D6] text-[#2D2D2D] text-[12px] font-semibold shadow-sm inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B4A]" strokeWidth={2} />
              <span>Destacada</span>
            </span>
          )}
        </div>
      </section>

      {/* Métricas de cocina */}
      <section>
        <div className="p-4 sm:p-5 rounded-[24px] bg-[#FFF8D6] border border-[#E8E8E8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#FF6B4A]" strokeWidth={2} />
            <span className="text-[14px] font-medium text-[#2D2D2D]">Tiempo total</span>
          </div>
          <span className="font-display text-[20px] font-bold text-[#2D2D2D] tabular-nums">
            {recipe.prepMinutes} <span className="text-[13px] font-normal">min</span>
          </span>
        </div>
      </section>

      {/* Lista de ingredientes verificables al cocinar */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)] space-y-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-[18px] font-semibold text-[#2D2D2D]">
                Ingredientes
              </h2>
              <span className="bg-[#D4F8E8] text-[#2D2D2D] text-[11px] font-semibold px-2.5 py-0.5 rounded-[8px] tabular-nums">
                {recipe.ingredients.length} cargados
              </span>
            </div>
            <p className="text-[12px] text-[#747474] mt-0.5">
              Ajustá las porciones para calcular lo que necesitás
            </p>
          </div>

          <div
            className="w-full flex items-center justify-between gap-2 p-1.5 rounded-[16px] bg-[#D4F8E8]/60 border border-[#52C41A]/30"
            role="group"
            aria-label="Ajustar porciones"
          >
            <button
              type="button"
              onClick={() => setServings((prev) => Math.max(1, prev - 1))}
              disabled={servings <= 1}
              aria-label="Reducir porciones"
              className="w-10 h-10 rounded-[12px] bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:border-[#FF6B4A] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-4 h-4" strokeWidth={2.5} />
            </button>
            <div className="px-2 min-w-[82px] text-center">
              <span className="font-display text-[16px] font-bold text-[#2D2D2D] tabular-nums">
                {servings}
              </span>{' '}
              <span className="text-[12px] font-medium text-[#2D2D2D]">
                {servings === 1 ? 'porción' : 'porciones'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setServings((prev) => Math.min(99, prev + 1))}
              disabled={servings >= 99}
              aria-label="Aumentar porciones"
              className="w-10 h-10 rounded-[12px] bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:border-[#FF6B4A] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {isScaled && (
          <div className="px-3.5 py-2 rounded-[14px] bg-[#FFF8D6] border border-[#FFA500]/30 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#2D2D2D]">
            <span>
              Cantidades calculadas para <strong>{servings}</strong>{' '}
              {servings === 1 ? 'porción' : 'porciones'} (original: {baseServings})
            </span>
            <button
              type="button"
              onClick={() => setServings(baseServings)}
              className="inline-flex items-center gap-1 font-semibold text-[#FF6B4A] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.2} />
              <span>Restablecer</span>
            </button>
          </div>
        )}

        <div className="space-y-2.5">
          {recipe.ingredients.map((ing) => {
            const checked = Boolean(checkedIngredients[ing.id]);
            const displayQuantity = formatScaledQuantity(ing.quantity, baseServings, servings);
            const quantityChanged = isScaled && displayQuantity !== ing.quantity;

            return (
              <button
                key={ing.id}
                type="button"
                onClick={() => toggleIngredient(ing.id)}
                className={`w-full p-3.5 rounded-[16px] border text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                  checked
                    ? 'bg-[#D4F8E8]/45 border-[#52C41A]/40'
                    : 'bg-[#FFD6C9]/20 border-[#E8E8E8] hover:border-[#FF6B4A]/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      checked
                        ? 'bg-[#52C41A] text-[#FFFFFF]'
                        : 'bg-[#D4F8E8] text-[#52C41A]'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-[14px] font-medium ${
                        checked
                          ? 'line-through text-[#747474]'
                          : 'text-[#2D2D2D]'
                      }`}
                    >
                      {ing.name}
                    </p>
                    {ing.note && (
                      <p className="text-[12px] text-[#747474]">{ing.note}</p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-[8px] border text-[12px] font-bold text-[#2D2D2D] tabular-nums shrink-0 transition-colors ${
                    quantityChanged
                      ? 'bg-[#FFF8D6] border-[#FFA500]/45'
                      : 'bg-[#FFFFFF] border-[#E8E8E8]'
                  }`}
                >
                  {displayQuantity} {ing.unit}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Paso a paso */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)] space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-[18px] font-semibold text-[#2D2D2D]">
              Paso a paso
            </h2>
            <span className="bg-[#D4F8E8] text-[#2D2D2D] text-[11px] font-semibold px-2.5 py-0.5 rounded-[8px] tabular-nums">
              {recipe.steps.length} {recipe.steps.length === 1 ? 'paso' : 'pasos'}
            </span>
          </div>
          <p className="text-[12px] text-[#747474] mt-0.5">
            Instrucciones claras y concisas
          </p>
        </div>

        <div className="space-y-3">
          {recipe.steps.map((step, index) => (
            <div
              key={step.id}
              className="p-4 rounded-[20px] bg-[#FFD6C9]/25 border border-[#E8E8E8] space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#FF4B8A] text-[#FFFFFF] text-[12px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                  {index + 1}
                </span>
                <h3 className="font-display text-[15px] font-bold text-[#2D2D2D]">
                  {step.title || `Paso ${index + 1}`}
                </h3>
              </div>
              <p className="text-[14px] leading-[1.6] text-[#2D2D2D]/85 pl-8">
                {step.instruction}
              </p>
              {step.tip && (
                <p className="ml-8 px-3 py-1.5 rounded-[8px] bg-[#FFF8D6] text-[12px] text-[#2D2D2D]">
                  <strong>Tip:</strong> {step.tip}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Miga Tip */}
      {recipe.migaTip && (
        <section className="p-4 sm:p-5 rounded-[24px] bg-[#E8D4F8]/70 border border-[#FF4B8A]/20 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FF4B8A] text-[#FFFFFF] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D2D2D] mb-0.5">
              Miga Tip
            </p>
            <p className="text-[13px] leading-[1.5] text-[#2D2D2D]">
              {recipe.migaTip}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

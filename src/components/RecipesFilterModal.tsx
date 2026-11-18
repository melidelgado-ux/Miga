import React, { useEffect, useMemo, useState } from 'react';
import { Filter, RotateCcw, Sparkles, X } from 'lucide-react';
import {
  Collection,
  RECIPE_CATEGORIES,
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
} from '../data/mockRecipes';

export type DateFilter = 'all' | 'week' | 'month' | 'year';
export type OwnerFilter = 'all' | 'own' | 'received';
export type SortOption = 'recent' | 'prep-asc' | 'title-asc';

export interface RecipeFiltersState {
  dateFilter: DateFilter;
  ownerFilter: OwnerFilter;
  categoryFilter: 'all' | RecipeCategory;
  collectionFilter: string;
  difficultyFilter: 'all' | RecipeDifficulty;
  onlyFeatured: boolean;
  sortBy: SortOption;
}

export const DEFAULT_RECIPE_FILTERS: RecipeFiltersState = {
  dateFilter: 'all',
  ownerFilter: 'all',
  categoryFilter: 'all',
  collectionFilter: 'all',
  difficultyFilter: 'all',
  onlyFeatured: false,
  sortBy: 'recent',
};

const DIFFICULTIES: RecipeDifficulty[] = ['Fácil', 'Moderado', 'Difícil'];

export function isWithinDateFilter(iso: string, filter: DateFilter): boolean {
  if (filter === 'all') return true;
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return true;

  const diffDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  if (filter === 'week') return diffDays <= 7;
  if (filter === 'month') return diffDays <= 30;
  if (filter === 'year') return diffDays <= 365;
  return true;
}

interface RecipesFilterModalProps {
  isOpen: boolean;
  filters: RecipeFiltersState;
  recipes: Recipe[];
  collections: Collection[];
  searchQuery: string;
  onClose: () => void;
  onApply: (nextFilters: RecipeFiltersState) => void;
}

export function RecipesFilterModal({
  isOpen,
  filters,
  recipes,
  collections,
  searchQuery,
  onClose,
  onApply,
}: RecipesFilterModalProps) {
  const [draft, setDraft] = useState<RecipeFiltersState>(filters);

  useEffect(() => {
    if (!isOpen) return;
    setDraft(filters);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filters, onClose]);

  const previewCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (draft.ownerFilter !== 'all' && recipe.origin !== draft.ownerFilter) return false;
      if (!isWithinDateFilter(recipe.createdAt, draft.dateFilter)) return false;
      if (draft.categoryFilter !== 'all' && recipe.category !== draft.categoryFilter)
        return false;
      if (
        draft.difficultyFilter !== 'all' &&
        recipe.difficulty !== draft.difficultyFilter
      )
        return false;
      if (draft.onlyFeatured && !recipe.featured) return false;

      if (draft.collectionFilter === 'none') {
        if (recipe.collectionId) return false;
      } else if (draft.collectionFilter !== 'all') {
        if (recipe.collectionId !== draft.collectionFilter) return false;
      }

      if (q) {
        const matchesText =
          recipe.title.toLowerCase().includes(q) ||
          recipe.description.toLowerCase().includes(q) ||
          recipe.category.toLowerCase().includes(q) ||
          (recipe.author && recipe.author.toLowerCase().includes(q)) ||
          (recipe.senderName && recipe.senderName.toLowerCase().includes(q)) ||
          recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      return true;
    }).length;
  }, [recipes, draft, searchQuery]);

  if (!isOpen) return null;

  const hasDraftChanges =
    draft.dateFilter !== 'all' ||
    draft.ownerFilter !== 'all' ||
    draft.categoryFilter !== 'all' ||
    draft.collectionFilter !== 'all' ||
    draft.difficultyFilter !== 'all' ||
    draft.onlyFeatured ||
    draft.sortBy !== 'recent';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipes-filter-heading"
      className="fixed inset-0 z-50 bg-[#2D2D2D]/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg max-h-[90vh] bg-[#FFFFFF] rounded-t-[24px] sm:rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera al estilo de AddChoiceModal */}
        <div className="px-6 py-5 bg-[#FFF8D6] border-b border-[#E8E8E8] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-[14px] bg-[#FFFFFF] border border-[#E8E8E8] flex items-center justify-center shrink-0">
              <Filter className="w-5 h-5 text-[#FF6B4A]" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2
                id="recipes-filter-heading"
                className="font-display text-[20px] sm:text-[22px] font-semibold leading-[1.3] text-[#2D2D2D]"
              >
                Filtrar recetas
              </h2>
              <p className="text-[14px] text-[#747474]">
                Elegí fecha, origen, categoría, colección y más.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar filtros"
            className="min-h-[44px] min-w-[44px] rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:bg-[#FFD6C9]/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Cuerpo scrolleable */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Dueño de la receta */}
          <div className="p-4 rounded-[20px] bg-[#FFD6C9]/35 space-y-2.5">
            <span className="block text-[13px] font-semibold text-[#2D2D2D]">
              Dueño de la receta
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'all', label: 'Todas' },
                  { id: 'own', label: 'Propias' },
                  { id: 'received', label: 'Recibidas' },
                ] as const
              ).map((opt) => {
                const active = draft.ownerFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, ownerFilter: opt.id }))}
                    className={`min-h-[44px] px-3 py-2 rounded-[14px] text-[13px] font-semibold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#FF6B4A] border-[#FF6B4A] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] border-[#E8E8E8] text-[#2D2D2D] hover:border-[#FF6B4A]/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fecha de carga */}
          <div className="p-4 rounded-[20px] bg-[#E8D4F8]/40 space-y-2.5">
            <span className="block text-[13px] font-semibold text-[#2D2D2D]">
              Fecha de carga
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'all', label: 'Todas' },
                  { id: 'week', label: 'Últ. semana' },
                  { id: 'month', label: 'Últ. mes' },
                  { id: 'year', label: 'Últ. año' },
                ] as const
              ).map((opt) => {
                const active = draft.dateFilter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, dateFilter: opt.id }))}
                    className={`min-h-[44px] px-2.5 py-2 rounded-[14px] text-[12px] font-semibold border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#FF4B8A] border-[#FF4B8A] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] border-[#E8E8E8] text-[#2D2D2D] hover:border-[#FF4B8A]/60'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categoría, Colección, Dificultad y Orden */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label
                htmlFor="modal-filter-category"
                className="block text-[13px] font-semibold text-[#2D2D2D] mb-1.5"
              >
                Categoría
              </label>
              <select
                id="modal-filter-category"
                value={draft.categoryFilter}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    categoryFilter: e.target.value as 'all' | RecipeCategory,
                  }))
                }
                className="miga-input w-full min-h-[46px] py-2 px-3 text-[13px] bg-[#FFFFFF] cursor-pointer"
              >
                <option value="all">Todas las categorías</option>
                {RECIPE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="modal-filter-collection"
                className="block text-[13px] font-semibold text-[#2D2D2D] mb-1.5"
              >
                Colección
              </label>
              <select
                id="modal-filter-collection"
                value={draft.collectionFilter}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, collectionFilter: e.target.value }))
                }
                className="miga-input w-full min-h-[46px] py-2 px-3 text-[13px] bg-[#FFFFFF] cursor-pointer"
              >
                <option value="all">Todas las colecciones</option>
                <option value="none">Sin colección</option>
                {collections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="modal-filter-difficulty"
                className="block text-[13px] font-semibold text-[#2D2D2D] mb-1.5"
              >
                Dificultad
              </label>
              <select
                id="modal-filter-difficulty"
                value={draft.difficultyFilter}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    difficultyFilter: e.target.value as 'all' | RecipeDifficulty,
                  }))
                }
                className="miga-input w-full min-h-[46px] py-2 px-3 text-[13px] bg-[#FFFFFF] cursor-pointer"
              >
                <option value="all">Todas las dificultades</option>
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="modal-filter-sort"
                className="block text-[13px] font-semibold text-[#2D2D2D] mb-1.5"
              >
                Ordenar por
              </label>
              <select
                id="modal-filter-sort"
                value={draft.sortBy}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))
                }
                className="miga-input w-full min-h-[46px] py-2 px-3 text-[13px] bg-[#FFFFFF] cursor-pointer"
              >
                <option value="recent">Más recientes</option>
                <option value="prep-asc">Menor tiempo</option>
                <option value="title-asc">Nombre (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Destacadas */}
          <div>
            <button
              type="button"
              onClick={() =>
                setDraft((prev) => ({ ...prev, onlyFeatured: !prev.onlyFeatured }))
              }
              aria-pressed={draft.onlyFeatured}
              className={`w-full min-h-[46px] px-4 py-2.5 rounded-[16px] text-[14px] font-semibold border flex items-center justify-between transition-colors cursor-pointer ${
                draft.onlyFeatured
                  ? 'bg-[#FFF8D6] border-[#FF6B4A] text-[#2D2D2D]'
                  : 'bg-[#FFFFFF] border-[#E8E8E8] text-[#747474] hover:border-[#FF6B4A]/50 hover:text-[#2D2D2D]'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles
                  className={`w-4 h-4 ${
                    draft.onlyFeatured ? 'text-[#FF6B4A]' : 'text-[#747474]'
                  }`}
                  strokeWidth={2}
                />
                <span>Mostrar solo recetas destacadas</span>
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-[8px] text-[11px] font-semibold ${
                  draft.onlyFeatured
                    ? 'bg-[#FFD6C9] text-[#2D2D2D]'
                    : 'bg-[#E8E8E8]/60 text-[#747474]'
                }`}
              >
                {draft.onlyFeatured ? 'Activado' : 'Opcional'}
              </span>
            </button>
          </div>
        </div>

        {/* Pie fijo del modal */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-t border-[#E8E8E8] flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={!hasDraftChanges}
            onClick={() => {
              setDraft(DEFAULT_RECIPE_FILTERS);
              onApply(DEFAULT_RECIPE_FILTERS);
              onClose();
            }}
            className="min-h-[48px] px-5 py-2.5 rounded-[16px] border-2 border-[#FF6B4A] bg-transparent text-[#FF6B4A] font-semibold text-[15px] hover:bg-[#FFD6C9]/25 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            <span>Limpiar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
            className="miga-btn-primary flex-1 min-h-[48px] px-6 py-2.5 rounded-[16px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              Aplicar filtros ({previewCount}{' '}
              {previewCount === 1 ? 'receta' : 'recetas'})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

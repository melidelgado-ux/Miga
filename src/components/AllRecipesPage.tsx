import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  Folder,
  RotateCcw,
  Search,
  Sparkles,
  User,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { Collection, Recipe } from '../data/mockRecipes';
import { GreetingKitchenIllustration } from './KitchenIllustrations';
import {
  DEFAULT_RECIPE_FILTERS,
  isWithinDateFilter,
  RecipeFiltersState,
  RecipesFilterModal,
} from './RecipesFilterModal';

interface AllRecipesPageProps {
  recipes: Recipe[];
  collections: Collection[];
  onBack?: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function AllRecipesPage({
  recipes,
  collections,
  onBack,
  onSelectRecipe,
}: AllRecipesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<RecipeFiltersState>(DEFAULT_RECIPE_FILTERS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dateFilter !== 'all') count += 1;
    if (filters.ownerFilter !== 'all') count += 1;
    if (filters.categoryFilter !== 'all') count += 1;
    if (filters.collectionFilter !== 'all') count += 1;
    if (filters.difficultyFilter !== 'all') count += 1;
    if (filters.onlyFeatured) count += 1;
    if (filters.sortBy !== 'recent') count += 1;
    return count;
  }, [filters]);

  const resetAll = () => {
    setSearchQuery('');
    setFilters(DEFAULT_RECIPE_FILTERS);
  };

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = recipes.filter((recipe) => {
      if (filters.ownerFilter !== 'all' && recipe.origin !== filters.ownerFilter)
        return false;
      if (!isWithinDateFilter(recipe.createdAt, filters.dateFilter)) return false;
      if (
        filters.categoryFilter !== 'all' &&
        recipe.category !== filters.categoryFilter
      )
        return false;
      if (
        filters.difficultyFilter !== 'all' &&
        recipe.difficulty !== filters.difficultyFilter
      )
        return false;
      if (filters.onlyFeatured && !recipe.featured) return false;

      if (filters.collectionFilter === 'none') {
        if (recipe.collectionId) return false;
      } else if (filters.collectionFilter !== 'all') {
        if (recipe.collectionId !== filters.collectionFilter) return false;
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
    });

    return [...list].sort((a, b) => {
      if (filters.sortBy === 'prep-asc') return a.prepMinutes - b.prepMinutes;
      if (filters.sortBy === 'title-asc') return a.title.localeCompare(b.title, 'es');
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [recipes, searchQuery, filters]);

  const getCollectionName = (collectionId?: string) => {
    if (!collectionId) return null;
    return collections.find((c) => c.id === collectionId)?.name ?? null;
  };

  return (
    <div className="space-y-6 pb-4">
      {onBack && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-4 py-2 rounded-[16px] bg-[#FFFFFF] border-2 border-[#E8E8E8] text-[#2D2D2D] font-semibold text-[14px] hover:border-[#FF6B4A] hover:bg-[#FFD6C9]/25 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2.2} />
            <span>Volver</span>
          </button>
        </div>
      )}

      {/* Cabecera */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFF8D6]/85 border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-[26px] sm:text-[32px] font-bold leading-[1.2] text-[#2D2D2D]">
              Todas tus recetas
            </h1>
            <span className="px-3 py-1 rounded-[10px] bg-[#FFFFFF] border border-[#E8E8E8] text-[12px] font-semibold text-[#2D2D2D] tabular-nums">
              {filteredRecipes.length}{' '}
              {filteredRecipes.length === 1 ? 'receta' : 'recetas'}
            </span>
          </div>
          <p className="text-[14px] sm:text-[15px] text-[#2D2D2D]/80">
            Explora todo tu recetario propio y las recetas que recibiste.
          </p>
        </div>
        <GreetingKitchenIllustration className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 hidden sm:block" />
      </section>

      {/* Buscador + botón que abre modal de filtros */}
      <section aria-label="Buscar y filtrar recetas" className="flex items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search
            className="w-4 h-4 text-[#747474] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, ingrediente o remitente..."
            aria-label="Buscar recetas"
            className="miga-input w-full min-h-[48px] pl-11 pr-10 text-[14px] bg-[#FFFFFF]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Borrar búsqueda"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#747474] hover:text-[#2D2D2D] absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsFilterModalOpen(true)}
          aria-label="Abrir filtros"
          className={`min-h-[48px] px-4 sm:px-5 rounded-[16px] border-2 font-semibold text-[14px] transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer ${
            activeFiltersCount > 0
              ? 'bg-[#FFD6C9]/45 border-[#FF6B4A] text-[#2D2D2D]'
              : 'bg-[#FFFFFF] border-[#E8E8E8] text-[#2D2D2D] hover:border-[#FF6B4A]'
          }`}
        >
          <Filter className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2.2} />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF6B4A] text-[#FFFFFF] text-[11px] font-bold inline-flex items-center justify-center tabular-nums">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </section>

      {/* Listado de recetas filtradas */}
      {filteredRecipes.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-[24px] bg-[#FFF8D6]/50 border border-[#E8E8E8] text-center space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-[#FF6B4A] mx-auto" strokeWidth={1.8} />
          <h2 className="font-display text-[20px] font-semibold text-[#2D2D2D]">
            No encontramos recetas con esos filtros
          </h2>
          <p className="text-[14px] text-[#747474] max-w-md mx-auto">
            Prueba ampliando la búsqueda o limpiando los filtros aplicados.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="min-h-[44px] px-5 py-2.5 rounded-[16px] border-2 border-[#FF6B4A] text-[#FF6B4A] font-semibold text-[14px] hover:bg-[#FFD6C9]/25 transition-colors inline-flex items-center gap-2 cursor-pointer mt-2"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            <span>Ver todas las recetas</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const collectionName = getCollectionName(recipe.collectionId);
            return (
              <article
                key={recipe.id}
                className="miga-card bg-[#FFFFFF] border border-[#E8E8E8] overflow-hidden flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => onSelectRecipe(recipe)}
                  className="text-left flex-1 flex flex-col cursor-pointer focus-visible:outline-none"
                >
                  <div className="w-full aspect-[4/3] bg-[#FFF8D6] overflow-hidden relative">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#747474]">
                        <UtensilsCrossed
                          className="w-8 h-8 text-[#FF6B4A]"
                          strokeWidth={2}
                        />
                        <span className="text-[12px]">Receta sin fotografía</span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {recipe.origin === 'received' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-[#E8D4F8] text-[11px] font-semibold text-[#2D2D2D] shadow-xs">
                          <User className="w-3 h-3 text-[#FF4B8A]" strokeWidth={2.2} />
                          <span>De {recipe.senderName}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-[#FFD6C9] text-[11px] font-semibold text-[#2D2D2D] shadow-xs">
                          <span>Propia</span>
                        </span>
                      )}
                    </div>

                    {recipe.featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-[8px] bg-[#FFF8D6] text-[11px] font-semibold text-[#2D2D2D] shadow-xs inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#FF6B4A]" strokeWidth={2} />
                        <span>Destacada</span>
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#747474]">
                        <span>{recipe.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="w-3 h-3" strokeWidth={2} />
                          {recipe.prepMinutes} minutos
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3 h-3" strokeWidth={2} />
                          {formatShortDate(recipe.createdAt)}
                        </span>
                      </div>

                      <h3 className="font-display text-[18px] font-semibold leading-[1.4] text-[#2D2D2D]">
                        {recipe.title}
                      </h3>

                      <p className="text-[14px] leading-[1.6] text-[#747474] line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-[8px] bg-[#D4F8E8] text-[11px] font-semibold text-[#2D2D2D]">
                          {recipe.difficulty}
                        </span>
                        {collectionName && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[8px] bg-[#FFF8D6] text-[11px] font-medium text-[#2D2D2D]">
                            <Folder className="w-3 h-3 text-[#FF6B4A]" strokeWidth={2} />
                            <span>{collectionName}</span>
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#FF4B8A]">
                        <span>Ver receta</span>
                        <ArrowRight className="w-4 h-4" strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de filtros */}
      <RecipesFilterModal
        isOpen={isFilterModalOpen}
        filters={filters}
        recipes={recipes}
        collections={collections}
        searchQuery={searchQuery}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={setFilters}
      />
    </div>
  );
}

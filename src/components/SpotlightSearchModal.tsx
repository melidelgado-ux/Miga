import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Clock,
  Folder,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { Collection, Recipe } from '../data/mockRecipes';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  recipes: Recipe[];
  collections: Collection[];
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onSelectCollection: (collectionId: string) => void;
}

export function SpotlightSearchModal({
  isOpen,
  recipes,
  collections,
  onClose,
  onSelectRecipe,
  onSelectCollection,
}: SpotlightSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const normalized = query.trim().toLowerCase();

  const matchingRecipes = useMemo(() => {
    if (!normalized) return recipes.slice(0, 4);
    return recipes.filter(
      (r) =>
        r.title.toLowerCase().includes(normalized) ||
        r.description.toLowerCase().includes(normalized) ||
        r.category.toLowerCase().includes(normalized) ||
        r.ingredients.some((ing) => ing.name.toLowerCase().includes(normalized)) ||
        (r.senderName && r.senderName.toLowerCase().includes(normalized))
    );
  }, [recipes, normalized]);

  const matchingCollections = useMemo(() => {
    if (!normalized) return collections;
    return collections.filter(
      (c) =>
        c.name.toLowerCase().includes(normalized) ||
        c.description.toLowerCase().includes(normalized)
    );
  }, [collections, normalized]);

  if (!isOpen) return null;

  const hasResults = matchingRecipes.length > 0 || matchingCollections.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscador rápido Spotlight"
      className="fixed inset-0 z-50 bg-[#2D2D2D]/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#FFFFFF] rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.14)] border-2 border-[#FF6B4A]/35 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior estilo Spotlight */}
        <div className="w-full min-w-0 px-3 sm:px-4 py-3 bg-[#FFF8D6]/55 border-b border-[#E8E8E8] flex items-center gap-2">
          <Search className="w-5 h-5 text-[#FF6B4A] shrink-0" strokeWidth={2.2} />
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar recetas, ingredientes..."
            aria-label="Buscar en Miga"
            className="flex-1 min-w-0 w-full min-h-[44px] bg-transparent text-[16px] text-[#2D2D2D] placeholder:text-[#747474] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="px-2.5 py-1 rounded-[8px] text-[12px] font-medium text-[#747474] hover:text-[#2D2D2D] hover:bg-[#FFFFFF] transition-colors cursor-pointer shrink-0"
            >
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar buscador"
            className="min-h-[44px] min-w-[44px] rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:bg-[#FFD6C9]/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Resultados flotantes */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-5">
          {!hasResults ? (
            <div className="p-6 rounded-[16px] bg-[#FFF8D6]/60 text-center space-y-1">
              <p className="text-[15px] font-semibold text-[#2D2D2D]">
                Sin resultados para «{query}»
              </p>
              <p className="text-[13px] text-[#747474]">
                Prueba buscando por otro ingrediente, plato o remitente.
              </p>
            </div>
          ) : (
            <>
              {matchingRecipes.length > 0 && (
                <div className="space-y-2">
                  <p className="px-2 text-[12px] font-semibold text-[#747474]">
                    {normalized ? 'Recetas encontradas' : 'Recetas recientes'}
                  </p>
                  <div className="space-y-1.5">
                    {matchingRecipes.map((recipe) => (
                      <button
                        key={recipe.id}
                        type="button"
                        onClick={() => {
                          onSelectRecipe(recipe);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-[16px] hover:bg-[#FFD6C9]/35 transition-colors flex items-center gap-3 text-left cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-[12px] overflow-hidden bg-[#FFF8D6] shrink-0 flex items-center justify-center">
                          {recipe.imageUrl ? (
                            <img
                              src={recipe.imageUrl}
                              alt={recipe.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UtensilsCrossed
                              className="w-5 h-5 text-[#FF6B4A]"
                              strokeWidth={2}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-[15px] font-semibold text-[#2D2D2D] truncate">
                              {recipe.title}
                            </span>
                            {recipe.origin === 'received' && (
                              <span className="px-2 py-0.5 rounded-[8px] bg-[#E8D4F8] text-[11px] font-medium text-[#2D2D2D] shrink-0">
                                De {recipe.senderName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#747474] mt-0.5">
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            <span>{recipe.prepMinutes} minutos</span>
                            <span aria-hidden="true">·</span>
                            <span>{recipe.category}</span>
                          </div>
                        </div>

                        <ArrowRight
                          className="w-4 h-4 text-[#FF6B4A] shrink-0"
                          strokeWidth={2}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchingCollections.length > 0 && (
                <div className="space-y-2">
                  <p className="px-2 text-[12px] font-semibold text-[#747474]">
                    Colecciones
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingCollections.map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => {
                          onSelectCollection(col.id);
                          onClose();
                        }}
                        className="p-3 rounded-[16px] border border-[#E8E8E8] hover:border-[#FF6B4A] transition-colors flex items-center gap-3 text-left cursor-pointer"
                        style={{ backgroundColor: `${col.pastelBg}55` }}
                      >
                        <div className="w-9 h-9 rounded-[10px] bg-[#FFFFFF] flex items-center justify-center shrink-0">
                          <Folder className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-display text-[14px] font-semibold text-[#2D2D2D] truncate">
                            {col.name}
                          </p>
                          <p className="text-[12px] text-[#747474] truncate">
                            Ir a colección
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

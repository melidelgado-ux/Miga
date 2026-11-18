import React, { useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit2,
  Heart,
  Minus,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Users,
  UtensilsCrossed,
} from 'lucide-react';
import {
  RECIPE_CATEGORIES,
  Recipe,
  RecipeCategory,
  RecipeDifficulty,
  RecipeIngredient,
  RecipeStep,
} from '../data/mockRecipes';
import {
  GreetingKitchenIllustration,
  ReceivedShareIllustration,
} from './KitchenIllustrations';
import { AddItemSheet, SheetTab } from './AddItemSheet';
import { compressRecipeImage } from '../lib/compressImage';

interface GuestInvitePageProps {
  requesterName?: string;
  onSubmitRecipe: (recipe: Recipe) => void | Promise<void>;
  onNotify?: (message: string, type?: 'success' | 'error') => void;
}

const DIFFICULTIES: RecipeDifficulty[] = ['Fácil', 'Moderado', 'Difícil'];

export function GuestInvitePage({
  requesterName = 'Miga',
  onSubmitRecipe,
  onNotify,
}: GuestInvitePageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [prepMinutes, setPrepMinutes] = useState<number>(30);
  const [servings, setServings] = useState<number>(4);
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('Fácil');
  const [category, setCategory] = useState<RecipeCategory | ''>('');
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [migaTip, setMigaTip] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [authorError, setAuthorError] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Estado del sheet para sumar/editar ingredientes y pasos
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<SheetTab>('ingrediente');
  const [editingIngredient, setEditingIngredient] = useState<RecipeIngredient | null>(
    null
  );
  const [editingStep, setEditingStep] = useState<RecipeStep | null>(null);

  // Estado de confirmación final
  const [submittedSummary, setSubmittedSummary] = useState<{
    title: string;
    author: string;
  } | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try { setImageUrl(await compressRecipeImage(file)); onNotify?.('Fotografía comprimida y añadida.', 'success'); }
    catch (error) { onNotify?.(error instanceof Error ? error.message : 'No se pudo preparar la fotografía.', 'error'); }
  };

  const openAddSheet = (tab: SheetTab) => {
    setEditingIngredient(null);
    setEditingStep(null);
    setSheetTab(tab);
    setSheetOpen(true);
  };

  const handleSaveIngredient = (item: RecipeIngredient, keepOpen: boolean) => {
    setIngredients((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [...prev, item];
    });
    onNotify?.(
      editingIngredient
        ? `Ingrediente «${item.name}» actualizado.`
        : `¡${item.name} agregado a la receta!`,
      'success'
    );
    if (!keepOpen) {
      setSheetOpen(false);
      setEditingIngredient(null);
    }
  };

  const handleSaveStep = (step: RecipeStep, keepOpen: boolean) => {
    setSteps((prev) => {
      const exists = prev.some((s) => s.id === step.id);
      return exists ? prev.map((s) => (s.id === step.id ? step : s)) : [...prev, step];
    });
    onNotify?.(
      editingStep ? 'Paso actualizado.' : 'Paso agregado a la receta.',
      'success'
    );
    if (!keepOpen) {
      setSheetOpen(false);
      setEditingStep(null);
    }
  };

  const handleSubmit = async () => {
    if (isSending) return;
    const cleanTitle = title.trim();
    const cleanAuthor = authorName.trim();

    const missingTitle = !cleanTitle;
    const missingAuthor = !cleanAuthor;

    setTitleError(missingTitle);
    setAuthorError(missingAuthor);

    if (missingTitle || missingAuthor) {
      onNotify?.(
        missingTitle && missingAuthor
          ? 'Completá el nombre de la receta y tu nombre.'
          : missingTitle
          ? 'Escribí el nombre de tu receta antes de enviarla.'
          : 'Escribí tu nombre como autor de la receta.',
        'error'
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const recipePayload: Recipe = {
      id: `received-${Date.now()}`,
      title: cleanTitle,
      description: description.trim(),
      prepMinutes,
      servings,
      difficulty,
      category: category || 'Sin categoría',
      author: cleanAuthor,
      featured: false,
      migaTip: migaTip.trim() || undefined,
      imageUrl,
      ingredients,
      steps,
      origin: 'received',
      senderName: cleanAuthor,
      isExample: false,
      createdAt: new Date().toISOString(),
    };

    setIsSending(true);
    try {
      await onSubmitRecipe(recipePayload);
      setSubmittedSummary({ title: cleanTitle, author: cleanAuthor });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      onNotify?.(error instanceof Error ? error.message : 'No se pudo enviar la receta. Intentá nuevamente.', 'error');
    } finally { setIsSending(false); }
  };

  const isTitleReady = title.trim().length > 0;
  const isAuthorReady = authorName.trim().length > 0;
  const isFormReady = isTitleReady && isAuthorReady;

  if (submittedSummary) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6">
        <section className="p-6 sm:p-8 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_8px_24px_rgba(0,0,0,0.08)] text-center space-y-5">
          <div className="flex justify-center">
            <GreetingKitchenIllustration className="w-24 h-24" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-[10px] bg-[#D4F8E8] text-[12px] font-semibold text-[#2D2D2D]">
            <CheckCircle2 className="w-4 h-4 text-[#52C41A]" strokeWidth={2.2} />
            <span>Receta enviada</span>
          </span>

          <div className="space-y-2">
            <h1
              className="font-display text-[26px] sm:text-[32px] font-bold leading-[1.2] text-[#2D2D2D]"
              style={{ textWrap: 'balance' }}
            >
              ¡Gracias, {submittedSummary.author}!
            </h1>
            <p className="text-[16px] leading-[1.6] text-[#747474] max-w-md mx-auto">
              Tu receta <strong className="text-[#2D2D2D]">«{submittedSummary.title}»</strong>{' '}
              ya quedó guardada en el recetario de{' '}
              <strong className="text-[#2D2D2D]">{requesterName}</strong>.
            </p>
          </div>

          <div className="p-4 rounded-[18px] bg-[#FFF8D6]/80 border border-[#E8E8E8] text-[14px] text-[#2D2D2D]/85 flex items-center justify-center gap-2 max-w-md mx-auto">
            <Heart className="w-4 h-4 text-[#FF4B8A] shrink-0" strokeWidth={2.2} />
            <span>
              El enlace sigue activo por 30 días para compartir más recetas.
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setTitle('');
              setDescription('');
              setAuthorName('');
              setImageUrl(undefined);
              setPrepMinutes(30);
              setServings(4);
              setDifficulty('Fácil');
              setCategory('');
              setIngredients([]);
              setSteps([]);
              setMigaTip('');
              setSubmittedSummary(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="miga-btn-primary min-h-[52px] px-6 py-3 rounded-[16px] inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" strokeWidth={2.2} />
            <span>Enviar otra receta</span>
          </button>

        </section>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Mini onboarding / Saludo inicial */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFF8D6] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row sm:items-center gap-4">
        <ReceivedShareIllustration className="w-16 h-16 shrink-0" />
        <div className="space-y-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded-[8px] bg-[#E8D4F8] text-[12px] font-semibold text-[#2D2D2D]">
            Invitación de {requesterName}
          </span>
          <h1
            className="font-display text-[24px] sm:text-[28px] font-bold leading-[1.2] text-[#2D2D2D]"
            style={{ textWrap: 'balance' }}
          >
            ¡Hola! {requesterName} quiere guardar tu receta
          </h1>
          <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[#2D2D2D]/85">
            Te pidió que compartas esta receta con ella para tenerla siempre a mano. No
            necesitás crear cuenta: solo completá los datos de acá abajo y listo.
          </p>
        </div>
      </section>

      {/* 1. Nombre de la receta, descripción breve y autor (sin sugeridos) */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.08)] space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="guest-recipe-title"
              className="text-[12px] font-semibold uppercase tracking-wider text-[#747474]"
            >
              Nombre de la receta <span className="text-[#FF6B4A]">*</span>
            </label>
            {isTitleReady && (
              <span className="text-[11px] font-semibold text-[#2D2D2D] bg-[#D4F8E8] px-2.5 py-0.5 rounded-[8px]">
                ✓ Listo
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="guest-recipe-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError && e.target.value.trim()) setTitleError(false);
              }}
              placeholder="Ej: Budín húmedo de limón"
              aria-invalid={titleError}
              className={`w-full min-h-[54px] px-4 py-3 pr-11 rounded-[16px] font-display text-[18px] font-semibold text-[#2D2D2D] placeholder:text-[#747474] transition-all focus:outline-none ${
                titleError
                  ? 'border-2 border-[#FFA500] bg-[#FFF8D6]/50'
                  : isTitleReady
                  ? 'border-2 border-[#52C41A]/60 bg-[#D4F8E8]/25'
                  : 'border-2 border-[#E8E8E8] bg-[#FFFFFF] focus:border-[#FF6B4A]'
              }`}
            />
            {isTitleReady && !titleError && (
              <CheckCircle2
                className="w-5 h-5 text-[#52C41A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={2}
              />
            )}
            {titleError && (
              <AlertCircle
                className="w-5 h-5 text-[#FFA500] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={2}
              />
            )}
          </div>
          {titleError && (
            <p className="mt-1.5 text-[12px] font-medium text-[#2D2D2D] flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFA500]" />
              Por favor escribí el nombre de la receta.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="guest-recipe-desc"
            className="block text-[12px] font-semibold uppercase tracking-wider text-[#747474] mb-2"
          >
            Descripción breve (opcional)
          </label>
          <textarea
            id="guest-recipe-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contá brevemente qué hace especial a este plato..."
            className="w-full px-4 py-3 rounded-[16px] bg-[#FFF8D6]/45 border border-[#E8E8E8] text-[14px] leading-[1.6] text-[#2D2D2D] placeholder:text-[#747474] focus:outline-none focus:border-[#FF6B4A] resize-none"
          />
        </div>

        <div className="pt-3 border-t border-[#E8E8E8]">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="guest-recipe-author"
              className="text-[12px] font-semibold uppercase tracking-wider text-[#747474]"
            >
              Tu nombre (autor de la receta) <span className="text-[#FF6B4A]">*</span>
            </label>
            {isAuthorReady && (
              <span className="text-[11px] font-semibold text-[#2D2D2D] bg-[#D4F8E8] px-2.5 py-0.5 rounded-[8px]">
                ✓ Listo
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="guest-recipe-author"
              type="text"
              value={authorName}
              onChange={(e) => {
                setAuthorName(e.target.value);
                if (authorError && e.target.value.trim()) setAuthorError(false);
              }}
              placeholder="Ej: Marta, Lucas, Tía Rosa..."
              aria-invalid={authorError}
              className={`w-full min-h-[48px] px-4 py-3 pr-11 rounded-[16px] text-[14px] font-medium text-[#2D2D2D] placeholder:text-[#747474] transition-all focus:outline-none ${
                authorError
                  ? 'border-2 border-[#FFA500] bg-[#FFF8D6]/50'
                  : isAuthorReady
                  ? 'border-2 border-[#52C41A]/60 bg-[#D4F8E8]/25'
                  : 'border-2 border-[#E8E8E8] bg-[#FFFFFF] focus:border-[#FF6B4A]'
              }`}
            />
            {isAuthorReady && !authorError && (
              <CheckCircle2
                className="w-5 h-5 text-[#52C41A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={2}
              />
            )}
            {authorError && (
              <AlertCircle
                className="w-5 h-5 text-[#FFA500] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={2}
              />
            )}
          </div>
          {authorError && (
            <p className="mt-1.5 text-[12px] font-medium text-[#2D2D2D] flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#FFA500]" />
              Necesitamos tu nombre para saber quién la compartió.
            </p>
          )}
        </div>
      </section>

      {/* 2. Subir foto opcional (sin botón de destacar) */}
      <section className="relative rounded-[24px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] bg-[#FFF8D6] border border-[#E8E8E8]">
        <div className="relative w-full h-56 sm:h-64 flex items-center justify-center">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={title || 'Foto de la receta'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2D2D]/65 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center px-6">
              <div className="w-14 h-14 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
                <UtensilsCrossed className="w-7 h-7 text-[#FF6B4A]" strokeWidth={2} />
              </div>
              <p className="text-[14px] font-medium text-[#2D2D2D]">
                Sumá una fotografía de tu plato (opcional)
              </p>
            </div>
          )}

          <label className="absolute bottom-3 left-3 min-h-[44px] px-4 py-2 rounded-full bg-[#FF4B8A] text-[#FFFFFF] text-[13px] font-semibold shadow-sm flex items-center gap-2 cursor-pointer hover:opacity-95 active:scale-95 transition-all">
            <Camera className="w-4 h-4" strokeWidth={2} />
            <span>{imageUrl ? 'Cambiar foto' : 'Subir foto'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="sr-only"
            />
          </label>
        </div>
      </section>

      {/* 3. Métricas de cocina */}
      <section className="grid grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 rounded-[24px] bg-[#FFF8D6] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#2D2D2D]">
            <Clock className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2} />
            <span>Tiempo total</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setPrepMinutes((m) => Math.max(5, m - 5))}
              aria-label="Disminuir 5 minutos"
              className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#2D2D2D] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.08)] active:scale-90 transition-transform cursor-pointer"
            >
              <Minus className="w-4 h-4" strokeWidth={2.2} />
            </button>
            <div className="text-center tabular-nums">
              <span className="font-display text-[20px] font-bold text-[#2D2D2D]">
                {prepMinutes}
              </span>
              <span className="text-[12px] text-[#747474] ml-1">min</span>
            </div>
            <button
              type="button"
              onClick={() => setPrepMinutes((m) => m + 5)}
              aria-label="Aumentar 5 minutos"
              className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#2D2D2D] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.08)] active:scale-90 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[24px] bg-[#D4F8E8] border border-[#52C41A]/30 shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#2D2D2D]">
            <Users className="w-4 h-4 text-[#52C41A]" strokeWidth={2} />
            <span>Porciones</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              aria-label="Disminuir porciones"
              className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#2D2D2D] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.08)] active:scale-90 transition-transform cursor-pointer"
            >
              <Minus className="w-4 h-4" strokeWidth={2.2} />
            </button>
            <div className="text-center tabular-nums">
              <span className="font-display text-[20px] font-bold text-[#2D2D2D]">
                {servings}
              </span>
              <span className="text-[12px] text-[#747474] ml-1">personas</span>
            </div>
            <button
              type="button"
              onClick={() => setServings((s) => s + 1)}
              aria-label="Aumentar porciones"
              className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#2D2D2D] flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.08)] active:scale-90 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Dificultad */}
      <section className="space-y-2.5">
        <span className="block font-display text-[18px] font-semibold text-[#2D2D2D]">
          Dificultad
        </span>
        <div className="grid grid-cols-3 gap-3">
          {DIFFICULTIES.map((level) => {
            const active = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`min-h-[52px] py-3 px-3 rounded-[16px] text-[14px] font-semibold transition-all cursor-pointer border-2 ${
                  active
                    ? 'bg-[#D4F8E8] border-[#52C41A]/50 text-[#2D2D2D] shadow-[0_2px_4px_rgba(0,0,0,0.06)]'
                    : 'bg-[#FFFFFF] border-[#E8E8E8] text-[#747474] hover:border-[#FF6B4A]/40'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Categoría (opcional, sin Colección) */}
      <section>
        <label
          htmlFor="guest-recipe-category"
          className="block font-display text-[18px] font-semibold text-[#2D2D2D] mb-2"
        >
          Categoría (opcional)
        </label>
        <div className="relative">
          <select
            id="guest-recipe-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as RecipeCategory | '')}
            className="w-full min-h-[52px] px-4 pr-10 rounded-[16px] bg-[#E8D4F8]/60 border-2 border-[#FF4B8A]/30 font-semibold text-[14px] text-[#2D2D2D] appearance-none focus:outline-none focus:border-[#FF4B8A] cursor-pointer"
          >
            <option value="">Elegir categoría (opcional)</option>
            {RECIPE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 text-[#FF4B8A] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </section>

      {/* 6. Ingredientes */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.06)] space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            <h2 className="font-display text-[18px] font-semibold text-[#2D2D2D]">
              Ingredientes
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10px] bg-[#FFF8D6] border border-[#E8E8E8] text-[12px] font-medium text-[#2D2D2D] tabular-nums">
              {ingredients.length}{' '}
              {ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openAddSheet('ingrediente')}
            aria-label="Añadir ingrediente"
            className="w-11 h-11 rounded-full bg-[#FFD6C9]/70 text-[#FF6B4A] hover:bg-[#FF6B4A] hover:text-[#FFFFFF] active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {ingredients.length === 0 ? (
          <div className="py-5 px-4 rounded-[16px] bg-[#FFF8D6]/35 border border-[#E8E8E8] text-center">
            <p className="text-[13px] text-[#747474]">
              Todavía no sumaste ingredientes. Toca <strong>+</strong> para agregar.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {ingredients.map((ing) => (
              <div
                key={ing.id}
                className="px-3.5 py-3 rounded-[16px] bg-[#FFFFFF] border border-[#E8E8E8] hover:border-[#FF6B4A]/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[#2D2D2D] truncate">
                    {ing.name}
                  </p>
                  {ing.note && (
                    <p className="text-[12px] text-[#747474] truncate mt-0.5">
                      {ing.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-1 rounded-[10px] bg-[#FFF8D6]/75 text-[12px] font-semibold text-[#2D2D2D] tabular-nums">
                    {ing.quantity} {ing.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStep(null);
                      setEditingIngredient(ing);
                      setSheetTab('ingrediente');
                      setSheetOpen(true);
                    }}
                    aria-label={`Editar ${ing.name}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#FF4B8A] hover:bg-[#FFD6C9]/35 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setIngredients((prev) => prev.filter((i) => i.id !== ing.id))
                    }
                    aria-label={`Quitar ${ing.name}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[#747474] hover:bg-[#E8E8E8]/60 hover:text-[#2D2D2D] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Paso a paso */}
      <section className="p-5 sm:p-6 rounded-[24px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.06)] space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
            <h2 className="font-display text-[18px] font-semibold text-[#2D2D2D]">
              Paso a paso
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[10px] bg-[#E8D4F8]/70 border border-[#E8E8E8] text-[12px] font-medium text-[#2D2D2D] tabular-nums">
              {steps.length} {steps.length === 1 ? 'paso' : 'pasos'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openAddSheet('paso')}
            aria-label="Añadir paso"
            className="w-11 h-11 rounded-full bg-[#E8D4F8]/80 text-[#FF4B8A] hover:bg-[#FF4B8A] hover:text-[#FFFFFF] active:scale-95 transition-all flex items-center justify-center cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {steps.length === 0 ? (
          <div className="py-5 px-4 rounded-[16px] bg-[#FFF8D6]/35 border border-[#E8E8E8] text-center">
            <p className="text-[13px] text-[#747474]">
              Todavía no sumaste pasos. Toca <strong>+</strong> para escribir el primero.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="p-4 rounded-[18px] bg-[#FFFFFF] border border-[#E8E8E8] hover:border-[#FF4B8A]/35 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-[#E8D4F8] text-[#FF4B8A] text-[12px] font-bold flex items-center justify-center shrink-0 tabular-nums">
                      {index + 1}
                    </span>
                    <h3 className="font-display text-[15px] font-semibold text-[#2D2D2D] truncate">
                      {step.title || `Paso ${index + 1}`}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingIngredient(null);
                        setEditingStep(step);
                        setSheetTab('paso');
                        setSheetOpen(true);
                      }}
                      aria-label={`Editar paso ${index + 1}`}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[#FF4B8A] hover:bg-[#E8D4F8]/45 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSteps((prev) => prev.filter((s) => s.id !== step.id))
                      }
                      aria-label={`Quitar paso ${index + 1}`}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[#747474] hover:bg-[#E8E8E8]/60 hover:text-[#2D2D2D] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                <p className="text-[14px] leading-[1.55] text-[#2D2D2D]/85 pl-9">
                  {step.instruction}
                </p>

                {step.tip && (
                  <p className="ml-9 px-3 py-1.5 rounded-[10px] bg-[#FFF8D6]/80 text-[12px] text-[#2D2D2D]">
                    <strong>Tip:</strong> {step.tip}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 8. Miga Tip (opcional) */}
      <section className="p-4 sm:p-5 rounded-[24px] bg-[#E8D4F8]/60 border border-[#FF4B8A]/20 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FF4B8A] text-[#FFFFFF] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" strokeWidth={2} />
        </div>
        <div className="flex-1 space-y-1.5">
          <label
            htmlFor="guest-recipe-tip"
            className="block text-[12px] font-bold uppercase tracking-wider text-[#2D2D2D]"
          >
            Tu secretito o consejo (opcional)
          </label>
          <input
            id="guest-recipe-tip"
            type="text"
            value={migaTip}
            onChange={(e) => setMigaTip(e.target.value)}
            placeholder="Un tip para que quede igual de rica que la tuya..."
            className="miga-input w-full min-h-[44px] text-[13px] bg-[#FFFFFF]"
          />
        </div>
      </section>

      {/* 9. Estado de validación y CTA Enviar receta */}
      <section className="space-y-3 pt-1">
        <div
          className={`p-4 rounded-[20px] border flex items-center justify-between gap-3 ${
            isFormReady
              ? 'bg-[#D4F8E8]/65 border-[#52C41A]/35'
              : 'bg-[#FFF8D6] border-[#FFA500]/40'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
              {isFormReady ? (
                <CheckCircle2 className="w-5 h-5 text-[#52C41A]" strokeWidth={2.2} />
              ) : (
                <AlertCircle className="w-5 h-5 text-[#FFA500]" strokeWidth={2.2} />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display text-[14px] font-bold text-[#2D2D2D]">
                {isFormReady
                  ? `¡Todo listo para enviársela a ${requesterName}!`
                  : 'Completá los datos para enviar tu receta'}
              </p>
              <p className="text-[12px] text-[#747474] truncate">
                {isFormReady
                  ? 'Solo tocá el botón de abajo para guardar tu receta.'
                  : 'Completá el nombre de la receta y tu nombre para enviarla.'}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="miga-btn-primary w-full min-h-[56px] rounded-full sm:rounded-[16px] flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(255,107,74,0.3)] cursor-pointer"
        >
          <Send className="w-4 h-4" strokeWidth={2.2} />
          <span>Enviar receta a {requesterName}</span>
        </button>
      </section>

      {/* Bottom Sheet para sumar/editar Ingredientes y Pasos */}
      <AddItemSheet
        isOpen={sheetOpen}
        initialTab={sheetTab}
        editingIngredient={editingIngredient}
        editingStep={editingStep}
        nextStepNumber={steps.length + 1}
        onClose={() => {
          setSheetOpen(false);
          setEditingIngredient(null);
          setEditingStep(null);
        }}
        onSaveIngredient={handleSaveIngredient}
        onSaveStep={handleSaveStep}
        onNotify={onNotify}
      />
    </div>
  );
}

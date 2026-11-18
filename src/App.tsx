import React, { useEffect, useMemo, useRef, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Edit2,
  Folder,
  Home,
  Plus,
  Search,
  User,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import {
  Collection,
  Recipe,
} from './data/mockRecipes';
import {
  CreateRecipeIllustration,
  GreetingKitchenIllustration,
  MigaBrandMark,
  ReceivedShareIllustration,
} from './components/KitchenIllustrations';
import { CreateRecipePage } from './components/CreateRecipePage';
import { RecipeDetailPage } from './components/RecipeDetailPage';
import { AddChoiceModal } from './components/AddChoiceModal';
import { SpotlightSearchModal } from './components/SpotlightSearchModal';
import { ProfileModal } from './components/ProfileModal';
import { CreateCollectionModal } from './components/CreateCollectionModal';
import { AllRecipesPage } from './components/AllRecipesPage';
import { GuestInvitePage } from './components/GuestInvitePage';
import { LoginPage } from './components/LoginPage';
import { auth as firebaseAuth, signOutFromMiga } from './firebase';
import {
  createRecipeInvite, deleteCollection, deleteRecipe, getRecipeInvite,
  saveCollection, saveRecipe, setRecipeCollection, submitInvitedRecipe,
  subscribeUserCollections, subscribeUserRecipes,
} from './data/firestore';

type MainTab = 'inicio' | 'recetas' | 'colecciones';

export default function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const lastAuthUid = useRef<string | null | undefined>(undefined);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return window.localStorage.getItem('miga-theme') === 'dark' ? 'dark' : 'light';
  });
  const [activeTab, setActiveTab] = useState<MainTab>('inicio');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Vistas de página completa
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [guestInvite, setGuestInvite] = useState<{
    active: boolean;
    requesterName: string;
    ownerUid: string;
    inviteId: string;
  }>(() => {
    if (typeof window === 'undefined') {
      return { active: false, requesterName: '', ownerUid: '', inviteId: '' };
    }
    const match = window.location.pathname.match(/^\/invitacion\/([^/]+)\/([^/]+)\/?$/);
    return { active: window.location.pathname.startsWith('/invitacion'), requesterName: '', ownerUid: match?.[1] ?? '', inviteId: match?.[2] ?? '' };
  });
  const [inviteStatus, setInviteStatus] = useState<'loading' | 'ready' | 'invalid' | 'expired'>('loading');

  // Modales auxiliares
  const [isAddChoiceOpen, setIsAddChoiceOpen] = useState(false);
  const [addChoiceInitialStep, setAddChoiceInitialStep] = useState<'choice' | 'request-link'>('choice');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Toast flotante compacto (3 s auto-cierre)
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const openRequestLinkDialog = () => {
    setAddChoiceInitialStep('request-link');
    setIsAddChoiceOpen(true);
  };

  useEffect(() => {
    if (!firebaseAuth) {
      setIsAuthReady(true);
      return;
    }

    return onAuthStateChanged(firebaseAuth, (user) => {
      const nextUid = user?.uid ?? null;
      if (lastAuthUid.current !== nextUid) {
        setRecipes([]);
        setCollections([]);
        setSelectedCollectionId(null);
        setSelectedRecipeId(null);
      }
      lastAuthUid.current = nextUid;
      setAuthenticatedUser(user);
      setIsAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!guestInvite.active) return;
    let cancelled = false;
    getRecipeInvite(guestInvite.ownerUid, guestInvite.inviteId).then((invite) => {
      if (cancelled) return;
      if (!invite) { setInviteStatus('invalid'); return; }
      setGuestInvite((current) => ({ ...current, requesterName: invite.ownerName }));
      if (invite.expiresAt.getTime() <= Date.now()) setInviteStatus('expired');
      else setInviteStatus('ready');
    }).catch(() => { if (!cancelled) setInviteStatus('invalid'); });
    return () => { cancelled = true; };
  }, [guestInvite.active, guestInvite.ownerUid, guestInvite.inviteId]);

  useEffect(() => {
    if (!authenticatedUser) return;
    const onError = () => setFeedback({ message: 'No pudimos cargar tus datos. Revisá tu conexión y las reglas de Firestore.', type: 'error' });
    const stopRecipes = subscribeUserRecipes(authenticatedUser.uid, setRecipes, onError);
    const stopCollections = subscribeUserCollections(authenticatedUser.uid, setCollections, onError);
    return () => { stopRecipes(); stopCollections(); };
  }, [authenticatedUser]);

  useEffect(() => {
    if (!feedback || feedback.type === 'error') return;
    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const addedRecipes = useMemo(() => {
    return recipes.filter((r) => r.origin === 'own');
  }, [recipes]);

  const receivedRecipes = useMemo(() => {
    return recipes.filter((r) => r.origin === 'received');
  }, [recipes]);

  const selectedCollection =
    collections.find((c) => c.id === selectedCollectionId) ?? null;
  const selectedRecipe = recipes.find((r) => r.id === selectedRecipeId) ?? null;

  const recipesInSelectedCollection = useMemo(() => {
    if (!selectedCollectionId) return [];
    return recipes.filter((r) => r.collectionId === selectedCollectionId);
  }, [recipes, selectedCollectionId]);

  const isSubPage = Boolean(
    isCreatingRecipe ||
      editingRecipe ||
      selectedRecipe ||
      selectedCollection ||
      guestInvite.active
  );

  const openCreateRecipePage = (recipeToEdit: Recipe | null = null) => {
    setIsAddChoiceOpen(false);
    setIsSpotlightOpen(false);
    setIsProfileOpen(false);
    setSelectedRecipeId(null);
    setEditingRecipe(recipeToEdit);
    setIsCreatingRecipe(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveRecipe = async (savedRecipe: Recipe) => {
    const isEditing = Boolean(editingRecipe);
    if (!authenticatedUser) return;
    try { await saveRecipe(authenticatedUser.uid, savedRecipe, !isEditing); }
    catch (error) {
      console.error('No se pudo guardar la receta en Firestore:', error);
      const code =
        typeof error === 'object' && error !== null && 'code' in error &&
        typeof error.code === 'string'
          ? error.code
          : '';
      setFeedback({
        message: (code === 'recipe-validation' || code === 'recipe-not-found' ||
          code === 'recipe-write-permission-denied' || code.startsWith('recipe-read-')) &&
          error instanceof Error
          ? error.message
          : code
          ? `Error de Firebase: ${code}. No se pudo guardar la receta.`
          : 'No se pudo guardar la receta. Revisá la conexión e intentá de nuevo.',
        type: 'error',
      });
      return;
    }
    setFeedback({
      message: isEditing
        ? `«${savedRecipe.title}» actualizada.`
        : `«${savedRecipe.title}» guardada en tu recetario.`,
      type: 'success',
    });
    setIsCreatingRecipe(false);
    setEditingRecipe(null);
    setSelectedRecipeId(savedRecipe.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const deletedRecipe = recipes.find((recipe) => recipe.id === recipeId);
    if (!authenticatedUser) return;
    try { await deleteRecipe(authenticatedUser.uid, recipeId); }
    catch { setFeedback({ message: 'No se pudo eliminar la receta.', type: 'error' }); return; }
    setIsCreatingRecipe(false);
    setEditingRecipe(null);
    setSelectedRecipeId(null);
    setFeedback({
      message: deletedRecipe
        ? `«${deletedRecipe.title}» eliminada del recetario.`
        : 'Receta eliminada del recetario.',
      type: 'success',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    if (!firebaseAuth) return;
    try {
      await signOutFromMiga();
      setIsProfileOpen(false);
    } catch {
      setFeedback({
        message: 'No pudimos cerrar la sesión. Intentá otra vez.',
        type: 'error',
      });
    }
  };

  const handleAssignCollection = async (recipeId: string, collectionId: string) => {
    if (!authenticatedUser) return;
    try { await setRecipeCollection(authenticatedUser.uid, recipeId, collectionId); }
    catch { setFeedback({ message: 'No se pudo actualizar la colección.', type: 'error' }); return; }
    const colName = collections.find((c) => c.id === collectionId)?.name;
    setFeedback({
      message: colName
        ? `Guardada en «${colName}».`
        : 'Quitada de la colección.',
      type: 'success',
    });
  };

  const handleCreateCollection = async (newCol: Collection) => {
    if (!authenticatedUser) return;
    try { await saveCollection(authenticatedUser.uid, newCol, true); }
    catch { setFeedback({ message: 'No se pudo crear la colección.', type: 'error' }); return; }
    setFeedback({
      message: `Colección «${newCol.name}» creada.`,
      type: 'success',
    });
  };

  const handleUpdateCollection = async (updatedCollection: Collection) => {
    if (!authenticatedUser) return;
    try { await saveCollection(authenticatedUser.uid, updatedCollection, false); }
    catch { setFeedback({ message: 'No se pudo actualizar la colección.', type: 'error' }); return; }
    setFeedback({
      message: `Colección «${updatedCollection.name}» actualizada.`,
      type: 'success',
    });
  };

  const handleDeleteCollection = async (collectionId: string) => {
    const deletedCollection = collections.find((collection) => collection.id === collectionId);
    if (!authenticatedUser) return;
    try { await deleteCollection(authenticatedUser.uid, collectionId, recipes.filter((r) => r.collectionId === collectionId).map((r) => r.id)); }
    catch { setFeedback({ message: 'No se pudo eliminar la colección.', type: 'error' }); return; }
    if (selectedCollectionId === collectionId) setSelectedCollectionId(null);
    setFeedback({
      message: deletedCollection
        ? `Colección «${deletedCollection.name}» eliminada. Sus recetas siguen en tu biblioteca.`
        : 'Colección eliminada. Sus recetas siguen en tu biblioteca.',
      type: 'success',
    });
  };

  const isGuestInviteRoute = guestInvite.active;
  if (isGuestInviteRoute) {
    // El formulario de invitación sigue disponible para personas sin cuenta.
  } else if (!isAuthReady || !authenticatedUser) {
    return <LoginPage isAuthReady={isAuthReady} />;
  }

  const userFirstName =
    authenticatedUser?.displayName?.trim().split(/\s+/)[0] ||
    authenticatedUser?.email?.split('@')[0] ||
    'Miga';

  return (
    <div data-theme={theme} className="min-h-screen bg-[#FFFFFF] text-[#2D2D2D] flex flex-col">
      {/* Header limpio y compacto (<= 52px) */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E8E8E8]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-8 h-[52px] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              if (guestInvite.active) return;
              setGuestInvite((prev) => ({ ...prev, active: false }));
              setIsCreatingRecipe(false);
              setEditingRecipe(null);
              setSelectedRecipeId(null);
              setSelectedCollectionId(null);
              setActiveTab('inicio');
            }}
            className={`flex items-center gap-2.5 ${
              guestInvite.active
                ? 'cursor-default'
                : 'cursor-pointer'
            }`}
          >
            <MigaBrandMark className="w-8 h-8" />
            <span className="font-display text-[20px] font-bold tracking-tight text-[#FF6B4A]">
              Miga
            </span>
          </button>

          {!guestInvite.active && (
            <div className="flex items-center gap-2">
              {!isCreatingRecipe && (
                <button
                  type="button"
                  onClick={() => openCreateRecipePage(null)}
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[16px] border-2 border-[#FF6B4A] text-[#FF6B4A] font-semibold text-[14px] hover:bg-[#FFD6C9]/30 transition-colors cursor-pointer mr-1"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  <span>Crear receta</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsSpotlightOpen(true)}
                aria-label="Abrir buscador rápido"
                className="min-h-[44px] min-w-[44px] rounded-full bg-[#FFFFFF] border border-[#E8E8E8] text-[#2D2D2D] flex items-center justify-center hover:border-[#FF6B4A] hover:bg-[#FFD6C9]/25 transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>

              <button
                type="button"
                onClick={() => setIsProfileOpen(true)}
                aria-label={`Abrir perfil de ${userFirstName}`}
                className="min-h-[44px] min-w-[44px] rounded-full bg-[#FFD6C9] border-2 border-[#FF6B4A]/60 text-[#2D2D2D] flex items-center justify-center hover:border-[#FF6B4A] transition-colors cursor-pointer"
              >
                <User className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Contenido principal responsive */}
      <main
        className={`flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-8 pt-6 ${
          isSubPage ? 'pb-12' : 'pb-28'
        }`}
      >
        {/* Toast flotante compacto (3 s auto-cierre, sin azul ni rojo) */}
        {feedback && (
          <aside
            role="status"
            aria-live="polite"
            className={`fixed top-[62px] left-1/2 -translate-x-1/2 z-[60] w-max max-w-[90vw] sm:max-w-md px-3.5 py-2 rounded-[16px] flex items-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border ${
              feedback.type === 'error'
                ? 'bg-[#FFF8D6] border-[#FFA500]/50'
                : 'bg-[#D4F8E8] border-[#52C41A]/35'
            }`}
          >
            {feedback.type === 'error' ? (
              <AlertCircle
                className="w-4 h-4 text-[#FFA500] shrink-0"
                strokeWidth={2.2}
              />
            ) : (
              <CheckCircle2
                className="w-4 h-4 text-[#52C41A] shrink-0"
                strokeWidth={2.2}
              />
            )}
            <p className="min-w-0 flex-1 text-[12px] font-medium text-[#2D2D2D] whitespace-normal break-words">
              {feedback.message}
            </p>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              aria-label="Cerrar aviso"
              className="min-h-[28px] min-w-[28px] rounded-full flex items-center justify-center text-[#2D2D2D]/75 hover:bg-[#FFFFFF]/60 transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </aside>
        )}

        {guestInvite.active ? (
          /* Formulario de invitado que recibió el link para compartir su receta */
          inviteStatus === 'ready' ? <GuestInvitePage
            requesterName={guestInvite.requesterName}
            onSubmitRecipe={async (sharedRecipe) => {
              await submitInvitedRecipe(guestInvite.ownerUid, guestInvite.inviteId, sharedRecipe);
              setFeedback({
                message: `Receta «${sharedRecipe.title}» enviada a ${guestInvite.requesterName}.`,
                type: 'success',
              });
            }}
            onNotify={(message, type = 'success') => setFeedback({ message, type })}
          /> : <section className="max-w-xl mx-auto p-8 my-10 rounded-[24px] bg-[#FFF8D6] border border-[#F4EBC2] text-center space-y-3">
            <h1 className="font-display text-[24px] font-bold">{inviteStatus === 'loading' ? 'Revisando el enlace…' : inviteStatus === 'expired' ? 'Este enlace venció' : 'No encontramos este enlace'}</h1>
            <p className="text-[#747474]">{inviteStatus === 'loading' ? 'Un momento, por favor.' : 'Pedile a quien te invitó que genere un enlace nuevo.'}</p>
          </section>
        ) : isCreatingRecipe ? (
          /* Página completa de Creación / Edición de Receta */
          <CreateRecipePage
            collections={collections}
            initialRecipe={editingRecipe}
            onCancel={() => {
              const prevEditedId = editingRecipe?.id ?? null;
              setIsCreatingRecipe(false);
              setEditingRecipe(null);
              if (prevEditedId) setSelectedRecipeId(prevEditedId);
            }}
            onSave={handleSaveRecipe}
            onDelete={handleDeleteRecipe}
            onNotify={(message, type = 'success') => setFeedback({ message, type })}
          />
        ) : selectedRecipe ? (
          /* Página completa de Vista de Receta */
          <RecipeDetailPage
            recipe={selectedRecipe}
            collections={collections}
            onBack={() => setSelectedRecipeId(null)}
            onEdit={(recipeToEdit) => openCreateRecipePage(recipeToEdit)}
            onAssignCollection={handleAssignCollection}
          />
        ) : activeTab === 'recetas' && !selectedCollection ? (
          /* Pestaña Recetas: listado completo con buscador y modal de filtros */
          <AllRecipesPage
            recipes={recipes}
            collections={collections}
            onSelectRecipe={(recipe) => {
              setSelectedRecipeId(recipe.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : activeTab === 'inicio' ? (
          <div className="space-y-8 lg:space-y-10">
            {/* Bienvenida y accesos rápidos */}
            <section
              aria-label="Bienvenida y creación rápida de receta"
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
            >
              <div className="lg:col-span-12 min-h-[248px] p-6 sm:p-8 rounded-[28px] bg-[#FFF8D6] border border-[#F4EBC2] shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-between gap-4 overflow-hidden relative">
                <div className="space-y-3 relative z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF]/75 text-[12px] font-semibold tracking-wide text-[#747474]">
                    <span className="w-2 h-2 rounded-full bg-[#FF6B4A]" />
                    TU RECETARIO
                  </span>
                  <h1
                    className="font-display text-[32px] sm:text-[40px] font-bold leading-[1.12] tracking-tight text-[#2D2D2D]"
                    style={{ textWrap: 'balance' }}
                  >
                    ¡Hola, {userFirstName}!
                  </h1>
                  <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#2D2D2D]/80 max-w-md">
                    Un lugar para tus clásicos de siempre y esos platos ricos que te comparten.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-3 py-1.5 rounded-full bg-[#FFFFFF]/75 text-[12px] font-medium text-[#2D2D2D]">
                      {addedRecipes.length} {addedRecipes.length === 1 ? 'receta propia' : 'recetas propias'}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-[#FFFFFF]/75 text-[12px] font-medium text-[#2D2D2D]">
                      {receivedRecipes.length} {receivedRecipes.length === 1 ? 'recibida' : 'recibidas'}
                    </span>
                  </div>
                </div>
                <GreetingKitchenIllustration className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 self-end" />
              </div>

              {/* Acceso directo - add recetas: se conserva identificado, oculto temporalmente. */}
              <div
                id="acceso-directo-add-recetas"
                hidden
                className="lg:col-span-5 p-6 sm:p-7 rounded-[28px] bg-[#FFD6C9] border border-[#F6C4B4] shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-5"
              >
                <div className="space-y-1">
                  <span className="text-[12px] font-semibold tracking-wide text-[#747474]">¿QUÉ COCINAMOS?</span>
                  <h2 className="font-display text-[22px] sm:text-[26px] font-semibold leading-[1.2] text-[#2D2D2D]">
                    Sumá algo rico
                  </h2>
                  <p className="text-[14px] leading-[1.6] text-[#2D2D2D]/80">
                    Guardá una receta o pedile una a alguien querido.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => openCreateRecipePage(null)}
                    className="miga-btn-primary w-full min-h-[52px] px-4 py-3 rounded-full flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(255,107,74,0.22)] cursor-pointer"
                  >
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                    <span>Crear receta</span>
                  </button>
                  <button
                    type="button"
                    onClick={openRequestLinkDialog}
                    className="w-full min-h-[52px] px-4 py-3 rounded-full border-2 border-[#FF4B8A] bg-[#FF4B8A] text-[#FFFFFF] font-semibold text-[14px] hover:brightness-95 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Pedir receta
                  </button>
                </div>
              </div>
            </section>

            {/* 3. Últimas recetas añadidas */}
            <section aria-labelledby="section-added-heading" className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2
                    id="section-added-heading"
                    className="font-display text-[22px] sm:text-[24px] font-semibold leading-[1.3] text-[#2D2D2D]"
                  >
                    Últimas recetas añadidas
                  </h2>
                  <p className="text-[14px] text-[#747474] mt-1">
                    {addedRecipes.length === 0
                      ? 'Cuando sumes una receta propia, aparecerá acá.'
                      : 'Tus preparaciones para volver a hacerlas cuando quieras.'}
                  </p>
                </div>
              </div>

              {addedRecipes.length === 0 ? (
                <div className="rounded-[24px] bg-[#FFD6C9]/55 border border-[#F6C4B4] p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                  <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[20px] bg-[#FFFFFF]/75 flex items-center justify-center shrink-0">
                    <CreateRecipeIllustration className="w-14 h-14 sm:w-16 sm:h-16" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="font-display text-[18px] sm:text-[20px] font-semibold leading-[1.3] text-[#2D2D2D]">
                      Tu recetario empieza acá
                    </h3>
                    <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[#2D2D2D]/80 max-w-2xl">
                      Todavía no agregaste recetas propias. Guardá ese plato que ya te sale de memoria para volver a prepararlo cuando quieras.
                    </p>
                  </div>
                  <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => openCreateRecipePage(null)}
                      className="miga-btn-primary w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-full flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" strokeWidth={2.5} />
                      <span>Crear receta</span>
                    </button>
                    <button
                      type="button"
                      onClick={openRequestLinkDialog}
                      className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-full bg-[#FF4B8A] text-[#FFFFFF] font-semibold text-[14px] hover:brightness-95 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Pedir receta
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {addedRecipes.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="miga-card bg-[#FFFFFF] border border-[#E8E8E8] overflow-hidden flex flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecipeId(recipe.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
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
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[12px] text-[#747474]">
                            <span>{recipe.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{recipe.prepMinutes} minutos</span>
                            {recipe.isExample && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>Receta de ejemplo</span>
                              </>
                            )}
                          </div>

                          <h3 className="font-display text-[18px] font-semibold leading-[1.4] text-[#2D2D2D]">
                            {recipe.title}
                          </h3>

                          <p className="text-[14px] leading-[1.6] text-[#747474] line-clamp-2">
                            {recipe.description}
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#FF4B8A] pt-1">
                          <span>Ver receta</span>
                          <ArrowRight className="w-4 h-4" strokeWidth={2} />
                        </span>
                      </div>
                    </button>
                  </article>
                  ))}
                </div>
              )}

              {addedRecipes.length > 0 && (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('recetas');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-[16px] border-2 border-[#FF6B4A] bg-transparent text-[#FF6B4A] font-semibold text-[15px] hover:bg-[#FFD6C9]/25 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ver todas</span>
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                </div>
              )}
            </section>

            {/* 4. Últimas recetas recibidas */}
            <section
              aria-labelledby="section-received-heading"
              className="p-6 rounded-[24px] bg-[#E8D4F8]/45 border border-[#E8D4F8] space-y-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <ReceivedShareIllustration className="w-12 h-12 shrink-0" />
                  <div>
                    <h2
                      id="section-received-heading"
                      className="font-display text-[22px] sm:text-[24px] font-semibold leading-[1.3] text-[#2D2D2D]"
                    >
                      Últimas recetas recibidas
                    </h2>
                    <p className="text-[14px] text-[#747474]">
                      Recetas enviadas por familiares y amigos, tengan o no Miga.
                    </p>
                  </div>
                </div>
              </div>

              {receivedRecipes.length === 0 ? (
                <div className="rounded-[20px] border border-dashed border-[#CBB4DB] bg-[#FFFFFF]/70 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div>
                    <h3 className="font-display text-[18px] font-semibold text-[#2D2D2D]">
                      Las recetas compartidas empiezan acá
                    </h3>
                    <p className="text-[14px] leading-[1.6] text-[#747474] mt-1 max-w-lg">
                      Invitá a alguien a enviarte su receta favorita y guardala en tu biblioteca.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={openRequestLinkDialog}
                    className="shrink-0 min-h-[48px] px-5 py-3 rounded-full bg-[#FF4B8A] text-[#FFFFFF] font-semibold text-[14px] hover:brightness-95 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Pedir una receta
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {receivedRecipes.slice(0, 2).map((recipe) => (
                  <article
                    key={recipe.id}
                    className="miga-card bg-[#FFFFFF] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecipeId(recipe.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-4 sm:p-5 text-left flex flex-col sm:flex-row gap-4 items-stretch sm:items-center cursor-pointer focus-visible:outline-none"
                    >
                      <div className="w-full sm:w-32 aspect-[4/3] sm:aspect-square rounded-[16px] overflow-hidden bg-[#FFF8D6] shrink-0">
                        {recipe.imageUrl ? (
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UtensilsCrossed
                              className="w-7 h-7 text-[#FF4B8A]"
                              strokeWidth={2}
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#E8D4F8] text-[#2D2D2D] text-[12px] font-medium">
                          <User
                            className="w-3.5 h-3.5 text-[#FF4B8A]"
                            strokeWidth={2}
                          />
                          <span>De {recipe.senderName}</span>
                        </div>

                        <h3 className="font-display text-[18px] font-semibold leading-[1.4] text-[#2D2D2D] truncate">
                          {recipe.title}
                        </h3>

                        <p className="text-[14px] leading-[1.5] text-[#747474] line-clamp-2">
                          {recipe.description}
                        </p>

                        <div className="flex items-center gap-2 text-[12px] text-[#747474]">
                          <span>{recipe.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{recipe.prepMinutes} minutos</span>
                          {recipe.isExample && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Receta de ejemplo</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  </article>
                ))}
                </div>
              )}
            </section>
          </div>
        ) : selectedCollection ? (
          /* Vista independiente al abrir una colección (sin bottom bar) */
          <section aria-labelledby="collection-detail-heading" className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedCollectionId(null)}
                className="min-h-[44px] px-4 py-2 rounded-[16px] bg-[#FFFFFF] border-2 border-[#E8E8E8] text-[#2D2D2D] font-semibold text-[14px] hover:border-[#FF6B4A] hover:bg-[#FFD6C9]/25 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2.2} />
                <span>Volver</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingCollection(selectedCollection);
                  setIsCreatingCollection(true);
                }}
                aria-label={`Editar colección ${selectedCollection.name}`}
                className="min-h-[48px] px-4 py-2 rounded-[16px] bg-[#FFF8D6] border border-[#E8E8E8] text-[#2D2D2D] font-semibold text-[13px] hover:border-[#FF6B4A] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-4 h-4 text-[#FF6B4A]" strokeWidth={2} />
                <span>Editar colección</span>
              </button>
            </div>

            <div
              className="p-6 rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ backgroundColor: selectedCollection.pastelBg }}
            >
              <div>
                <h1
                  id="collection-detail-heading"
                  className="font-display text-[26px] sm:text-[32px] font-bold leading-[1.2] text-[#2D2D2D]"
                >
                  {selectedCollection.name}
                </h1>
                <p className="text-[15px] text-[#2D2D2D]/85 mt-1">
                  {selectedCollection.description}
                </p>
              </div>

              <span className="self-start sm:self-center px-3.5 py-1.5 rounded-[8px] bg-[#FFFFFF]/90 text-[13px] font-semibold text-[#2D2D2D] tabular-nums shrink-0">
                {recipesInSelectedCollection.length}{' '}
                {recipesInSelectedCollection.length === 1 ? 'receta' : 'recetas'}
              </span>
            </div>

            {recipesInSelectedCollection.length === 0 ? (
              <div className="p-8 rounded-[24px] bg-[#FFF8D6]/50 border border-[#E8E8E8] text-center space-y-3">
                <p className="text-[16px] font-medium text-[#2D2D2D]">
                  Todavía no hay recetas en «{selectedCollection.name}»
                </p>
                <p className="text-[14px] text-[#747474]">
                  Abre cualquier receta o crea una nueva para guardarla aquí.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipesInSelectedCollection.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="miga-card bg-[#FFFFFF] border border-[#E8E8E8] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRecipeId(recipe.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full p-3 sm:p-3.5 text-left flex flex-row items-center gap-3.5 sm:gap-4 cursor-pointer focus-visible:outline-none"
                    >
                      <div className="w-[20%] shrink-0 aspect-square rounded-[14px] bg-[#FFF8D6] overflow-hidden flex items-center justify-center">
                        {recipe.imageUrl ? (
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UtensilsCrossed
                            className="w-6 h-6 text-[#FF6B4A]"
                            strokeWidth={2}
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                        <h2 className="font-display text-[16px] sm:text-[17px] font-semibold leading-[1.3] text-[#2D2D2D] line-clamp-2">
                          {recipe.title}
                        </h2>

                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#FF4B8A]">
                          <span>Ver receta</span>
                          <ArrowRight className="w-4 h-4" strokeWidth={2} />
                        </span>
                      </div>
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Pantalla independiente: Colecciones */
          <section aria-labelledby="collections-page-heading" className="space-y-8">
            <div className="p-5 sm:p-6 rounded-[24px] bg-[#FFF8D6]/85 border border-[#E8E8E8] shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1
                    id="collections-page-heading"
                    className="font-display text-[26px] sm:text-[32px] font-bold leading-[1.2] text-[#2D2D2D]"
                  >
                    Colecciones
                  </h1>
                  <span className="inline-flex px-3 py-1 rounded-[10px] bg-[#FFFFFF] border border-[#E8E8E8] text-[12px] font-semibold text-[#2D2D2D] tabular-nums">
                    {collections.length}{' '}
                    {collections.length === 1 ? 'colección' : 'colecciones'}
                  </span>
                </div>
                <p className="text-[14px] sm:text-[15px] text-[#2D2D2D]/80">
                  Organiza tus recetas propias y recibidas en carpetas temáticas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCollection(null);
                  setIsCreatingCollection(true);
                }}
                className="min-h-[48px] px-6 py-3 rounded-[16px] bg-[#FF6B4A] text-[#FFFFFF] font-semibold text-[16px] hover:brightness-95 active:scale-[0.98] transition-all cursor-pointer shrink-0"
              >
                Nueva colección
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((col) => {
                const count = recipes.filter((r) => r.collectionId === col.id).length;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedCollectionId(col.id)}
                    aria-label={`Abrir colección ${col.name}`}
                    className="miga-card p-4 sm:p-6 flex flex-col gap-3"
                    style={{ backgroundColor: col.pastelBg }}
                  >
                    <div className="space-y-1 text-left">
                      <h2 className="font-display text-[18px] font-semibold text-[#2D2D2D]">
                        {col.name}
                      </h2>
                      <p className="text-[14px] leading-[1.5] text-[#2D2D2D]/80">
                        {col.description || 'Sin detalle'}
                      </p>
                    </div>

                    <span className="self-start px-3 py-1 rounded-[8px] bg-[#FFFFFF]/85 text-[12px] font-medium text-[#2D2D2D] tabular-nums">
                      {count} {count === 1 ? 'receta' : 'recetas'}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* Bottom navigation fija: Inicio, Recetas, Colecciones y Crear */}
      {!isSubPage && (
        <nav
          aria-label="Navegación principal"
          className="fixed bottom-0 inset-x-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E8E8E8] pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.06)]"
        >
          <div className="max-w-lg mx-auto h-16 px-2 sm:px-4 grid grid-cols-4 items-center">
            <button
              type="button"
              onClick={() => {
                setSelectedCollectionId(null);
                setActiveTab('inicio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={activeTab === 'inicio' ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-1 text-[12px] transition-colors cursor-pointer ${
                activeTab === 'inicio'
                  ? 'text-[#FF6B4A] font-semibold'
                  : 'text-[#747474] font-medium hover:text-[#2D2D2D]'
              }`}
            >
              <Home className="w-5 h-5" strokeWidth={2} />
              <span>Inicio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCollectionId(null);
                setActiveTab('recetas');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={activeTab === 'recetas' ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-1 text-[12px] transition-colors cursor-pointer ${
                activeTab === 'recetas'
                  ? 'text-[#FF6B4A] font-semibold'
                  : 'text-[#747474] font-medium hover:text-[#2D2D2D]'
              }`}
            >
              <BookOpen className="w-5 h-5" strokeWidth={2} />
              <span>Recetas</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCollectionId(null);
                setActiveTab('colecciones');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={activeTab === 'colecciones' ? 'page' : undefined}
              className={`min-h-[48px] flex flex-col items-center justify-center gap-1 text-[12px] transition-colors cursor-pointer ${
                activeTab === 'colecciones'
                  ? 'text-[#FF6B4A] font-semibold'
                  : 'text-[#747474] font-medium hover:text-[#2D2D2D]'
              }`}
            >
              <Folder className="w-5 h-5" strokeWidth={2} />
              <span>Colecciones</span>
            </button>

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setIsAddChoiceOpen(true)}
                aria-label="Crear o solicitar receta"
                className="w-12 h-12 rounded-full bg-[#FF6B4A] text-[#FFFFFF] flex items-center justify-center shadow-[0_4px_14px_rgba(255,107,74,0.35)] hover:opacity-92 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Ventana de elección desde el botón (+) */}
      <AddChoiceModal
        isOpen={isAddChoiceOpen}
        initialStep={addChoiceInitialStep}
        onClose={() => {
          setIsAddChoiceOpen(false);
          setAddChoiceInitialStep('choice');
        }}
        onChooseCreateOwn={() => openCreateRecipePage(null)}
        onCreateInvite={async () => {
          if (!authenticatedUser) throw new Error('Iniciá sesión para crear un enlace.');
          const invite = await createRecipeInvite(authenticatedUser.uid, authenticatedUser.displayName ?? authenticatedUser.email ?? 'Miga');
          return invite.link;
        }}
        onNotify={(message, type = 'success') => setFeedback({ message, type })}
      />

      {/* Buscador flotante estilo Spotlight */}
      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        recipes={recipes}
        collections={collections}
        onClose={() => setIsSpotlightOpen(false)}
        onSelectRecipe={(recipe) => {
          setIsCreatingRecipe(false);
          setEditingRecipe(null);
          setSelectedRecipeId(recipe.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCollection={(collectionId) => {
          setIsCreatingRecipe(false);
          setEditingRecipe(null);
          setSelectedRecipeId(null);
          setActiveTab('colecciones');
          setSelectedCollectionId(collectionId);
        }}
      />

      {/* Perfil de usuario */}
      <ProfileModal
        isOpen={isProfileOpen}
        ownCount={recipes.filter((r) => r.origin === 'own').length}
        receivedCount={recipes.filter((r) => r.origin === 'received').length}
        collectionsCount={collections.length}
        displayName={authenticatedUser?.displayName?.trim() || userFirstName}
        email={authenticatedUser?.email ?? null}
        photoURL={authenticatedUser?.photoURL ?? null}
        onSignOut={handleSignOut}
        theme={theme}
        onThemeChange={(nextTheme) => {
          setTheme(nextTheme);
          window.localStorage.setItem('miga-theme', nextTheme);
        }}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Modal de creación de colección */}
      <CreateCollectionModal
        isOpen={isCreatingCollection}
        collection={editingCollection}
        onClose={() => {
          setIsCreatingCollection(false);
          setEditingCollection(null);
        }}
        onCreate={handleCreateCollection}
        onUpdate={handleUpdateCollection}
        onDelete={handleDeleteCollection}
        onNotify={(message, type = 'success') => setFeedback({ message, type })}
      />
    </div>
  );
}

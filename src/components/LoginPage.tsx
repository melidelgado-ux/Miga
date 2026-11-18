import React, { useState } from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { hasFirebaseConfig, signInWithGoogle } from '../firebase';
import { MigaBrandMark } from './KitchenIllustrations';

function getGoogleSignInError(error: unknown): string | null {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';

  if (code === 'auth/popup-closed-by-user') return null;
  if (code === 'auth/unauthorized-domain') {
    return 'Este dominio todavía no está habilitado para iniciar sesión.';
  }
  if (code === 'auth/operation-not-allowed') {
    return 'El acceso con Google todavía no está habilitado en Firebase.';
  }
  if (code === 'auth/popup-blocked') {
    return 'El navegador bloqueó la ventana de Google. Permití las ventanas emergentes e intentá otra vez.';
  }
  return 'No pudimos iniciar sesión. Revisá tu conexión e intentá otra vez.';
}

interface LoginPageProps {
  isAuthReady: boolean;
}

export function LoginPage({ isAuthReady }: LoginPageProps) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    if (!hasFirebaseConfig || isSigningIn) return;
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage(getGoogleSignInError(error));
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8D6]/45 text-[#2D2D2D] flex flex-col">
      <header className="w-full border-b border-[#E8E8E8] bg-[#FFFFFF]/90">
        <div className="max-w-[1200px] mx-auto h-16 px-4 sm:px-6 flex items-center gap-2.5">
          <MigaBrandMark className="w-9 h-9" />
          <span className="font-display text-[22px] font-bold tracking-tight text-[#FF6B4A]">
            Miga
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <section className="p-6 sm:p-10 rounded-[28px] bg-[#FFF8D6] border border-[#F4EBC2] shadow-[0_4px_12px_rgba(0,0,0,0.06)] min-h-[240px] flex flex-col justify-center gap-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF]/80 text-[12px] font-semibold tracking-wide text-[#747474]">
                <span className="w-2 h-2 rounded-full bg-[#FF6B4A]" />
                TU COCINA, TUS RECUERDOS
              </span>
              <h1 className="font-display text-[32px] sm:text-[42px] font-bold leading-[1.12] tracking-tight text-[#2D2D2D]">
                Recetas que hacen hogar.
              </h1>
              <p className="max-w-lg text-[16px] leading-[1.6] text-[#747474]">
                Guardá tus clásicos y reuní las recetas que te comparten las personas que querés.
              </p>
            </div>
          </section>

          <section
            aria-labelledby="login-heading"
            className="w-full max-w-xl mx-auto p-6 sm:p-9 rounded-[28px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
          >
            <div className="space-y-2 mb-7">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#747474] uppercase">
                TE DAMOS LA BIENVENIDA A MIGA
              </p>
              <h2
                id="login-heading"
                className="font-display text-[26px] sm:text-[30px] font-bold leading-[1.2] text-[#2D2D2D]"
              >
                Iniciá sesión
              </h2>
              <p className="text-[15px] leading-[1.6] text-[#747474]">
                Entrá directamente con tu cuenta de Google.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!hasFirebaseConfig || isSigningIn || !isAuthReady}
              className="w-full min-h-[56px] px-5 py-3 rounded-[16px] bg-[#FFFFFF] border-2 border-[#E8E8E8] text-[#2D2D2D] font-semibold text-[15px] hover:border-[#FF6B4A] hover:bg-[#FFF8D6]/50 transition-colors inline-flex items-center justify-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B4A]/25 disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {isSigningIn || !isAuthReady ? (
                <LoaderCircle className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <span aria-hidden="true" className="font-display text-[20px] font-bold text-[#2D2D2D]">G</span>
              )}
              <span>
                {!isAuthReady
                  ? 'Comprobando sesión…'
                  : isSigningIn
                    ? 'Conectando con Google…'
                    : 'Continuar con Google'}
              </span>
            </button>

            {errorMessage && (
              <p
                role="alert"
                className="mt-4 p-3 rounded-[12px] bg-[#FFF8D6] text-[13px] leading-[1.5] text-[#2D2D2D] flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-[#FFA500] shrink-0 mt-0.5" />
                {errorMessage}
              </p>
            )}

            {!hasFirebaseConfig && (
              <p
                role="status"
                className="mt-4 p-3 rounded-[12px] bg-[#FFF8D6] text-[13px] leading-[1.5] text-[#747474]"
              >
                El acceso con Google estará disponible cuando se conecte el proyecto de Firebase.
              </p>
            )}

            <p className="mt-6 text-center text-[12px] leading-[1.5] text-[#747474]">
              No necesitás crear una contraseña para Miga.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { GreetingKitchenIllustration, MigaBrandMark } from './KitchenIllustrations';

interface SignInPageProps {
  isLoading: boolean;
  error?: string | null;
  onSignIn: () => void;
}

export function SignInPage({ isLoading, error, onSignIn }: SignInPageProps) {
  return (
    <main className="min-h-screen bg-[#FFF8F6] px-4 py-8 sm:px-6 flex items-center justify-center">
      <section
        aria-labelledby="miga-sign-in-heading"
        className="w-full max-w-md rounded-[28px] bg-[#FFFFFF] border border-[#E8E8E8] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-6 sm:p-8 text-center space-y-6"
      >
        <div className="flex justify-center">
          <GreetingKitchenIllustration className="w-28 h-28" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-[#FF6B4A]">
            <MigaBrandMark className="w-8 h-8" />
            <span className="font-display text-[22px] font-bold">Miga</span>
          </div>
          <h1
            id="miga-sign-in-heading"
            className="font-display text-[26px] sm:text-[30px] font-bold leading-tight text-[#2D2D2D]"
          >
            Tu recetario te espera
          </h1>
          <p className="text-[15px] leading-[1.6] text-[#747474]">
            Ingresá con Google para guardar y volver a encontrar tus recetas.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-[16px] border border-[#FFA500]/40 bg-[#FFF8D6] px-4 py-3 flex items-start gap-2.5 text-left"
          >
            <AlertCircle className="w-5 h-5 text-[#FFA500] shrink-0 mt-0.5" />
            <p className="text-[13px] leading-[1.5] text-[#2D2D2D]">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onSignIn}
          disabled={isLoading}
          className="miga-btn-primary w-full min-h-[52px] rounded-[16px] px-5 py-3 inline-flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? (
            <LoaderCircle className="w-5 h-5 animate-spin" aria-hidden="true" />
          ) : (
            <span
              aria-hidden="true"
              className="w-6 h-6 rounded-full bg-[#FFFFFF] text-[#2D2D2D] font-bold text-[14px] flex items-center justify-center"
            >
              G
            </span>
          )}
          <span>{isLoading ? 'Conectando…' : 'Continuar con Google'}</span>
        </button>

        <p className="text-[12px] leading-[1.5] text-[#747474]">
          Tus recetas quedan asociadas a tu cuenta de Google.
        </p>
      </section>
    </main>
  );
}

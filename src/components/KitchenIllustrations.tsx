import React from 'react';

/**
 * Ilustraciones flat design lineales de cocina para Miga.
 * Trazo 2px en #2D2D2D y acentos estrictos de la paleta Miga (sin azul ni rojo).
 */

export function MigaBrandMark({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <div
      className={`${className} rounded-full bg-[#FF6B4A] flex items-center justify-center shrink-0 shadow-[0_2px_4px_rgba(0,0,0,0.08)]`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 28 28" className="w-5 h-5" fill="none">
        <path
          d="M6.5 14.5C5.2 12.2 6.8 8.5 10.5 7.5C12.2 7 13.4 7.7 14 8.6C14.6 7.7 15.8 7 17.5 7.5C21.2 8.5 22.8 12.2 21.5 14.5C20.6 16 19.8 17.5 19.5 19.5C19.3 20.6 18.4 21.3 17.3 21.3H10.7C9.6 21.3 8.7 20.6 8.5 19.5C8.2 17.5 7.4 16 6.5 14.5Z"
          fill="#FFFFFF"
        />
        <path
          d="M11 11.5C11.8 12.8 12.2 14.2 12.2 15.5M17 11.5C16.2 12.8 15.8 14.2 15.8 15.5"
          stroke="#FF6B4A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function GreetingKitchenIllustration({ className = 'w-20 h-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Fondo pastel suave */}
      <circle cx="48" cy="48" r="42" fill="#FFF8D6" />
      <circle cx="72" cy="24" r="10" fill="#FFD6C9" />
      {/* Vapor cálido */}
      <path
        d="M38 28C38 24 42 23 42 19M49 26C49 22 53 21 53 17M60 28C60 24 64 23 64 19"
        stroke="#FF6B4A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Olla lineal */}
      <rect
        x="26"
        y="38"
        width="44"
        height="30"
        rx="8"
        fill="#FFFFFF"
        stroke="#2D2D2D"
        strokeWidth="2"
      />
      {/* Tapa / borde superior */}
      <path
        d="M22 38H74"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Asas */}
      <path
        d="M26 47H20C18.3 47 17 48.3 17 50V52C17 53.7 18.3 55 20 55H26"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M70 47H76C77.7 47 79 48.3 79 50V52C79 53.7 77.7 55 76 55H70"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Cuchara asomando */}
      <path
        d="M58 38L66 24"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="67.5" cy="21.5" r="3.5" fill="#D4F8E8" stroke="#2D2D2D" strokeWidth="2" />
      {/* Detalle acogedor en olla */}
      <path
        d="M40 53C42.5 56 53.5 56 56 53"
        stroke="#FF4B8A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CreateRecipeIllustration({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="36" fill="#FFFFFF" />
      {/* Tarjeta de receta */}
      <rect
        x="21"
        y="18"
        width="34"
        height="44"
        rx="7"
        fill="#FFF8D6"
        stroke="#2D2D2D"
        strokeWidth="2"
      />
      <path
        d="M28 29H48M28 37H48M28 45H40"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Lápiz / cuchara creativa */}
      <path
        d="M49 54L62 35L67 39L54 58L48 60L49 54Z"
        fill="#FF6B4A"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReceivedShareIllustration({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" fill="none" className={className} aria-hidden="true">
      <circle cx="28" cy="28" r="26" fill="#E8D4F8" />
      {/* Sobre abierto con tarjeta de receta */}
      <rect
        x="14"
        y="22"
        width="28"
        height="20"
        rx="4"
        fill="#FFFFFF"
        stroke="#2D2D2D"
        strokeWidth="2"
      />
      <path
        d="M19 22V16C19 14.9 19.9 14 21 14H35C36.1 14 37 14.9 37 16V22"
        fill="#FFF8D6"
        stroke="#2D2D2D"
        strokeWidth="2"
      />
      <path
        d="M15 24L28 33L41 24"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 18H32"
        stroke="#FF4B8A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CollectionShelfIllustration({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#FFF8D6" />
      <rect
        x="16"
        y="18"
        width="10"
        height="28"
        rx="3"
        fill="#FFD6C9"
        stroke="#2D2D2D"
        strokeWidth="2"
      />
      <rect
        x="27"
        y="15"
        width="11"
        height="31"
        rx="3"
        fill="#E8D4F8"
        stroke="#2D2D2D"
        strokeWidth="2"
      />
      <rect
        x="39"
        y="20"
        width="10"
        height="26"
        rx="3"
        transform="rotate(-8 39 20)"
        fill="#D4F8E8"
        stroke="#2D2D2D"
        strokeWidth="2"
      />
      <path d="M12 46H52" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

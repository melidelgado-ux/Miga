# Ocultar selector de apariencia

- **Objetivo:** ocultar temporalmente la sección “Apariencia” del modal de perfil.
- **Resultado:** retirada la sección visual en `src/components/ProfileModal.tsx`; la
  lógica de tema, persistencia y estilos oscuros permanece disponible para una futura
  reactivación.
- **Validación:** `npm run lint` pasó; no se verificaron rama ni SHA porque la carpeta
  entregada no contiene metadatos Git.

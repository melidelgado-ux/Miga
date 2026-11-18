# Acceso con Google

- **Estado:** interfaz y flujo implementados; pendiente configurar el proyecto Firebase.
- **Archivos:** `src/components/LoginPage.tsx`, `src/firebase.ts`, `src/App.tsx`,
  `src/components/ProfileModal.tsx`, `src/data/mockRecipes.ts`, `.env.example` y `README.md`.
- **Comportamiento:** login usa `signInWithGoogle` y `hasFirebaseConfig` del cliente
  Firebase existente para evitar una segunda instancia. El formulario de invitación
  sigue disponible sin cuenta. Perfil muestra la identidad Google y permite cerrar
  sesión. Se quitó la ilustración del bloque de bienvenida y el rótulo dice
  “TE DAMOS LA BIENVENIDA A MIGA”. El hero de Inicio ocupa todas las columnas en escritorio.
- **Persistencia:** la app integra Firebase Auth y Firestore para cuentas, recetas,
  colecciones e invitaciones; esta tarea no modificó reglas de Firestore. No se leyeron
  valores reales de entorno.
- **Configuración pendiente:** completar variables `VITE_FIREBASE_*`, habilitar Google
  en Firebase Authentication y añadir `localhost` a dominios autorizados. Sin esto,
  el CTA queda desactivado con una explicación.
- **Validación:** `npm run lint` y `npm run build` pasan. Vite advierte sobre `__dirname`
  en modo nativo y un bundle mayor a 500 kB.
- **Contexto Git:** esta carpeta no tiene metadatos `.git` disponibles.

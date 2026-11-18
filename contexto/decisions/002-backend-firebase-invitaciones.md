# Backend Firebase e invitaciones

- **Fecha:** 2026-11-18
- **Estado:** aprobado por la usuaria y aplicado; Auth y reglas desplegadas.
- **Decisión:** usar Firebase Authentication con Google y Cloud Firestore Standard en
  `southamerica-east1`, con biblioteca separada por UID.
- **Invitaciones:** cada enlace apunta a una sola receta, no requiere cuenta del invitado,
  vence a los 30 días y se consume atómicamente al guardar la receta recibida.
- **Fotos:** comprimir a JPEG (1280 px máximo, 200 KiB) y guardarlas en el documento de
  receta, sin habilitar Firebase Storage.
- **Evidencia:** confirmaciones explícitas de producto en la conversación; base
  `(default)` verificada; configuración de Google Sign-In desplegada; variables Vercel
  creadas en los tres entornos.
- **Validación:** la implementación pasa lint y build; Firebase confirmó el despliegue de reglas.
- **Reemplaza:** `001-persistencia-local-observada.md` como arquitectura vigente.

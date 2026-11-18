# Estado: integración Firebase

- **Estado:** Auth y reglas publicados; enlace de invitación reutilizable implementado en código y reglas. El guardado autenticado sigue en investigación.
- **Rama/SHA:** no verificables; este directorio no tiene metadatos Git.
- **Hecho:** Firestore Standard `(default)` existe en `southamerica-east1`. Google Sign-In
  quedó configurado en Firebase Auth con la identidad visual Miga. La app lee y escribe
  recetas y colecciones por UID; las invitaciones anónimas vencen a los 30 días y pueden
  guardar múltiples recetas independientes. Las fotos se comprimen antes de guardarse
  en Firestore.
  Se crearon variables Vercel de configuración cliente en development, preview y production.
- **Validación:** `npm run lint` y `npm run build` pasaron. Google figura habilitado en
  Authentication y `miga-six.vercel.app` aparece autorizado. Firebase confirmó el deploy
  de Firestore; la lectura posterior verificó las reglas activas.
- **Publicación:** commit `ed9098b` de `main` en GitHub publicó la integración Firebase.
  El commit `b1eab06` añadió el fallback SPA; Vercel lo reportó `READY` en producción y
  `miga-six.vercel.app` quedó como alias.
- El commit `2782484` corrige los campos opcionales que Firestore rechazaba como
  `undefined` en `Transaction.set()` y conserva `migaTip`. Vercel reportó `READY` para
  ese SHA en producción y el alias `miga-six.vercel.app` está asociado al deployment.
- El commit `5eac1c6` agrega registro de errores y muestra el código de Firestore en el
  aviso al fallar el guardado autenticado. Vercel reportó `READY` en producción y el alias
  `miga-six.vercel.app` está asociado al deployment. El error concreto todavía no se conoce.
- La usuaria cambió el requisito: el mismo enlace debe aceptar varias recetas. El código
  elimina el consumo del enlace, permite enviar otra receta desde la confirmación y deja
  de rechazar enlaces antiguos por `used`. Firestore Rules se desplegaron en `miga-3ad86`
  y una lectura posterior confirmó la regla reutilizable más la transición heredada.
  Falta publicar el código de la app y verificar su deployment Vercel.
- **Verificación:** el home muestra el acceso Google. La ruta de invitación real abrió
  el formulario para “Meli Delgado” tras el fallback. No se envió ninguna receta en la
  revisión previa. No se realizó una sesión Google ni se confirmó persistencia en la
  biblioteca propietaria.
- **Pendiente:** envío real por invitado y comprobación de persistencia en la biblioteca
  propietaria; volver a abrir el mismo enlace después del primer envío para comprobar que
  permanece disponible hasta vencer.
- **Pendiente:** un usuario autenticado debe reintentar guardar una receta y compartir el
  código que ahora aparece en el aviso; luego corregir según el error real y confirmar la
  persistencia.
- **Próximo paso:** publicar el código del enlace reutilizable, verificar Vercel y luego
  probar dos envíos desde el mismo enlace. Probar también el guardado autenticado y
  recuperar su código de error si persiste.
- **Última actualización:** 2026-11-18.

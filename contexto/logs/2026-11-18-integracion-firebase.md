# Integración Firebase

- El proyecto ya tiene Firestore Standard en São Paulo y Google Sign-In configurado.
- La app se conectó a Authentication y Firestore; Vercel recibió las variables Firebase
  de cliente en los tres entornos.
- `npm run lint` y `npm run build` pasaron. El build conserva advertencias existentes de
  Vite sobre `__dirname` y el tamaño del bundle.
- Tras la aprobación de la usuaria, las reglas de `firestore.rules` se desplegaron y se
  verificaron con una lectura posterior. La validación de reglas confirmó nombres de
  colección obligatorios.
- El checkout local no tiene `.git`; la publicación en GitHub se hizo desde el conector.
- La usuaria subió la integración a `main`. El deployment de producción quedó READY.
- Una prueba de enlace directo detectó 404 de Vercel; se añadió `vercel.json`, se publicó
  el fallback SPA en un nuevo commit y el enlace invitado real abrió el formulario.
  La receta no se envió; queda disponible para la persona invitada.
- El envío invitado mostró `Transaction.set()` con datos inválidos: los campos opcionales
  `note`, `title` o `tip` podían llegar como `undefined`. Se ajustó `recipeFields` para
  omitirlos cuando faltan y persistir `migaTip`; el commit `2782484` quedó `READY` en
  producción y `miga-six.vercel.app` apunta a ese deployment.
- Se volvió a abrir el enlace y cargó el formulario de Meli Delgado. No se envió la receta;
  el comportamiento de guardado y consumo transaccional sigue pendiente de una prueba
  real por parte de la persona invitada.
- La usuaria reportó un fallo distinto al guardar una receta con sesión iniciada. El aviso
  original ocultaba el error de Firebase; el commit `5eac1c6` ahora lo registra y muestra
  el código (`permission-denied`, etc.). El build y los tipos pasaron y Vercel quedó
  `READY`, con `miga-six.vercel.app` en el deployment. Falta que la persona reintente y
  comparta el código para identificar la causa; no se afirmó que el guardado ya funcione.
- La usuaria pidió que el mismo enlace acepte más de una receta. Se actualizó el PRD y
  la app para que cada envío cree una receta independiente, con opción de cargar otra
  desde la confirmación. Las reglas de Firestore se desplegaron y se leyeron de vuelta;
  verifican existencia, propietario y vencimiento del enlace, y conservan la ruta
  transaccional heredada para clientes antiguos. Código y despliegue Vercel pendientes.

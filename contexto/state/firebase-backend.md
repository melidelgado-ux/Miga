# Estado: integración Firebase

- **Estado:** implementación local, Auth y reglas de Firestore aplicadas.
- **Rama/SHA:** no verificables; este directorio no tiene metadatos Git.
- **Hecho:** Firestore Standard `(default)` existe en `southamerica-east1`. Google Sign-In
  quedó configurado en Firebase Auth con la identidad visual Miga. La app lee y escribe
  recetas y colecciones por UID; los enlaces anónimos vencen a los 30 días y guardan una
  receta con consumo transaccional. Las fotos se comprimen antes de guardarse en Firestore.
  Se crearon variables Vercel de configuración cliente en development, preview y production.
- **Validación:** `npm run lint` y `npm run build` pasaron. Google figura habilitado en
  Authentication y `miga-six.vercel.app` aparece autorizado. Firebase confirmó el deploy
  de Firestore; la lectura posterior verificó las reglas activas.
- **Pendiente:** trasladar estos cambios al checkout GitHub/Vercel, que no existe en esta
  carpeta, y publicar el código; luego hacer una prueba extremo a extremo en la app.
- **Próximo paso:** llevar los archivos modificados al checkout Git conectado y desplegar
  la app para probar Google Sign-In, biblioteca e invitación de un solo uso.
- **Última actualización:** 2026-11-18.

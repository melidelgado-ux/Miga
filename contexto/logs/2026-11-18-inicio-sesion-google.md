# Inicio de sesión con Google

- Se conectó la pantalla de acceso con Google al cliente Firebase existente, con restauración de sesión y cierre de sesión desde Perfil.
- Se mantuvo el formulario de invitación como ruta para personas sin cuenta y se conectó la identidad Google al encabezado y al perfil.
- Se aplicaron los comentarios visuales: bienvenida actualizada, ilustración retirada y hero de Inicio a ancho completo en escritorio.
- Se añadió `invitationId` al modelo `Recipe`, campo requerido por la integración Firestore existente y para que pase la comprobación de tipos.
- Se documentó la configuración Firebase en `.env.example` y `README.md`; no se leyeron valores reales de entorno.
- Validación: `npm run lint` y `npm run build` exitosos. Build muestra avisos sobre configuración Vite y tamaño del bundle.
- Falta la configuración del proyecto Firebase en el entorno para probar el proveedor Google real.

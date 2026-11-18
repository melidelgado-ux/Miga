# Integración Firebase

- El proyecto ya tiene Firestore Standard en São Paulo y Google Sign-In configurado.
- La app se conectó a Authentication y Firestore; Vercel recibió las variables Firebase
  de cliente en los tres entornos.
- `npm run lint` y `npm run build` pasaron. El build conserva advertencias existentes de
  Vite sobre `__dirname` y el tamaño del bundle.
- Tras la aprobación de la usuaria, las reglas de `firestore.rules` se desplegaron y se
  verificaron con una lectura posterior. La validación de reglas confirmó nombres de
  colección obligatorios.
- Falta llevar el código al checkout GitHub/Vercel conectado y publicar la app.

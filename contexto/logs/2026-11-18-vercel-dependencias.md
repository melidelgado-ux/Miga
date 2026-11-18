# Dependencias de build para Vercel — 2026-11-18

Vercel reportó `ERESOLVE`: Vite 8.3.8 necesita esbuild 0.27 o 0.28, y el manifiesto
fijaba el rango 0.25. Se actualizó `esbuild` a `^0.27.7` y npm regeneró el lockfile.
`npm run lint` y `npm run build` pasan en este checkout local. La carpeta no contiene
metadatos Git, así que el cambio aún debe integrarse al checkout conectado con Vercel;
no se afirma que esté desplegado.

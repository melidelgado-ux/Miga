# Reglas verificables

Cada regla indica qué comprobar. Las instrucciones actuales del usuario y del entorno
prevalecen. No se añaden políticas sin evidencia del repositorio.

## MIGA-01 — No guardar secretos de entorno

- **Obligación:** no leer, copiar ni registrar valores de archivos `.env*`; usar
  `.env.example` solo como plantilla sin secretos.
- **Alcance:** memoria, código y documentación agregados por agentes.
- **Detección:** revisar rutas tocadas y `git diff`; confirmar que no se añadió ningún
  `.env*` (excepto la plantilla existente) ni valor de credencial.
- **Excepción:** ninguna para guardar valores secretos.

## MIGA-02 — Preservar invariantes de build y edición

- **Obligación:** conservar el plugin `copy-unbundled-src-assets` de build y la
  semántica de `DISABLE_HMR` en Vite, salvo que la tarea autorice modificar esos
  comportamientos y se valide su reemplazo.
- **Alcance:** `vite.config.ts` y cambios que afecten assets servidos por URL raíz o HMR.
- **Detección:** inspeccionar el diff de `vite.config.ts`; para cambios autorizados,
  ejecutar `npm run build` y comprobar que los assets referenciados se copian.
- **Excepción:** cambio explícitamente solicitado con comportamiento sustituto validado.

## MIGA-03 — Afirmar persistencia solo con evidencia

- **Obligación:** describir recetas y colecciones según el backend implementado y
  desplegado. No prometer privacidad ni sincronización entre usuarios si las reglas
  remotas no están aplicadas.
- **Alcance:** documentación de producto, arquitectura y comportamiento.
- **Detección:** contrastar `src/App.tsx`, `src/data/firestore.ts`, `firestore.rules` y el
  estado desplegado de Firebase antes de describir datos como persistentes o privados.
- **Excepción:** ninguna; la evidencia de configuración, despliegue y reglas debe
  comprobarse en cada cambio de backend.

## MIGA-04 — Usar solo comandos declarados

- **Obligación:** no presentar un comando de test o lint como disponible sin verificarlo
  en scripts o configuración del repositorio.
- **Alcance:** validación y documentación para agentes.
- **Detección:** comprobar `package.json`; actualmente `lint` ejecuta `tsc --noEmit` y
  no hay script `test`.
- **Excepción:** comando nuevo añadido por la tarea y documentado en el manifiesto.

## MIGA-05 — Tratar clean como destructivo

- **Obligación:** no ejecutar `npm run clean` sin confirmar que se pueden eliminar
  `dist/` y `server.js` del directorio de trabajo.
- **Alcance:** uso del script declarado en `package.json`.
- **Detección:** revisar su efecto (`rm -rf dist server.js`) y el estado de esos paths
  antes de ejecutarlo.
- **Excepción:** el usuario solicita la limpieza o los targets están verificados como
  prescindibles.

## MIGA-06 — No inferir entrega externa

- **Obligación:** no afirmar commit, merge, despliegue, migración ni publicación sin
  evidencia verificable; no hacer esas acciones si no forman parte de la autorización.
- **Alcance:** informes de estado y acciones sobre sistemas externos.
- **Detección:** contrastar estado Git/remoto o plataforma correspondiente antes de usar
  esos términos; revisar el alcance explícito de la solicitud antes de actuar.
- **Excepción:** autorización explícita del usuario para la acción concreta.

## MIGA-07 — Mantener manifiesto y lockfile coherentes

- **Obligación:** si cambia una dependencia declarada, actualizar también el lockfile
  correspondiente; no editar una copia de dependencia instalada como sustituto del
  código fuente.
- **Alcance:** `package.json`, `package-lock.json` y `node_modules/`.
- **Detección:** comparar cambios de dependencias en manifiesto y lockfile; `node_modules/`
  está ignorado y no es la fuente canónica.
- **Excepción:** ninguna para entregar una dependencia nueva sin actualizar el lockfile.

## MIGA-08 — No editar artefactos de build

- **Obligación:** no tratar `dist/` como fuente ni editar sus archivos manualmente; se
  genera con `npm run build` y está excluido por `.gitignore`.
- **Alcance:** archivos de salida Vite y referencias a assets copiados al build.
- **Detección:** revisar `.gitignore`, la configuración Vite y los paths modificados;
  validar el cambio desde la fuente en `src/` o `public/`.
- **Excepción:** ninguna para cambios que deban persistir en el proyecto.

## MIGA-09 — No usar azul en la interfaz

- **Obligación:** no usar tonos azules en la interfaz; limitar colores a la paleta
  aprobada en la referencia de diseño. La información auxiliar usa gris mediano.
- **Alcance:** componentes, estilos, ilustraciones, estados semánticos y documentación
  visual de la app.
- **Detección:** buscar nombres y valores de color azules en `src/` y contrastar los
  estados descritos con `public/assets/aistudio/miga-design-system-design_d8a6008b.md`.
- **Excepción:** ninguna sin una instrucción posterior explícita del usuario.

## MIGA-10 — Texto blanco sobre fondos coral

- **Obligación:** cuando una superficie usa el coral principal (`#FF6B4A`) como fondo,
  el texto visible debe ser blanco (`#FFFFFF`).
- **Alcance:** botones, badges y otras superficies de interfaz con fondo coral. No se
  aplica a ilustraciones decorativas.
- **Detección:** buscar `#FF6B4A` en propiedades de fondo y revisar que el texto
  visible sobre esas superficies use blanco; confirmar también el estilo compartido de
  `.miga-btn-primary` y los estados de tema oscuro.
- **Excepción:** ninguna sin una instrucción posterior explícita del usuario.

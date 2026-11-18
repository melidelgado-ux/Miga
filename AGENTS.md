# Miga — instrucciones para agentes

Miga es un recetario personal y colaborativo. Esta carpeta contiene una app web de
React y TypeScript para guardar, organizar y compartir recetas; el flujo actual es una
demostración local sin servidor ni persistencia.

## Fuentes de verdad

- Stack y comandos: [`package.json`](package.json), [`vite.config.ts`](vite.config.ts)
  y [`tsconfig.json`](tsconfig.json).
- Producto y límites publicados: [`README.md`](README.md); requisitos del flujo de
  invitación: [`PRD.md`](PRD.md).
- Diseño: [`public/assets/aistudio/miga-design-system-design_d8a6008b.md`](public/assets/aistudio/miga-design-system-design_d8a6008b.md).
- Implementación actual: código y configuración. La memoria no sustituye estas fuentes.

## Reglas permanentes

- La memoria persistente vive en archivos. Carga solo lo necesario para la tarea y
  referencia archivos en lugar de copiar documentos largos al contexto.
- Lee [`contexto/reglas.md`](contexto/reglas.md) y el índice de estado; carga detalles
  bajo demanda según la tabla de abajo.
- `reglas.md` define restricciones verificables; `decisions/` explica decisiones
  duraderas. No conviertas una observación en decisión aprobada.
- `state/` describe solo trabajo activo y separado por tarea/rama. Los logs y planes
  históricos no son instrucciones vigentes ni autorización para empezar tareas.
- Código/configuración describen la implementación actual. Instrucciones actuales del
  usuario y del entorno prevalecen sobre memoria histórica.
- No afirmes que trabajo local está committed, merged, desplegado, migrado o aplicado
  sin evidencia de ese estado.
- Al cerrar, pausar o transferir trabajo significativo, sigue
  [la skill de actualización de contexto](.agents/skills/actualizar-contexto/SKILL.md).

## Inicio mínimo

1. Inspecciona el estado de Git si existe y conserva cambios previos.
2. Lee este archivo, [`contexto/reglas.md`](contexto/reglas.md) y
   [`contexto/state/README.md`](contexto/state/README.md).
3. Abre solo los documentos de la tarea según esta tabla.

| Tarea | Cargar |
| --- | --- |
| Producto o flujo de usuario | `README.md`, `PRD.md`, componentes implicados |
| Arquitectura o datos | `contexto/design.md`, `src/App.tsx`, `src/data/mockRecipes.ts` |
| UI o estilos | referencia de diseño, `src/index.css`, componente implicado |
| Build, tipos o configuración | `package.json`, `tsconfig.json`, `vite.config.ts` |
| Continuar una tarea | archivo correspondiente en `contexto/state/` y solo sus referencias |
| Cambiar restricciones o decisiones | `contexto/reglas.md`, índice y registro pertinente |

## Comandos canónicos

- `npm run dev`: servidor Vite en puerto 3000.
- `npm run lint`: `tsc --noEmit` (verificación de tipos; no es ESLint).
- `npm run build`: compilación Vite.
- `npm run preview`: vista previa de producción.

No hay script de tests declarado en `package.json`. Para cambios documentales, valida
los enlaces, el diff y la consistencia sin ejecutar toda la app.

## Definition of Done

- El cambio cumple el alcance pedido y las reglas aplicables.
- Se ejecutaron las validaciones pertinentes y se informa exactamente cuáles.
- No se incorporan cambios ajenos, secretos ni estados de entrega sin evidencia.
- Se actualizaron estado, decisiones, gotchas o log cuando el cambio sea duradero.

## Cierre, pausa y handoff

Antes de entregar, pausar o transferir una tarea significativa, actualiza su archivo
en `contexto/state/`; registra decisiones duraderas y un resumen breve en `contexto/logs/`
cuando corresponda. Un cierre de sesión es este checkpoint explícito: no se presupone
que exista un hook al cerrar una ventana. En trabajo paralelo, cada agente mantiene su
propio estado; un único integrador actualiza índices compartidos.

Memoria detallada: [`contexto/README.md`](contexto/README.md). Índices: decisiones,
[`contexto/state/`](contexto/state/README.md), `contexto/gotchas/` y `contexto/logs/`.

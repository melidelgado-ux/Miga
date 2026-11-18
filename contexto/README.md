# Memoria de ingeniería

La memoria permite retomar trabajo con poco contexto. Los archivos del repositorio
siguen siendo la fuente de verdad de implementación.

## Mapa

- [`reglas.md`](reglas.md): restricciones comprobables derivadas de configuración y
  documentación vigente.
- [`design.md`](design.md): mapa de arquitectura actual y rutas para profundizar.
- [`convenciones.md`](convenciones.md): patrones comprobados y comandos reales.
- [`decisiones.md`](decisiones.md) y `decisions/`: índice y registro breve de decisiones
  duraderas, con su nivel de evidencia.
- `state/`: índice y un archivo por tarea activa, rama o línea de trabajo.
- `gotchas/`: solo fallos reproducibles con solución y verificación comprobadas.
- `logs/`: resúmenes breves de sesiones importantes, nunca transcripciones.
- [Skill de cierre](../.agents/skills/actualizar-contexto/SKILL.md): checkpoint antes de
  entregar, pausar o transferir trabajo significativo.

## Carga y mantenimiento

Al empezar, lee `AGENTS.md`, `reglas.md` e `state/README.md`. Consulta el resto solo
según la tarea. No cargues recursivamente toda la memoria ni copies documentos largos:
usa enlaces a las fuentes.

El estado cerrado se archiva fuera del índice activo (o se elimina si ya no aporta
referencia útil). Actualiza el índice para que solo apunte a tareas activas. Los logs
son registro histórico y no backlog. Los documentos de planes y PRD describen intención
de producto; una propuesta o pendiente allí no autoriza implementarla.

No guardes secretos, credenciales, datos personales, transcripciones, razonamientos
internos ni outputs extensos. No dupliques en memoria contenido que ya tenga una fuente
canónica; guarda el enlace y solo la síntesis que facilite retomar el trabajo.

El estado inicial de esta instalación señala que faltan metadatos Git en la carpeta
entregada. No atribuyas rama, commit ni limpieza del árbol de trabajo hasta verificarlo
en un checkout con Git.

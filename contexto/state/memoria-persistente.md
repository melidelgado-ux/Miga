# Handoff: instalación de memoria persistente

- **Identificador:** memoria-persistente
- **Rama:** no verificable; la carpeta del proyecto no contiene `.git` y su padre
  tampoco es un checkout.
- **Commit base/SHA:** no disponible por la misma razón.
- **Alcance autorizado:** auditar el material disponible e instalar la estructura de
  contexto y el procedimiento de cierre descritos en `context_instructions.md`.
- **Hecho:** añadidos router, reglas, mapa de arquitectura, convenciones, decisión
  observada, índices de estado, log de sesión y skill de cierre. No se modificó código
  de aplicación.
- **Verificaciones ejecutadas:** los 12 archivos nuevos tienen 20 enlaces relativos
  resueltos, frontmatter válido, whitespace limpio y sin rutas de máquina ni patrones de
  credenciales detectables; `AGENTS.md` tiene 75 líneas y 3964 bytes. También se registró
  que el PRD/README llaman privado al enlace, pero el token cliente no se valida en servidor.
  `git diff --check`, `git status --short`, rama y SHA no se pueden verificar porque falta
  `.git`.
- **Pendiente:** llevar o validar estos archivos en el checkout Git del proyecto y
  actualizar este estado con rama/SHA y resultado real de sus validaciones.
- **Blockers:** faltan metadatos Git en el entorno entregado.
- **Próximo paso comprobable:** en el checkout Git real, comprobar `git status --short`,
  revisar el diff y ejecutar `git diff --check`; actualizar este estado con rama/SHA.
- **Archivos relevantes:** `AGENTS.md`, `contexto/`, `.agents/skills/actualizar-contexto/SKILL.md`.
- **Última actualización:** 2026-11-18.

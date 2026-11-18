# Instalación de memoria persistente

- **Objetivo:** adaptar al repositorio un sistema pequeño de contexto y handoff.
- **Resultado:** creados `AGENTS.md`, `contexto/` y la skill de cierre. La arquitectura
  inicial se basa en README, PRD, scripts y código inspeccionados.
- **Decisiones:** persistencia actual marcada como observada, no aprobada.
- **Validación:** enlaces relativos, frontmatter, whitespace, tamaño/líneas, symlinks y
  búsqueda de rutas sensibles pasaron. No se pudieron confirmar rama, SHA, cambios
  previos ni `git diff --check`: el directorio entregado no tiene `.git`.
- **Pendiente transferido:** validar enlaces, límites, skill y diff en el checkout Git;
  ver [`state/memoria-persistente.md`](../state/memoria-persistente.md).

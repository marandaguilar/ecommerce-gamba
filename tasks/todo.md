# TODO — Fase 1: Fundaciones del Design System

Lista de tasks derivada de `tasks/plan.md`. **Fase 1 COMPLETA** (rama `redesign/phase-1-design-foundations`).

## Phase 1A — Eliminar dark mode
- [x] **Task 1** — Quitar andamiaje dark + desacoplar sonner + remover `next-themes` (RF-4) · M — `dcb4906`
- [x] **Task 2** — Limpiar clases `dark:` inertes en componentes (RF-4) · S — `820170a`
- [x] **Checkpoint A** — dark mode 100% fuera; lint+typecheck ok ✓

## Phase 1B — Identidad de marca
- [x] **Task 3** — Tokens de color de marca (azul `#0d4c99`, turquesa, `--whatsapp`, `--offer`) (RF-1) · M — `a1d4a95`
- [x] **Task 4** — Cablear tipografía (Plus Jakarta Sans + Sora), quitar Geist (RF-2) · S — `022f301`
- [x] **Checkpoint B** — marca + fuente visibles; sin geist/sidebar tokens ✓

## Phase 1C — Componentes base
- [x] **Task 5** — Componente `Input` shadcn (RF-5) · S — `1641b3c`
- [x] **Task 6** — Refinar button + reestilizar wordmark navbar/footer (RF-3 + §3) · M — `e83848e`
- [x] **Checkpoint C** — Fase 1 completa ✓

---
**Verificación por task:** `grep` asserts + `npx tsc --noEmit` + `npx next lint` + `next build` (etapa de compilación).
**Limitación de entorno:** `next build` no completa la generación estática sin `NEXT_PUBLIC_BACKEND_URL` (backend Strapi) — preexistente, ajeno a estos cambios. Falta verificación visual con `npm run dev` apuntando al backend real.

**Siguiente:** Fase 2 — Product card unificado + precios mayorista-first + badge "Oferta" (consume los tokens `--offer`, `--fresh`, `--whatsapp` y el componente `Input` creados acá).

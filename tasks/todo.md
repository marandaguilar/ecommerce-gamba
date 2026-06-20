# TODO — Fase 1: Fundaciones del Design System

Lista de tasks derivada de `tasks/plan.md`. Implementar en orden con `/g-build`.

## Phase 1A — Eliminar dark mode
- [ ] **Task 1** — Quitar andamiaje dark + desacoplar sonner + remover `next-themes` (RF-4) · M
- [ ] **Task 2** — Limpiar clases `dark:` inertes en componentes (RF-4) · S
- [ ] **Checkpoint A** — dark mode 100% fuera; `lint`+`build` ok; app en claro con SO en dark

## Phase 1B — Identidad de marca
- [ ] **Task 3** — Tokens de color de marca (azul `#0d4c99`, acento turquesa, `--whatsapp`, `--offer`) (RF-1) · M
- [ ] **Task 4** — Cablear tipografía (Plus Jakarta Sans + Sora), quitar Geist (RF-2) · S
- [ ] **Checkpoint B** — marca + fuente visibles y consistentes; sin geist/sidebar tokens

## Phase 1C — Componentes base
- [ ] **Task 5** — Componente `Input` shadcn (RF-5) · S
- [ ] **Task 6** — Refinar button/card + reestilizar wordmark navbar/footer (RF-3 + §3) · M
- [ ] **Checkpoint C** — Fase 1 completa; recorrido manual sin regresiones; listo para Fase 2

---
**Orden de dependencias:** 1 → 2 → 3 → (4, 5, 6)
**Verificación por task:** `npm run lint` + `npm run build` + chequeo visual `npm run dev` (no hay suite de tests).

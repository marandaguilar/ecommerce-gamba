# TODO — Fase 3: Header / Navegación

**Fase 3 COMPLETA** (rama `redesign/phase-1-design-foundations`).
> Fases 1 (design system) y 2 (product card) ✓ completas — ver git log.

## Phase 3A — Navegación principal
- [x] **Task 1** — Categorías dinámicas en el menú (RF-18) · M — `b2380c8`
- [x] **Task 2** — Accesos header: "Mi pedido" + contadores (RF-19) · S — `ca32a90`
- [x] **Task 3** — Buscador global → `/products?search=` (RF-17) · M — `d8766f4`
- [x] **Checkpoint A** — header funcional ✓

## Phase 3B — Conversión y cierre
- [x] **Task 4** — FAB de WhatsApp + builder genérico con test (RF-16) · S — `0c1386a`
- [x] **Task 5** — Footer consistente (RF-20) · S — `0573846`
- [x] **Checkpoint B** — Fase 3 completa ✓

---
**Verificación por task:** `npm test` (10 tests, node:test) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación). Visual pendiente con `npm run dev` + backend Strapi.

**Logros:** categorías hardcodeadas (5 fijas) → `getAllCategories`; buscador global en header (desktop + mobile); contadores de favoritos/pedido con guard de hydration; FAB de WhatsApp; footer tokenizado.

**Siguiente:** Fase 4 — Listado/categoría (unificar paginación, breadcrumbs, orden, filtros, estados de carga/vacío, grid mobile compacto).

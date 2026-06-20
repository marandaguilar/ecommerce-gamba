# TODO — Fase 4: Listado / Categoría

**Fase 4 COMPLETA** (rama `redesign/phase-1-design-foundations`).
> Fases 1, 2, 3 ✓ completas — ver git log.

## Phase 4A — Fundaciones
- [x] **Task 1** — Data: orden (`lib/sort.ts` + test) + `getProducts({sort})` (RF-21/22) · S — `2460179`
- [x] **Task 2** — nuqs + `NuqsAdapter` (RF-23) · S — `268cd30`
- [x] **Task 3** — Controles: `sort-select` + `pagination-controls` (nuqs) (RF-22/23) · M — `d7b7251`
- [x] **Task 4** — Estados + breadcrumb (skeleton, empty, breadcrumb) (RF-25/22) · M — `ef5e9fd`
- [x] **Checkpoint A** — fundaciones y primitivos listos ✓

## Phase 4B — Migración de superficies
- [x] **Task 5** — Migrar `/products` server-driven (URL completa) (RF-21/22/23/24/25) · M/L — `048913d`
- [x] **Task 6** — Migrar `/category` (fix bug >50) (RF-21/22/23/25) · M — `b24bd88`
- [x] **Checkpoint B** — Fase 4 completa ✓

---
**Verificación por task:** `npm test` (16 tests) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación). Visual pendiente con `npm run dev` + backend.

**Logros:** listado y categoría unificados sobre `getProducts` (server-driven, estado en URL); **bug de categoría >50 resuelto**; breadcrumbs, orden, filtros (categoría/oferta), paginación y skeleton/empty; `ListingControls` compartido.

**Pendiente Fase 7 (limpieza):** `choose-category.tsx`, `category/[categorySlug]/components/filter-purchase.tsx` y `filters-controls-category.tsx` (muertos), hooks `api/` legacy, `<img>` en galería de detalle/miniaturas, `skeletonSchema.tsx` (ya no usado por los listados).

**Siguiente:** Fase 5 — Conversión (WhatsApp formalizado + "Mi pedido" multi-producto → WhatsApp).

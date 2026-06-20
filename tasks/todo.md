# TODO — Fase 4: Listado / Categoría

Lista derivada de `tasks/plan.md`. Implementar en orden con `/g-build`.
> Fases 1 (design system), 2 (product card) y 3 (header/nav) ✓ completas — ver git log.

## Phase 4A — Fundaciones
- [ ] **Task 1** — Capa de datos: orden (`lib/sort.ts` + test) + fetch unificado en `getProducts` (RF-21/22) · S
- [ ] **Task 2** — Estado en URL: instalar nuqs + `NuqsAdapter` en layout (RF-23) · S
- [ ] **Task 3** — Controles: `sort-select` + `pagination-controls` (nuqs) (RF-22/23) · M
- [ ] **Task 4** — Estados + breadcrumb: `breadcrumb`, `product-grid-skeleton`, `empty-state` (RF-25/22) · M
- [ ] **Checkpoint A** — fundaciones y primitivos listos; `npm test`+`tsc`+`lint`+compilación

## Phase 4B — Migración de superficies
- [ ] **Task 5** — Migrar `/products` al listado server-driven (URL: page/search/sort/category/offer) (RF-21/22/23/24/25) · M/L
- [ ] **Task 6** — Migrar `/category/[slug]` al patrón unificado (fix bug >50) (RF-21/22/23/25) · M
- [ ] **Checkpoint B** — Fase 4 completa

---
**Orden de dependencias:** (1, 2, 4) independientes ; 3 ← (1,2) ; 5 y 6 ← (1-4) ; 6 reusa patrón de 5
**Verificación por task:** `npm test` + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + visual `npm run dev` con backend.

**A resolver/limpiar:** bug de categoría >50 (fetch unificado); `getCategoryProducts` se deprecia; `products-client-wrapper`/`category-client-wrapper`/`search.tsx` se simplifican o eliminan.

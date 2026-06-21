# TODO — Fase 7: Limpieza

**Fase 7 COMPLETA** (rama `redesign/phase-1-design-foundations`).
> Fases 1, 2, 3, 4, 5, 6 ✓ completas — ver git log. **Rediseño cerrado (Fases 1-7).**

Plan completo en `tasks/plan.md`. Cubre **RNF-1** (`<img>`→`next/image`), **RNF-4** (sin código muerto) y **Spec §9** (remover Stripe).
> Inventario de muerto ya verificado por grep (importadores reales). Sin TDD nuevo: la red es la suite existente (28) + tsc/lint/build + grep.

## Phase 7A — Migración del `<img>` y borrado de código muerto
- [x] **Task 1** — `ProductImageMiniature` → `next/image` (RNF-1) · S — `ade9500`
- [x] **Task 2** — Borrar cluster muerto listado/categoría + `api/` legacy + `types/response` (RNF-4) · M — `0877962`
- [x] **Task 3** — Borrar sueltos: `skeletonSchema.tsx`, `icon-button.tsx`, ruta `success` (RNF-4/§9) · S — `b3ca720`
- [x] **Checkpoint A** — código muerto eliminado, cero `<img>` nativo ✓

## Phase 7B — Dependencias y tokens
- [x] **Task 4** — Remover deps sin uso: `@stripe/*`, `qs` (§9) · S — `19a5183`
- [x] **Task 5** — Remover tokens muertos `--chart-*` (cierra OQ Fase 1, RNF-4) · XS — pendiente commit
- [x] **Checkpoint B** — limpieza completa, rediseño cerrado ✓

---
**Verificación por task:** `npm test` (28) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + grep de importadores. `npm install` (Task 4) con `dangerouslyDisableSandbox`.

**Inventario de muerto (verificado):**
- `<img>` vivo restante: solo `product-image-miniature.tsx` (cart + favoritos) → Task 1.
- Cluster muerto: `choose-category.tsx`, `category/[categorySlug]/components/filters-controls-category.tsx` + `filter-purchase.tsx`, dir `api/` (4 hooks), `types/response.ts` → Task 2.
- Sueltos: `skeletonSchema.tsx`, `icon-button.tsx`, ruta `success` (asset `/images/success.png` ni existe) → Task 3.
- Deps sin uso: `@stripe/react-stripe-js`, `@stripe/stripe-js`, `qs` (toploader se conserva; next-themes ya removido) → Task 4.
- Tokens muertos: `--chart-1..5` + `--color-chart-*` en globals.css → Task 5.

**Open questions:** rename `carousel-product.tsx`→`product-gallery.tsx` (cosmético, default no); abrir PR al cerrar Fase 7; verificación visual del rediseño completo (necesita `npm run dev` + backend).

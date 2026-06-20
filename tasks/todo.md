# TODO — Fase 2: Product Card unificado + precios + badge "Oferta"

**Fase 2 COMPLETA** (rama `redesign/phase-1-design-foundations`).
> Fase 1 (fundaciones del design system) ✓ completada — ver git log.

## Phase 2A — Fundaciones del card
- [x] **Task 1** — Tipar y traer `isRebaja` (ProductType + strapi) (RF-7/9) · S — `aff7157`
- [x] **Task 2** — `formatPrice` robusto + helper `lib/whatsapp.ts` + tests (RF-11/8) · S — `f240d1e`
- [x] **Task 3** — Componente `ProductCard` unificado (RF-6/7/8/10) · M — `9e3db6f`
- [x] **Checkpoint A** — card creado; `tsc`+`lint` limpios ✓

## Phase 2B — Migración de superficies
- [x] **Task 4** — Migrar grid `/products` + borrar `carousel-products.tsx` · S — `a1bbb18`
- [x] **Task 5** — Migrar categoría + home section + borrar variante y muerto · M — `e308f0d`
- [x] **Task 6** — Migrar relacionados + borrar variante y muerto · M — `8358e41`
- [x] **Checkpoint B** — superficies principales unificadas ✓
- [x] **Task 7** — Migrar carruseles + limpiar legacy muerto · M — `f2ff208`
- [x] **Checkpoint C** — una sola card en todo el código; Fase 2 completa ✓

---
**Verificación por task:** `npm test` (8 tests, node:test) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + chequeo visual pendiente con `npm run dev` + backend Strapi.

**Resultado:** 1 sola implementación de product card (`components/shared/product-card.tsx`) en 6 superficies. Eliminadas 5 variantes + 4 archivos muertos.

**Pendiente para Fase 7 (limpieza):** componentes muertos restantes (`choose-category.tsx`, `filter-purchase.tsx`) y hooks legacy `api/` aún referenciados por páginas/muertos; `<img>` en galería de detalle y miniaturas.

**Siguiente:** Fase 3 — Header/navegación (buscador global, categorías dinámicas, accesos a favoritos/pedido, FAB WhatsApp).

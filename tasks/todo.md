# TODO — Fase 2: Product Card unificado + precios + badge "Oferta"

Lista derivada de `tasks/plan.md`. Implementar en orden con `/g-build`.
> Fase 1 (fundaciones del design system) ✓ completada — ver git log.

## Phase 2A — Fundaciones del card
- [ ] **Task 1** — Tipar y traer `isRebaja` (ProductType + strapi) (RF-7/9) · S
- [ ] **Task 2** — `formatPrice` robusto + helper `lib/whatsapp.ts` (RF-11/8) · S
- [ ] **Task 3** — Componente `ProductCard` unificado (RF-6/7/8/10) · M
- [ ] **Checkpoint A** — card renderiza ok; `tsc`+`lint`+compilación limpios

## Phase 2B — Migración de superficies (paralelizables; dependen de Task 3)
- [ ] **Task 4** — Migrar grid `/products` + borrar `carousel-products.tsx` · S
- [ ] **Task 5** — Migrar categoría + home section + borrar `product-card.tsx` y `category-section.tsx` muerto · M
- [ ] **Task 6** — Migrar relacionados + borrar `related-product-card.tsx` y `related-products.tsx` muerto · M
- [ ] **Checkpoint B** — superficies principales unificadas
- [ ] **Task 7** — Migrar carruseles (destacados+rebajas) + limpiar legacy muerto (`featured-products.tsx`, `rebaja-products.tsx`, hooks `api/`) · M
- [ ] **Checkpoint C** — una sola card en todo el código; Fase 2 completa

---
**Orden de dependencias:** (1, 2) → 3 → (4, 5, 6, 7)
**Verificación por task:** `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + chequeo visual `npm run dev` con backend Strapi.

**Variantes a eliminar (5 activas + muertas):** `category/.../product-card.tsx`, `products/.../carousel-products.tsx`, `related-product-card.tsx`, markup inline de los 2 carruseles; muertos: `category-section.tsx`, `related-products.tsx`, `featured-products.tsx`, `rebaja-products.tsx`.

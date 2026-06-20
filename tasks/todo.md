# TODO — Fase 3: Header / Navegación

Lista derivada de `tasks/plan.md`. Implementar en orden con `/g-build`.
> Fases 1 (design system) y 2 (product card) ✓ completas — ver git log.

## Phase 3A — Navegación principal (en orden; tocan navbar.tsx)
- [ ] **Task 1** — Categorías dinámicas en el menú (layout → navbar → menús) (RF-18) · M
- [ ] **Task 2** — Accesos header: "Mi pedido" + contadores favoritos/carrito (RF-19) · S
- [ ] **Task 3** — Buscador global en el header → `/products?search=` (RF-17) · M
- [ ] **Checkpoint A** — header funcional; `tsc`+`lint`+compilación limpios

## Phase 3B — Conversión y cierre
- [ ] **Task 4** — FAB de WhatsApp + builder genérico con test (RF-16) · S
- [ ] **Task 5** — Footer consistente con el design system y el header (RF-20) · S
- [ ] **Checkpoint B** — Fase 3 completa

---
**Orden de dependencias:** 1 → 2 → 3 (mismo navbar) ; 4 y 5 independientes
**Verificación por task:** `npm test` + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + visual `npm run dev` con backend.

**Hardcode a eliminar:** arrays de categorías en `menu-list.tsx` e `items-menu-mobile.tsx` (5 fijas) → fuente única `getAllCategories`.

# TODO — Fase 6: Detalle de producto (galería)

**Fase 6 COMPLETA** (rama `redesign/phase-1-design-foundations`).
> Fases 1, 2, 3, 4, 5 ✓ completas — ver git log.

Plan completo en `tasks/plan.md`. Cubre **RF-26 a RF-28**.
> RF-27 (jerarquía + CTAs) ya resuelto en Fase 5 (Task 4 `info-product`); RF-28 ya usa el card unificado — Fase 6 = **galería** + pulido skeleton/relacionados.

## Phase 6A — Galería
- [x] **Task 1** — Imagen principal `next/image` + aspecto fijo + placeholder (helper testeable) (RF-26/RNF-1, edge: sin imágenes) · M — `b6abcd1`
- [x] **Task 2** — Thumbnails sincronizados con embla (`setApi`) (RF-26) · M — `a0f1e93`
- [x] **Checkpoint A** — galería navegable y performante (next/image + thumbnails) ✓

## Phase 6B — Zoom y soporte
- [x] **Task 3** — Zoom de imagen, overlay hand-rolled sin radix-dialog (RF-26) · M — `04f14ce`
- [x] **Task 4** — Skeleton + relacionados alineados al design system (RF-25/28/24) · S — pendiente commit
- [x] **Checkpoint B** — detalle completo y consistente ✓

---
**Verificación por task:** `npm test` + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación). Visual/runtime con `npm run dev` + backend + **Chrome DevTools** (LCP/CLS, navegación, zoom, consola limpia).

**Decisiones clave:** reutilizar el carousel embla existente (cero deps nuevas, RNF-5); `next/image` + contenedor de aspecto (anti-CLS); placeholder de marca vía helper puro (único TDD real de la fase); thumbnails bidireccionales vía `setApi`; zoom hand-rolled (precedente breadcrumb); relacionados al grid 2-col del listado.

**Fuera de alcance / diferido a Fase 7:** `ProductImageMiniature` (`<img>` en cart/favoritos), `components/icon-button.tsx` (orphan de Fase 5), rename `carousel-product.tsx`→`product-gallery.tsx`.

**Open questions:** ¿hacer el zoom (Task 3) o recortarlo? · aspect ratio `square` vs `4/3` · rename del archivo de galería.

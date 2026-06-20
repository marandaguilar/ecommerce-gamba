# TODO — Fase 5: Conversión (WhatsApp + "Mi pedido")

**Fase 5 PENDIENTE** (rama `redesign/phase-1-design-foundations`).
> Fases 1, 2, 3, 4 ✓ completas — ver git log.

Plan completo en `tasks/plan.md`. Cubre **RF-12 a RF-16**.

## Phase 5A — Fundación de conversión
- [ ] **Task 1** — Helper `buildOrderWhatsappUrl` + tests (RF-12/14) · S
- [ ] **Task 2** — `/cart` → "Mi pedido" + envío WhatsApp (RF-14/15, edge: pedido vacío) · M
- [ ] **Checkpoint A** — pedido enviable por WhatsApp como un solo mensaje

## Phase 5B — Orígenes del pedido y coherencia
- [ ] **Task 3** — CTA "Agregar a mi pedido" en product card (RF-8/14) · S
- [ ] **Task 4** — Detalle: CTAs WhatsApp + agregar + favorito toggle + precios mayorista-first (RF-12/14/27 parcial) · M
- [ ] **Task 5** — Favoritos rediseñada + WhatsApp + mover a pedido (RF-13/15) · M
- [ ] **Task 6** — Navbar: WhatsApp por helper + coherencia copy (RF-12/19) · XS
- [ ] **Checkpoint B** — embudo completo, cero WhatsApp hardcodeado

---
**Verificación por task:** `npm test` + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación). Visual pendiente con `npm run dev` + backend.

**Decisiones clave:** un solo `buildOrderWhatsappUrl` reusado por pedido y favoritos; "Mi pedido" reusa el store `useCart` SIN cantidades; ruta `/cart` se mantiene (solo cambia copy); verde solo vía token `--whatsapp`; mayorista-first en todo el embudo; `EmptyState` (Fase 4) para estados vacíos.

**Fuera de alcance (Spec §9):** Stripe/checkout, cantidades, cambios a Strapi. **Diferido a Fase 7:** `next/image` en `ProductImageMiniature`.

**Open questions:** cantidades, límite de URL WhatsApp, renombrar `/cart` → `/mi-pedido`.

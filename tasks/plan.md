# Implementation Plan — Fase 6: Detalle de producto (galería)

> Deriva de `Spec.md` → sección 11, Fase 6. Cubre **RF-26 a RF-28**: galería mejorada (`next/image`, thumbnails y/o zoom, navegación clara), jerarquía de info y relacionados con el card unificado.
> **Read-only plan.** La implementación es responsabilidad de `/g-build`.
> Fases 1 (design system), 2 (product card), 3 (header/nav), 4 (listado/categoría) y 5 (conversión) ya completas — ver git log de `redesign/phase-1-design-foundations`.

## Overview

El detalle de producto ya tiene **la mitad de la Fase 6 hecha** por arrastre de fases anteriores:

- **RF-27 (jerarquía de info + CTAs)** ya se resolvió en Fase 5 (Task 4 `info-product.tsx`): nombre + categoría + **precios mayorista-first** + descripción + CTAs WhatsApp/"Agregar a mi pedido"/favorito-toggle. Esta fase **no lo re-implementa**, solo lo conserva.
- **RF-28 (relacionados con card unificado)** ya usa `ProductCard` (`related-products-server.tsx`). Falta solo **alinear su grid** al patrón compacto 2-col mobile del listado (hoy arranca en `grid-cols-1`) y al espaciado del design system.

Lo que **falta de verdad** es la **galería (RF-26)**, que es el último resto de deuda visual y de performance:

- `carousel-product.tsx` usa **`<img>` nativo** (no `next/image`) → impacto en LCP/CLS (RNF-1), sin `sizes` ni contenedor de aspecto fijo.
- **Sin thumbnails**: en productos con varias imágenes solo se navega con flechas; no hay vista de conjunto ni acceso directo a una imagen.
- **Sin zoom**: no se puede ver el detalle de la imagen (relevante para artículos de limpieza: etiquetas, presentación).
- **Sin placeholder de marca** cuando el producto no tiene imágenes (Spec §8: `return null` actual → galería vacía/rota).
- El **skeleton** (`skeleton-product.tsx`) usa tamaños en px fijos que no matchean el layout 2-col real ni los tokens del sistema.

Esta fase reconstruye la galería sobre el carousel embla ya disponible (sin nuevas dependencias): `next/image` + contenedor de aspecto + placeholder, thumbnails sincronizados, zoom hand-rolled (sin radix-dialog), y deja skeleton/relacionados consistentes.

## Architecture Decisions

- **Reutilizar el carousel embla existente (`components/ui/carousel.tsx`), cero deps nuevas (RNF-5):** ya expone `setApi` → da acceso a la API embla para sincronizar thumbnails (`scrollTo`, `selectedScrollSnap`, evento `select`). No se agrega `embla-carousel-react` extra ni librerías de lightbox.
- **`next/image` con contenedor de aspecto fijo (RNF-1):** la imagen principal pasa a `Image fill object-contain` dentro de un contenedor con relación de aspecto estable (p. ej. `aspect-square`/`aspect-[4/3]`) → elimina CLS y mejora LCP. La primera imagen marca `priority`. `sizes` acorde al layout 2-col del detalle.
- **Placeholder de marca cuando no hay imágenes (Spec §8):** función pura y testeable que normaliza `images` (filtra vacíos / cae a placeholder) → la galería nunca renderiza `null` ni un `<img>` roto. Único punto con TDD real de la fase (`lib/gallery.ts` o helper colocalizado + test node:test).
- **Thumbnails sincronizados bidireccionalmente:** click en thumb → `api.scrollTo(i)`; `select` de embla → resalta el thumb activo y hace scroll del thumb a la vista. Si hay **una sola imagen**, no se renderiza la tira de thumbnails (evita ruido).
- **Zoom hand-rolled sin radix-dialog (RNF-5):** overlay propio (precedente: breadcrumb hand-authored de Fase 4) — `fixed inset-0` con backdrop, imagen ampliada, cierre por botón / click-outside / `Esc`, `aria-modal` + foco. RF-26 pide thumbnails **y/o** zoom: con thumbnails ya se cumple el mínimo, así que el zoom es **mejora opcional** (ver Open Questions) — se implementa simple, sin pan/zoom-gestures.
- **Relacionados alineados al listado (RF-28/24):** el grid de `related-products-server.tsx` adopta `grid-cols-2 ... xl:grid-cols-5` + gaps del listado, para densidad consistente en mobile. Sigue usando `ProductCard` (ya `next/image`).
- **Galería como componente client aislado:** la lógica de thumbnails/zoom (estado, `setApi`) vive en el componente de galería (`carousel-product.tsx`, se conserva el nombre de archivo para minimizar churn); `page.tsx` (server) solo le pasa `images` + `productName`. No se toca el fetch/ISR.
- **Verificación:** `npm test` (suma el test del helper de placeholder) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación). Lo visual/runtime de la galería (LCP, sin CLS, navegación, zoom) se valida con `npm run dev` + backend y **Chrome DevTools** (skill `google-browser-testing-with-devtools`): consola limpia, screenshot, thumbnails y zoom funcionando.

## Grafo de dependencias

```
Task 1 (next/image + aspecto + placeholder)   ← base de la galería (incl. helper testeable)
        │
        ├──────────────► Task 2 (thumbnails sincronizados)
        │                         │
        └──────────────► Task 3 (zoom hand-rolled)   ← opcional, sobre la galería
                                  │
Task 4 (skeleton + relacionados alineados)  ← soporte, independiente del 2/3
```

Orden: primero la imagen principal correcta (next/image + placeholder, ya shippable), luego thumbnails, luego zoom (opcional), y por último el pulido de skeleton/relacionados.

---

## Task List

### Phase 6A — Galería

#### Task 1 — Imagen principal con `next/image`, aspecto fijo y placeholder — M

**Descripción:** Migrar la imagen principal de la galería de `<img>` a `next/image` dentro de un contenedor de aspecto estable, con `priority` en la primera, `sizes` acorde al layout, y un **placeholder de marca** cuando el producto no tiene imágenes (vía helper puro testeable).

**Criterios de aceptación:**
- [ ] La imagen principal usa `Image` (`fill`, `object-contain`) en un contenedor con relación de aspecto fija (sin CLS); primera imagen `priority`, con `sizes` acorde a 2-col del detalle.
- [ ] Producto sin imágenes → placeholder de marca (no `null`, no `<img>` roto). Helper puro normaliza `images` (filtra vacíos / fallback).
- [ ] Sin `<img>` nativo en la imagen principal; sin `dark:`; usa tokens del sistema.

**Verificación:**
- [ ] `npm test` — nuevos casos del helper: lista normal se devuelve igual; lista vacía/`null`/imágenes sin `url` → fallback de placeholder.
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación).
- [ ] Manual/DevTools: imagen nítida sin salto de layout; producto sin imágenes muestra placeholder.

**Dependencias:** Ninguna.
**Archivos:** `app/(routes)/product/[productSlug]/components/carousel-product.tsx`, helper nuevo (`lib/gallery.ts` + `lib/gallery.test.ts`), opcional `page.tsx` (sizes/layout). — **Scope: M**

#### Task 2 — Thumbnails sincronizados con la imagen principal — M

**Descripción:** Agregar una tira de thumbnails (`next/image`) debajo de la imagen principal, sincronizada con el carousel embla vía `setApi`: click en thumb mueve la principal, el thumb activo se resalta. Se oculta si hay una sola imagen.

**Criterios de aceptación:**
- [ ] Tira de thumbnails (`next/image`) bajo la principal; click → `api.scrollTo(i)`.
- [ ] El thumb del slide activo se resalta (borde/anillo con token `--primary`) y se actualiza con el evento `select` de embla y con las flechas.
- [ ] Con una sola imagen no se renderiza la tira. Thumbnails accesibles (`button aria-label`).
- [ ] Sin loops de re-render (suscripción/limpieza correcta al `select`).

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación); `npm test` sin regresiones.
- [ ] Manual/DevTools: click en thumbs cambia la principal y resalta; flechas actualizan el thumb activo; consola limpia.

**Dependencias:** Task 1.
**Archivos:** `app/(routes)/product/[productSlug]/components/carousel-product.tsx`. — **Scope: M**

### Checkpoint A — Galería navegable y performante
- [ ] `npm test` verde, build compila.
- [ ] La imagen principal es `next/image` sin CLS, con thumbnails que navegan; placeholder cuando no hay imágenes.

### Phase 6B — Zoom y soporte

#### Task 3 — Zoom de imagen (overlay hand-rolled, opcional) — M

**Descripción:** Permitir ampliar la imagen principal en un overlay propio (sin radix-dialog): click o botón "ampliar" abre `fixed inset-0` con backdrop e imagen grande; cierre por botón, click-outside y `Esc`.

**Criterios de aceptación:**
- [ ] Click en la imagen principal (o botón "ampliar") abre el overlay con la imagen actual en grande (`next/image`, `object-contain`).
- [ ] Cierre por botón ✕, click en backdrop y tecla `Esc`; `role="dialog"`/`aria-modal`, foco gestionado, scroll del body bloqueado mientras está abierto.
- [ ] Sin nuevas dependencias; tokens del sistema; sin `dark:`.

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación); `npm test` sin regresiones.
- [ ] Manual/DevTools: abre/cierra por los 3 medios; `Esc` y click-outside funcionan; consola limpia.

**Dependencias:** Task 1 (opcionalmente Task 2 para abrir desde la imagen activa).
**Archivos:** `app/(routes)/product/[productSlug]/components/carousel-product.tsx` (+ posible `image-zoom.tsx` colocalizado). — **Scope: M**

#### Task 4 — Skeleton y relacionados alineados al design system — S

**Descripción:** Actualizar `skeleton-product.tsx` para que matchee el layout real 2-col (galería + info) con tokens y aspecto, y alinear el grid de `related-products-server.tsx` al patrón compacto 2-col mobile del listado.

**Criterios de aceptación:**
- [ ] Skeleton refleja el layout 2-col (bloque de galería con aspecto + tira de thumbs + líneas de info y CTAs), sin tamaños px arbitrarios que descuadren.
- [ ] Grid de relacionados usa `grid-cols-2 ... xl:grid-cols-5` + gaps del listado; título con `font-display` y espaciado consistente.
- [ ] Sin `dark:`; usa `Skeleton` y tokens.

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación); `npm test` sin regresiones.
- [ ] Manual/DevTools: el skeleton no “salta” al cargar; relacionados en 2-col mobile como el listado.

**Dependencias:** Task 1 (para que el skeleton matchee la galería final). Independiente de Task 2/3.
**Archivos:** `app/(routes)/product/[productSlug]/components/skeleton-product.tsx`, `app/(routes)/product/[productSlug]/components/related-products-server.tsx`. — **Scope: S**

### Checkpoint B — Detalle completo
- [ ] Galería con `next/image` + thumbnails (+ zoom), placeholder, skeleton y relacionados consistentes con el design system.
- [ ] Flujo end-to-end del detalle: ver imágenes (navegar/ampliar) → precios mayorista-first → CTAs de conversión → relacionados.
- [ ] `npm test` verde, build compila, lint limpio. Validación visual con DevTools registrada.

---

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Loop de re-render al sincronizar thumbnails con embla | Medio | Suscribir/desuscribir `select` en `useEffect` con cleanup; derivar el índice activo del estado de embla, no de props. |
| CLS por imágenes de alto variable | Medio | Contenedor de aspecto fijo + `fill object-contain`; `sizes` correcto. |
| Tentación de agregar radix-dialog / lib de lightbox/zoom | Bajo | Overlay hand-rolled (precedente breadcrumb Fase 4); RNF-5. |
| `next/image` con dominios de Strapi no configurados | Medio | El proyecto ya usa `next/image` con Strapi en el card (Fases 2/4) → `next.config` ya habilita el host; reutilizar el mismo patrón de `url`. |
| Scope creep hacia pan/zoom con gestos o fullscreen API | Bajo | Zoom mínimo (overlay + object-contain); gestos quedan fuera. |

## Open Questions

- **Zoom (Task 3) ¿se hace?** RF-26 pide thumbnails **y/o** zoom; con Task 2 ya se cumple. Default: implementarlo simple por valor en limpieza (etiquetas), pero es el candidato a recortar si se prefiere cerrar la fase antes.
- **Aspect ratio de la imagen principal:** ¿`square` o `4/3`? Default sugerido: `aspect-square` con `object-contain` (consistente con el card). A validar visualmente.
- **Rename `carousel-product.tsx` → `product-gallery.tsx`:** más descriptivo ahora que tiene thumbnails+zoom. Default: mantener el nombre para minimizar churn (se puede renombrar en Fase 7).
- **`ProductImageMiniature` (`<img>` en cart/favoritos):** sigue diferido a Fase 7 (limpieza), no entra acá.

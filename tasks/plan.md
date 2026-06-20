# Implementation Plan — Fase 5: Conversión (WhatsApp + "Mi pedido")

> Deriva de `Spec.md` → sección 11, Fase 5. Cubre **RF-12 a RF-16**: formalizar WhatsApp como canal de compra con mensajes prellenados, convertir el carrito muerto en **"Mi pedido" multi-producto → un único mensaje de WhatsApp**, y dejar favoritos + pedido coherentes y accesibles.
> **Read-only plan.** La implementación es responsabilidad de `/g-build`.
> Fases 1 (design system), 2 (product card), 3 (header/nav) y 4 (listado/categoría) ya completas — ver git log de `redesign/phase-1-design-foundations`.

## Overview

La conversión real ocurre por **WhatsApp**, pero hoy ese camino está a medio cablear y con deuda:

- `lib/whatsapp.ts` ya centraliza el mensaje **por producto** (`buildWhatsappUrl`) y el general (`buildGeneralWhatsappUrl`), y la **product card** ya usa el primero (Fase 2). Falta el mensaje **multi-ítem** para el pedido completo.
- La página `/cart` es un **checkout muerto**: título "Carrito de compras", suma `price` (menudeo) como "Total de la orden" y un botón **"Comprar" → `console.log`**. No envía nada por WhatsApp.
- `loved-products/page.tsx` e `info-product.tsx` **arman la URL de WhatsApp a mano** (`phoneNumber` hardcodeado, `bg-green-600` fuera del token `--whatsapp`, `Array.map` sin formato → `productName,productName`). `info-product` además tiene el botón "Comprar" muerto comentado y NO ofrece "Agregar a mi pedido".
- La **product card** no tiene CTA "Agregar a mi pedido" (solo "Pedir" directo + favorito); el store `useCart` existe y el navbar ya cuenta sus ítems, pero nada lo llena salvo código muerto comentado.
- El navbar arma su propio `openWhatsapp` hardcodeado en vez de usar el helper.

Esta fase **formaliza el embudo**: un único helper de mensaje multi-ítem (puro, testeado), `/cart` rediseñada como **"Mi pedido"** que envía todos los ítems por WhatsApp, CTA "Agregar a mi pedido" en card y detalle, favoritos coherente con el design system y enviable por WhatsApp, y limpieza del WhatsApp hardcodeado restante. Sin tocar Strapi ni Stripe (queda fuera de alcance, Spec §9).

## Architecture Decisions

- **Un solo constructor de mensajes en `lib/whatsapp.ts`:** agregar `buildOrderWhatsappUrl(items, { baseUrl?, intro? })` — función **pura y testeada** (node:test, igual que Fase 2/4) que arma **un único** `wa.me` con todos los ítems en formato legible (nombre · precio mayoreo-first · link). Favoritos y "Mi pedido" la reusan con distinto `intro` → cero duplicación, cero teléfonos hardcodeados. Centraliza el formato exigido por el edge case "muchos ítems / límite de URL" (Spec §8).
- **"Mi pedido" = el store de carrito reusado, SIN cantidades:** `useCart` ya es una lista dedup de `ProductType` (1 por producto) con `persist`. RF-14 dice "cantidad **si aplica**"; agregar cantidades implica cambiar el shape del store + steppers en UI = scope mayor y riesgo de regresión en el contador del navbar. **Decisión:** mantener el modelo 1-por-producto en esta fase (sin deuda: el helper acepta `quantity?` opcional para no cerrar la puerta). Cantidades quedan como Open Question.
- **Ruta interna `/cart` se mantiene; el copy es "Mi pedido":** renombrar la ruta obligaría redirects y tocar navbar/footer/links por un beneficio cosmético. Se conserva `app/(routes)/cart` y se cambia solo el texto visible y la semántica (envío WhatsApp en vez de checkout). El navbar ya rotula el ícono "Mi pedido".
- **Verde solo WhatsApp, vía token (RN-2):** todos los CTAs de envío pasan a `bg-whatsapp text-whatsapp-foreground` (se elimina el `bg-green-600` hardcodeado de `loved-products` e `info-product`).
- **Mayorista-first en todo el embudo (RN-1):** `cart-item`, la página de pedido y `info-product` muestran el **mayoreo protagonista** y el menudeo secundario, vía `formatPrice` (que ya devuelve `null` → "Consultar"). Se elimina el "Total de la orden" (no aplica a un pedido-consulta por WhatsApp; los precios mayoreo/menudeo conviven y el cierre es por chat).
- **Estados vacíos con el componente compartido:** se reusa `components/listing/empty-state.tsx` (Fase 4) para "Mi pedido vacío" y "Sin favoritos" con CTA a explorar (Spec §8).
- **`next/image` en miniaturas queda para Fase 7:** `ProductImageMiniature` usa `<img>`; está listado explícitamente en la limpieza de Fase 7. No se toca aquí para no mezclar concerns (disciplina de scope).
- **Verificación:** `npm test` (suite node:test, suma casos de `buildOrderWhatsappUrl`) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + visual con `npm run dev` + backend Strapi.

## Grafo de dependencias

```
Task 1 (helper buildOrderWhatsappUrl + tests)   ← foundation, pura/testeable
        │
        ├──────────────► Task 2 (/cart → "Mi pedido" + envío WhatsApp)
        │                         │
Task 3 (CTA "Agregar a mi pedido" en product card) ─┘  (llena el pedido)
        │
        ├──────────────► Task 4 (detalle: CTAs WhatsApp + agregar + favorito toggle)
        │
        └──────────────► Task 5 (favoritos rediseñada + WhatsApp + mover a pedido)

Task 6 (navbar: WhatsApp por helper + coherencia copy) ← independiente, cierre
```

Orden: helper primero (todo lo demás lo consume), luego destino del pedido (`/cart`), luego los orígenes que lo llenan (card, detalle), favoritos, y limpieza final del navbar.

---

## Task List

### Phase 5A — Fundación de conversión

#### Task 1 — Helper de mensaje multi-ítem (`buildOrderWhatsappUrl`) — S

**Descripción:** Agregar a `lib/whatsapp.ts` una función pura que arme **un único** enlace `wa.me` a partir de una lista de productos, en formato legible y mayorista-first, reusable por "Mi pedido" y favoritos.

**Criterios de aceptación:**
- [ ] `buildOrderWhatsappUrl(items, options?)` donde `items: { productName: string; slug: string; price_mayoreo?: number|null; price?: number|null; quantity?: number }[]` y `options?: { baseUrl?: string; intro?: string }`.
- [ ] Devuelve `https://wa.me/${WHATSAPP_PHONE}?text=...` con `intro` (default tipo "Hola, quiero hacer este pedido:") seguido de una línea por ítem: nombre + precio (mayoreo si existe, si no menudeo, vía `formatPrice`) + link al producto si hay `baseUrl`.
- [ ] Si `items` está vacío, devuelve una URL válida con un mensaje genérico (no rompe).
- [ ] Todo el texto va `encodeURIComponent`. Sin teléfonos hardcodeados (usa `WHATSAPP_PHONE`).

**Verificación:**
- [ ] `npm test` — nuevos casos en `lib/whatsapp.test.ts`: apunta al teléfono; incluye los nombres de **todos** los ítems; usa mayoreo cuando existe y cae a menudeo cuando no; incluye links con `baseUrl`; lista vacía → URL válida; `intro` personalizado se codifica.
- [ ] `npx tsc --noEmit`, `npx next lint`.

**Dependencias:** Ninguna.
**Archivos:** `lib/whatsapp.ts`, `lib/whatsapp.test.ts`. — **Scope: S**

#### Task 2 — `/cart` → "Mi pedido" con envío por WhatsApp — M

**Descripción:** Rediseñar la página del carrito como **"Mi pedido"**: lista de ítems con design system, estado vacío con CTA, y botón "Enviar pedido por WhatsApp" que usa `buildOrderWhatsappUrl`. Eliminar el checkout muerto ("Total de la orden" + "Comprar" → `console.log`).

**Criterios de aceptación:**
- [ ] Título y copy "Mi pedido"; precios mayorista-first en `cart-item` (mayoreo protagonista, menudeo secundario, `formatPrice`).
- [ ] Pedido vacío → `EmptyState` con CTA a `/products`. Se elimina el bloque "Resumen de la compra"/"Comprar"/`console.log` y la suma de menudeo como total.
- [ ] Botón "Enviar pedido por WhatsApp" (`bg-whatsapp`) que abre `buildOrderWhatsappUrl(items, { baseUrl, intro })`; deshabilitado/oculto si el pedido está vacío. Opción "Vaciar pedido" (`removeAll`).
- [ ] `cart-item` con botón de eliminar accesible (`<button aria-label>`, no `onClick` en el ícono `X`).
- [ ] Guard de hydration para leer el store persistido (patrón ya usado en navbar/card).

**Verificación:**
- [ ] `npm test` (sin regresiones), `npx tsc --noEmit`, `npx next lint`, `next build` (compilación).
- [ ] Manual: agregar ítems → `/cart` los lista → "Enviar" abre WhatsApp con todos; vaciar y pedido-vacío muestran estado correcto.

**Dependencias:** Task 1.
**Archivos:** `app/(routes)/cart/page.tsx`, `app/(routes)/cart/components/cart-item.tsx`. — **Scope: M**

### Checkpoint A — Pedido enviable
- [ ] `npm test` verde, build compila.
- [ ] El usuario puede ver "Mi pedido" y enviarlo por WhatsApp como un solo mensaje.

### Phase 5B — Orígenes del pedido y coherencia

#### Task 3 — CTA "Agregar a mi pedido" en product card — S

**Descripción:** Sumar a la product card el botón "Agregar a mi pedido" (`useCart.addItem`), conservando "Pedir por WhatsApp" directo y el favorito. Mantener la card compacta en mobile (2-col).

**Criterios de aceptación:**
- [ ] Botón "Agregar a mi pedido" (ícono carrito) que llama `addItem(product)`; el toast y la dedup ya los provee el store; el contador del navbar refleja el alta.
- [ ] Layout compacto coherente con Fase 2/4 (no rompe el grid de 2 columnas mobile); sin `dark:`, usando Button/tokens.
- [ ] Sin hydration mismatch (la card ya monta-guard para favoritos).

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación); `npm test` sin regresiones.
- [ ] Manual: click agrega al pedido y el contador del navbar sube; reagregar muestra el toast de "ya está".

**Dependencias:** Task 2 (destino del pedido listo).
**Archivos:** `components/shared/product-card.tsx`. — **Scope: S**

#### Task 4 — Detalle de producto: CTAs de conversión formalizados — M

**Descripción:** En `info-product.tsx`, reemplazar el WhatsApp hardcodeado por `buildWhatsappUrl`, agregar "Agregar a mi pedido" (`addItem`), convertir el favorito en **toggle** (add/remove con estado), y aplicar jerarquía de precios mayorista-first. (La galería/zoom RF-26 es Fase 6; aquí solo el bloque de conversión y precios.)

**Criterios de aceptación:**
- [ ] CTA WhatsApp usa `buildWhatsappUrl(product, baseUrl)` con `bg-whatsapp` (sin `green-600` ni teléfono hardcodeado).
- [ ] Botón "Agregar a mi pedido" (`addItem`) visible; se elimina el bloque "Comprar" comentado muerto.
- [ ] Favorito = toggle con estado montado (add/remove, `aria-pressed`, corazón relleno), consistente con la card.
- [ ] Precios mayorista-first (mayoreo protagonista, menudeo secundario, `formatPrice` con "Consultar" si falta).

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación); `npm test` sin regresiones.
- [ ] Manual: en detalle, WhatsApp prellena el producto; "Agregar a mi pedido" sube el contador; el corazón togglea.

**Dependencias:** Task 1, Task 3 (patrón de "agregar").
**Archivos:** `app/(routes)/product/[productSlug]/components/info-product.tsx`. — **Scope: M**

#### Task 5 — Favoritos rediseñada + WhatsApp + mover a pedido — M

**Descripción:** Rediseñar `loved-products/page.tsx` con el design system: estado vacío con CTA, consulta por WhatsApp vía `buildOrderWhatsappUrl` (intro de favoritos), y por ítem "Agregar a mi pedido" además de quitar. Limpiar el WhatsApp hardcodeado y `bg-green-600`.

**Criterios de aceptación:**
- [ ] Sin favoritos → `EmptyState` con CTA a `/products`. Copy y estilos con tokens (no `green-600`, no map crudo).
- [ ] Botón "Consultar por WhatsApp" usa `buildOrderWhatsappUrl(lovedItems, { baseUrl, intro: "..." })`.
- [ ] Cada `loved-item-product` permite "Agregar a mi pedido" (`addItem`) y "Quitar" (`removeLovedItem`) con botones accesibles; precios mayorista-first.
- [ ] Guard de hydration para el store persistido.

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación); `npm test` sin regresiones.
- [ ] Manual: favoritos lista, "Consultar" abre WhatsApp con todos, "Agregar a mi pedido" mueve al pedido, vacío muestra estado.

**Dependencias:** Task 1, Task 3.
**Archivos:** `app/(routes)/loved-products/page.tsx`, `app/(routes)/loved-products/components/loved-item-product.tsx`. — **Scope: M**

#### Task 6 — Navbar: WhatsApp por helper + coherencia de copy — XS

**Descripción:** Reemplazar el `openWhatsapp` hardcodeado del navbar por `buildGeneralWhatsappUrl` (como el FAB) y verificar coherencia del acceso "Mi pedido"/favoritos con contador (RF-19).

**Criterios de aceptación:**
- [ ] El botón de WhatsApp del navbar usa `buildGeneralWhatsappUrl` (sin teléfono/mensaje hardcodeados).
- [ ] Accesos a favoritos y "Mi pedido" con contador siguen funcionando (sin regresión del guard de hydration).

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación); `npm test` sin regresiones.
- [ ] Manual: el ícono de WhatsApp del header abre el mismo destino que el FAB.

**Dependencias:** Ninguna (puede ir al final).
**Archivos:** `components/navbar.tsx`. — **Scope: XS**

### Checkpoint B — Embudo de conversión completo
- [ ] Todos los CTAs (card, detalle, favoritos, pedido, navbar, FAB) usan los helpers centralizados; cero WhatsApp hardcodeado.
- [ ] Flujo end-to-end: descubrir → agregar a pedido → enviar pedido por WhatsApp; y descubrir → favorito → consultar/mover a pedido.
- [ ] `npm test` verde, build compila, lint limpio.

---

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| URL de WhatsApp demasiado larga con muchos ítems | Medio | Formato compacto (una línea por ítem); `buildOrderWhatsappUrl` testeado; evaluar truncado/aviso si crece (Open Question). |
| Hydration mismatch al leer `useCart`/`useLovedProducts` persistidos | Medio | Reusar el patrón `mounted` ya probado en navbar/card en todas las páginas client nuevas. |
| Scope creep hacia cantidades o checkout | Medio | Decisión explícita: sin cantidades, sin Stripe (Spec §9); helper deja `quantity?` abierto sin implementarlo. |
| Mezclar la galería del detalle (Fase 6) | Bajo | Task 4 toca solo el bloque de conversión/precios de `info-product`, no la galería. |

## Open Questions

- **Cantidades en "Mi pedido"** (RF-14 "si aplica"): ¿se necesitan steppers de cantidad o alcanza 1-por-producto? Default actual: 1-por-producto.
- **Límite de URL de WhatsApp**: si un pedido es enorme, ¿truncar con "...y N ítems más" o avisar? Default: enviar completo.
- **Ruta `/cart`**: ¿renombrar a `/mi-pedido` por SEO/claridad o mantener? Default: mantener (solo cambia el copy).
- **`next/image` en miniaturas**: se difiere a Fase 7 (limpieza) junto con el resto de `<img>`.

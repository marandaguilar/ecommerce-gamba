# Implementation Plan — Fase 2: Product Card unificado + precios + badge "Oferta"

> Deriva de `Spec.md` → sección 11, Fase 2. Cubre **RF-6 a RF-11**: un único componente de product card, precios mayorista-first, badge "Oferta", `next/image` y `formatPrice` consistente.
> **Read-only plan.** La implementación es responsabilidad de `/g-build`.
> Fase 1 (fundaciones del design system) ya completada — ver git log de `redesign/phase-1-design-foundations`.

## Overview

Hoy existen **5 variantes divergentes** del product card que muestran información inconsistente (unas con doble precio, otras solo el nombre), usan `<img>` nativo y duplican lógica. Esta fase crea **un único `ProductCard`** que consume los tokens de la Fase 1 (`--offer`, `--whatsapp`, `--fresh`, `--primary`), muestra el **precio mayoreo como protagonista**, un **badge "Oferta"** cuando `isRebaja`, usa `next/image`, y un CTA orientado a conversión (WhatsApp + favorito). Luego migra todos los consumidores a ese card y elimina las variantes y el código muerto.

## Architecture Decisions

- **Un solo componente** `components/shared/product-card.tsx`, agnóstico al ancho (llena su contenedor) para servir tanto a grids (2-5 columnas) como a `CarouselItem` (basis-1/5). Reemplaza las 5 variantes.
- **`next/image` con `fill` + `sizes`** dentro de un contenedor `relative` de alto fijo y `object-contain` (los productos de limpieza tienen fondos variados). El host de imágenes **ya está configurado** en `next.config.ts` (`**.strapiapp.com` + host del backend) → no se toca config.
- **Precio mayorista-first (RF-10):** mayoreo grande/bold/`text-primary`; menudeo chico/`text-muted-foreground` con etiqueta. Si falta `price_mayoreo`, el menudeo pasa a protagonista (Spec §8).
- **Badge "Oferta" (RF-9):** puramente visual, `bg-offer text-offer-foreground`, mostrado cuando `product.isRebaja === true`. Requiere **tipar y traer** `isRebaja` (hoy el backend lo filtra pero no lo selecciona ni está en `ProductType`).
- **Badge de categoría:** se reutiliza el componente existente `components/shared/product-categories.tsx` (su mapa de colores hardcodeado queda fuera de scope; se anota).
- **CTA de conversión (RF-8):** en esta fase, **"Pedir por WhatsApp"** (mensaje prellenado por producto via helper `lib/whatsapp.ts`) + **favorito** (corazón con toggle usando `useLovedProducts`). El botón **"Agregar a mi pedido"** (carrito multi-producto) es de la **Fase 5** y se deja anotado, no se implementa acá.
- **`formatPrice` robusto (RF-11):** se agrega guarda para `undefined`/`NaN` (hoy produciría `$NaN`).
- **Migración incremental por superficie:** se migra y verifica un consumidor a la vez, borrando cada card vieja recién cuando todos sus consumidores usan el unificado (rollback-friendly).
- **Verificación:** sin suite de tests (cambios de UI/datos). Gates: `npx tsc --noEmit` + `npx next lint` + `next build` (etapa de compilación) + chequeo visual con `npm run dev` apuntando a Strapi.

## Grafo de dependencias

```
Task 1 (isRebaja: ProductType + strapi)   Task 2 (formatPrice guard + whatsapp helper)
                 \                              /
                  \                            /
                   ▼                          ▼
                 Task 3 (ProductCard unificado)
                            │
        ┌───────────────────┼───────────────────┬──────────────────┐
        ▼                   ▼                   ▼                  ▼
   Task 4 (/products)  Task 5 (categoría +   Task 6 (relacionados)  Task 7 (carruseles
                        home sections)                              + limpieza legacy)
```

Tasks 1 y 2 son independientes entre sí. Task 3 depende de ambas. Tasks 4-7 dependen solo de Task 3 y son **paralelizables** (tocan archivos disjuntos), pero el orden propuesto valida el card en la superficie más simple primero (fail-fast).

## Task List

### Phase 2A — Fundaciones del card

#### Task 1: Tipar y traer `isRebaja` (RF-7, RF-9)
**Descripción:** Habilitar el dato que dispara el badge "Oferta": agregar `isRebaja` al tipo de producto y seleccionarlo en la query de Strapi para que venga por producto en grids/carruseles mixtos.

**Criterios de aceptación:**
- [ ] `types/product.ts`: `ProductType` incluye `isRebaja: boolean | null`.
- [ ] `lib/data/strapi.ts` → `buildProductPopulate` agrega `fields` para `isRebaja` (y se mantiene `isFeatured`).
- [ ] El campo viaja en las respuestas de `getProducts`, `getCategoryProducts`, `getFeaturedProducts`, `getRebajaProducts`, `getRelatedProducts` (todas usan `buildProductPopulate`).

**Verificación:**
- [ ] `npx tsc --noEmit` sin errores.
- [ ] Manual (`npm run dev`): inspeccionar el payload de `/api/products` o un `console.log` temporal confirma que cada producto trae `isRebaja`.

**Dependencias:** Ninguna.
**Archivos probablemente tocados:** `types/product.ts`, `lib/data/strapi.ts`.
**Scope estimado:** Small.

#### Task 2: `formatPrice` robusto + helper de WhatsApp (RF-11, RF-8)
**Descripción:** Endurecer el formateo de precios y centralizar la construcción del mensaje/URL de WhatsApp por producto, reutilizable por el card y (luego) por la Fase 5.

**Criterios de aceptación:**
- [ ] `lib/formatPrice.ts`: si el valor es `undefined`/`null`/`NaN`, no devuelve `$NaN` (devuelve `null` o `"Consultar"` — decidir, ver Open Questions).
- [ ] Nuevo `lib/whatsapp.ts` con una función pura que recibe un producto (o nombre + slug) y devuelve la URL `https://wa.me/<phone>?text=...` con el mensaje prellenado; el número de teléfono se define como constante única (hoy duplicado en navbar e info-product).
- [ ] Sin dependencias nuevas.

**Verificación:**
- [ ] `npx tsc --noEmit` sin errores.
- [ ] Check manual: `formatPrice(undefined)` y `formatPrice(NaN)` no producen `$NaN`; la URL generada abre WhatsApp con el texto correcto.

**Dependencias:** Ninguna.
**Archivos probablemente tocados:** `lib/formatPrice.ts`, `lib/whatsapp.ts` (nuevo).
**Scope estimado:** Small.

#### Task 3: Componente `ProductCard` unificado (RF-6, RF-7, RF-8, RF-10)
**Descripción:** Crear el card único que reemplazará todas las variantes. Agnóstico al ancho, con imagen optimizada, badges, precios mayorista-first y CTAs de conversión.

**Criterios de aceptación:**
- [ ] Nuevo `components/shared/product-card.tsx` (client component) con props `{ product: ProductType; priority?: boolean; className?: string }`.
- [ ] Imagen con **`next/image`** (`fill` + `sizes`) en contenedor `relative` de alto fijo, `object-contain`; **placeholder** cuando no hay imágenes (Spec §8).
- [ ] **Badge de categoría** (reusa `ProductCategories`) y **badge "Oferta"** (`bg-offer text-offer-foreground`) visible solo si `product.isRebaja`.
- [ ] **Precio mayoreo protagonista** (`text-primary`, grande/bold) + **menudeo secundario** (`text-muted-foreground`, etiquetado); si falta mayoreo, menudeo pasa a protagonista.
- [ ] **CTA "Pedir por WhatsApp"** (usa `lib/whatsapp.ts`) y **favorito** (corazón con toggle: relleno si está en `lovedItems`, alterna add/remove via `useLovedProducts`).
- [ ] Nombre truncado consistente; navegación a `/product/[slug]` al click en imagen/nombre.
- [ ] Sin clases `dark:`; usa tokens (consistencia con Fase 1).

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios.
- [ ] `next build` compila (etapa de compilación) sin errores de `next/image`/CSS.
- [ ] Manual: renderizar el card aislado (o en una superficie ya migrada) muestra imagen, badges, mayoreo destacado y CTAs funcionando.

**Dependencias:** Task 1, Task 2.
**Archivos probablemente tocados:** `components/shared/product-card.tsx` (nuevo).
**Scope estimado:** Medium.

### Checkpoint A — Card listo
- [ ] `tsc` + `lint` + compilación limpios.
- [ ] El `ProductCard` renderiza correctamente en al menos una superficie de prueba.
- [ ] Review humano antes de migrar consumidores.

### Phase 2B — Migración de superficies

#### Task 4: Migrar el grid de `/products` (RF-6)
**Descripción:** Reemplazar la variante de card de la página de listado por el unificado y eliminar esa variante.

**Criterios de aceptación:**
- [ ] `app/(routes)/products/components/products-client-wrapper.tsx` usa `components/shared/product-card.tsx`.
- [ ] Se elimina `app/(routes)/products/components/carousel-products.tsx`.
- [ ] El grid responsive (2 cols mobile → 5 xl) se mantiene; las cards se ven consistentes.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: `/products` muestra el grid con el card nuevo, precios y badges correctos, sin regresión de layout.

**Dependencias:** Task 3.
**Archivos probablemente tocados:** `products-client-wrapper.tsx`, `carousel-products.tsx` (del).
**Scope estimado:** Small.

#### Task 5: Migrar categoría + sección de categoría del home (RF-6)
**Descripción:** Migrar la página de categoría y la sección de categorías del home, y borrar la variante de card de categoría y su gemela muerta.

**Criterios de aceptación:**
- [ ] `app/(routes)/category/[categorySlug]/components/category-client-wrapper.tsx` y `components/category-section-server.tsx` usan el card unificado.
- [ ] Se elimina `app/(routes)/category/[categorySlug]/components/product-card.tsx`.
- [ ] Se elimina el componente muerto `components/category-section.tsx` (sin consumidores).

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: `/category/[slug]` y la sección del home se ven con el card nuevo, sin regresión.

**Dependencias:** Task 3.
**Archivos probablemente tocados:** `category-client-wrapper.tsx`, `category-section-server.tsx`, `category/.../product-card.tsx` (del), `category-section.tsx` (del).
**Scope estimado:** Medium.

#### Task 6: Migrar productos relacionados (RF-6, RF-28 parcial)
**Descripción:** Migrar la sección de relacionados del detalle al card unificado y borrar la variante de relacionados y su gemela muerta.

**Criterios de aceptación:**
- [ ] `app/(routes)/product/[productSlug]/components/related-products-server.tsx` usa el card unificado.
- [ ] Se elimina `related-product-card.tsx`.
- [ ] Se elimina el componente muerto `related-products.tsx` (sin consumidores).

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: en una página de producto, los relacionados muestran el card nuevo (ahora con precio mayoreo, antes no tenían precio).

**Dependencias:** Task 3.
**Archivos probablemente tocados:** `related-products-server.tsx`, `related-product-card.tsx` (del), `related-products.tsx` (del).
**Scope estimado:** Medium.

### Checkpoint B — Superficies principales unificadas
- [ ] Listado, categoría, home y relacionados usan el mismo card.
- [ ] `tsc` + `lint` + compilación limpios; recorrido manual sin regresiones.

#### Task 7: Migrar carruseles (destacados + rebajas) y limpiar legacy (RF-6, RNF-4)
**Descripción:** Reemplazar el markup inline de los carruseles por el card unificado y eliminar las variantes legacy muertas y sus hooks huérfanos.

**Criterios de aceptación:**
- [ ] `components/featured-products-client.tsx` y `components/rebaja-products-client.tsx` renderizan `ProductCard` dentro de cada `CarouselItem` (corrige de paso el typo `ext-lg`).
- [ ] El badge "Oferta" aparece naturalmente en el carrusel de rebajas (todos `isRebaja`) vía la lógica del card.
- [ ] Se eliminan los componentes muertos `components/featured-products.tsx` y `components/rebaja-products.tsx`.
- [ ] Se eliminan los hooks legacy huérfanos en `api/` que quedaron sin uso (`useGetFeaturedProducts`, `useGetRebajaProducts`) — verificar que no tengan otros consumidores antes de borrar.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] `grep -rn "featured-products\"\|rebaja-products\"\|useGetFeatured\|useGetRebaja"` sin referencias a lo borrado.
- [ ] Manual: el home muestra ambos carruseles con el card nuevo; las rebajas con badge "Oferta".

**Dependencias:** Task 3.
**Archivos probablemente tocados:** `featured-products-client.tsx`, `rebaja-products-client.tsx`, `featured-products.tsx` (del), `rebaja-products.tsx` (del), `api/useGetFeaturedProducts.*` (del), `api/useGetRebajaProducts.*` (del).
**Scope estimado:** Medium.

### Checkpoint C — Fase 2 completa
- [ ] **Una sola** implementación de product card en todo el código (`grep` no encuentra las variantes viejas).
- [ ] Mayoreo protagonista, badge "Oferta", `next/image` y `formatPrice` consistentes en toda la app.
- [ ] `tsc` + `lint` + compilación limpios; recorrido manual (home, listado, categoría, detalle) sin regresiones.
- [ ] Listo para Fase 3 (header/navegación).

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| `next/image` con `fill` rompe layout (falta `relative`/`sizes`) o host no permitido | Medio | Contenedor `relative` + `sizes` explícito; host ya en `remotePatterns`; verificar en `dev`. |
| Backend no devuelve `isRebaja` con el nombre esperado → badge nunca aparece | Medio | El filtro `filters[isRebaja]` ya existe (nombre confirmado); validar con payload real en dev. |
| Regresión visual en carruseles por card width-agnóstico dentro de `CarouselItem` | Medio | El card llena el contenedor; el `basis-1/x` lo da el `CarouselItem`; verificar en dev. |
| `next build` no completa sin `NEXT_PUBLIC_BACKEND_URL` | Bajo | Gate real = `tsc` + `lint` + compilación; verificación visual con backend en dev. |
| Borrar un componente con consumidor oculto | Bajo | Cada borrado va tras migrar sus consumidores; `grep` de consumidores antes de borrar. |

## Open Questions
- **`formatPrice` con valor faltante:** ¿devolver `"Consultar"` (texto mayorista) o `null` (y que el card decida ocultar)? Default propuesto: `null`, y el card muestra solo el precio disponible / "Consultar precio".
- **CTA del card:** ¿alcanza con "Pedir por WhatsApp" + favorito en esta fase (dejando "Agregar a mi pedido" para Fase 5), o querés un placeholder de "Mi pedido" ya visible? Default: solo WhatsApp + favorito.
- **Badge de categoría:** su mapa de colores está hardcodeado (no usa tokens). ¿Migrarlo a tokens en esta fase o dejarlo para más adelante? Default: dejarlo (fuera de scope de Fase 2).

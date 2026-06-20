# Implementation Plan — Fase 4: Listado / Categoría

> Deriva de `Spec.md` → sección 11, Fase 4. Cubre **RF-21 a RF-25**: unificar paginación de listado y categoría, breadcrumbs, ordenamiento, filtros, estado en URL, grid mobile compacto y estados de carga/vacío.
> **Read-only plan.** La implementación es responsabilidad de `/g-build`.
> Fases 1 (design system), 2 (product card) y 3 (header/nav) ya completas — ver git log de `redesign/phase-1-design-foundations`.

## Overview

Hoy hay **dos modelos de listado divergentes**: `/products` pagina contra la API (fetch client-side acumulativo) y `/category/[slug]` carga 50 productos y filtra en el cliente (**bug: pierde los productos > 50**). Ninguno tiene breadcrumbs, ordenamiento ni filtros más allá de buscar/categoría, y los estados de carga/vacío son `<p>` planos. Esta fase unifica ambas superficies en **un patrón server-driven con el estado en la URL** (búsqueda, categoría, oferta, orden, página): el server lee `searchParams`, hace **un solo `getProducts`** con los filtros, y un listado compartido renderiza grid + breadcrumbs + orden + filtros + paginación + skeletons + estado vacío. Esto resuelve el bug de categoría, hace las vistas compartibles por URL (RF-23) y deja una sola implementación.

## Architecture Decisions

- **Fuente única de datos:** ambas superficies usan `getProducts` (ya soporta `categoryId`, `search`, `isRebaja`, paginación). `/category` resuelve `getCategoryBySlug(slug) → category.id` y delega en `getProducts`. `getCategoryProducts` queda deprecado/eliminado. Resuelve el bug de >50.
- **Estado en la URL con nuqs** (paquete recomendado en el Spec §10): `?search`, `?category`, `?offer`, `?sort`, `?page`. El **server** lee `searchParams` (async) y rinde el resultado; los **controles client** usan nuqs (`useQueryState`) para actualizar la URL (con `shallow: false` para re-fetch del server). Rationale: nuqs es exactamente la herramienta para "URL como fuente de verdad" multi-parámetro; evita el doble modelo de estado actual.
- **Paginación por página (`?page=N`), server-driven:** reemplaza el "cargar más" acumulativo por controles prev/siguiente + "página X de Y". Es compartible, fixea el bug y unifica. (Open Question: mantener "cargar más" vs paginado; default = paginado.)
- **Orden seguro vía allow-list:** `lib/sort.ts` mapea claves públicas (`novedades`, `precio_asc`, `precio_desc`, `nombre`) a strings de Strapi; función pura **testeada** (evita inyección de `sort` arbitrario en la query).
- **Componentes de listado reutilizables** en `components/listing/` (sort, paginación, skeleton, estado vacío) + `components/ui/breadcrumb.tsx` (hand-authored estilo shadcn, sin CLI). Consumidos por ambas superficies → una sola implementación de UI de listado.
- **Grid mobile 2 columnas compacto (RF-24):** ya se cumple (grid 2-col mobile + card compacta de Fase 2); el listado compartido conserva `grid-cols-2 ... xl:grid-cols-5`.
- **Tokens del design system y sin `dark:`** en todo lo nuevo; inputs/controles usan los componentes base (Input, Button, dropdown-menu).
- **Verificación:** `npm test` (suite node:test, incluye `lib/sort`) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + visual con `npm run dev` + backend Strapi.

## Grafo de dependencias

```
Task 1 (data: sort + fetch unificado)      Task 2 (nuqs setup)
            \                                   /
             \                                 /
              ▼                               ▼
        Task 3 (controles: sort + paginación)        Task 4 (estados + breadcrumb)
                          \                          /
                           \                        /
                            ▼                      ▼
                    Task 5 (migrar /products)  ──► patrón ──►  Task 6 (migrar /category)
```

Tasks 1, 2 y 4 son independientes. Task 3 depende de 1 (opciones de orden) y 2 (nuqs). Tasks 5 y 6 dependen de 1-4; 6 reusa el patrón validado en 5.

## Task List

### Phase 4A — Fundaciones

#### Task 1: Capa de datos — orden y fetch unificado (RF-21, RF-22)
**Descripción:** Permitir ordenar en `getProducts` mediante una allow-list segura y dejar lista la base para que categoría use `getProducts`.

**Criterios de aceptación:**
- [ ] Nuevo `lib/sort.ts`: tipo `SortKey`, lista de opciones `{ key, label }` para la UI, y `toStrapiSort(key)` que mapea a string de Strapi (`novedades`→`createdAt:desc`, `precio_asc`→`price_mayoreo:asc`, `precio_desc`→`price_mayoreo:desc`, `nombre`→`productName:asc`), con fallback seguro a `novedades` para claves desconocidas.
- [ ] `lib/sort.test.ts`: tests del mapeo y del fallback (node:test).
- [ ] `getProducts` acepta `sort?: SortKey` y aplica `toStrapiSort`; sin `sort` mantiene `novedades`.
- [ ] `getProducts` ya soporta `categoryId`/`search`/`isRebaja` (verificado) → no se requiere endpoint nuevo para categoría.

**Verificación:**
- [ ] `npm test` (incluye `lib/sort`) + `npx tsc --noEmit` limpios.
- [ ] Manual: `getProducts({ sort: 'precio_asc' })` genera `sort[0]=price_mayoreo:asc`.

**Dependencias:** Ninguna.
**Archivos probablemente tocados:** `lib/sort.ts` (nuevo), `lib/sort.test.ts` (nuevo), `lib/data/strapi.ts`.
**Scope estimado:** Small.

#### Task 2: Estado en URL — nuqs (RF-23)
**Descripción:** Adoptar nuqs como gestor de estado en la URL para los controles de listado.

**Criterios de aceptación:**
- [ ] `nuqs` instalado (dependencia).
- [ ] `NuqsAdapter` (adapter de Next App Router) envuelve la app en `app/layout.tsx`.
- [ ] No rompe el `?search=` introducido en Fase 3 (sigue navegando a `/products?search=`).

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: un control de prueba con `useQueryState` actualiza la URL y dispara re-render del server.

**Dependencias:** Ninguna.
**Archivos probablemente tocados:** `package.json`, `app/layout.tsx`.
**Scope estimado:** Small.

#### Task 3: Controles de listado — orden y paginación (RF-22, RF-23)
**Descripción:** Componentes client que reflejan/actualizan el estado en la URL para ordenar y paginar.

**Criterios de aceptación:**
- [ ] `components/listing/sort-select.tsx`: dropdown (usa `dropdown-menu` o `Input`/`select` estilizado) con las opciones de `lib/sort`, sincronizado a `?sort` vía nuqs (`shallow: false`).
- [ ] `components/listing/pagination-controls.tsx`: prev/siguiente + "Página X de Y", sincronizado a `?page` vía nuqs; deshabilita extremos correctamente.
- [ ] Accesibles (labels/aria), tokens, sin `dark:`.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: cambiar orden/página actualiza la URL y la grilla.

**Dependencias:** Task 1, Task 2.
**Archivos probablemente tocados:** `components/listing/sort-select.tsx` (nuevo), `components/listing/pagination-controls.tsx` (nuevo).
**Scope estimado:** Medium.

#### Task 4: Estados y breadcrumbs (RF-25, RF-22)
**Descripción:** Componentes de carga, vacío y migas de pan reutilizables.

**Criterios de aceptación:**
- [ ] `components/ui/breadcrumb.tsx`: breadcrumb estilo shadcn (hand-authored), con separador (chevron lucide) y tokens.
- [ ] `components/listing/product-grid-skeleton.tsx`: grilla de skeletons que matchea el layout del grid (2→5 cols), parametrizable por cantidad.
- [ ] `components/listing/empty-state.tsx`: estado vacío con mensaje + CTA (p. ej. limpiar filtros / ver todos), tokens.
- [ ] Sin `dark:`.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: render aislado de skeleton/empty/breadcrumb se ve consistente con el sistema.

**Dependencias:** Ninguna.
**Archivos probablemente tocados:** `components/ui/breadcrumb.tsx` (nuevo), `components/listing/product-grid-skeleton.tsx` (nuevo), `components/listing/empty-state.tsx` (nuevo).
**Scope estimado:** Medium.

### Checkpoint A — Fundaciones y primitivos
- [ ] `npm test` + `tsc` + `lint` + compilación limpios.
- [ ] Controles, estados y breadcrumb existen y compilan.
- [ ] Review humano antes de migrar superficies.

### Phase 4B — Migración de superficies

#### Task 5: Migrar `/products` al listado server-driven (RF-21, 22, 23, 24, 25)
**Descripción:** Reescribir `/products` para que el server lea los `searchParams` (page, search, sort, category, offer), haga `getProducts` con esos filtros y renderice el listado unificado con breadcrumbs, orden, filtros, paginación y estados.

**Criterios de aceptación:**
- [ ] `app/(routes)/products/page.tsx` lee `searchParams` (page/search/sort/category/offer), hace `getProducts(...)` server-side y pasa data + meta al render.
- [ ] Breadcrumb "Inicio › Productos"; controles de orden, filtro por categoría y toggle "Solo ofertas"; paginación por página; skeleton/empty integrados.
- [ ] Se reemplaza el modelo de fetch client-side acumulativo de `products-client-wrapper.tsx` (los controles pasan a nuqs; el wrapper se simplifica o elimina); `products-filter.tsx` usa los controles/URL.
- [ ] Grid 2-col mobile → 5 xl conservado (RF-24).

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: en `/products`, buscar/filtrar/ordenar/paginar actualiza la URL y los resultados; recargar la URL reproduce el mismo estado; estados de carga/vacío correctos.

**Dependencias:** Tasks 1-4.
**Archivos probablemente tocados:** `app/(routes)/products/page.tsx`, `app/(routes)/products/components/products-client-wrapper.tsx`, `app/(routes)/products/components/products-filter.tsx`.
**Scope estimado:** Medium/Large.

#### Task 6: Migrar `/category/[slug]` al listado unificado (RF-21 fix, 22, 23, 25)
**Descripción:** Migrar categoría al mismo patrón server-driven, resolviendo el bug de >50 productos y agregando breadcrumbs/orden/paginación.

**Criterios de aceptación:**
- [ ] `app/(routes)/category/[categorySlug]/page.tsx` resuelve `getCategoryBySlug` y usa `getProducts({ categoryId, page, search, sort })` server-side (sin tope de 50; pagina todo).
- [ ] Breadcrumb "Inicio › Categoría"; orden, búsqueda y paginación reutilizando los controles compartidos; skeleton/empty.
- [ ] Se elimina el filtrado client-side con tope (`category-client-wrapper.tsx`, `search.tsx`) reemplazándolo por el listado unificado; `getCategoryProducts` se deprecia/elimina si queda sin uso.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: una categoría con >50 productos muestra todos vía paginación; orden/búsqueda/URL funcionan; breadcrumbs correctos.

**Dependencias:** Tasks 1-4 (y patrón de Task 5).
**Archivos probablemente tocados:** `app/(routes)/category/[categorySlug]/page.tsx`, `category-client-wrapper.tsx`, `category/[categorySlug]/components/search.tsx`, `lib/data/strapi.ts` (deprecar `getCategoryProducts`).
**Scope estimado:** Medium.

### Checkpoint B — Fase 4 completa
- [ ] Listado y categoría comparten un patrón server-driven con estado en URL; el bug de >50 está resuelto.
- [ ] Breadcrumbs, orden, filtros, paginación y estados de carga/vacío presentes en ambas.
- [ ] `npm test` + `tsc` + `lint` + compilación limpios; recorrido manual sin regresiones.
- [ ] Listo para Fase 5 (conversión: WhatsApp + "Mi pedido" multi-producto).

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| nuqs requiere red para instalar | Bajo | `npm install` con red habilitada (ya usado en fases previas). |
| Cambiar "cargar más" por paginado altera la UX esperada | Medio | Decisión explícita (default paginado, compartible); Open Question para confirmar. |
| `sort` arbitrario en la query (inyección) | Medio | Allow-list en `lib/sort.ts` con fallback; nunca pasar el valor crudo a Strapi. |
| `searchParams` dinámicos desactivan ISR del listado | Bajo | Es el comportamiento esperado (vistas dinámicas por filtro); home/detalle conservan ISR. |
| Migración rompe el `?search=` de Fase 3 | Medio | Mantener el mismo nombre de parámetro `search`; verificar el flujo del header. |
| `next build` no completa sin `NEXT_PUBLIC_BACKEND_URL` | Bajo | Gate real = `npm test` + `tsc` + `lint` + compilación; visual en dev. |

## Open Questions
- **Paginación:** ¿paginado por página (default, compartible) o mantener "Cargar más" (infinite-ish)? El plan asume **paginado**.
- **Filtros en `/products`:** ¿alcanza con categoría + "solo ofertas", o también rango de precio? (No hay precio mínimo/máximo indexado; el rango requeriría más trabajo). Default: categoría + ofertas.
- **Búsqueda en categoría:** ¿mantenemos un buscador dentro de la categoría, o la búsqueda global del header (que va a `/products`) es suficiente? Default: mantener búsqueda dentro de la categoría (filtra dentro del rubro).

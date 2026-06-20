# Implementation Plan — Fase 3: Header / Navegación

> Deriva de `Spec.md` → sección 11, Fase 3. Cubre **RF-16, RF-17, RF-18, RF-19, RF-20**: buscador global en el header, categorías dinámicas desde Strapi, accesos visibles (favoritos / "Mi pedido" / WhatsApp), FAB de WhatsApp y footer consistente.
> **Read-only plan.** La implementación es responsabilidad de `/g-build`.
> Fases 1 (design system) y 2 (product card unificado) ya completas — ver git log de `redesign/phase-1-design-foundations`.

## Overview

El header hoy tiene **categorías hardcodeadas** (5 fijas en `menu-list.tsx` e `items-menu-mobile.tsx`), **no tiene buscador global** (la búsqueda vive dentro de cada listado) y solo expone WhatsApp + favoritos (sin contadores ni acceso al carrito/pedido). Esta fase convierte el header en una barra de navegación de e-commerce: categorías que vienen de Strapi (`getAllCategories`, ya disponible), buscador global que enruta a `/products?search=`, accesos con contador a favoritos y "Mi pedido", un FAB de WhatsApp siempre visible, y un footer alineado al design system.

## Architecture Decisions

- **Categorías dinámicas vía server→client props:** `app/layout.tsx` (server) ya envuelve el `Navbar`; ahí se llama `getAllCategories()` (ISR 2h) y se pasa `categories` al `Navbar` (client). `Navbar` las reenvía a `MenuList` (dropdown desktop) e `ItemsMenuMobile`. Se eliminan los arrays hardcodeados. Rationale: evita un fetch client-side y aprovecha el cache/ISR existente.
- **Descripciones del menú:** el `CategoryType` de Strapi **no** trae descripción; el dropdown desktop pasa a mostrar solo el nombre de la categoría (se quita el subtítulo hardcodeado). Se anota como decisión.
- **Buscador global:** componente `header-search.tsx` (client) con un form que hace `router.push('/products?search=<term>')`. La página `/products` (server async) lee `searchParams.search`, lo usa para el fetch inicial (`getProducts({ search })`) y lo pasa como `initialSearch` al wrapper, que siembra su estado. Compatible con la futura gestión de estado en URL de la Fase 4 (nuqs).
- **Contadores con guard de hydration:** los accesos a favoritos (`useLovedProducts`) y "Mi pedido" (`useCart`) leen estado persistido en localStorage; el badge de cantidad se muestra solo después de montar (igual patrón que el card de Fase 2) para evitar mismatch de hidratación.
- **"Mi pedido" = carrito existente:** en esta fase el ícono enlaza a `/cart` y muestra `items.length`. El envío del pedido por WhatsApp es de la **Fase 5** (anotado, no se implementa).
- **FAB de WhatsApp:** componente `whatsapp-fab.tsx` montado en el layout, fijo abajo-derecha, con mensaje genérico. Se extiende `lib/whatsapp.ts` con un builder genérico (sin producto), con su test (cero dependencias, `node:test`).
- **Verde solo para WhatsApp (RN-2)** y tokens del design system (Fase 1) en todos los elementos nuevos; sin clases `dark:`.
- **Verificación:** `npm test` (suite node:test) + `npx tsc --noEmit` + `npx next lint` + `next build` (etapa de compilación) + chequeo visual con `npm run dev` + backend Strapi.

## Grafo de dependencias

```
getAllCategories (ya existe) ─► Task 1 (categorías dinámicas: layout → navbar → menús)
                                      │
lib/whatsapp.ts (ya existe) ─────────┼─► Task 2 (accesos header: carrito + contadores)   [navbar]
                                      │         │
                                      │         ▼
                                      └─► Task 3 (buscador global)   [navbar + products page/wrapper]
                                                │
                                                ▼
                                          Task 4 (FAB WhatsApp)   [layout + lib/whatsapp]
                                                │
                                                ▼
                                          Task 5 (footer consistente)   [footer]
```

Tasks 1, 2 y 3 tocan `navbar.tsx` → se hacen **en orden** (mismo archivo, evita conflictos). Tasks 4 y 5 son independientes del navbar.

## Task List

### Phase 3A — Navegación principal

#### Task 1: Categorías dinámicas en el menú (RF-18)
**Descripción:** Reemplazar las categorías hardcodeadas del menú desktop y mobile por las que vienen de Strapi, pasadas desde el layout.

**Criterios de aceptación:**
- [ ] `app/layout.tsx` obtiene `getAllCategories()` y pasa `categories` al `Navbar`.
- [ ] `Navbar` reenvía `categories` a `MenuList` e `ItemsMenuMobile`.
- [ ] `MenuList` renderiza el dropdown desde `categories` (nombre + link `/category/[slug]`); se eliminan el array `components` y los subtítulos hardcodeados.
- [ ] `ItemsMenuMobile` renderiza las categorías desde `categories`; se elimina la lista hardcodeada.
- [ ] Edge case: si `categories` está vacío, el menú sigue mostrando "Productos" y "Sobre Nosotros" sin romperse.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: el dropdown desktop y el menú mobile listan las categorías reales del backend; los links navegan a la categoría correcta.

**Dependencias:** Ninguna (usa `getAllCategories` existente).
**Archivos probablemente tocados:** `app/layout.tsx`, `components/navbar.tsx`, `components/menu-list.tsx`, `components/items-menu-mobile.tsx`.
**Scope estimado:** Medium.

#### Task 2: Accesos del header — "Mi pedido" + contadores (RF-19)
**Descripción:** Sumar al header el acceso al carrito ("Mi pedido") con contador y un contador a favoritos, manteniendo WhatsApp; todo con guard de hydration.

**Criterios de aceptación:**
- [ ] El header muestra un ícono de carrito que enlaza a `/cart` con un badge de cantidad (`useCart().items.length`).
- [ ] El ícono de favoritos muestra un badge con `useLovedProducts().lovedItems.length` y enlaza a `/loved-products`.
- [ ] Los badges se muestran solo cuando hay ≥1 ítem y solo tras montar (sin hydration mismatch).
- [ ] Se mantiene el acceso a WhatsApp; se usan tokens (`--primary`/`--whatsapp`) y sin `dark:`.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: agregar favoritos/ítems actualiza los contadores; los íconos navegan a `/loved-products` y `/cart`.

**Dependencias:** Task 1 (mismo archivo `navbar.tsx`).
**Archivos probablemente tocados:** `components/navbar.tsx` (+ opcional un pequeño componente de ícono con badge).
**Scope estimado:** Small.

#### Task 3: Buscador global en el header (RF-17)
**Descripción:** Agregar un buscador en el header (desktop y mobile) que enrute a `/products?search=`, y hacer que la página de productos siembre la búsqueda desde la URL.

**Criterios de aceptación:**
- [ ] Nuevo `components/header-search.tsx` (client): input + submit que hace `router.push('/products?search=<term>')` (term codificado; vacío → `/products`).
- [ ] `Navbar` monta el buscador en desktop y en mobile.
- [ ] `app/(routes)/products/page.tsx` lee `searchParams.search` (Promise en Next 15), lo pasa a `getProducts({ search })` para el fetch inicial y como `initialSearch` al wrapper.
- [ ] `products-client-wrapper.tsx` acepta `initialSearch` y siembra `searchTerm` (el input del filtro refleja el término; no hay doble fetch en el primer render).
- [ ] Buscar desde cualquier página lleva a `/products` con resultados filtrados.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: buscar "cloro" desde el header en home/categoría navega a `/products?search=cloro` con resultados; el input del listado muestra "cloro".

**Dependencias:** Task 1, Task 2 (mismo `navbar.tsx`).
**Archivos probablemente tocados:** `components/header-search.tsx` (nuevo), `components/navbar.tsx`, `app/(routes)/products/page.tsx`, `app/(routes)/products/components/products-client-wrapper.tsx`.
**Scope estimado:** Medium.

### Checkpoint A — Header funcional
- [ ] Categorías dinámicas, accesos con contador y buscador global operativos.
- [ ] `tsc` + `lint` + compilación limpios; recorrido manual del header sin regresiones.
- [ ] Review humano.

### Phase 3B — Conversión y cierre

#### Task 4: FAB de WhatsApp (RF-16)
**Descripción:** Botón flotante de WhatsApp siempre visible que refuerza el canal de conversión.

**Criterios de aceptación:**
- [ ] `lib/whatsapp.ts` expone un builder genérico (sin producto), p. ej. `buildGeneralWhatsappUrl(message?)`, con su test en `lib/whatsapp.test.ts`.
- [ ] Nuevo `components/whatsapp-fab.tsx`: botón fijo abajo-derecha (`fixed`, z alto), color `--whatsapp`, accesible (`aria-label`), abre la URL en nueva pestaña.
- [ ] Montado en `app/layout.tsx`, visible en todas las páginas, sin tapar el footer ni el contenido en mobile.

**Verificación:**
- [ ] `npm test` (incluye el nuevo caso) + `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: el FAB aparece en todas las páginas y abre WhatsApp con el mensaje genérico.

**Dependencias:** Ninguna (independiente del navbar).
**Archivos probablemente tocados:** `lib/whatsapp.ts`, `lib/whatsapp.test.ts`, `components/whatsapp-fab.tsx` (nuevo), `app/layout.tsx`.
**Scope estimado:** Small.

#### Task 5: Footer consistente (RF-20)
**Descripción:** Alinear el footer al design system y a los accesos del header (las clases duplicadas ya se corrigieron en Fase 1).

**Criterios de aceptación:**
- [ ] El footer usa tokens (sin grises hardcodeados sueltos donde aplique) y el wordmark consistente (ya hecho en Fase 1, verificar).
- [ ] Agrega accesos útiles coherentes con el header (Productos, Nosotros y, si aporta, Favoritos / Mi pedido).
- [ ] Sin clases `dark:`; layout responsive correcto.

**Verificación:**
- [ ] `npx tsc --noEmit` + `npx next lint` limpios; `next build` compila.
- [ ] Manual: el footer se ve alineado al header y al resto del sistema, sin regresiones.

**Dependencias:** Ninguna.
**Archivos probablemente tocados:** `components/footer.tsx`.
**Scope estimado:** Small.

### Checkpoint B — Fase 3 completa
- [ ] Header (categorías dinámicas + buscador + accesos), FAB de WhatsApp y footer consistentes.
- [ ] `npm test` + `tsc` + `lint` + compilación limpios; recorrido manual (home, listado, categoría, detalle) sin regresiones.
- [ ] Listo para Fase 4 (listado/categoría: paginación unificada, breadcrumbs, orden, filtros).

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Layout fetchea categorías en cada render | Bajo | `getAllCategories` ya tiene ISR 2h + cache tag; costo despreciable. |
| Hydration mismatch en contadores (estado persistido) | Medio | Guard `mounted` antes de mostrar badges (patrón ya usado en el card). |
| `searchParams` como Promise en Next 15 mal tipado | Medio | Tipar `searchParams: Promise<{ search?: string }>` y `await`; validar con `tsc`. |
| Buscador global duplica la búsqueda interna del listado | Bajo | El header solo navega/siembra; el filtrado sigue en el wrapper (single source). |
| Menú dinámico sin descripciones se ve pobre | Bajo | Mostrar nombre claro; descripciones quedan fuera (no existen en Strapi). |
| `next build` no completa sin `NEXT_PUBLIC_BACKEND_URL` | Bajo | Gate real = `tsc` + `lint` + compilación + tests; visual en dev. |

## Open Questions
- **Buscador en mobile:** ¿lo mostramos como una fila siempre visible bajo la barra, o desplegable (ícono lupa que abre el input)? Default propuesto: fila compacta siempre visible (menos fricción).
- **Footer:** ¿incluir la lista de categorías dinámicas también en el footer, o solo links fijos (Productos/Nosotros/Favoritos/Pedido)? Default: links fijos (categorías dinámicas opcionales).
- **FAB vs ícono WhatsApp del header:** ¿mantenemos ambos (header + FAB) o el FAB reemplaza el del header? Default: mantener ambos (header para desktop, FAB refuerza en scroll/mobile).

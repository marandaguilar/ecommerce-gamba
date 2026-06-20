# Implementation Plan — Fase 7: Limpieza

> Deriva de `Spec.md` → sección 11, Fase 7. Cubre **RNF-1** (`<img>`→`next/image`), **RNF-4** (un único design system, sin variantes ni código muerto) y **Spec §9** (remover Stripe/checkout sin uso). Cierra el rediseño.
> **Read-only plan.** La implementación es responsabilidad de `/g-build`.
> Fases 1-6 ya completas — ver git log de `redesign/phase-1-design-foundations`.

## Overview

Tras las fases 1-6, queda **deuda muerta** acumulada del estado previo, ya inventariada por grep (importadores reales):

- **Último `<img>` vivo:** `components/shared/product-image-miniature.tsx` (usado por `cart-item` y `loved-item-product`) sigue con `<img>` nativo → falta migrar a `next/image` (RNF-1). El otro `<img>` está en `choose-category.tsx`, que es **código muerto** (se va con el archivo).
- **Cluster de código muerto del listado/categoría legacy** (sin ningún importador vivo, todos interdependientes entre sí):
  - `components/choose-category.tsx` (no lo importa nadie)
  - `app/(routes)/category/[categorySlug]/components/filters-controls-category.tsx` (sin importadores)
  - `app/(routes)/category/[categorySlug]/components/filter-purchase.tsx` (solo lo importa el anterior, muerto)
  - `api/` legacy completo: `getProducts.tsx`, `getProductBySlug.tsx`, `getProductField.tsx`, `getCategoryProduct.tsx` (solo los importan los dos archivos muertos de arriba; la capa viva es `lib/data/strapi.ts`)
  - `types/response.ts` (solo lo importa `choose-category`)
- **Archivos muertos sueltos:** `components/skeletonSchema.tsx` (sin importadores), `components/icon-button.tsx` (huérfano desde Fase 5).
- **Ruta huérfana de checkout:** `app/(routes)/success/page.tsx` — no la linkea nadie y referencia `/images/success.png` que **ni existe** (asset roto). Resto del flujo Stripe (Spec §9).
- **Dependencias sin uso:** `@stripe/react-stripe-js`, `@stripe/stripe-js` (cero imports), `qs` (cero imports en app/components/lib). `nextjs-toploader` **sí** se usa (`app/layout.tsx`) → se conserva. `next-themes` ya se removió en Fase 1.
- **Tokens muertos del preset shadcn:** `--chart-1..5` + sus `--color-chart-*` en `@theme inline` (`app/globals.css`) — nunca se usan; cierra la Open Question de Fase 1.

Esta fase **borra todo lo muerto y migra el último `<img>`**, sin agregar features. La red de seguridad es la suite existente (**28 tests**) + `tsc`/`lint`/`build` + grep que pruebe que no quedan imports colgados.

## Architecture Decisions

- **Sin TDD nuevo (deleciones/migración):** la skill TDD excluye explícitamente cambios puros de borrado/config. La regresión se cubre con la **suite existente verde (28)** + `tsc --noEmit` (atrapa imports rotos) + `next lint` + `next build` (compilación) + grep de importadores. Solo `ProductImageMiniature` cambia comportamiento (UI) y se valida visualmente.
- **Borrado en bloque del cluster muerto, verificado por el compilador:** como `choose-category`, `filters-controls-category`, `filter-purchase`, `api/*` y `types/response` son **mutuamente dependientes y sin raíz viva**, se eliminan juntos; `tsc`/`build` confirman que nada vivo los referenciaba (ya verificado por grep en el plan).
- **`next/image` en la miniatura con dimensiones explícitas:** `ProductImageMiniature` pasa a `Image` con `width/height` (o contenedor + `fill`) y `sizes`, conservando el click-to-navigate y el tamaño actual (`w-24 h-24` / `sm:h-32`). Mismo patrón de host Strapi ya configurado en `next.config`.
- **Remover Stripe y `qs` del `package.json` + lockfile:** Spec §9 decide remover (no dejar dependencia sin uso). Se corre `npm install` para actualizar `package-lock.json`. `qs` se borra solo tras confirmar cero imports (ya verificado).
- **Quitar tokens `--chart-*`:** elimina las 5 definiciones y sus 5 mapeos `--color-chart-*` en `@theme inline`; no hay clases `*-chart-*` en el código. Cierra la Open Question de Fase 1 (RNF-4).
- **Disciplina de scope:** solo se borra lo probado-muerto y se migra el `<img>` restante. No se renombra `carousel-product.tsx`→`product-gallery.tsx` (Open Question de Fase 6, cosmético) salvo que se decida explícitamente.
- **Verificación transversal:** tras cada task, `npm test` (28, sin regresión) + `npx tsc --noEmit` + `npx next lint` + `next build` (compilación) + grep confirmando que el símbolo/archivo borrado no se referencia.

## Grafo de dependencias

```
Task 1 (miniatura → next/image)        ← único cambio de UI, independiente
Task 2 (borrar cluster muerto + api/ legacy + response.ts)   ← deleción en bloque
Task 3 (borrar sueltos: skeletonSchema, icon-button, ruta success)
Task 4 (remover deps: @stripe/*, qs)   ← package.json + lockfile
Task 5 (remover tokens --chart-*)      ← globals.css, cierra OQ Fase 1
```

Todas las tareas son en gran medida independientes (no hay orden forzado por dependencias, ya que se borra código sin importadores vivos). Se ordenan de mayor a menor riesgo: primero la migración con cambio de UI (Task 1), luego las deleciones de código (2-3), y por último deps y tokens (4-5).

---

## Task List

### Phase 7A — Migración del último `<img>` y borrado de código muerto

#### Task 1 — `ProductImageMiniature` → `next/image` (RNF-1) — S

**Descripción:** Migrar la miniatura de `<img>` a `next/image`, conservando el comportamiento (click navega al producto) y el tamaño actual. Es el único `<img>` en código vivo.

**Criterios de aceptación:**
- [ ] Usa `next/image` (con `width/height` o contenedor + `fill` + `sizes`); sin `<img>` nativo. Mantiene `w-24 h-24` / `sm:h-32` y el click a `/product/${slug}`.
- [ ] Maneja `url` vacía sin romper (fallback simple, p. ej. no renderizar imagen rota).
- [ ] Sigue usado correctamente por `cart-item` y `loved-item-product` (sin cambios de API del componente).

**Verificación:**
- [ ] `npm test` (28, sin regresión), `npx tsc --noEmit`, `npx next lint`, `next build` (compilación).
- [ ] `grep "<img" app/ components/` → solo queda en archivos que se borrarán en Task 2 (o cero tras Task 2).
- [ ] Manual: miniaturas en "Mi pedido" y favoritos se ven y navegan.

**Dependencias:** Ninguna.
**Archivos:** `components/shared/product-image-miniature.tsx`. — **Scope: S**

#### Task 2 — Borrar cluster muerto de listado/categoría + `api/` legacy + `types/response` — M

**Descripción:** Eliminar el código muerto interdependiente del modelo de datos client-side anterior, ya reemplazado por `lib/data/strapi.ts` (Fase 4).

**Criterios de aceptación:**
- [ ] Borrados: `components/choose-category.tsx`, `app/(routes)/category/[categorySlug]/components/filters-controls-category.tsx`, `app/(routes)/category/[categorySlug]/components/filter-purchase.tsx`, el directorio `api/` completo (`getProducts.tsx`, `getProductBySlug.tsx`, `getProductField.tsx`, `getCategoryProduct.tsx`) y `types/response.ts`.
- [ ] `lib/data/strapi.ts` (capa viva) intacta y sin referencias a lo borrado.

**Verificación:**
- [ ] `npx tsc --noEmit` (sin imports rotos), `npx next lint`, `next build` (compilación), `npm test` (28).
- [ ] `grep -rn "api/getProducts\|api/getProductBySlug\|api/getProductField\|api/getCategoryProduct\|choose-category\|filter-purchase\|filters-controls-category\|types/response"` → cero coincidencias en código vivo.

**Dependencias:** Ninguna (todo sin importador vivo, verificado).
**Archivos:** (borrados) ver arriba. — **Scope: M**

#### Task 3 — Borrar archivos sueltos muertos + ruta `success` — S

**Descripción:** Eliminar `skeletonSchema.tsx`, `icon-button.tsx` (huérfano de Fase 5) y la ruta de checkout `success` (huérfana, Stripe, con asset inexistente).

**Criterios de aceptación:**
- [ ] Borrados: `components/skeletonSchema.tsx`, `components/icon-button.tsx`, `app/(routes)/success/` (page.tsx y carpeta).
- [ ] No queda ningún link a `/success` (ya verificado: ninguno).

**Verificación:**
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación), `npm test` (28).
- [ ] `grep -rn "skeletonSchema\|icon-button\|/success"` → cero en código vivo.

**Dependencias:** Ninguna.
**Archivos:** (borrados) ver arriba. — **Scope: S**

### Checkpoint A — Código muerto eliminado
- [ ] Cero `<img>` nativo en código vivo; cero archivos/rutas muertas; `tsc`/`lint`/`build` verdes; 28 tests pasan.

### Phase 7B — Dependencias y tokens

#### Task 4 — Remover dependencias sin uso (Stripe, `qs`) — S

**Descripción:** Quitar de `package.json` las dependencias sin uso confirmadas y actualizar el lockfile.

**Criterios de aceptación:**
- [ ] Removidas de `package.json`: `@stripe/react-stripe-js`, `@stripe/stripe-js`, `qs` (y `@types/qs` si existiera).
- [ ] `package-lock.json` actualizado (`npm install`). `nextjs-toploader` se conserva (en uso).

**Verificación:**
- [ ] `grep -rn "stripe\|from \"qs\"\|import qs"` en app/components/lib → cero.
- [ ] `npx tsc --noEmit`, `npx next lint`, `next build` (compilación), `npm test` (28).

**Dependencias:** Tasks 2-3 (que ya quitaron cualquier referencia potencial). Sandbox: `npm install` con red bloqueada → `dangerouslyDisableSandbox`.
**Archivos:** `package.json`, `package-lock.json`. — **Scope: S**

#### Task 5 — Remover tokens muertos `--chart-*` (cierra OQ Fase 1) — XS

**Descripción:** Eliminar de `app/globals.css` las definiciones `--chart-1..5` y sus mapeos `--color-chart-*` en `@theme inline`, restos del preset shadcn sin uso.

**Criterios de aceptación:**
- [ ] Borradas las 5 líneas `--chart-N` y las 5 `--color-chart-N` en `@theme inline`.
- [ ] No hay clases `*-chart-*` en el código (ya verificado).

**Verificación:**
- [ ] `grep -rn "chart" app/ components/` → cero (salvo, si aplica, palabras no relacionadas).
- [ ] `npx next lint`, `next build` (compilación), `npm test` (28).

**Dependencias:** Ninguna.
**Archivos:** `app/globals.css`. — **Scope: XS**

### Checkpoint B — Limpieza completa
- [ ] Sin código/rutas/archivos muertos, sin deps sin uso, sin tokens muertos; `<img>` solo vía `next/image`.
- [ ] `npm test` (28) verde, `tsc`/`lint` limpios, `build` compila.
- [ ] Rediseño cerrado (Fases 1-7). Listo para review/PR.

---

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Borrar algo que sí se usaba | Alto | Inventario por grep ya hecho (importadores reales); `tsc --noEmit` + `build` atrapan cualquier import roto antes de commitear. |
| `next/image` en la miniatura rompe layout/host | Medio | Reusar patrón ya usado en card/galería; host Strapi ya en `next.config`; validación visual en cart/favoritos. |
| `qs` usado transitivamente por algo runtime | Bajo | Grep en app/components/lib dio cero; si `build` fallara, se revierte solo el borrado de `qs`. |
| `npm install` con red bloqueada en sandbox | Medio | Correr con `dangerouslyDisableSandbox` (patrón ya usado en fases previas). |

## Open Questions

- **Rename `carousel-product.tsx` → `product-gallery.tsx`** (OQ de Fase 6): cosmético; default = no hacerlo para minimizar churn. ¿Incluirlo en esta limpieza?
- **¿Abrir el PR al cerrar Fase 7?** Las 7 fases viven sin mergear en `redesign/phase-1-design-foundations`; la limpieza es el cierre natural antes del PR.
- **Verificación visual pendiente de todo el rediseño:** requiere `npm run dev` + `NEXT_PUBLIC_BACKEND_URL` (las gates de build/test no cubren pixeles ni datos reales).

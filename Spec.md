# Spec — Rediseño del Design System de Gamba

> Tienda de artículos de limpieza **Gamba**. Especificación de negocio y diseño para un rediseño global enfocado en **conversión, imagen profesional/moderna y mobile**. Este documento **no implementa código**: define el qué y el porqué.

**Fecha:** 2026-06-20
**Alcance:** Toda la app (design system global), con la página de listado de productos como pieza piloto.

---

## 1. Problema

El proyecto tiene una base técnica sólida (Next.js 15 + Tailwind v4 + shadcn/ui), pero **el diseño no está personalizado ni terminado**, y eso frena las ventas y la percepción de marca:

- **Identidad ausente:** los tokens de color son el preset gris/negro genérico de shadcn. El azul de marca `#0d4c99` solo vive hardcodeado en el wordmark "GAMBA" del navbar; no permea la UI.
- **Tipografía rota:** se carga **Urbanist** pero el sistema apunta a una variable **Geist inexistente** (`--font-sans: var(--font-geist-sans)`), por lo que la fuente de marca no se aplica de forma efectiva.
- **Conversión desconectada:** el carrito/checkout está muerto (el botón "Comprar" hace `console.log`; Stripe instalado pero sin usar). La conversión real ocurre por **WhatsApp**, pero ese flujo no está formalizado ni optimizado.
- **Inconsistencia de componentes:** existen **3 variantes divergentes** del product card; las páginas de listado (`/products`) y categoría (`/category/[slug]`) tienen lógicas de paginación distintas; hay código muerto (dark mode sin montar, página `success` huérfana, hooks legacy en `api/`).
- **Navegación pobre:** sin buscador en el header, categorías hardcodeadas, sin breadcrumbs, sin ordenamiento ni filtros, sin badges de oferta.
- **Mobile sin pulir:** grids de 2 columnas con cards de alto fijo, uso de `<img>` nativo en vez de `next/image` (impacto en LCP), sin buscador en el header mobile.

**Resultado:** una tienda que se ve "template a medio terminar", con la marca y el camino de compra poco claros.

---

## 2. Usuarios

| Perfil | Descripción | Necesidad principal |
|---|---|---|
| **Comprador mayorista** (primario) | Negocios/revendedores que compran al por mayor artículos de limpieza. | Ver rápido el **precio mayoreo**, identificar productos y pedir por WhatsApp con poca fricción. |
| **Comprador minorista** (secundario) | Cliente final que compra pocas unidades. | Ver el precio menudeo y consultar/pedir fácil. |
| **Visitante mobile** (mayoría del tráfico) | Llega desde el celular. | Navegación clara, búsqueda accesible, cards legibles y CTA de WhatsApp evidente. |

---

## 3. Dirección de diseño elegida: **"Azul confiable + fresco"**

Estética profesional y limpia, acorde al rubro de higiene, anclada en la marca:

- **Color primario:** azul de marca `#0d4c99` (convertido en token `--primary` real).
- **Acentos:** celeste/turquesa para sensación de frescura e higiene; usados con moderación.
- **Verde:** reservado **exclusivamente** para acciones de WhatsApp (no decorativo).
- **Base:** blanco amplio y aireado, bordes sutiles, grises neutros para texto secundario.
- **Sensación:** confiable, ordenada, moderna; ni ruidosa de supermercado ni fría de lujo.

### Wordmark
- Mantener el nombre **"GAMBA"** (no se cambia el logo), pero **reestilizar su presentación** (tipografía, peso, espaciado) para que se vea más profesional.
- El subtítulo **"1er aniversario"** se trata como **banner/etiqueta temporal aparte**, no como parte fija del logo.

### Tipografía (recomendación)
La fuente actual está mal cableada. Recomendación a validar en implementación:
- **Cuerpo/UI:** **Plus Jakarta Sans** (geométrica, amigable, moderna, excelente legibilidad para ecommerce) — alternativa: mantener **Urbanist** ya cargada, cableándola correctamente.
- **Display (títulos y precios):** opcionalmente **Sora** o **Bricolage Grotesque** para dar carácter a títulos y al precio mayoreo destacado.
- **Acción técnica clave:** mapear correctamente `--font-sans` (y `--font-display` si aplica) vía `next/font`, eliminando las referencias muertas a Geist.

---

## 4. Requisitos funcionales

### 4.1 Design system / tokens (global)
- **RF-1.** Definir tokens de marca en `globals.css`: `--primary` = azul `#0d4c99` (en oklch), acento turquesa, escala de grises neutra, color de éxito/WhatsApp verde como token semántico, color de oferta/destacado.
- **RF-2.** Cablear la tipografía correctamente vía `next/font`; eliminar referencias a Geist.
- **RF-3.** Definir escala consistente de radius, sombras (tokens), espaciado y estados (hover/focus/active) para botones, cards e inputs.
- **RF-4.** **Eliminar dark mode**: quitar `.dark`, `ThemeProvider`, `ToggleTheme` y el andamiaje muerto. Un único tema claro bien pulido.
- **RF-5.** Instalar/estandarizar un componente `Input` (hoy se usan inputs nativos) consistente con el sistema.

### 4.2 Product card (unificado)
- **RF-6.** Crear **un único** componente de product card que reemplace las 3 variantes actuales (grilla, carrusel, relacionados), parametrizable.
- **RF-7.** La card muestra: imagen (`next/image`, `object-contain`, contenedor responsive), nombre, **precio mayoreo destacado** (jerarquía visual principal) y **menudeo secundario**, badge de categoría, y **badge "Oferta"** cuando el producto tiene el flag `isRebaja`.
- **RF-8.** CTA en la card orientado a conversión: **"Pedir por WhatsApp"** y/o **"Agregar a mi pedido"** (ver 4.4). Acción secundaria: favorito (corazón).
- **RF-9.** El **badge "Oferta"** es visual únicamente (no requiere precio anterior ni cambios en Strapi). Estilo llamativo pero consistente con la paleta.

### 4.3 Precios (mayorista primero)
- **RF-10.** En card y detalle, **el precio mayoreo es el protagonista** (tamaño/color/posición), con el menudeo presentado como secundario y claramente etiquetado.
- **RF-11.** Formato de precio consistente vía `lib/formatPrice` en todos los lugares.

### 4.4 Conversión por WhatsApp (canal oficial)
- **RF-12.** Formalizar WhatsApp como camino de compra. Mensaje prellenado con el **nombre y datos del producto** desde card y detalle.
- **RF-13.** **Wishlist (favoritos):** mantener el corazón como lista de deseos persistida.
- **RF-14.** **"Mi pedido" (carrito reusado):** reutilizar el store de carrito existente (zustand + persist) como una **lista de pedido multi-producto**. Botón que **arma un único mensaje de WhatsApp con todos los ítems** del pedido (nombre, cantidad si aplica, link).
- **RF-15.** Favoritos y "Mi pedido" coexisten como dos listas distintas, ambas accesibles desde el header.
- **RF-16.** **FAB de WhatsApp** siempre visible (botón flotante) reforzando el canal.

### 4.5 Navegación / header
- **RF-17.** **Buscador global** visible en el header (desktop **y** mobile), no solo dentro de los listados.
- **RF-18.** **Categorías dinámicas** desde Strapi (`getAllCategories`), reemplazando las 5 categorías hardcodeadas en navbar y menú mobile.
- **RF-19.** Header con accesos visibles a: favoritos, "Mi pedido" (con contador), WhatsApp.
- **RF-20.** Footer rediseñado consistente con el sistema (corregir clases duplicadas).

### 4.6 Listado y categoría
- **RF-21.** **Unificar** la lógica de listado y categoría en un patrón consistente de carga/paginación (resolver la inconsistencia: `/products` pagina contra API; categoría carga 50 y filtra en cliente con tope).
- **RF-22.** Agregar **breadcrumbs**, **ordenamiento** (precio mayoreo/menudeo, nombre, novedades) y **filtros** (categoría, oferta) en las páginas de listado.
- **RF-23.** Estado de filtros/orden/búsqueda preferentemente reflejado en la **URL** (compartible, navegable con back/forward).
- **RF-24.** **Grid mobile: 2 columnas con card compacta** rediseñada (foto, nombre, precio mayoreo destacado, CTA); más densidad legible al hacer scroll.
- **RF-25.** Estados de carga (skeletons) y estado vacío ("sin resultados") bien diseñados.

### 4.7 Detalle de producto
- **RF-26.** Galería mejorada: `next/image`, thumbnails y/o zoom; navegación clara (embla ya disponible).
- **RF-27.** Jerarquía de info: nombre, categoría, precios (mayoreo destacado), descripción, CTA WhatsApp + "Agregar a mi pedido" + favorito.
- **RF-28.** Sección de relacionados usando el card unificado.

---

## 5. Flujos principales

1. **Descubrir → Pedir (mobile, mayorista):** Home/Categoría → grid 2 col → ve precio mayoreo → "Pedir por WhatsApp" (mensaje prellenado) **o** "Agregar a mi pedido".
2. **Pedido multi-producto:** agrega varios productos a "Mi pedido" → revisa la lista → "Enviar pedido por WhatsApp" (mensaje con todos los ítems).
3. **Búsqueda:** usa el buscador del header desde cualquier página → resultados → card → pedir.
4. **Wishlist:** marca favoritos (corazón) → revisa la lista de favoritos → mueve a "Mi pedido" o consulta.
5. **Navegación por categoría:** menú dinámico → categoría con breadcrumbs/orden/filtros → card.

---

## 6. Reglas de negocio

- **RN-1.** El **precio mayoreo** tiene prioridad visual sobre el menudeo en toda la app.
- **RN-2.** El **verde** se usa solo para WhatsApp; ningún otro elemento decorativo lo usa.
- **RN-3.** El badge **"Oferta"** se muestra cuando `isRebaja = true`; es puramente visual (no hay precio anterior).
- **RN-4.** Solo se muestran productos con `active = true` (regla ya vigente en la capa de datos).
- **RN-5.** Las categorías mostradas provienen de Strapi (fuente única de verdad), no de listas hardcodeadas.
- **RN-6.** No se cambia el **nombre** de la marca ("GAMBA"); solo su presentación visual.

---

## 7. Requisitos no funcionales

- **RNF-1. Performance/LCP:** migrar `<img>` → `next/image` en cards y galería; preservar ISR existente.
- **RNF-2. Mobile-first:** todo el diseño se valida primero en celular.
- **RNF-3. Accesibilidad:** contraste suficiente del azul sobre blanco, foco visible, labels en inputs/botones de ícono, tamaños táctiles adecuados.
- **RNF-4. Consistencia:** un único design system; eliminar variantes divergentes y código muerto.
- **RNF-5. Sin librerías pesadas innecesarias:** preferir lo ya instalado (shadcn/Radix, embla, sonner, zustand). Nuevas dependencias solo si aportan valor claro (ver sección 10).
- **RNF-6. Mantener shadcn/Radix** como base de componentes.

---

## 8. Edge cases

- Producto **sin imágenes** → placeholder de marca.
- Producto **sin precio mayoreo** (`price_mayoreo` ausente) → mostrar solo menudeo con etiqueta clara.
- Categoría con **>50 productos** → la carga debe traerlos todos (hoy se truncan en categoría); resolver con la unificación de paginación (RF-21).
- **Búsqueda sin resultados** → estado vacío con sugerencia/limpiar filtros.
- **"Mi pedido" vacío** → estado vacío con CTA a explorar productos.
- Nombre/descripción muy largos → truncado consistente en la card.
- Mensaje de WhatsApp con muchos ítems → formato legible y dentro de límites razonables de URL.
- Falla de red al "Cargar más" → manejo de error visible (ya hay `AbortController`).

---

## 9. Fuera de alcance

- Checkout/pago online con Stripe (se descarta por ahora; se formaliza WhatsApp). Stripe queda como dependencia sin uso o se remueve en limpieza.
- Dark mode (se elimina).
- Sistema de reviews/ratings, stock/inventario, variantes de producto, precio anterior tachado (requiere backend; se evalúa a futuro).
- Cambios al backend Strapi (modelo de datos se mantiene; el badge "Oferta" usa el flag existente).
- Cambio del nombre de marca o creación de logo gráfico.

---

## 10. Stack detectado

- **Framework:** Next.js 15.5 (App Router, Turbopack), React 19.
- **Estilos:** Tailwind CSS v4 (config en CSS, `@theme inline`), `tw-animate-css`.
- **UI:** shadcn/ui (estilo new-york, base neutral), Radix UI (dropdown, navigation-menu, popover, radio-group, label, separator, slot), `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` (iconos).
- **Estado:** Zustand 5 (carrito/favoritos con `persist`).
- **Carrusel:** embla-carousel (+ autoplay).
- **Notificaciones:** sonner.
- **Otros:** next-themes (a eliminar), nextjs-toploader, qs, @stripe/* (sin uso).
- **Datos:** Backend **Strapi** (REST), capa en `lib/data/strapi.ts`; campos de producto: `productName`, `slug`, `description`, `price`, `price_mayoreo`, `images[]`, `category`, `active`, `isFeatured`, `isRebaja`.
- **TypeScript** 5.

---

## 11. Roadmap sugerido (fases)

1. **Fundaciones del design system:** tokens de marca (azul + acentos), tipografía cableada, eliminar dark mode, definir botones/cards/inputs base. *(habilita todo lo demás)*
2. **Product card unificado** + precios mayorista-first + badge "Oferta".
3. **Header/navegación:** buscador global, categorías dinámicas, accesos a favoritos/pedido, FAB WhatsApp.
4. **Listado/categoría:** unificar paginación, breadcrumbs, orden, filtros, estados de carga/vacío, grid mobile compacto.
5. **Conversión:** formalizar WhatsApp (mensajes prellenados), "Mi pedido" multi-producto → WhatsApp.
6. **Detalle de producto:** galería mejorada, jerarquía, relacionados.
7. **Limpieza:** `next/image`, remover código muerto (api/ legacy, success, filtros sin uso), corregir typos.

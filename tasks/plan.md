# Implementation Plan — Fase 1: Fundaciones del Design System (Gamba)

> Deriva de `Spec.md` → sección 11, Fase 1. Cubre **RF-1 a RF-5**: tokens de marca, tipografía cableada, eliminación de dark mode y componentes base (button/card/input) + reestilizado del wordmark.
> **Read-only plan.** La implementación es responsabilidad de `/g-build`.

## Overview

Convertir el preset genérico de shadcn (gris/negro, tipografía rota, dark mode muerto) en una base de diseño con identidad de marca: azul `#0d4c99` como `--primary` real, acentos turquesa, tipografía bien cableada vía `next/font`, dark mode eliminado por completo, y componentes base (botón, card, input) y wordmark coherentes. Es la fundación que habilita las fases 2-7.

## Architecture Decisions

- **Dark mode se elimina, no se desactiva.** Se borra el andamiaje (`theme-provider`, `toggle-theme`), se quita `next-themes`, se elimina el bloque `.dark`, el `@custom-variant dark` y **todas** las clases `dark:`. Rationale: en Tailwind v4 `dark:` es built-in (`prefers-color-scheme`); dejar clases `dark:` sin el `@custom-variant` reactivaría estilos oscuros según el SO del visitante → bug. Limpiar las clases es obligatorio, no opcional.
- **`sonner.tsx` se desacopla de `next-themes`.** Hoy hace `useTheme()` y pasa `theme` al `<Sonner>`. Se reemplaza por `theme="light"` fijo para poder remover la dependencia sin romper el Toaster (que está montado en `layout.tsx`).
- **Tipografía (decisión):** **Plus Jakarta Sans** para cuerpo/UI (`--font-sans`) y **Sora** para display/títulos/precios (`--font-display`), ambas vía `next/font/google`. Se elimina toda referencia a Geist. *(g-build puede cambiar la familia si el usuario lo pide; el cableado es lo que importa.)*
- **Tokens en oklch** dentro de `:root` de `globals.css`, mapeados en `@theme inline`. Se agregan tokens semánticos `--whatsapp` (verde, solo WhatsApp) y `--offer` (badge oferta). Se eliminan los tokens `--sidebar-*` (sin uso) para reducir ruido; los `--chart-*` se mantienen salvo confirmación de que son código muerto.
- **shadcn/Radix se mantiene** como base; el `Input` se agrega como componente shadcn estándar (no existe hoy).
- **Verificación sin tests:** el repo no tiene suite de tests. La verificación de cada task es `npm run lint` + `npm run build` (deben pasar sin errores) + chequeo visual manual con `npm run dev`.

## Grafo de dependencias

```
Task 1 (quitar andamiaje dark + sonner + .dark CSS)
        │
        └── Task 2 (limpiar clases dark: inertes)   ← juntas dejan dark mode 100% fuera
                    │
                    ├── Task 3 (tokens de marca en globals.css)
                    │           │
                    │           ├── Task 4 (tipografía: layout + @theme)
                    │           ├── Task 5 (componente Input)
                    │           └── Task 6 (refinar button/card + wordmark)
```

Tasks 1 y 2 modifican `globals.css`/componentes para sacar dark mode → van **antes** de tocar tokens. Tasks 4, 5 y 6 consumen tokens/fuentes → después de Task 3.

## Task List

### Phase 1A — Eliminar dark mode

#### Task 1: Quitar andamiaje de dark mode y desacoplar sonner (RF-4)
**Descripción:** Eliminar el código muerto de theming y la dependencia `next-themes`, dejando el Toaster funcional con tema claro fijo y el CSS sin el bloque oscuro.

**Criterios de aceptación:**
- [ ] Se eliminan `components/theme-provider.tsx` y `components/toggle-theme.tsx`.
- [ ] `components/ui/sonner.tsx` ya no importa ni usa `next-themes`; usa `theme="light"` fijo.
- [ ] `app/globals.css`: se elimina el bloque `.dark { … }` (líneas ~81-113) y el `@custom-variant dark (…)` (línea ~4).
- [ ] Se remueve `next-themes` de `package.json`.
- [ ] No queda ninguna referencia a `next-themes`/`useTheme`/`ThemeProvider`/`ToggleTheme` en el código (`grep` limpio).

**Verificación:**
- [ ] `grep -rn "next-themes\|useTheme\|ToggleTheme\|ThemeProvider" --include="*.ts*" .` → sin resultados.
- [ ] `npm run build` exitoso.
- [ ] Manual: `npm run dev` → los toasts (sonner) siguen apareciendo con estilo claro.

**Dependencias:** Ninguna.
**Archivos probablemente tocados:** `components/theme-provider.tsx` (del), `components/toggle-theme.tsx` (del), `components/ui/sonner.tsx`, `app/globals.css`, `package.json`.
**Scope estimado:** Medium.

#### Task 2: Limpiar clases `dark:` inertes en componentes (RF-4)
**Descripción:** Tras quitar el `@custom-variant dark`, las clases `dark:` restantes reactivarían estilos oscuros vía `prefers-color-scheme`. Eliminarlas de todos los componentes que las usan.

**Criterios de aceptación:**
- [ ] Se eliminan todas las utilidades `dark:` de: `components/ui/button.tsx`, `components/ui/radio-group.tsx`, `components/ui/dropdown-menu.tsx`, `components/shared/products-counter.tsx`.
- [ ] El comportamiento visual en tema claro es idéntico al previo (solo se borran variantes que nunca aplicaban en claro).

**Verificación:**
- [ ] `grep -rn "dark:" --include="*.tsx" components app` → sin resultados.
- [ ] `npm run build` exitoso.
- [ ] Manual: con el SO en modo oscuro, la app sigue viéndose en claro (sin estilos oscuros parásitos).

**Dependencias:** Task 1.
**Archivos probablemente tocados:** `components/ui/button.tsx`, `components/ui/radio-group.tsx`, `components/ui/dropdown-menu.tsx`, `components/shared/products-counter.tsx`.
**Scope estimado:** Small (mecánico).

### Checkpoint A — Dark mode eliminado
- [ ] `grep` de `next-themes` y `dark:` ambos vacíos.
- [ ] `npm run lint` y `npm run build` limpios.
- [ ] Con SO en dark, la app permanece en tema claro.
- [ ] Review humano antes de seguir.

### Phase 1B — Identidad de marca

#### Task 3: Tokens de color de marca (RF-1)
**Descripción:** Reemplazar el preset neutral de shadcn por la paleta de marca en `:root`, agregar tokens semánticos y mapearlos en `@theme inline`.

**Criterios de aceptación:**
- [ ] `--primary` = azul de marca `#0d4c99` (en oklch) con `--primary-foreground` legible (blanco).
- [ ] Acento turquesa/celeste definido (`--accent` o token nuevo) acorde a "fresco/higiene".
- [ ] Tokens semánticos nuevos: `--whatsapp` (verde) y `--offer` (badge oferta), mapeados en `@theme inline` (`--color-whatsapp`, `--color-offer`).
- [ ] Escala de grises neutra para texto secundario/bordes coherente.
- [ ] Se eliminan los tokens `--sidebar-*` sin uso (de `:root` y de `@theme inline`).
- [ ] Contraste AA del azul sobre blanco verificado (RNF-3).

**Verificación:**
- [ ] `npm run build` exitoso.
- [ ] Manual: navbar/botones primarios se ven azul de marca; no quedan grises del preset como color principal.
- [ ] Contraste texto/fondo ≥ 4.5:1 (chequeo con herramienta).

**Dependencias:** Task 1 (CSS ya sin `.dark`).
**Archivos probablemente tocados:** `app/globals.css`.
**Scope estimado:** Medium.

#### Task 4: Cablear tipografía (RF-2)
**Descripción:** Cargar Plus Jakarta Sans (cuerpo) y Sora (display) vía `next/font`, mapear `--font-sans`/`--font-display` y eliminar las referencias muertas a Geist.

**Criterios de aceptación:**
- [ ] `app/layout.tsx` carga ambas fuentes con `next/font/google` y aplica sus variables al `<body>`.
- [ ] `app/globals.css` `@theme inline`: `--font-sans` apunta a la variable de Plus Jakarta Sans y se agrega `--font-display` (Sora); se elimina `--font-mono`/Geist si no se usa.
- [ ] No queda ninguna referencia a `geist`.
- [ ] El texto del sitio renderiza efectivamente con la fuente nueva (no la system default).

**Verificación:**
- [ ] `grep -rn "geist" .` → sin resultados.
- [ ] `npm run build` exitoso.
- [ ] Manual: inspeccionar en el navegador que `body` computa `font-family` = Plus Jakarta Sans.

**Dependencias:** Task 3 (comparten `@theme inline`/`globals.css`).
**Archivos probablemente tocados:** `app/layout.tsx`, `app/globals.css`.
**Scope estimado:** Small.

### Checkpoint B — Identidad visible
- [ ] `npm run lint` y `npm run build` limpios.
- [ ] La app muestra azul de marca + tipografía nueva de forma consistente.
- [ ] Sin referencias a geist ni a tokens sidebar.
- [ ] Review humano.

### Phase 1C — Componentes base

#### Task 5: Componente Input estándar (RF-5)
**Descripción:** Agregar `components/ui/input.tsx` (shadcn) consistente con los tokens, para reemplazar los inputs nativos en fases futuras.

**Criterios de aceptación:**
- [ ] Existe `components/ui/input.tsx` con la API shadcn estándar y estados focus/disabled usando los tokens (`--ring`, `--border`, `--input`).
- [ ] Sin clases `dark:`.
- [ ] Compila y es importable vía `@/components/ui/input`.

**Verificación:**
- [ ] `npm run build` exitoso.
- [ ] Manual: render de prueba del Input muestra foco con anillo del color primario.

**Dependencias:** Task 3 (tokens).
**Archivos probablemente tocados:** `components/ui/input.tsx` (nuevo).
**Scope estimado:** Small.

#### Task 6: Refinar button/card + reestilizar wordmark (RF-3 + Spec §3)
**Descripción:** Ajustar escala de radius/sombras/estados de `button` y `card` para coherencia, y reestilizar el wordmark "GAMBA" (navbar/footer) para que consuma el token `--primary` en vez del literal `#0d4c99` y se vea más profesional (usando la fuente display).

**Criterios de aceptación:**
- [ ] `button.tsx` y `card.tsx` con estados hover/focus/active consistentes y radius/sombra derivados de tokens; sin `dark:` (ya limpiado en Task 2, verificar).
- [ ] `components/navbar.tsx`: el wordmark deja de usar `text-[#0d4c99]` y usa `text-primary`; tipografía/peso/espaciado mejorados con `font-display`.
- [ ] `components/footer.tsx`: wordmark coherente con el navbar; se corrigen clases duplicadas si las hay.
- [ ] El nombre "GAMBA" no cambia (RN-6); "1er aniversario" puede separarse como etiqueta.

**Verificación:**
- [ ] `npm run build` exitoso.
- [ ] Manual: navbar/footer muestran el wordmark azul de marca con la fuente display; botones/cards consistentes en hover/focus.

**Dependencias:** Tasks 3, 4 (tokens + fuentes); revisa Task 2 (sin `dark:`).
**Archivos probablemente tocados:** `components/ui/button.tsx`, `components/ui/card.tsx`, `components/navbar.tsx`, `components/footer.tsx`.
**Scope estimado:** Medium.

### Checkpoint C — Fase 1 completa
- [ ] Todos los criterios de aceptación (Tasks 1-6) cumplidos.
- [ ] `npm run lint` + `npm run build` limpios.
- [ ] Recorrido manual: home, listado, detalle se ven con marca + fuente nuevas, sin dark mode, sin regresiones.
- [ ] Listo para Fase 2 (Product card unificado).

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Quitar `@custom-variant dark` deja clases `dark:` activas vía `prefers-color-scheme` → estilos oscuros parásitos | Alto | Tasks 1 y 2 se completan **juntas** antes del Checkpoint A; verificar con SO en dark. |
| Romper el Toaster al quitar `next-themes` | Medio | Task 1 desacopla `sonner.tsx` con `theme="light"` antes de remover la dependencia. |
| Cambiar `--primary` afecta toda la UI (botones, links, focus) | Medio | Es el objetivo; validar contraste AA y recorrido visual en Checkpoint B. |
| Elegir mal la fuente (gusto del usuario) | Bajo | Decisión por defecto (Jakarta+Sora); el cableado es lo central y la familia se cambia en una línea. |
| Eliminar tokens `--chart-*`/`--sidebar-*` que estuvieran en uso | Bajo | Solo se eliminan `--sidebar-*` (confirmado sin uso); `--chart-*` se conservan salvo verificación. |

## Open Questions
- ¿Confirmás **Plus Jakarta Sans + Sora** como tipografías, o preferís otra familia? (no bloquea; default asumido).
- ¿Eliminamos también los tokens `--chart-*` (aparentan ser código muerto) o los dejamos por las dudas?

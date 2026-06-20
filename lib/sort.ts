/**
 * Allow-list de ordenamiento para el listado de productos.
 * Mapea claves públicas (seguras, expuestas en la URL) a strings de Strapi,
 * evitando inyectar un `sort` arbitrario en la query.
 */

export const SORT_KEYS = [
  "novedades",
  "precio_asc",
  "precio_desc",
  "nombre",
] as const;

export type SortKey = (typeof SORT_KEYS)[number];

export const DEFAULT_SORT: SortKey = "novedades";

const SORT_MAP: Record<SortKey, string> = {
  novedades: "createdAt:desc",
  precio_asc: "price_mayoreo:asc",
  precio_desc: "price_mayoreo:desc",
  nombre: "productName:asc",
};

/** Opciones para renderizar el selector de orden. */
export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "novedades", label: "Más nuevos" },
  { key: "precio_asc", label: "Precio: menor a mayor" },
  { key: "precio_desc", label: "Precio: mayor a menor" },
  { key: "nombre", label: "Nombre (A-Z)" },
];

/** Type guard: ¿la clave es un SortKey válido? */
export function isSortKey(value: unknown): value is SortKey {
  return typeof value === "string" && value in SORT_MAP;
}

/** Devuelve el string de Strapi para una clave; fallback seguro a novedades. */
export function toStrapiSort(key: unknown): string {
  return SORT_MAP[isSortKey(key) ? key : DEFAULT_SORT];
}

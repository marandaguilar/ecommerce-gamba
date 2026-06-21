/**
 * Contrato único de los search-params del listado (productos y categoría).
 * Una sola definición de claves + parsers, compartida por los controles
 * client (nuqs `useQueryStates`) y las páginas server (`loadListingParams`).
 * Evita que el encoding del cliente y el parseo del servidor diverjan.
 */
import {
  createLoader,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { SORT_KEYS, DEFAULT_SORT } from "@/lib/sort";

export const listingParams = {
  page: parseAsInteger.withDefault(1),
  search: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(SORT_KEYS).withDefault(DEFAULT_SORT),
  category: parseAsString.withDefault(""),
  offer: parseAsBoolean.withDefault(false),
};

/** Loader server-side: coacciona `searchParams` al contrato tipado. */
export const loadListingParams = createLoader(listingParams);

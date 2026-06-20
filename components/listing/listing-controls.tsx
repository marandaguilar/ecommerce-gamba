"use client";

import { useEffect, useState } from "react";
import { Filter, Search, Tag } from "lucide-react";
import {
  useQueryStates,
  parseAsString,
  parseAsBoolean,
  parseAsInteger,
} from "nuqs";

import { CategoryType } from "@/types/category";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import SortSelect from "@/components/listing/sort-select";

interface ListingControlsProps {
  /** Si se pasa, muestra el filtro por categoría (listado global). En
   *  una página de categoría se omite (el rubro ya está fijo). */
  categories?: CategoryType[];
}

/**
 * Barra de controles compartida del listado, con estado en la URL (nuqs):
 * búsqueda (debounced), filtro por categoría (opcional), toggle "solo
 * ofertas" y orden. Cualquier cambio resetea ?page=1 y re-renderiza el
 * server (shallow:false).
 */
const ListingControls = ({ categories }: ListingControlsProps) => {
  const [{ search, category, offer }, setParams] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      category: parseAsString.withDefault(""),
      offer: parseAsBoolean.withDefault(false),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: false }
  );

  const [localSearch, setLocalSearch] = useState(search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch.trim() !== search) {
      setParams({ search: debouncedSearch.trim() || null, page: 1 });
    }
  }, [debouncedSearch, search, setParams]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:w-auto">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className="pl-9 sm:w-[260px]"
        />
      </div>

      {categories && (
        <div className="relative w-full sm:w-auto">
          <Filter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <select
            value={category}
            onChange={(e) =>
              setParams({ category: e.target.value || null, page: 1 })
            }
            aria-label="Filtrar por categoría"
            className="h-9 w-full appearance-none rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] sm:w-[210px]"
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={offer}
          onChange={(e) =>
            setParams({ offer: e.target.checked || null, page: 1 })
          }
          className="size-4 accent-[var(--offer)]"
        />
        <Tag className="size-4 text-offer" />
        Solo ofertas
      </label>

      <div className="sm:ml-auto">
        <SortSelect />
      </div>
    </div>
  );
};

export default ListingControls;

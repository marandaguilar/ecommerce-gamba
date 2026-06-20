"use client";

import { ChevronDown } from "lucide-react";
import { useQueryStates, parseAsStringLiteral, parseAsInteger } from "nuqs";

import { SORT_KEYS, SORT_OPTIONS, DEFAULT_SORT } from "@/lib/sort";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Selector de orden sincronizado a la URL (?sort). Cambiar el orden
 * resetea la página a 1. shallow:false fuerza el re-fetch del server.
 */
const SortSelect = () => {
  const [{ sort }, setParams] = useQueryStates(
    {
      sort: parseAsStringLiteral(SORT_KEYS).withDefault(DEFAULT_SORT),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: false }
  );

  const current =
    SORT_OPTIONS.find((o) => o.key === sort) ?? SORT_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between gap-2">
          <span className="text-muted-foreground">Ordenar:</span>
          {current.label}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.key}
            onClick={() => setParams({ sort: option.key, page: 1 })}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortSelect;

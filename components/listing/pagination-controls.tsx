"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";

import { listingParams } from "@/lib/listing-params";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  pageCount: number;
}

/**
 * Controles de paginación sincronizados a la URL (?page). Compartible y
 * server-driven (shallow:false). Se oculta si hay una sola página.
 */
const PaginationControls = ({ pageCount }: PaginationControlsProps) => {
  const [page, setPage] = useQueryState(
    "page",
    listingParams.page.withOptions({ shallow: false })
  );

  if (pageCount <= 1) return null;

  const current = Math.min(Math.max(page, 1), pageCount);

  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        disabled={current <= 1}
        onClick={() => setPage(current - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="size-4" />
        Anterior
      </Button>

      <span className="text-sm text-muted-foreground">
        Página {current} de {pageCount}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={current >= pageCount}
        onClick={() => setPage(current + 1)}
        aria-label="Página siguiente"
      >
        Siguiente
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export default PaginationControls;

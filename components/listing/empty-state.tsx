import { PackageSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** CTA opcional (p. ej. limpiar filtros / ver todos). */
  children?: React.ReactNode;
}

/** Estado vacío para listados sin resultados. */
const EmptyState = ({ title, description, children }: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 py-16 text-center">
      <PackageSearch className="size-10 text-muted-foreground" />
      <p className="text-lg font-medium">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
};

export default EmptyState;

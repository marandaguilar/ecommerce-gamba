import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-3xl font-bold mb-4">Producto no encontrado</h2>
      <p className="text-muted-foreground mb-6">
        El producto que buscas no existe o ha sido eliminado.
      </p>
      <Link href="/products">
        <Button className="text-white">Ver todos los productos</Button>
      </Link>
    </div>
  );
}

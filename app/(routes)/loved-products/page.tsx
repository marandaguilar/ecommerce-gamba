"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { useLovedProducts } from "@/hooks/use-loved-products";
import { useMounted } from "@/hooks/use-mounted";
import { buildOrderWhatsappUrl, getBaseUrl, openWhatsapp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EmptyState from "@/components/listing/empty-state";
import LovedItemProduct from "./components/loved-item-product";

export default function LovedProductsPage() {
  const { lovedItems } = useLovedProducts();

  // Guard de hydration: favoritos viven en localStorage (persist).
  const mounted = useMounted();
  const items = mounted ? lovedItems : [];

  const consultar = () => {
    openWhatsapp(
      buildOrderWhatsappUrl(items, {
        baseUrl: getBaseUrl(),
        intro: "Hola, quiero consultar por estos productos:",
      })
    );
  };

  return (
    <div className="max-w-3xl px-4 py-16 mx-auto sm:px-6">
      <h1 className="mb-6 font-display text-3xl font-bold">Mis favoritos</h1>

      {items.length === 0 ? (
        <EmptyState
          title="Todavía no tenés favoritos"
          description="Marcá productos con el corazón para guardarlos acá."
        >
          <Button asChild className="mt-2">
            <Link href="/products">Explorar productos</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <LovedItemProduct key={item.id} product={item} />
            ))}
          </ul>

          <Separator className="my-6" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "favorito" : "favoritos"}
            </p>
            <Button
              type="button"
              onClick={consultar}
              className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 active:bg-whatsapp/80"
            >
              <MessageCircle className="size-4" />
              Consultar por WhatsApp
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { useMounted } from "@/hooks/use-mounted";
import { buildOrderWhatsappUrl, getBaseUrl, openWhatsapp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EmptyState from "@/components/listing/empty-state";
import CartItem from "./components/cart-item";

export default function Page() {
  const { items, removeAll } = useCart();

  // Guard de hydration: el pedido vive en localStorage (persist); solo se
  // refleja tras montar para evitar mismatch servidor/cliente.
  const mounted = useMounted();
  const orderItems = mounted ? items : [];

  const sendOrder = () => {
    const orderLines = orderItems.map((item) => ({
      ...item,
      quantity: item.cartQuantity,
      unidad: item.cartUnit,
    }));
    openWhatsapp(buildOrderWhatsappUrl(orderLines, { baseUrl: getBaseUrl() }));
  };

  return (
    <div className="max-w-3xl px-4 py-16 mx-auto sm:px-6">
      <h1 className="mb-6 font-display text-3xl font-bold">Mi pedido</h1>

      {orderItems.length === 0 ? (
        <EmptyState
          title="Tu pedido está vacío"
          description="Agregá productos a tu pedido y envialos juntos por WhatsApp."
        >
          <Button asChild className="mt-2">
            <Link href="/products">Explorar productos</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <ul>
            {orderItems.map((item) => (
              <CartItem key={`${item.id}-${item.cartUnit ?? "sin-unidad"}`} product={item} />
            ))}
          </ul>

          <Separator className="my-6" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {orderItems.length}{" "}
              {orderItems.length === 1 ? "producto" : "productos"} en tu pedido
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={removeAll}
                className="sm:order-1"
              >
                Vaciar pedido
              </Button>
              <Button
                type="button"
                onClick={sendOrder}
                className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 active:bg-whatsapp/80 sm:order-2"
              >
                <MessageCircle className="size-4" />
                Enviar pedido por WhatsApp
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

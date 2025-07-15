"use client";
import { useLovedProducts } from "@/hooks/use-loved-products";
import LovedItemProduct from "./components/loved-item-product";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function LovedProductsPage() {
  const { lovedItems } = useLovedProducts();

  return (
    <div className="max-w-4xl py-4 mx-auto sm:py-32 sm:px-24">
      <h1 className="sm:text-2xl">Productos que te gustan</h1>

      <div>
        <div>
          {lovedItems.length === 0 && <p>No tienes productos favoritos</p>}
          <ul>
            {lovedItems.map((item) => (
              <LovedItemProduct key={item.id} product={item} />
            ))}
          </ul>
        </div>
        <div>
          <Button
            className="w-full bg-green-600 text-white text-md hover:bg-green-700"
            onClick={() => {
              const phoneNumber = "+524494056193";
              const message = `Quiero más información de ${lovedItems.map(
                (item) => item.productName
              )}`;
              const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                message
              )}`;
              window.open(whatsappUrl, "_blank");
            }}
          >
            <MessageCircle size={20} />
            <span>Mándanos un mensaje</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

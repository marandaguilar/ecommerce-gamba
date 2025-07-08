"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/formatPrice";
import CartItem from "./components/cart-item";

export default function Page() {
    const { items } = useCart()

    const prices = items.map((product) => product.price)
    const totalPrice = prices.reduce((total, price) => total + price, 0)
    
    return (
        <div className="max-w-6xl px-4 py-16 mx-auto lg:px-8 sm:px-6">
            <h1 className="mb-5 text-3xl font-bold">Carrito de compras</h1>
            <div className="grid grid-cols-2 sm:gap-5">
                <div>
                   {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-gray-500">No hay productos en el carrito</p>
                    </div>
                   )}
                   <ul>
                    {items.map((item) => (
                        <CartItem key={item.id} product={item} />
                    ))}
                   </ul>
                </div>
                <div className="max-w-lg">
                    <div className="p-6 rounded-lg bg-slate-100">
                        <p className="mb-3 text-lg font-semibold">Resumen de la compra</p>
                        <Separator />
                        <div className="flex justify-between gap-5 my-4">
                            <p>Total de la orden</p>
                            <p>{formatPrice(totalPrice)}</p>
                        </div>
                        <div className="flex items-center justify-center w-full mt-3">
                            <Button className="w-full" onClick={() => console.log("Comprar")}>Comprar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
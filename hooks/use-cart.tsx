import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { toast } from "sonner"

import { ProductType, SaleUnit } from "@/types/product"
import { getDefaultUnit } from "@/lib/units"

/** Ítem del pedido: el producto + la unidad y cantidad elegidas. */
export type CartItem = ProductType & {
    /** Unidad elegida (pieza/litro/kg); null si el producto no tiene unidades. */
    cartUnit: SaleUnit | null
    /** Cantidad solicitada en esa unidad (mínimo 1). */
    cartQuantity: number
}

type AddItemOptions = {
    unidad?: SaleUnit | null
    cantidad?: number
}

interface CartStore {
    items: CartItem[]
    addItem: (data: ProductType, options?: AddItemOptions) => void
    removeItem: (id: number, unidad?: SaleUnit | null) => void
    removeAll: () => void
}

/** Normaliza la cantidad a un entero >= 1. */
function normalizeQuantity(value?: number): number {
    if (!value || !Number.isFinite(value) || value < 1) return 1
    return Math.floor(value)
}

export const useCart = create(persist<CartStore>((set, get) => ({
    items: [],
    addItem: (data: ProductType, options?: AddItemOptions) => {
        const currentItems = get().items
        const unidad = options?.unidad ?? getDefaultUnit(data)
        const cantidad = normalizeQuantity(options?.cantidad)

        // Un mismo producto en distinta unidad son ítems separados; misma
        // unidad suma cantidad.
        const existingItem = currentItems.find(
            (item) => item.id === data.id && item.cartUnit === unidad
        )

        if (existingItem) {
            const updatedItems = currentItems.map((item) =>
                item.id === data.id && item.cartUnit === unidad
                    ? { ...item, cartQuantity: item.cartQuantity + cantidad }
                    : item
            )
            set({ items: updatedItems })
            return toast.success("Cantidad actualizada en tu pedido")
        }

        set({
            items: [...currentItems, { ...data, cartUnit: unidad, cartQuantity: cantidad }],
        })
        toast.success("Producto agregado al carrito")
    },
    removeItem: (id: number, unidad?: SaleUnit | null) => {
        const currentItems = get().items
        const updatedItems = currentItems.filter(
            (item) => !(item.id === id && (unidad === undefined || item.cartUnit === unidad))
        )
        set({ items: updatedItems })
        toast.success("Producto eliminado del carrito")
    },
    removeAll: () => {
        set({ items: [] })
        toast.success("Carrito vaciado")
    }
}), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage),
    // v1: el ítem pasó de ProductType a CartItem (unidad + cantidad).
    version: 1,
    migrate: (persisted, version) => {
        const state = persisted as { items?: unknown[] } | null
        if (state && version === 0) {
            return {
                ...state,
                items: (state.items ?? []).map((item) => ({
                    ...(item as object),
                    cartUnit: null,
                    cartQuantity: 1,
                })),
            } as unknown as CartStore
        }
        return persisted as CartStore
    },
}))

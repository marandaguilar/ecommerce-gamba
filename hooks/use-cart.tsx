import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { toast } from "sonner"

import { ProductType } from "@/types/product"

interface CartStore {
    items: ProductType[]
    addItem: (data: ProductType) => void
    removeItem: (id: number) => void
    removeAll: () => void
}

export const useCart = create(persist<CartStore>((set, get) => ({
    items: [],
    addItem: (data: ProductType) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item.id === data.id)

        if (existingItem) {
            return toast.error("El producto ya está en el carrito")
        }

        set({ items: [...currentItems, data] })
        toast.success("Producto agregado al carrito")
    },
    removeItem: (id: number) => {
        const currentItems = get().items
        const updatedItems = currentItems.filter((item) => item.id !== id)
        set({ items: updatedItems })
        toast.success("Producto eliminado del carrito")
    },
    removeAll: () => {
        set({ items: [] })
        toast.success("Carrito vaciado")
    }
}), {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage)
}))
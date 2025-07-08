import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { ProductType } from "@/types/product"
import { toast } from "sonner"

interface LovedProductsState {
    lovedItems: ProductType[]
    addLovedItem: (product: ProductType) => void
    removeLovedItem: (product: ProductType) => void
}

export const useLovedProducts = create<LovedProductsState>()(
    persist((set, get) => ({
    lovedItems: [],
    addLovedItem: (data: ProductType) => {
       const currentLovedItem = get().lovedItems
       const existingItem = currentLovedItem.find((item) => item.id === data.id)

       if (existingItem) {
        toast.error("Producto ya agregado a favoritos")
        return
       }

       set({ lovedItems: [...currentLovedItem, data] })
       toast.success("Producto agregado a favoritos")
    },
    removeLovedItem: (data: ProductType) => {
        const currentLovedItem = get().lovedItems
        const updatedLovedItem = currentLovedItem.filter((item) => item.id !== data.id)
        set({ lovedItems: updatedLovedItem })
        toast.success("Producto eliminado de favoritos")
    },
}), {
    name: "loved-products",
    storage: createJSONStorage(() => localStorage),
}))
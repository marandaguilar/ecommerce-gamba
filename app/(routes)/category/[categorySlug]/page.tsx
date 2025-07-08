"use client"

import { useGetCategoryProduct } from "@/api/getCategoryProduct"
import { ResponseType } from "@/types/response"
import { useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import FiltersControlsCategory from "./components/filters-controls-category"
import SkeletonSchema from "@/components/skeletonSchema"
import ProductCard from "./components/product-card"
import { ProductType } from "@/types/product"
import { useState } from "react"

export default function Page() {
    const params = useParams()
    const { categorySlug } = params as { categorySlug: string }
    const { result, loading }: ResponseType = useGetCategoryProduct(categorySlug) 
    const [filteredPurchase, setFilteredPurchase] = useState<string>("")
    
    const filteredProducts = result?.filter((product: ProductType) => {
        if (filteredPurchase === "") return true
        return product.purchase === filteredPurchase
    })

    return (
        <div className="max-m-6xl py-4 mx-auto sm:py-16 sm:px-24">
            {result !== null && !loading && (
                <h1 className="text-3xl font-medium">{result[0].category.categoryName}</h1>
            )}
            <Separator />

            <div className="sm:flex sm:justify-between">
                <FiltersControlsCategory 
                setFilteredPurchase={setFilteredPurchase}
                />

                <div className="grid gap-5 mt-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
                    {loading && (
                        <SkeletonSchema grid={3} />
                    )}
                    {filteredProducts !== null && !loading && (
                        filteredProducts.map((product: ProductType) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                    {filteredProducts !== null && !loading && filteredProducts.length === 0 && (
                        <p>No hay productos que coincidan con la búsqueda</p>
                    )}
                </div>
            </div>
        </div>
    )
}
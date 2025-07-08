import { useLovedProducts } from "@/hooks/use-loved-products"
import { ProductType } from "@/types/product"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import IconButton from "@/components/icon-button"
import { formatPrice } from "@/lib/formatPrice"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import ProductCategories from "@/components/shared/product-categories"
import ProductImageMiniature from "@/components/shared/product-image-miniature"

interface LovedItemProductProps {
    product: ProductType
}

const LovedItemProduct = (props: LovedItemProductProps) => {
    const { product } = props
    const router = useRouter()
    const { removeLovedItem } = useLovedProducts()
    const { addItem } = useCart()

    return (
        <li className="flex py-6 border-b">
            <ProductImageMiniature slug={product.slug || ""} url={product.images?.[0]?.url || ""} />
                <div className="flex justify-between flex-1 px-6">
                    <div>
                        <div>
                            <h2 className="text-lg font-bold">{product.productName}</h2>
                            <p className="font-bold">{formatPrice(product.price)}</p>
                        </div>
                        <ProductCategories category={product.category?.categoryName || ""} purchase={product.purchase || ""} />
                        <Button 
                            className="mt-5 rounded-full"
                            onClick={() => addItem(product)}
                            >
                                Agregar al carrito
                            </Button>
                    </div>
                    <div>
                        <button className={cn("rounded-full flex items-center justify-center bg-white border shadow-md p-1 hover:scale-110 transition")}>
                            <X size={20} 
                            onClick={ () => removeLovedItem(product)}/>
                        </button>
                    </div>
                </div>
        </li>
    )
}

export default LovedItemProduct
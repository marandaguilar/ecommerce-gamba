import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/formatPrice"
import { ProductType } from "@/types/product"
import { Minus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import ProductCategories from "@/components/shared/product-categories"
import ProductImageMiniature from "@/components/shared/product-image-miniature"

interface CartItemProps {
    product: ProductType
}

const CartItem = (props: CartItemProps) => {
    const { product } = props
    const router = useRouter()
    const { removeItem } = useCart()

    return (
        <li className="flex py-6 border-b">
            <ProductImageMiniature slug={product.slug || ""} url={product.images?.[0]?.url || ""} />
            <div className="flex justify-between flex-1 px-6">
                <div>
                    <h2 className="text-lg font-bold">{product.productName}</h2>
                    <p className="font-bold">{formatPrice(product.price)}</p>
                    <ProductCategories category={product.category?.categoryName || ""} purchase={product.purchase || ""} />
                </div>
                    <div>
                        <button className={cn("rounded-full flex items-center justify-center bg-white border shadow-md p-1 hover:scale-110 transition")}>
                            <X size={20} onClick={() => removeItem(product.id)} />
                        </button>
                    </div>
            </div>
        </li>
    )
}

export default CartItem
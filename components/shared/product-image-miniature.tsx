import { useRouter } from "next/navigation"

interface ProductImageMiniatureProps {
    slug: string
    url: string
}

const ProductImageMiniature = (props: ProductImageMiniatureProps) => {
    const { slug, url } = props
    const router = useRouter()

    return (
        <div onClick={() => router.push(`/product/${slug}`)} className="cursor-pointer">
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`} 
                alt={slug} 
                className="w-24 h-24 rounded-md overflow-hidden sm:w-auto sm:h-32" />
            </div>
    )
}

export default ProductImageMiniature
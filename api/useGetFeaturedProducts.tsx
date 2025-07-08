import { useEffect, useState } from "react"

export function useGetFeaturedProducts() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?filtered[isFeatured][$eq]=true&populate=*`
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(url)
                const json = await res.json()
                setResult(json.data)
                setLoading(false)
            } catch (error: any) {
                setError(error)
                setLoading(false)
            }
        })()
    }, [url])

    return { result, loading, error }
}
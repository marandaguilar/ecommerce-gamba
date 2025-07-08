import { useEffect, useState } from "react"
import { ResultFilterTypes } from "@/types/filters"

export function useGetProductField() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content-type-builder/content-types/api::product.product`
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [result, setResult] = useState<ResultFilterTypes | null>(null)

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

    return { loading, result, error }
}
import { useState, useEffect } from "react"

export function useGetCategories() {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [result, setResult] = useState(null)

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
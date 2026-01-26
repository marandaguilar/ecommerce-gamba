import { CategoryType } from './category'

export type ImageType = {
    id: number
    documentId?: string
    url: string
}

export type ProductType = {
    id: number
    documentId?: string
    productName: string
    slug: string
    description: string
    active: boolean
    isFeatured: boolean | null
    purchase?: string
    price: number
    price_mayoreo: number
    images?: ImageType[]
    category?: CategoryType
    createdAt?: string
    updatedAt?: string
}
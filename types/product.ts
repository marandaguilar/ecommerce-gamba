import { CategoryType } from './category'

export type ImageType = {
    id: number
    url: string
}

export type ProductType = {
    id: number
    productName: string
    slug: string
    description: string
    active: boolean
    isFeatured: boolean
    purchase: string
    price: number
    price_mayoreo: number
    images?: ImageType[]
    category?: CategoryType
}
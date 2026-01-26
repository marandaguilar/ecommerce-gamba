export type CategoryType = {
    id: number
    documentId?: string
    slug: string
    categoryName: string
    mainImage?: MainImageType
    images?: MainImageType
}

export type MainImageType = {
    id: number
    documentId?: string
    url: string
}
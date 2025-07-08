export type CategoryType = {
    id: number
    slug: string
    categoryName: string
    mainImage: MainImageType
    images?: MainImageType
}

export type MainImageType = {
    id: number
    url: string
}
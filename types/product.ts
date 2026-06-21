import { CategoryType } from './category'

export type ImageType = {
    id: number
    documentId?: string
    url: string
}

/** Unidad de venta de un producto (componente repetible `unidades` en Strapi). */
export type SaleUnit = 'pieza' | 'litro' | 'kg'

export type ProductUnit = {
    id: number
    unidad: SaleUnit
    /** Marca la unidad que sale seleccionada por defecto en el detalle. */
    predeterminada?: boolean | null
}

export type ProductType = {
    id: number
    documentId?: string
    productName: string
    slug: string
    description: string
    active: boolean
    isFeatured: boolean | null
    isRebaja: boolean | null
    purchase?: string
    price: number
    price_mayoreo: number
    images?: ImageType[]
    category?: CategoryType
    /** Unidades de venta disponibles para este producto (puede venir vacío). */
    unidades?: ProductUnit[]
    createdAt?: string
    updatedAt?: string
}
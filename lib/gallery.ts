/**
 * Normalización de imágenes para la galería del detalle de producto.
 * Centraliza el filtrado de imágenes inválidas (sin `url`) y permite a la
 * galería decidir cuándo mostrar el placeholder de marca (Spec §8: producto
 * sin imágenes). Función pura y testeable.
 */
import type { ImageType } from "@/types/product";

export type GalleryImage = {
  id: number;
  url: string;
};

/** Devuelve solo las imágenes con `url` válida, en orden. */
export function resolveGalleryImages(
  images?: ImageType[] | null
): GalleryImage[] {
  if (!images) return [];
  return images
    .filter((image): image is ImageType => Boolean(image?.url))
    .map((image) => ({ id: image.id, url: image.url }));
}

/** `true` si hay al menos una imagen renderizable. */
export function hasGalleryImages(images?: ImageType[] | null): boolean {
  return resolveGalleryImages(images).length > 0;
}

"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageType } from "@/types/product";
import { resolveGalleryImages } from "@/lib/gallery";

interface CarouselProductProps {
  images?: ImageType[] | null;
  productName: string;
}

const CarouselProduct = (props: CarouselProductProps) => {
  const { images, productName } = props;
  const gallery = resolveGalleryImages(images);

  // Placeholder de marca cuando el producto no tiene imágenes (Spec §8).
  if (gallery.length === 0) {
    return (
      <div className="p-8 sm:px-16">
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground">
          <ImageOff className="size-10" />
          <span className="text-sm">Sin imagen disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 sm:px-16">
      <Carousel>
        <CarouselContent>
          {gallery.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={image.url}
                  alt={`${productName} — imagen ${index + 1}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain p-4"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {gallery.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default CarouselProduct;

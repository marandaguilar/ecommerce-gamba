"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageType } from "@/types/product";
import { resolveGalleryImages } from "@/lib/gallery";
import { cn } from "@/lib/utils";

interface CarouselProductProps {
  images?: ImageType[] | null;
  productName: string;
}

const CarouselProduct = (props: CarouselProductProps) => {
  const { images, productName } = props;
  const gallery = resolveGalleryImages(images);

  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);

  // Sincroniza el índice activo con embla (flechas, swipe y thumbnails).
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

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

  const hasMultiple = gallery.length > 1;

  return (
    <div className="p-8 sm:px-16">
      <Carousel setApi={setApi}>
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
        {hasMultiple && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>

      {hasMultiple && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {gallery.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Ver imagen ${index + 1} de ${productName}`}
              aria-current={selected === index}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted transition",
                selected === index
                  ? "border-primary ring-2 ring-primary"
                  : "border-input hover:border-primary/50"
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarouselProduct;

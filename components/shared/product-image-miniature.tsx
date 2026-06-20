"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductImageMiniatureProps {
  slug: string;
  url: string;
}

const ProductImageMiniature = (props: ProductImageMiniatureProps) => {
  const { slug, url } = props;
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/product/${slug}`)}
      aria-label={`Ver ${slug}`}
      className="relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-md bg-muted sm:size-32"
    >
      {url ? (
        <Image
          src={url}
          alt={slug}
          fill
          sizes="(min-width: 640px) 128px, 96px"
          className="object-contain"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageOff className="size-6" />
        </span>
      )}
    </button>
  );
};

export default ProductImageMiniature;

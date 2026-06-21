"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageZoomProps {
  src: string;
  alt: string;
  /** Cierra el overlay (botón, click-outside, Esc). */
  onClose: () => void;
}

/**
 * Overlay de zoom hand-rolled (sin radix-dialog, RNF-5): muestra la imagen
 * actual en grande. Cierre por botón, click en el backdrop y tecla Esc;
 * bloquea el scroll del body mientras está abierto.
 */
const ImageZoom = ({ src, alt, onClose }: ImageZoomProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:scale-110"
      >
        <X className="size-5" />
      </button>
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative h-[80vh] w-full max-w-4xl"
      >
        <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
      </div>
    </div>
  );
};

export default ImageZoom;

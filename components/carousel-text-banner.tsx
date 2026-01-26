"use client";

import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Sparkles, ShoppingBag, MapPin } from "lucide-react";

export const dataCarouselTop = [
  {
    id: 1,
    title: "¡Época navideña!",
    description: "Descubre nuestros productos especiales para estas fiestas",
    link: "/products",
    gradient: "from-purple-600 via-pink-600 to-red-600",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Mejores precios",
    description: "Emitimos factura electrónica en todas tus compras",
    link: "/products",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
    icon: ShoppingBag,
  },
  {
    id: 3,
    title: "Disponibilidad en Aguascalientes",
    description: "Visítanos y conoce todo nuestro catálogo",
    link: "/nosotros",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    icon: MapPin,
  },
];

const CarouselTextBanner = () => {
  const router = useRouter();
  return (
    <div className="relative w-full overflow-hidden">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {dataCarouselTop.map(({ id, title, description, link, gradient, icon: Icon }) => (
            <CarouselItem
              key={id}
              onClick={() => router.push(link)}
              className="cursor-pointer"
            >
              <div className={`relative bg-gradient-to-r ${gradient} py-16 sm:py-24 overflow-hidden group`}>
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute -top-10 -right-10 w-40 h-40 sm:w-60 sm:h-60 bg-white rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 sm:w-60 sm:h-60 bg-white rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6">
                    {/* Icon */}
                    <div className="p-3 sm:p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight group-hover:scale-105 transition-transform duration-300">
                      {title}
                    </h2>

                    {/* Description */}
                    <p className="text-base sm:text-xl lg:text-2xl text-white/90 max-w-3xl font-light group-hover:text-white transition-colors duration-300">
                      {description}
                    </p>

                    {/* Call to action indicator */}
                    <div className="mt-4 flex items-center gap-2 text-white/80 text-sm sm:text-base group-hover:gap-4 transition-all duration-300">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselTextBanner;

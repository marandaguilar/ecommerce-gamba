"use client";

import { useRouter } from "next/navigation";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import Autoplay from "embla-carousel-autoplay";

export const dataCarouselTop = [
  {
    id: 1,
    title: "🎉 ¡Época navideña! 🎉",
    description: "Felices fiestas",
    link: "/products",
  },
  {
    id: 2,
    title: "Mejores precios",
    description: "Emitimos factura",
    link: "/products",
  },
  {
    id: 3,
    title: "Disponibilidad en Aguascalientes",
    description: "Obten más información",
    link: "/nosotros",
  },
];

const CarouselTextBanner = () => {
  const router = useRouter();
  return (
    <div className="bg-gray-200 dark:bg-primary">
      <Carousel
        className="w-full max-w-4xl mx-auto"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {dataCarouselTop.map(({ id, title, description, link }) => (
            <CarouselItem
              key={id}
              onClick={() => router.push(link)}
              className="cursor-pointer"
            >
              <div>
                <Card className="shadow-none border-none bg-transparent">
                  <CardContent className="flex flex-col justify-center p-2 items-center text-center">
                    <p className="text-xl sm:text-2xl text-wrap dark:text-secondary">
                      {title}
                    </p>
                    <p className="text-md sm:text-base text-wrap dark:text-secondary">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default CarouselTextBanner;

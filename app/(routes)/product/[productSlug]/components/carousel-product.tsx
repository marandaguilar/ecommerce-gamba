import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageType } from "@/types/product";

interface CarouselProductProps {
  images?: ImageType[] | null;
  productName: string;
}

const CarouselProduct = (props: CarouselProductProps) => {
  const { images }: CarouselProductProps = props;

  if (!images) return null;

  return (
    <div className="sm:px-16 p-8">
      <Carousel>
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <img
                src={image.url}
                alt="image1"
                className="rounded-lg"
                loading="lazy"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 left-4" />
        <CarouselNext className="absolute top-1/2 -translate-y-1/2 right-4" />
      </Carousel>
    </div>
  );
};

export default CarouselProduct;

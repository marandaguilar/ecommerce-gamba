import Link from "next/link";
import { buttonVariants } from "./ui/button";

const BannerProduct = () => {
  return (
    <>
      <div className="mt-4 text-center p-20 sm:p-8">
        <p>Precios bajos</p>
        <h4 className="mt-2 text-5xl font-extrabold uppercase">
          Productos de calidad
        </h4>
        <p className="my-2 text-lg">Lo mejor en limpieza y desinfección</p>
        <Link href="#" className={buttonVariants({ variant: "default" })}>
          Ver productos
        </Link>
      </div>
    </>
  );
};

export default BannerProduct;

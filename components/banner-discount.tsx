import Link from "next/link";
import { buttonVariants } from "./ui/button";

const BannerDiscount = () => {
  return (
    <div className="p-5  sm:p-28 text-center">
      <h2 className="uppercase text-2xl font-black text-primary">
        Descuento en productos al mayoreo
      </h2>
      <h3>Compra más de 20 L o 5 unidades y obtendrás precio al mayoreo</h3>
      <div className="max-w-md mx-auto sm:flex justify-center gap-8 mt-5">
        <Link
          href="/products"
          className={buttonVariants({ variant: "default" })}
        >
          Ver productos
        </Link>
      </div>
    </div>
  );
};

export default BannerDiscount;

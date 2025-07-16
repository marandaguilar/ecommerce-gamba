"use client";

import { useGetCategories } from "../api/getProducts";
import Link from "next/link";
import { ResponseType } from "../types/response";
import { CategoryType } from "../types/category";

const ChooseCategory = () => {
  const { loading, result }: ResponseType = useGetCategories();

  console.log(result);

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-16 sm:px-24">
      <h3 className="px-6 pb-4 text-3xl sm:pb-8">¿Qué te gustaría comprar?</h3>

      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
        {!loading &&
          result !== undefined &&
          result.map((category: CategoryType) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="relative max-w-sm mx-auto overflow-hidden bg-no-repeat bg-cover rounded-lg"
            >
              {category.mainImage?.url && (
                <img
                  src={category.mainImage.url}
                  alt={category.categoryName}
                  className="max-w-[230px] transition duration-300 ease-in-out rounded-lg hover:scale-110"
                  loading="lazy"
                />
              )}
              <p className="absolute w-full py-2 text-center text-black text-lg bottom-5 font-bold backdrop-blur-lg">
                {category.categoryName}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ChooseCategory;

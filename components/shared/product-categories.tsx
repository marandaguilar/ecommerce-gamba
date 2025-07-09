interface ProductCategoriesProps {
  category: string;
}

const ProductCategories = (props: ProductCategoriesProps) => {
  const { category } = props;

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="px-2 py-1 text-xs text-white bg-red-950 dark:bg-white dark:text-black rounded-full">
        {category}
      </p>
    </div>
  );
};

export default ProductCategories;

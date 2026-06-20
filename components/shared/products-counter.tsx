interface ProductsCounterProps {
  visibleCount: number;
  totalCount: number;
  isLoading?: boolean;
}

const ProductsCounter = ({
  visibleCount,
  totalCount,
  isLoading = false,
}: ProductsCounterProps) => {
  if (isLoading) return null;

  return (
    <div className="flex justify-end mt-8 pr-6">
      <p className="text-sm text-gray-600">
        {visibleCount} de {totalCount} productos mostrados
      </p>
    </div>
  );
};

export default ProductsCounter;

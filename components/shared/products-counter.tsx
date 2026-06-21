interface ProductsCounterProps {
  visibleCount: number;
  totalCount: number;
}

const ProductsCounter = ({ visibleCount, totalCount }: ProductsCounterProps) => {
  return (
    <div className="flex justify-end mt-8 pr-6">
      <p className="text-sm text-gray-600">
        {visibleCount} de {totalCount} productos mostrados
      </p>
    </div>
  );
};

export default ProductsCounter;

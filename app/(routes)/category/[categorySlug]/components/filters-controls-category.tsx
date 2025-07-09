import FilterPurchase from "./filter-purchase";

type FiltersControlsCategoryProps = {
  setFilteredPurchase: (purchase: string) => void;
};

const FiltersControlsCategory = (props: FiltersControlsCategoryProps) => {
  const { setFilteredPurchase } = props;

  return (
    <div className="sm:w-[350px] sm:mt-5 p-6">
      <FilterPurchase setFilteredPurchase={setFilteredPurchase} />
    </div>
  );
};

export default FiltersControlsCategory;

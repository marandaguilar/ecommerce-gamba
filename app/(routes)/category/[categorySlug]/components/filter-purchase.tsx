import { useGetProductField } from "@/api/getProductField"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FilterTypes } from "@/types/filters"

type FilterPurchaseProps = {
    setFilteredPurchase: (purchase: string) => void
}

const FilterPurchase = (props: FilterPurchaseProps) => {
    const { setFilteredPurchase } = props
    const { result, loading }: FilterTypes = useGetProductField()

    return (
        <div className="my-5">
            <p className="mb-3 font-bold">Tipo de compra</p>
            {loading && result === null && (
                <p>Cargando...</p>
            )}

            <RadioGroup onValueChange={(value) => setFilteredPurchase(value)}>
                {result !== null && result.schema.attributes.purchase.enum.map((purchase: string) => (
                    <div key={purchase} className="flex items-center space-x-2">
                        <RadioGroupItem value={purchase} id={purchase} />
                        <Label htmlFor={purchase}>{purchase}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}

export default FilterPurchase
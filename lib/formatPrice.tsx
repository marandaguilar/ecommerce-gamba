export function formatPrice(price: number) {
    const priceFormated = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "MXN",
    }).format(price)

    const finalPrice = priceFormated.replace("MXN", "$")

    return finalPrice
}
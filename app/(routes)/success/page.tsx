import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const PageSuccess = () => {
    return (
        <div className="max-w-5xl px-4 py-16 mx-auto sm:py-16 sm:px-24">
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <div className="flex justify-center md:min-w-[400px]">
                    <Image src="/images/success.png" alt="success" width={250} height={500} className="rounded-lg" />
                </div>

                <div>
                    <h1 className="text-3xl">¡Gracias por tu compra!</h1>
                    <p className="my-3">Agradecemos tu compra, te esperamos en la tienda.</p>
                    <p className="my-3">En breve recibirás un correo con los detalles de tu compra.</p>
                    <p className="my-3">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <Button className="text-white">
                        <Link href="/">
                            Volver a la tienda
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PageSuccess
import Link from "next/link";
import { Separator } from "./ui/separator";

const dataFooter = [
  {
    id: 1,
    title: "Productos",
    href: "/products",
  },
  {
    id: 2,
    title: "Sobre Nosotros",
    href: "/nosotros",
  },
  {
    id: 3,
    title: "Favoritos",
    href: "/loved-products",
  },
  {
    id: 4,
    title: "Mi pedido",
    href: "/cart",
  },
];

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            <span className="font-display text-2xl font-extrabold tracking-tight text-primary">
              GAMBA
            </span>{" "}
            E-commerce
          </p>

          <ul className="flex flex-wrap items-center mt-6 text-sm font-medium text-muted-foreground sm:mt-0">
            {dataFooter.map((data) => (
              <li key={data.id}>
                <Link
                  href={data.href}
                  className="hover:text-primary hover:underline mr-4 md:mr-6"
                >
                  {data.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Separator className="my-6 sm:mx-auto lg:my-8" />

        <span className="block text-sm text-muted-foreground sm:text-center">
          &copy; 2026
          <Link href="/" className="hover:text-primary hover:underline">
            {" "}
            GAMBA.{" "}
          </Link>
          Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

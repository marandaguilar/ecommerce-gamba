import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="max-w-6xl py-4 mx-auto sm:py-16 sm:px-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Quienes Somos</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Somos una empresa especializada en la distribución de productos de
          limpieza accesibles y de calidad, comprometida con la excelencia y el
          servicio al cliente.
        </p>
      </div>

      <Separator className="mb-12" />

      {/* Misión y Visión */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              Nuestra Misión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Proporcionar a nuestros clientes en Aguascalientes una amplia gama
              de productos de limpieza de la más alta calidad, desde utensilios
              y herramientas hasta limpiadores especializados, contribuyendo a
              mantener espacios limpios y saludables en hogares y negocios.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-green-600 dark:text-green-400">
              Nuestra Visión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Ser la empresa líder en Aguascalientes en la distribución de
              productos de limpieza, reconocida por la calidad de nuestros
              productos, la excelencia en el servicio y el compromiso con la
              satisfacción del cliente.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Qué ofrecemos */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            ¿Qué Ofrecemos?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Utensilios de Limpieza</h3>
              <p className="text-sm text-muted-foreground">
                Escobas, trapeadores, cepillos, guantes y todo tipo de
                herramientas para facilitar las tareas de limpieza.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Productos Limpiadores</h3>
              <p className="text-sm text-muted-foreground">
                Detergentes, desinfectantes, limpiadores especializados y
                productos para cada tipo de superficie y necesidad.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Catálogo Digital</h3>
              <p className="text-sm text-muted-foreground">
                Nuestro catálogo en línea te permite explorar todos nuestros
                productos desde la comodidad de tu hogar o negocio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nuestros Valores */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Nuestros Valores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                Calidad
              </h4>
              <p className="text-sm text-muted-foreground">
                Ofrecemos solo productos de la más alta calidad que cumplen con
                los estándares más exigentes.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                Confiabilidad
              </h4>
              <p className="text-sm text-muted-foreground">
                Nuestros clientes confían en nosotros para satisfacer sus
                necesidades de limpieza de manera consistente.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">
                Servicio
              </h4>
              <p className="text-sm text-muted-foreground">
                Nos comprometemos a brindar un servicio excepcional y atención
                personalizada a cada cliente.
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                Compromiso
              </h4>
              <p className="text-sm text-muted-foreground">
                Estamos comprometidos con la satisfacción del cliente y la
                mejora continua de nuestros servicios.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Servicio */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Nuestro Servicio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">
                Cobertura de Servicio
              </h3>
              <p className="text-muted-foreground mb-4">
                Actualmente, nuestros servicios están disponibles exclusivamente
                en
                <strong className="text-foreground"> Aguascalientes</strong>.
                Nos especializamos en atender a clientes locales, ofreciendo un
                servicio personalizado y de calidad.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Nota importante:</strong> Esta plataforma funciona
                  como un catálogo digital. No realizamos ventas en línea, pero
                  te proporcionamos toda la información necesaria sobre nuestros
                  productos.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
                ¿Por qué elegirnos?
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Amplia variedad de productos de limpieza
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Productos de marcas reconocidas y confiables
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Atención personalizada y asesoría especializada
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Servicio local en Aguascalientes
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Catálogo digital fácil de navegar
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Contáctanos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              ¿Tienes alguna pregunta sobre nuestros productos o servicios? No
              dudes en contactarnos.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Servicio disponible en:</strong> Aguascalientes, México
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Explora nuestro catálogo para conocer todos nuestros productos
                de limpieza.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

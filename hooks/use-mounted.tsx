import { useEffect, useState } from "react";

/**
 * Devuelve `false` en el primer render (servidor + hidratación) y `true`
 * tras montar en el cliente. Sirve para gatear estado persistido en
 * localStorage (carrito, favoritos) y evitar mismatch de hidratación.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

import { test } from "node:test";
import assert from "node:assert/strict";

import { buildWhatsappUrl, WHATSAPP_PHONE } from "./whatsapp.ts";

test("buildWhatsappUrl apunta al teléfono configurado", () => {
  const url = buildWhatsappUrl({ productName: "Cloro", slug: "cloro" });
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_PHONE}?text=`));
});

test("buildWhatsappUrl codifica el nombre del producto en el mensaje", () => {
  const url = buildWhatsappUrl({ productName: "Jabón líquido", slug: "jabon" });
  assert.ok(url.includes(encodeURIComponent("Jabón líquido")));
});

test("buildWhatsappUrl incluye el link del producto cuando se pasa baseUrl", () => {
  const url = buildWhatsappUrl(
    { productName: "Cloro", slug: "cloro" },
    "https://gamba.com"
  );
  assert.ok(url.includes(encodeURIComponent("https://gamba.com/product/cloro")));
});

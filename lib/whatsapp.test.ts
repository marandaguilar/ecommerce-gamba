import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildWhatsappUrl,
  buildGeneralWhatsappUrl,
  buildOrderWhatsappUrl,
  WHATSAPP_PHONE,
} from "./whatsapp.ts";

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

test("buildGeneralWhatsappUrl apunta al teléfono con un mensaje por defecto", () => {
  const prefix = `https://wa.me/${WHATSAPP_PHONE}?text=`;
  const url = buildGeneralWhatsappUrl();
  assert.ok(url.startsWith(prefix));
  assert.ok(url.length > prefix.length);
});

test("buildGeneralWhatsappUrl codifica un mensaje personalizado", () => {
  const url = buildGeneralWhatsappUrl("Hola 👋");
  assert.ok(url.includes(encodeURIComponent("Hola 👋")));
});

test("buildOrderWhatsappUrl apunta al teléfono configurado", () => {
  const url = buildOrderWhatsappUrl([
    { productName: "Cloro", slug: "cloro" },
  ]);
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_PHONE}?text=`));
});

test("buildOrderWhatsappUrl incluye los nombres de todos los ítems", () => {
  const url = buildOrderWhatsappUrl([
    { productName: "Cloro", slug: "cloro" },
    { productName: "Jabón líquido", slug: "jabon" },
  ]);
  const text = decodeURIComponent(url);
  assert.ok(text.includes("Cloro"));
  assert.ok(text.includes("Jabón líquido"));
});

test("buildOrderWhatsappUrl muestra la cantidad y la unidad elegidas", () => {
  const url = buildOrderWhatsappUrl([
    { productName: "Cloro", slug: "cloro", quantity: 3, unidad: "kg" },
    { productName: "Aceite", slug: "aceite", quantity: 1, unidad: "litro" },
  ]);
  const text = decodeURIComponent(url);
  assert.ok(text.includes("3 kg"));
  assert.ok(text.includes("1 litro"));
});

test("buildOrderWhatsappUrl no incluye ningún precio en el mensaje", () => {
  const url = buildOrderWhatsappUrl([
    { productName: "Cloro", slug: "cloro", quantity: 2, unidad: "pieza" },
  ]);
  const text = decodeURIComponent(url);
  assert.ok(text.includes("2 piezas"));
  // El precio quedó fuera del pedido por WhatsApp (se acuerda al contactar).
  assert.ok(!/\$|MXN|EUR/.test(text));
});

test("buildOrderWhatsappUrl incluye los links cuando se pasa baseUrl", () => {
  const url = buildOrderWhatsappUrl(
    [{ productName: "Cloro", slug: "cloro" }],
    { baseUrl: "https://gamba.com" }
  );
  assert.ok(url.includes(encodeURIComponent("https://gamba.com/product/cloro")));
});

test("buildOrderWhatsappUrl con lista vacía devuelve una URL válida", () => {
  const url = buildOrderWhatsappUrl([]);
  const prefix = `https://wa.me/${WHATSAPP_PHONE}?text=`;
  assert.ok(url.startsWith(prefix));
  assert.ok(url.length > prefix.length);
});

test("buildOrderWhatsappUrl codifica un intro personalizado", () => {
  const url = buildOrderWhatsappUrl(
    [{ productName: "Cloro", slug: "cloro" }],
    { intro: "Estos son mis favoritos 👋" }
  );
  assert.ok(url.includes(encodeURIComponent("Estos son mis favoritos 👋")));
});

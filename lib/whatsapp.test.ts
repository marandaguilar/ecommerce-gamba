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
    { productName: "Cloro", slug: "cloro", price_mayoreo: 100, price: 120 },
  ]);
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_PHONE}?text=`));
});

test("buildOrderWhatsappUrl incluye los nombres de todos los ítems", () => {
  const url = buildOrderWhatsappUrl([
    { productName: "Cloro", slug: "cloro", price_mayoreo: 100, price: 120 },
    { productName: "Jabón líquido", slug: "jabon", price_mayoreo: 50, price: 60 },
  ]);
  const text = decodeURIComponent(url);
  assert.ok(text.includes("Cloro"));
  assert.ok(text.includes("Jabón líquido"));
});

test("buildOrderWhatsappUrl usa el precio mayoreo cuando existe", () => {
  const url = buildOrderWhatsappUrl([
    { productName: "Cloro", slug: "cloro", price_mayoreo: 100, price: 120 },
  ]);
  const text = decodeURIComponent(url);
  assert.ok(text.includes("100"));
  assert.ok(!text.includes("120"));
});

test("buildOrderWhatsappUrl cae a menudeo cuando falta el mayoreo", () => {
  const url = buildOrderWhatsappUrl([
    { productName: "Cloro", slug: "cloro", price_mayoreo: null, price: 120 },
  ]);
  const text = decodeURIComponent(url);
  assert.ok(text.includes("120"));
});

test("buildOrderWhatsappUrl incluye los links cuando se pasa baseUrl", () => {
  const url = buildOrderWhatsappUrl(
    [{ productName: "Cloro", slug: "cloro", price_mayoreo: 100, price: 120 }],
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
    [{ productName: "Cloro", slug: "cloro", price_mayoreo: 100 }],
    { intro: "Estos son mis favoritos 👋" }
  );
  assert.ok(url.includes(encodeURIComponent("Estos son mis favoritos 👋")));
});

import { test } from "node:test";
import assert from "node:assert/strict";

import { toStrapiSort, SORT_OPTIONS, isSortKey } from "./sort.ts";

test("toStrapiSort mapea 'novedades' a createdAt:desc", () => {
  assert.equal(toStrapiSort("novedades"), "createdAt:desc");
});

test("toStrapiSort mapea precio mayoreo ascendente y descendente", () => {
  assert.equal(toStrapiSort("precio_asc"), "price_mayoreo:asc");
  assert.equal(toStrapiSort("precio_desc"), "price_mayoreo:desc");
});

test("toStrapiSort mapea 'nombre' a productName:asc", () => {
  assert.equal(toStrapiSort("nombre"), "productName:asc");
});

test("toStrapiSort cae a 'novedades' ante una clave desconocida o insegura", () => {
  assert.equal(toStrapiSort("'; DROP TABLE"), "createdAt:desc");
  assert.equal(toStrapiSort(undefined), "createdAt:desc");
});

test("SORT_OPTIONS expone key + label para la UI", () => {
  assert.ok(SORT_OPTIONS.length >= 4);
  for (const opt of SORT_OPTIONS) {
    assert.equal(typeof opt.key, "string");
    assert.equal(typeof opt.label, "string");
  }
});

test("isSortKey valida claves conocidas", () => {
  assert.equal(isSortKey("nombre"), true);
  assert.equal(isSortKey("desconocida"), false);
});

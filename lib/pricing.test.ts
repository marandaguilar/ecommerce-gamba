import { test } from "node:test";
import assert from "node:assert/strict";

import { getPrimaryPricing } from "./pricing.ts";

test("getPrimaryPricing usa el mayoreo como primario y el menudeo como secundario", () => {
  const r = getPrimaryPricing({ price_mayoreo: 100, price: 120 });
  assert.equal(r.primaryLabel, "Mayoreo");
  assert.ok(r.primaryPrice?.includes("100"));
  assert.ok(r.secondaryPrice?.includes("120"));
});

test("getPrimaryPricing cae a menudeo cuando falta el mayoreo", () => {
  const r = getPrimaryPricing({ price_mayoreo: null, price: 120 });
  assert.equal(r.primaryLabel, "Menudeo");
  assert.ok(r.primaryPrice?.includes("120"));
  assert.equal(r.secondaryPrice, null);
});

test("getPrimaryPricing sin precios devuelve primaryPrice null", () => {
  const r = getPrimaryPricing({ price_mayoreo: null, price: null });
  assert.equal(r.primaryPrice, null);
  assert.equal(r.secondaryPrice, null);
});

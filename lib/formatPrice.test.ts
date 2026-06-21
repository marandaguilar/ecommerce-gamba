import { test } from "node:test";
import assert from "node:assert/strict";

import { formatPrice } from "./formatPrice.ts";

test("formatPrice prefija $ y usa 2 decimales (es-ES)", () => {
  assert.equal(formatPrice(1234.5), "$1234,50");
});

test("formatPrice trata 0 como precio válido (no null)", () => {
  assert.equal(formatPrice(0), "$0,00");
});

test("formatPrice devuelve null para undefined", () => {
  assert.equal(formatPrice(undefined), null);
});

test("formatPrice devuelve null para NaN", () => {
  assert.equal(formatPrice(NaN), null);
});

test("formatPrice devuelve null para null", () => {
  assert.equal(formatPrice(null), null);
});

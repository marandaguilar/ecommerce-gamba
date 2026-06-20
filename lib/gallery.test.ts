import { test } from "node:test";
import assert from "node:assert/strict";

import { resolveGalleryImages, hasGalleryImages } from "./gallery.ts";

test("resolveGalleryImages devuelve las imágenes con url tal cual", () => {
  const images = [
    { id: 1, url: "https://cdn/a.jpg" },
    { id: 2, url: "https://cdn/b.jpg" },
  ];
  const result = resolveGalleryImages(images);
  assert.equal(result.length, 2);
  assert.equal(result[0].url, "https://cdn/a.jpg");
  assert.equal(result[1].id, 2);
});

test("resolveGalleryImages filtra imágenes sin url", () => {
  const images = [
    { id: 1, url: "https://cdn/a.jpg" },
    { id: 2, url: "" },
  ];
  const result = resolveGalleryImages(images);
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 1);
});

test("resolveGalleryImages con undefined o null devuelve lista vacía", () => {
  assert.deepEqual(resolveGalleryImages(undefined), []);
  assert.deepEqual(resolveGalleryImages(null), []);
});

test("resolveGalleryImages con lista vacía devuelve lista vacía", () => {
  assert.deepEqual(resolveGalleryImages([]), []);
});

test("hasGalleryImages es true solo si hay al menos una imagen con url", () => {
  assert.equal(hasGalleryImages([{ id: 1, url: "https://cdn/a.jpg" }]), true);
  assert.equal(hasGalleryImages([{ id: 1, url: "" }]), false);
  assert.equal(hasGalleryImages([]), false);
  assert.equal(hasGalleryImages(null), false);
});

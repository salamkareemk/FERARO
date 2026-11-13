import { categories, products } from "../data/products.js";
import { newCreations } from "../data/newCreations.js";
import { customCakes } from "../data/customCakes.js";
import { galleryItems, galleryOccasions } from "../data/gallery.js";

/*=============== CAKE CATALOG ===============*/
/* One place that decides what every section of the website shows.

   Before the built-in cakes are imported into Supabase, the website shows the
   cakes bundled in `src/data` plus anything added from the admin dashboard.
   After the import (site_settings.catalog_imported_at is set), Supabase is the
   only source, so every cake can be edited or removed from the dashboard. */

export const SECTION_KEYS = ["products", "new", "custom", "gallery"];

export const CAKE_SHAPES = ["square", "wide", "tall"];
export const PRODUCT_CATEGORIES = categories;
export const GALLERY_OCCASIONS = galleryOccasions.filter((name) => name !== "All");
export const CUSTOM_OCCASIONS = customCakes.map((cake) => cake.occasion);

/*=============== BUILT-IN CAKES AS DATABASE ROWS ===============*/
/* Fixed timestamps in the past keep the built-in cakes in their original order
   and place them before (products, new) or after (gallery) newer uploads. */
const BASE_TIME = Date.UTC(2000, 0, 1);
const stamp = (seconds) => new Date(BASE_TIME + seconds * 1000).toISOString();

const emptyRow = {
  name: "",
  description: "",
  price: null,
  category: null,
  occasion: null,
  shape: "square",
};

/* `image` is the bundled asset URL - the importer uploads it to storage */
export const builtinRows = [
  ...products.map((product, index) => ({
    ...emptyRow,
    builtin_key: `products:${product.id}`,
    section: "products",
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    created_at: stamp(index),
  })),
  ...newCreations.map((cake, index) => ({
    ...emptyRow,
    builtin_key: `new:${index + 1}`,
    section: "new",
    name: cake.name,
    image: cake.image,
    created_at: stamp(index),
  })),
  ...customCakes.map((cake, index) => ({
    ...emptyRow,
    builtin_key: `custom:${cake.occasion}`,
    section: "custom",
    occasion: cake.occasion,
    image: cake.image,
    created_at: stamp(index),
  })),
  ...galleryItems.map((item, index) => ({
    ...emptyRow,
    builtin_key: `gallery:${item.id}`,
    section: "gallery",
    name: item.name,
    occasion: item.occasion,
    shape: item.shape,
    image: item.image,
    created_at: stamp(galleryItems.length - index),
  })),
];

/* Built-in cakes in the same shape as rows read from Supabase */
const staticRows = builtinRows.map(({ image, ...row }) => ({
  ...row,
  id: row.builtin_key,
  image_url: image,
  image_path: null,
  isBuiltin: true,
}));

/*=============== ORDERING ===============*/
const time = (row) => Date.parse(row.created_at) || 0;
const oldestFirst = (a, b) => time(a) - time(b);
const newestFirst = (a, b) => time(b) - time(a);

/* Customized Cakes: one photo per occasion (newest wins), in the order of the
   occasion tiles - the masonry grid depends on that order */
const orderCustom = (rows) => {
  const byOccasion = new Map();

  [...rows].sort(newestFirst).forEach((row) => {
    if (!byOccasion.has(row.occasion)) byOccasion.set(row.occasion, row);
  });

  const rank = (row) => {
    const index = CUSTOM_OCCASIONS.indexOf(row.occasion);
    return index === -1 ? CUSTOM_OCCASIONS.length : index;
  };

  return [...byOccasion.values()].sort((a, b) => rank(a) - rank(b));
};

const orderSection = {
  products: (rows) => [...rows].sort(oldestFirst),
  new: (rows) => [...rows].sort(oldestFirst),
  custom: orderCustom,
  gallery: (rows) => [...rows].sort(newestFirst),
};

/* Display zoom for built-in products (see products.js). Looked up by
   builtin_key, so it still applies after the import into Supabase. */
const zoomByKey = new Map(
  products.filter((product) => product.zoom).map((product) => [`products:${product.id}`, product.zoom]),
);

/*=============== ROW -> ITEM ===============*/
/* One item shape for every section, used by the website and the dashboard */
const toItem = (row) => ({
  id: row.isBuiltin ? row.id : `db-${row.id}`,
  dbId: row.isBuiltin ? null : row.id,
  imagePath: row.image_path,
  builtinKey: row.builtin_key ?? null,
  isBuiltin: Boolean(row.isBuiltin),
  section: row.section,
  name: row.name ?? "",
  description: row.description ?? "",
  price: Number(row.price) || 0,
  category: row.category,
  occasion: row.occasion,
  shape: CAKE_SHAPES.includes(row.shape) ? row.shape : "square",
  image: row.image_url,
  zoom: zoomByKey.get(row.builtin_key) ?? null,
});

/* `includeBuiltins`: add the bundled cakes (before the import, or when
   Supabase can't be reached) */
export const buildSections = (dbRows, { includeBuiltins }) => {
  const storedKeys = new Set(dbRows.map((row) => row.builtin_key).filter(Boolean));

  const rows = includeBuiltins
    ? [...staticRows.filter((row) => !storedKeys.has(row.builtin_key)), ...dbRows]
    : dbRows;

  return Object.fromEntries(
    SECTION_KEYS.map((section) => [
      section,
      orderSection[section](rows.filter((row) => row.section === section)).map(toItem),
    ]),
  );
};

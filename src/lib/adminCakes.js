import { supabase } from "./supabaseClient.js";
import { CAKES_BUCKET, CAKES_TABLE, SETTINGS_TABLE } from "./supabaseConfig.js";
import {
  CAKE_SHAPES,
  CUSTOM_OCCASIONS,
  GALLERY_OCCASIONS,
  PRODUCT_CATEGORIES,
  builtinRows,
} from "./catalog.js";

/*=============== ADMIN CAKE OPERATIONS ===============*/
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export const LIMITS = { name: 80, description: 300, price: 100000 };

const EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

/* Postgres "undefined column / table" errors mean schema.sql wasn't re-run */
const withSchemaHint = (error) => {
  const missing =
    ["42703", "42P01", "PGRST204", "PGRST205"].includes(error?.code) ||
    /does not exist|could not find/i.test(error?.message ?? "");

  return missing
    ? new Error(
        "The database is missing the latest setup. Run supabase/schema.sql again in the Supabase SQL Editor, then retry.",
      )
    : error;
};

/*=============== VALIDATION ===============*/
/* Each returns an error message, or "" when valid */
export const validatePhoto = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return "Please choose a PNG, JPG, WEBP or AVIF image.";
  if (file.size > MAX_IMAGE_SIZE) return "The photo must be smaller than 5 MB.";
  return "";
};

export const validateCake = (section, fields, { file, isEdit }) => {
  if (!isEdit && !file) return "Please choose a cake photo.";

  if (file) {
    const photoError = validatePhoto(file);
    if (photoError) return photoError;
  }

  if (section !== "custom") {
    if (!fields.name) return "Please enter the cake name.";
    if (fields.name.length > LIMITS.name) return `The name must be ${LIMITS.name} characters or fewer.`;
  }

  if (section === "products") {
    if (!fields.description) return "Please enter a description.";
    if (fields.description.length > LIMITS.description) {
      return `The description must be ${LIMITS.description} characters or fewer.`;
    }
    if (!Number.isFinite(fields.price) || fields.price < 0 || fields.price > LIMITS.price) {
      return "Please enter a valid price.";
    }
    if (!PRODUCT_CATEGORIES.includes(fields.category)) return "Please choose a category.";
  }

  if (section === "custom" && !CUSTOM_OCCASIONS.includes(fields.occasion)) {
    return "Please choose an occasion.";
  }

  if (section === "gallery") {
    if (!GALLERY_OCCASIONS.includes(fields.occasion)) return "Please choose an occasion.";
    if (!CAKE_SHAPES.includes(fields.shape)) return "Please choose a tile shape.";
  }

  return "";
};

/*=============== STORAGE ===============*/
const uploadPhoto = async (section, file) => {
  const path = `${section}/${crypto.randomUUID()}.${EXTENSIONS[file.type] ?? "img"}`;

  const { error } = await supabase.storage
    .from(CAKES_BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from(CAKES_BUCKET).getPublicUrl(path);

  return { image_url: data.publicUrl, image_path: path };
};

/* Storage reports failures in the result instead of throwing.
   Returns the error (or null) so callers can tell the admin. */
const removeFiles = async (paths) => {
  const existing = paths.filter(Boolean);

  if (!existing.length) return null;

  const { error } = await supabase.storage.from(CAKES_BUCKET).remove(existing);

  if (error) console.error("Could not remove photo files", existing, error);

  return error ?? null;
};

/*=============== ADD ===============*/
/* Upload the photo, then save the row; the photo is removed again if saving fails */
export const addCake = async (section, fields, file) => {
  const photo = await uploadPhoto(section, file);

  const { data, error } = await supabase
    .from(CAKES_TABLE)
    .insert({ ...fields, section, ...photo })
    .select()
    .single();

  if (error) {
    await removeFiles([photo.image_path]);
    throw withSchemaHint(error);
  }

  return data;
};

/*=============== EDIT ===============*/
/* `file` is optional - a new photo replaces the old one in storage */
export const updateCake = async (item, fields, file) => {
  const photo = file ? await uploadPhoto(item.section, file) : null;

  const { data, error } = await supabase
    .from(CAKES_TABLE)
    .update({ ...fields, ...photo })
    .eq("id", item.dbId)
    .select()
    .single();

  if (error) {
    if (photo) await removeFiles([photo.image_path]);
    throw withSchemaHint(error);
  }

  const storageError = photo ? await removeFiles([item.imagePath]) : null;

  return { row: data, storageError };
};

/*=============== DELETE ===============*/
/* `items`: dashboard items or raw rows (anything with dbId/id + image path) */
export const deleteCakes = async (items) => {
  if (!items.length) return { storageError: null };

  const ids = items.map((item) => item.dbId ?? item.id);

  const { error } = await supabase.from(CAKES_TABLE).delete().in("id", ids);

  if (error) throw withSchemaHint(error);

  const storageError = await removeFiles(items.map((item) => item.imagePath ?? item.image_path));

  return { storageError };
};

/*=============== IMPORT BUILT-IN CAKES ===============*/
export const BUILTIN_COUNT = builtinRows.length;

/* Copies every bundled cake (photo + details) into Supabase, then marks the
   catalog as imported. Safe to re-run: cakes already copied are skipped. */
export const importBuiltins = async (onProgress = () => {}) => {
  const { data: existing, error: readError } = await supabase
    .from(CAKES_TABLE)
    .select("builtin_key")
    .not("builtin_key", "is", null);

  if (readError) throw withSchemaHint(readError);

  const copied = new Set(existing.map((row) => row.builtin_key));
  const pending = builtinRows.filter((row) => !copied.has(row.builtin_key));
  let done = BUILTIN_COUNT - pending.length;

  onProgress(done, BUILTIN_COUNT);

  for (const { image, ...fields } of pending) {
    const response = await fetch(image);

    if (!response.ok) throw new Error(`Could not read the photo for ${fields.builtin_key}.`);

    const blob = await response.blob();
    const type = IMAGE_TYPES.includes(blob.type) ? blob.type : "image/png";
    const file = new File([blob], `${fields.section}.${EXTENSIONS[type]}`, { type });

    const photo = await uploadPhoto(fields.section, file);
    const { error } = await supabase.from(CAKES_TABLE).insert({ ...fields, ...photo });

    if (error) {
      await removeFiles([photo.image_path]);
      throw withSchemaHint(error);
    }

    onProgress(++done, BUILTIN_COUNT);
  }

  const { error: settingsError } = await supabase
    .from(SETTINGS_TABLE)
    .upsert({ id: 1, catalog_imported_at: new Date().toISOString() });

  if (settingsError) throw withSchemaHint(settingsError);
};

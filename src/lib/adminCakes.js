import { supabase } from "./supabaseClient.js";
import { CAKES_BUCKET, CAKES_TABLE } from "./supabaseConfig.js";

/*=============== ADMIN CAKE OPERATIONS ===============*/
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif"];

export const listCakes = async (section) => {
  const { data, error } = await supabase
    .from(CAKES_TABLE)
    .select("*")
    .eq("section", section)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

const removeFiles = (paths) =>
  paths.length ? supabase.storage.from(CAKES_BUCKET).remove(paths) : null;

/* Upload the photo, then save the row; the photo is removed again if saving fails */
export const addCake = async (section, fields, file) => {
  const extension = file.name.split(".").pop().toLowerCase();
  const path = `${section}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(CAKES_BUCKET)
    .upload(path, file, { cacheControl: "31536000", contentType: file.type });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from(CAKES_BUCKET).getPublicUrl(path);

  const { data, error } = await supabase
    .from(CAKES_TABLE)
    .insert({ ...fields, section, image_url: urlData.publicUrl, image_path: path })
    .select()
    .single();

  if (error) {
    await removeFiles([path]);
    throw error;
  }

  return data;
};

export const deleteCakes = async (rows) => {
  if (!rows.length) return;

  const { error } = await supabase
    .from(CAKES_TABLE)
    .delete()
    .in("id", rows.map((row) => row.id));

  if (error) throw error;

  await removeFiles(rows.map((row) => row.image_path));
};

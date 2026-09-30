/*=============== SUPABASE CONFIG ===============*/
/* Set these in `.env.local` (and in Vercel > Settings > Environment Variables).
   Without them the site simply shows the built-in cakes. */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const CAKES_TABLE = "cakes";
export const CAKES_BUCKET = "cakes";

/* Sections the admin can add photos to */
export const CAKE_SECTIONS = {
  products: "Products",
  new: "New Creations",
  custom: "Customized Cakes",
  gallery: "Cake Gallery",
};

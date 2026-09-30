import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CAKES_TABLE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "../lib/supabaseConfig.js";

const CakesContext = createContext(null);

/* Plain REST read so the public site doesn't need to load the Supabase SDK */
const fetchCakes = async () => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${CAKES_TABLE}?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    },
  );

  if (!response.ok) throw new Error(`Could not load cakes (${response.status})`);

  return response.json();
};

/*=============== ROW -> SECTION ITEM ===============*/
const toItem = {
  products: (row) => ({
    id: `db-${row.id}`,
    name: row.name,
    description: row.description,
    price: Number(row.price) || 0,
    category: row.category,
    image: row.image_url,
  }),
  new: (row) => ({ id: `db-${row.id}`, name: row.name, image: row.image_url }),
  custom: (row) => ({ occasion: row.occasion, image: row.image_url }),
  gallery: (row) => ({
    id: `db-${row.id}`,
    name: row.name,
    occasion: row.occasion,
    shape: row.shape,
    image: row.image_url,
  }),
};

/*=============== CAKES PROVIDER ===============*/
/* Cakes added from the admin dashboard, newest first */
export const CakesProvider = ({ children }) => {
  const [rows, setRows] = useState([]);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    try {
      setRows(await fetchCakes());
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const sections = useMemo(() => {
    const grouped = { products: [], new: [], custom: [], gallery: [] };

    rows.forEach((row) => {
      if (grouped[row.section]) grouped[row.section].push(toItem[row.section](row));
    });

    return grouped;
  }, [rows]);

  return (
    <CakesContext.Provider value={{ sections, reload }}>
      {children}
    </CakesContext.Provider>
  );
};

export const useCakes = () => {
  const context = useContext(CakesContext);

  if (!context) throw new Error("useCakes must be used inside CakesProvider");

  return context;
};

/* Admin-added items for one section: "products" | "new" | "custom" | "gallery" */
export const useSectionCakes = (section) => useCakes().sections[section];

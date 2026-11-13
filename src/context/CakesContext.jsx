import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { buildSections } from "../lib/catalog.js";
import {
  CAKES_TABLE,
  SETTINGS_TABLE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "../lib/supabaseConfig.js";

const CakesContext = createContext(null);

/* Refetch when the visitor comes back to the tab, at most this often */
const REFRESH_INTERVAL = 15_000;

const restHeaders = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

/* Plain REST reads so the public site doesn't need to load the Supabase SDK */
const fetchCakes = async () => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${CAKES_TABLE}?select=*&order=created_at.desc`,
    { headers: restHeaders, cache: "no-store" },
  );

  if (!response.ok) throw new Error(`Could not load cakes (${response.status})`);

  return response.json();
};

/* When the import happened, or null. A missing settings table (schema not
   updated yet) simply means "not imported". */
const fetchImportedAt = async () => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${SETTINGS_TABLE}?select=catalog_imported_at&id=eq.1`,
      { headers: restHeaders, cache: "no-store" },
    );

    if (!response.ok) return null;

    const [settings] = await response.json();

    return settings?.catalog_imported_at ?? null;
  } catch {
    return null;
  }
};

/*=============== CAKES PROVIDER ===============*/
export const CakesProvider = ({ children }) => {
  const [state, setState] = useState({
    status: isSupabaseConfigured ? "loading" : "offline",
    rows: [],
    importedAt: null,
    error: "",
  });
  const lastLoad = useRef(0);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    lastLoad.current = Date.now();

    try {
      const [rows, importedAt] = await Promise.all([fetchCakes(), fetchImportedAt()]);

      /* Keep the same array when nothing changed, so sections don't re-render */
      setState((current) => ({
        status: "ready",
        rows: JSON.stringify(current.rows) === JSON.stringify(rows) ? current.rows : rows,
        importedAt,
        error: "",
      }));
    } catch (error) {
      console.error(error);
      /* A failed refresh keeps the last good data on screen */
      setState((current) => ({
        ...current,
        status: current.status === "ready" ? "ready" : "error",
        error: error.message,
      }));
    }
  }, []);

  useEffect(() => {
    reload();

    /* Pick up admin changes made in another tab or on another device */
    const refreshIfStale = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastLoad.current >= REFRESH_INTERVAL) reload();
    };

    document.addEventListener("visibilitychange", refreshIfStale);
    window.addEventListener("focus", refreshIfStale);

    return () => {
      document.removeEventListener("visibilitychange", refreshIfStale);
      window.removeEventListener("focus", refreshIfStale);
    };
  }, [reload]);

  const { status, rows, importedAt, error } = state;
  const isImported = status === "ready" && Boolean(importedAt);

  const sections = useMemo(() => {
    /* While loading, show nothing rather than cakes that may have been removed */
    if (status === "loading") return buildSections([], { includeBuiltins: false });

    /* Offline / error / not imported yet: keep the bundled cakes on the site */
    return buildSections(status === "ready" ? rows : [], { includeBuiltins: !isImported });
  }, [status, rows, isImported]);

  const value = useMemo(
    () => ({ sections, rows, status, error, isImported, reload }),
    [sections, rows, status, error, isImported, reload],
  );

  return <CakesContext.Provider value={value}>{children}</CakesContext.Provider>;
};

export const useCakes = () => {
  const context = useContext(CakesContext);

  if (!context) throw new Error("useCakes must be used inside CakesProvider");

  return context;
};

/* Everything one section shows: "products" | "new" | "custom" | "gallery" */
export const useSectionCakes = (section) => useCakes().sections[section];

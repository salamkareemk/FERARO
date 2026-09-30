import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import CakeForm from "./CakeForm.jsx";
import { useCakes } from "../../context/CakesContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { addCake, deleteCakes, listCakes } from "../../lib/adminCakes.js";
import { supabase } from "../../lib/supabaseClient.js";
import { CAKE_SECTIONS } from "../../lib/supabaseConfig.js";
import { formatPrice } from "../../utils/format.js";

const sectionNotes = {
  products: "Cards in “Your Indulgence”, shown after the built-in cakes with a Buy button.",
  new: "Slides in the “Try Our New Creations” slider.",
  custom: "One photo per occasion tile - a new upload replaces the old one.",
  gallery: "Photos on the Cake Gallery page, shown first under their occasion.",
};

const detailsFor = (section, row) => {
  if (section === "products") return `${row.category} · ${formatPrice(Number(row.price))}`;
  if (section === "custom") return "Customized Cakes tile";
  if (section === "gallery") return `${row.occasion} · ${row.shape}`;
  return "New Creations slide";
};

/*=============== ADMIN DASHBOARD ===============*/
const AdminDashboard = ({ user }) => {
  const { reload: reloadSite } = useCakes();
  const { showToast } = useToast();
  const [section, setSection] = useState("products");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRows = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      setRows(await listCakes(section));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }, [section]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const refresh = async () => {
    await loadRows();
    reloadSite();
  };

  const handleAdd = async (fields, file) => {
    const added = await addCake(section, fields, file);

    /* Customized Cakes keep one photo per occasion - drop the older one */
    if (section === "custom") {
      const replaced = rows.filter((row) => row.occasion === added.occasion);
      await deleteCakes(replaced).catch(console.error);
    }

    showToast("Cake added", "It's now live on the website.", "ri-check-line");
    await refresh();
  };

  const handleDelete = async (row) => {
    const label = row.name || `${row.occasion} photo`;

    if (!window.confirm(`Delete “${label}”? This removes it from the website.`)) return;

    try {
      await deleteCakes([row]);
      showToast("Cake deleted", `${label} was removed.`, "ri-delete-bin-line");
      await refresh();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <section className="admin">
      <header className="admin_header">
        <div>
          <h1 className="admin_title">FERARO Admin</h1>
          <p className="admin_text">Signed in as {user.email}</p>
        </div>

        <div className="admin_header-actions">
          <Link to="/" className="admin_link">
            <i className="ri-external-link-line"></i> View website
          </Link>
          <button
            type="button"
            className="admin_button admin_button-outline"
            onClick={() => supabase.auth.signOut()}
          >
            <i className="ri-logout-box-r-line"></i> Sign out
          </button>
        </div>
      </header>

      <nav className="menu_tabs admin_tabs" role="tablist" aria-label="Sections">
        {Object.entries(CAKE_SECTIONS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={section === key}
            className={`menu_tab ${section === key ? "active" : ""}`}
            onClick={() => setSection(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <p className="admin_note">{sectionNotes[section]}</p>

      <div className="admin_layout">
        <CakeForm section={section} onSubmit={handleAdd} />

        <div className="admin_card">
          <h2 className="admin_subtitle">
            Added photos {!isLoading && <span>({rows.length})</span>}
          </h2>

          {error && <p className="admin_error">{error}</p>}

          {isLoading ? (
            <p className="admin_text">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="admin_text">
              No photos added yet. The website shows its built-in cakes.
            </p>
          ) : (
            <ul className="admin_list">
              {rows.map((row) => (
                <li className="admin_item" key={row.id}>
                  <img src={row.image_url} alt={row.name || row.occasion} />

                  <div className="admin_item-data">
                    <h3>{row.name || row.occasion}</h3>
                    <p>{detailsFor(section, row)}</p>
                  </div>

                  <button
                    type="button"
                    className="admin_delete"
                    aria-label={`Delete ${row.name || row.occasion}`}
                    onClick={() => handleDelete(row)}
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

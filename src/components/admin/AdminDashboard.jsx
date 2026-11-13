import { useState } from "react";
import { Link } from "react-router";

import AdminModal from "./AdminModal.jsx";
import CakeForm from "./CakeForm.jsx";
import { useCakes } from "../../context/CakesContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import {
  BUILTIN_COUNT,
  addCake,
  deleteCakes,
  importBuiltins,
  updateCake,
} from "../../lib/adminCakes.js";
import { CUSTOM_OCCASIONS } from "../../lib/catalog.js";
import { supabase } from "../../lib/supabaseClient.js";
import { CAKE_SECTIONS } from "../../lib/supabaseConfig.js";
import { formatPrice } from "../../utils/format.js";

const sectionNotes = {
  products: "Cards in “Your Indulgence”, in the order shown on the website, each with a Buy button.",
  new: "Slides in the “New Creations” strip.",
  custom: "One photo per occasion tile. A tile without a photo is hidden on the website.",
  gallery: "Photos on the Cake Gallery page - newest first, filtered by occasion.",
};

const STORAGE_WARNING =
  "The change is live, but an old photo file could not be removed from storage.";

const labelFor = (item) => item.name || `${item.occasion} photo`;

const detailsFor = (item) => {
  if (item.section === "products") return `${item.category} · ${formatPrice(item.price)}`;
  if (item.section === "custom") return "Customized Cakes tile";
  if (item.section === "gallery") return `${item.occasion} · ${item.shape}`;
  return "New Creations slide";
};

const matches = (item, query) =>
  !query ||
  [item.name, item.occasion, item.category, item.description]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(query));

/*=============== ADMIN DASHBOARD ===============*/
const AdminDashboard = ({ user }) => {
  const { sections, rows, status, error: loadError, isImported, reload } = useCakes();
  const { showToast } = useToast();

  const [section, setSection] = useState("products");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // { item, presetOccasion } | null
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  const items = sections[section];
  const query = search.trim().toLowerCase();
  const visibleItems = items.filter((item) => matches(item, query));
  const isLoading = status === "loading";

  /* Customized Cakes occasions with no photo - hidden on the website */
  const emptyOccasions =
    section === "custom" && !query
      ? CUSTOM_OCCASIONS.filter((name) => !items.some((item) => item.occasion === name))
      : [];

  const warnIfStorage = (storageError) => {
    if (storageError) showToast("Photo cleanup failed", STORAGE_WARNING, "ri-error-warning-line");
  };

  const changeSection = (key) => {
    setSection(key);
    setSearch("");
    setActionError("");
  };

  /*=============== SAVE (add or edit) ===============*/
  const handleSave = async (fields, file) => {
    const { item } = editing;

    if (item) {
      const { storageError } = await updateCake(item, fields, file);
      warnIfStorage(storageError);
      showToast("Changes saved", `${labelFor({ ...item, ...fields })} is updated on the website.`);
    } else {
      const added = await addCake(section, fields, file);

      /* Customized Cakes keep one photo per occasion - drop the older ones */
      if (section === "custom") {
        const replaced = rows.filter(
          (row) => row.section === "custom" && row.occasion === added.occasion && row.id !== added.id,
        );
        const { storageError } = await deleteCakes(replaced).catch((replaceError) => {
          console.error(replaceError);
          return { storageError: replaceError };
        });
        warnIfStorage(storageError);
      }

      showToast("Cake added", "It's now live on the website.");
    }

    setEditing(null);
    await reload();
  };

  /*=============== DELETE ===============*/
  const confirmDelete = async () => {
    setIsDeleting(true);
    setActionError("");

    try {
      /* Customized Cakes: remove every stored photo for the occasion */
      const targets =
        deleting.section === "custom"
          ? rows.filter((row) => row.section === "custom" && row.occasion === deleting.occasion)
          : [deleting];

      const { storageError } = await deleteCakes(targets);

      warnIfStorage(storageError);
      showToast("Cake removed", `${labelFor(deleting)} was removed from the website.`, "ri-delete-bin-line");
      setDeleting(null);
      await reload();
    } catch (deleteError) {
      setActionError(deleteError.message);
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="admin">
      <div className="admin_shell">
        {/*=============== HEADER ===============*/}
        <header className="admin_header">
          <div className="admin_brand">
            <h1 className="admin_title">FERARO Admin</h1>
            <p className="admin_text">Signed in as {user.email}</p>
          </div>

          <div className="admin_header-actions">
            <Link to="/" className="admin_button admin_button-outline" target="_blank" rel="noopener">
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

        {status === "ready" && !isImported && <ImportBanner onDone={reload} />}

        {status === "error" && (
          <p className="admin_error" role="alert">
            Could not load the cakes: {loadError}.{" "}
            <button type="button" className="admin_inline-button" onClick={reload}>
              Try again
            </button>
          </p>
        )}

        {/*=============== SECTION TABS ===============*/}
        <nav className="admin_tabs" aria-label="Website sections">
          {Object.entries(CAKE_SECTIONS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={section === key}
              className={`admin_tab ${section === key ? "active" : ""}`}
              onClick={() => changeSection(key)}
            >
              {label}
              <span className="admin_tab-count">{isLoading ? "…" : sections[key].length}</span>
            </button>
          ))}
        </nav>

        {/*=============== TOOLBAR ===============*/}
        <div className="admin_toolbar">
          <p className="admin_note">{sectionNotes[section]}</p>

          <div className="admin_toolbar-actions">
            <label className="admin_search">
              <i className="ri-search-line" aria-hidden="true"></i>
              <input
                type="search"
                placeholder={`Search ${CAKE_SECTIONS[section]}`}
                aria-label={`Search ${CAKE_SECTIONS[section]}`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="admin_button"
              onClick={() => setEditing({ item: null })}
              disabled={isLoading}
            >
              <i className="ri-add-line"></i> Add cake
            </button>
          </div>
        </div>

        {actionError && (
          <p className="admin_error" role="alert">
            {actionError}
          </p>
        )}

        {/*=============== ITEMS ===============*/}
        {isLoading ? (
          <p className="admin_empty">Loading the website's cakes…</p>
        ) : visibleItems.length === 0 && emptyOccasions.length === 0 ? (
          <p className="admin_empty">
            {query ? `No cakes match “${search.trim()}”.` : "Nothing in this section yet - add the first cake."}
          </p>
        ) : (
          <ul className="admin_grid">
            {visibleItems.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                position={query ? null : index + 1}
                canEdit={!item.isBuiltin}
                onEdit={() => setEditing({ item })}
                onDelete={() => setDeleting(item)}
              />
            ))}

            {emptyOccasions.map((occasion) => (
              <li className="admin_item admin_item-empty" key={occasion}>
                <div className="admin_item-media">
                  <i className="ri-image-line" aria-hidden="true"></i>
                </div>
                <div className="admin_item-body">
                  <h3>{occasion}</h3>
                  <p>No photo - hidden on the website</p>
                </div>
                <div className="admin_item-actions">
                  <button
                    type="button"
                    className="admin_action"
                    onClick={() => setEditing({ item: null, presetOccasion: occasion })}
                  >
                    <i className="ri-image-add-line"></i> Add photo
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*=============== DIALOGS ===============*/}
      {editing && (
        <CakeForm
          key={`${section}-${editing.item?.id ?? "new"}`}
          section={section}
          item={editing.item}
          presetOccasion={editing.presetOccasion}
          takenOccasions={sections.custom.map((item) => item.occasion)}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <AdminModal
          title="Remove this cake?"
          size="sm"
          onClose={() => setDeleting(null)}
          isBusy={isDeleting}
          footer={
            <>
              <button
                type="button"
                className="admin_button admin_button-outline"
                onClick={() => setDeleting(null)}
                disabled={isDeleting}
                data-autofocus
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin_button admin_button-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Removing…" : "Remove"}
              </button>
            </>
          }
        >
          <div className="admin_confirm">
            <img src={deleting.image} alt="" />
            <p>
              <strong>{labelFor(deleting)}</strong> will be removed from the website and its photo
              deleted. This can't be undone.
            </p>
          </div>
        </AdminModal>
      )}
    </section>
  );
};

/*=============== ITEM CARD ===============*/
const ItemCard = ({ item, position, canEdit, onEdit, onDelete }) => {
  const label = labelFor(item);
  const lockedHint = "Import the built-in cakes first to change this one";

  return (
    <li className="admin_item">
      <div className="admin_item-media">
        <img src={item.image} alt={label} loading="lazy" />
        {position && <span className="admin_badge admin_badge-position">#{position}</span>}
        {item.isBuiltin && <span className="admin_badge">Built-in</span>}
      </div>

      <div className="admin_item-body">
        <h3 title={label}>{label}</h3>
        <p>{detailsFor(item)}</p>
        {item.section === "products" && item.description && (
          <p className="admin_item-description">{item.description}</p>
        )}
      </div>

      <div className="admin_item-actions">
        <button
          type="button"
          className="admin_action"
          onClick={onEdit}
          disabled={!canEdit}
          title={canEdit ? undefined : lockedHint}
          aria-label={`Edit ${label}`}
        >
          <i className="ri-edit-line"></i> Edit
        </button>
        <button
          type="button"
          className="admin_action admin_action-danger"
          onClick={onDelete}
          disabled={!canEdit}
          title={canEdit ? undefined : lockedHint}
          aria-label={`Remove ${label}`}
        >
          <i className="ri-delete-bin-line"></i> Remove
        </button>
      </div>
    </li>
  );
};

/*=============== IMPORT BUILT-IN CAKES ===============*/
const ImportBanner = ({ onDone }) => {
  const { showToast } = useToast();
  const [progress, setProgress] = useState(null); // { done, total } while importing
  const [error, setError] = useState("");

  const isImporting = progress !== null;

  const runImport = async () => {
    setError("");
    setProgress({ done: 0, total: BUILTIN_COUNT });

    try {
      await importBuiltins((done, total) => setProgress({ done, total }));
      showToast("Import complete", "Every cake on the website can now be edited or removed.");
      await onDone();
    } catch (importError) {
      setError(`${importError.message} Cakes already copied are kept - run the import again to finish.`);
    } finally {
      setProgress(null);
    }
  };

  return (
    <div className="admin_banner" role="region" aria-label="Import built-in cakes">
      <i className="ri-download-cloud-2-line admin_banner-icon" aria-hidden="true"></i>

      <div className="admin_banner-text">
        <h2>Make the built-in cakes editable</h2>
        <p>
          {BUILTIN_COUNT} cakes marked <strong>Built-in</strong> are part of the website's code, so
          they can't be changed here yet. Import them once to copy their photos and details into
          your database. After that, every cake can be edited or removed.
        </p>

        {isImporting && (
          <div className="admin_progress" role="progressbar" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.done}>
            <span style={{ width: `${(progress.done / progress.total) * 100}%` }}></span>
          </div>
        )}

        {error && (
          <p className="admin_error" role="alert">
            {error}
          </p>
        )}
      </div>

      <button type="button" className="admin_button" onClick={runImport} disabled={isImporting}>
        {isImporting ? `Importing ${progress.done}/${progress.total}…` : "Import built-in cakes"}
      </button>
    </div>
  );
};

export default AdminDashboard;

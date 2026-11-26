import { useEffect, useId, useState } from "react";

import AdminModal from "./AdminModal.jsx";
import {
  CUSTOM_OCCASIONS,
  GALLERY_OCCASIONS,
  PRODUCT_CATEGORIES,
} from "../../lib/catalog.js";
import { CAKE_SECTIONS } from "../../lib/supabaseConfig.js";
import { IMAGE_TYPES, LIMITS, validateCake, validatePhoto } from "../../lib/adminCakes.js";

const SHAPE_LABELS = {
  square: "Square",
  wide: "Wide (landscape)",
  tall: "Tall (portrait)",
};

const initialFields = (section, item, presetOccasion) => {
  const occasions = section === "custom" ? CUSTOM_OCCASIONS : GALLERY_OCCASIONS;

  return {
    name: item?.name ?? "",
    description: item?.description ?? "",
    price: item ? String(item.price) : "",
    category: item?.category ?? PRODUCT_CATEGORIES[0],
    occasion: item?.occasion ?? presetOccasion ?? occasions[0],
    shape: item?.shape ?? "square",
  };
};

/* Only the columns each section uses are saved */
const fieldsFor = (section, fields) => {
  switch (section) {
    case "products":
      return {
        name: fields.name.trim(),
        description: fields.description.trim(),
        price: fields.price === "" ? NaN : Number(fields.price),
        category: fields.category,
      };
    case "custom":
      return { occasion: fields.occasion };
    default:
      return {
        name: fields.name.trim(),
        occasion: fields.occasion,
        shape: fields.shape,
      };
  }
};

/*=============== ADD / EDIT CAKE DIALOG ===============*/
/* `item`: the cake being edited, or null to add a new one.
   `takenOccasions`: Customized Cakes occasions that already have a photo. */
const CakeForm = ({ section, item, presetOccasion, takenOccasions = [], onClose, onSave }) => {
  const formId = useId();
  const isEdit = Boolean(item);

  const [fields, setFields] = useState(() => initialFields(section, item, presetOccasion));
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const update = (name) => (event) =>
    setFields((current) => ({ ...current, [name]: event.target.value }));

  const handleFile = (event) => {
    const picked = event.target.files[0] ?? null;
    const message = picked ? validatePhoto(picked) : "";

    if (message) event.target.value = "";

    setError(message);
    setFile(message ? null : picked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const values = fieldsFor(section, fields);
    const message = validateCake(section, values, { file, isEdit });

    if (message) {
      setError(message);
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await onSave(values, file);
    } catch (saveError) {
      setError(saveError.message || "Could not save the cake. Try again.");
      setIsSaving(false);
    }
  };

  const occasionList = section === "custom" ? CUSTOM_OCCASIONS : GALLERY_OCCASIONS;
  const replacesTile = section === "custom" && !isEdit && takenOccasions.includes(fields.occasion);
  const shownImage = preview || item?.image;

  return (
    <AdminModal
      title={`${isEdit ? "Edit" : "Add to"} ${CAKE_SECTIONS[section]}`}
      onClose={onClose}
      isBusy={isSaving}
      footer={
        <>
          <button
            type="button"
            className="admin_button admin_button-outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button className="admin_button" type="submit" form={formId} disabled={isSaving}>
            {isSaving ? "Saving…" : isEdit ? "Save changes" : "Add cake"}
          </button>
        </>
      }
    >
      <form id={formId} className="admin_form" onSubmit={handleSubmit} noValidate>
        <label className="admin_upload">
          {shownImage ? (
            <>
              <img src={shownImage} alt="Selected cake" />
              <span className="admin_upload-change">
                <i className="ri-image-edit-line"></i> {isEdit || preview ? "Change photo" : "Choose a photo"}
              </span>
            </>
          ) : (
            <span>
              <i className="ri-image-add-line"></i>
              Choose a photo
              <small>PNG with a transparent background looks best · max 5 MB</small>
            </span>
          )}
          <input
            type="file"
            accept={IMAGE_TYPES.join(",")}
            onChange={handleFile}
            aria-label={isEdit ? "Replace photo" : "Cake photo"}
            data-autofocus={!isEdit || undefined}
          />
        </label>

        {section !== "custom" && (
          <label className="admin_field">
            <span>Cake name</span>
            <input
              value={fields.name}
              onChange={update("name")}
              maxLength={LIMITS.name}
              required
              data-autofocus={isEdit || undefined}
            />
          </label>
        )}

        {section === "products" && (
          <>
            <label className="admin_field">
              <span>
                Description
                <small className="admin_counter">
                  {fields.description.length}/{LIMITS.description}
                </small>
              </span>
              <textarea
                rows="3"
                value={fields.description}
                onChange={update("description")}
                maxLength={LIMITS.description}
                required
              />
            </label>

            <div className="admin_row">
              <label className="admin_field">
                <span>Price (₹)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max={LIMITS.price}
                  step="1"
                  value={fields.price}
                  onChange={update("price")}
                  required
                />
              </label>

              <label className="admin_field">
                <span>Category</span>
                <select value={fields.category} onChange={update("category")}>
                  {PRODUCT_CATEGORIES.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </label>
            </div>
          </>
        )}

        {(section === "custom" || section === "gallery") && (
          <div className="admin_row">
            <label className="admin_field">
              <span>Occasion</span>
              <select
                value={fields.occasion}
                onChange={update("occasion")}
                disabled={section === "custom" && isEdit}
              >
                {occasionList.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </label>

            {section === "gallery" && (
              <label className="admin_field">
                <span>Tile shape</span>
                <select value={fields.shape} onChange={update("shape")}>
                  {Object.entries(SHAPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        {replacesTile && (
          <p className="admin_hint">
            The {fields.occasion} tile already has a photo - this one will replace it.
          </p>
        )}

        {error && (
          <p className="admin_error" role="alert">
            {error}
          </p>
        )}
      </form>
    </AdminModal>
  );
};

export default CakeForm;

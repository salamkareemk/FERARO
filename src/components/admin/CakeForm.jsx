import { useEffect, useRef, useState } from "react";

import { categories } from "../../data/products.js";
import { customCakes } from "../../data/customCakes.js";
import { galleryOccasions } from "../../data/gallery.js";
import { IMAGE_TYPES, MAX_IMAGE_SIZE } from "../../lib/adminCakes.js";

const occasions = galleryOccasions.filter((name) => name !== "All");
const customOccasions = customCakes.map((cake) => cake.occasion);

const emptyFields = {
  name: "",
  description: "",
  price: "",
  category: categories[0],
  occasion: occasions[0],
  shape: "square",
};

/* Only the columns each section uses are saved */
const fieldsFor = (section, fields) => {
  switch (section) {
    case "products":
      return {
        name: fields.name.trim(),
        description: fields.description.trim(),
        price: Number(fields.price),
        category: fields.category,
      };
    case "new":
      return { name: fields.name.trim() };
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

/*=============== ADD CAKE FORM ===============*/
const CakeForm = ({ section, onSubmit }) => {
  const [fields, setFields] = useState(emptyFields);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInput = useRef(null);

  const occasionList = section === "custom" ? customOccasions : occasions;

  /* Fresh form for each section */
  useEffect(() => {
    setFields({ ...emptyFields, occasion: occasionList[0] });
    setFile(null);
    setError("");
    if (fileInput.current) fileInput.current.value = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

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
    const picked = event.target.files[0];
    setError("");

    if (!picked) return setFile(null);

    if (!IMAGE_TYPES.includes(picked.type)) {
      event.target.value = "";
      return setError("Please choose a PNG, JPG, WEBP or AVIF image.");
    }

    if (picked.size > MAX_IMAGE_SIZE) {
      event.target.value = "";
      return setError("The photo must be smaller than 5 MB.");
    }

    setFile(picked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) return setError("Please choose a cake photo.");

    setError("");
    setIsSaving(true);

    try {
      await onSubmit(fieldsFor(section, fields), file);
      setFields({ ...emptyFields, occasion: occasionList[0] });
      setFile(null);
      fileInput.current.value = "";
    } catch (submitError) {
      setError(submitError.message || "Could not save the cake. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const needsName = section !== "custom";

  return (
    <form className="admin_card admin_form" onSubmit={handleSubmit}>
      <h2 className="admin_subtitle">Add a cake photo</h2>

      <label className="admin_upload">
        {preview ? (
          <img src={preview} alt="Selected cake preview" />
        ) : (
          <span>
            <i className="ri-image-add-line"></i>
            Choose a photo
            <small>PNG with a transparent background looks best · max 5 MB</small>
          </span>
        )}
        <input
          ref={fileInput}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          onChange={handleFile}
        />
      </label>

      {needsName && (
        <label className="admin_field">
          <span>Cake name</span>
          <input value={fields.name} onChange={update("name")} required />
        </label>
      )}

      {section === "products" && (
        <>
          <label className="admin_field">
            <span>Description</span>
            <textarea
              rows="3"
              value={fields.description}
              onChange={update("description")}
              required
            />
          </label>

          <div className="admin_row">
            <label className="admin_field">
              <span>Price ($)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fields.price}
                onChange={update("price")}
                required
              />
            </label>

            <label className="admin_field">
              <span>Category</span>
              <select value={fields.category} onChange={update("category")}>
                {categories.map((name) => (
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
            <select value={fields.occasion} onChange={update("occasion")}>
              {occasionList.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>

          {section === "gallery" && (
            <label className="admin_field">
              <span>Tile shape</span>
              <select value={fields.shape} onChange={update("shape")}>
                <option value="square">Square</option>
                <option value="wide">Wide (landscape)</option>
                <option value="tall">Tall (portrait)</option>
              </select>
            </label>
          )}
        </div>
      )}

      {section === "custom" && (
        <p className="admin_hint">
          This replaces the current photo on the {fields.occasion} tile.
        </p>
      )}

      {error && <p className="admin_error">{error}</p>}

      <button className="admin_button" type="submit" disabled={isSaving}>
        {isSaving ? "Uploading…" : "Add cake"}
      </button>
    </form>
  );
};

export default CakeForm;

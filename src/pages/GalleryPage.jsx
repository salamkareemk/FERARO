import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { galleryCollections, galleryItems } from "../data/gallery.js";
import { useScrollLock } from "../hooks/useSmoothScroll.js";

/*=============== GALLERY PAGE ===============*/
const GalleryPage = () => {
  const [collection, setCollection] = useState("All");
  const [openIndex, setOpenIndex] = useState(null);

  const items =
    collection === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.collection === collection);

  useEffect(() => {
    document.title = "Cake Gallery | FERARO";

    return () => {
      document.title =
        "FERARO | Fresh Handmade Cakes for Every Occasion Experience";
    };
  }, []);

  return (
    <section className="gallery" id="gallery">
      <div className="gallery_container container">
        <Link to="/#custom" className="gallery_back">
          <i className="ri-arrow-left-line"></i>
          Back to Home
        </Link>

        <header className="gallery_header">
          <h1 className="gallery_title">Cake Gallery</h1>
          <p className="gallery_subtitle">
            Every cake tells a story. Browse our favourite creations for
            every celebration.
          </p>
        </header>

        {/* Collection filters */}
        <div className="menu_tabs gallery_tabs" role="tablist">
          {galleryCollections.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={collection === name}
              className={`menu_tab ${collection === name ? "active" : ""}`}
              onClick={() => setCollection(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <p className="gallery_count">
          {items.length} {items.length === 1 ? "photo" : "photos"}
        </p>

        {/* Masonry - CSS columns, tile heights follow each photo's shape */}
        <div className="gallery_grid">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`gallery_tile gallery_tile-${item.shape}`}
              onClick={() => setOpenIndex(index)}
              aria-label={`View ${item.name}`}
            >
              <img src={item.image} alt={item.name} loading="lazy" />

              <span className="gallery_caption">
                <span className="gallery_name">{item.name}</span>
                <span className="gallery_collection">{item.collection}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <Lightbox
        items={items}
        index={openIndex}
        onChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </section>
  );
};

/*=============== LIGHTBOX ===============*/
const Lightbox = ({ items, index, onChange, onClose }) => {
  const isOpen = index !== null;
  const item = isOpen ? items[index] : null;
  const closeRef = useRef(null);

  useScrollLock(isOpen);

  const show = (step) => onChange((index + step + items.length) % items.length);

  /* Keyboard: Esc closes, arrow keys browse */
  useEffect(() => {
    if (!isOpen) return;

    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") show(1);
      if (event.key === "ArrowLeft") show(-1);
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  });

  if (!item) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox_close"
        aria-label="Close"
        onClick={onClose}
      >
        <i className="ri-close-line"></i>
      </button>

      <button
        type="button"
        className="lightbox_arrow lightbox_arrow-prev"
        aria-label="Previous photo"
        onClick={() => show(-1)}
      >
        <i className="ri-arrow-left-line"></i>
      </button>

      <figure className="lightbox_figure">
        <img src={item.image} alt={item.name} />

        <figcaption className="lightbox_caption">
          <strong>{item.name}</strong>
          <span>
            {item.collection} &middot; {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        className="lightbox_arrow lightbox_arrow-next"
        aria-label="Next photo"
        onClick={() => show(1)}
      >
        <i className="ri-arrow-right-line"></i>
      </button>
    </div>
  );
};

export default GalleryPage;

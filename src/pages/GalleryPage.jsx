import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";

import { galleryOccasions } from "../data/gallery.js";
import { useCakes } from "../context/CakesContext.jsx";
import { useScrollLock } from "../hooks/useSmoothScroll.js";
import { openWhatsAppEnquiry } from "../utils/whatsapp.js";

/*=============== GALLERY PAGE ===============*/
const GalleryPage = () => {
  /* Active filter lives in the URL (?occasion=Birthday) so the
     Customized Cakes tiles can link straight to a filtered gallery */
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("occasion");
  const occasion = galleryOccasions.includes(requested) ? requested : "All";
  const [openIndex, setOpenIndex] = useState(null);

  /* Newest first - everything the admin dashboard manages */
  const { sections, status } = useCakes();
  const allItems = sections.gallery;

  const setOccasion = (name) => {
    setOpenIndex(null);
    setSearchParams(name === "All" ? {} : { occasion: name }, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const items =
    occasion === "All"
      ? allItems
      : allItems.filter((item) => item.occasion === occasion);

  /* Photos per occasion - tabs with none are hidden (unless selected) */
  const counts = allItems.reduce(
    (totals, item) => ({ ...totals, [item.occasion]: (totals[item.occasion] ?? 0) + 1 }),
    { All: allItems.length },
  );
  const visibleOccasions = galleryOccasions.filter(
    (name) => name === "All" || name === occasion || counts[name],
  );

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
          <span className="gallery_eyebrow">Handcrafted at FERARO</span>
          <h1 className="gallery_title">Cake Gallery</h1>
          <span className="gallery_divider" aria-hidden="true">
            <i className="ri-cake-3-line"></i>
          </span>
          <p className="gallery_subtitle">
            Every cake tells a story. Browse our favourite creations for
            every celebration.
          </p>
        </header>

        {/* Occasion filters */}
        <div className="menu_tabs gallery_tabs" role="tablist">
          {visibleOccasions.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={occasion === name}
              className={`menu_tab gallery_tab ${occasion === name ? "active" : ""}`}
              onClick={() => setOccasion(name)}
            >
              {name}
              <span className="gallery_tab-count">{counts[name] ?? 0}</span>
            </button>
          ))}
        </div>

        <p className="gallery_count" aria-live="polite">
          {status === "loading"
            ? "Loading photos…"
            : `${items.length} ${items.length === 1 ? "creation" : "creations"}`}
        </p>

        {/* Bento grid - tile size follows each photo's shape, the first
            photo is featured; re-keyed so tiles animate in on filter change */}
        {items.length > 0 ? (
          <div className="gallery_grid" key={occasion}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`gallery_card gallery_card-${item.shape} ${
                  index === 0 ? "gallery_card-featured" : ""
                }`}
                style={{ "--delay": `${Math.min(index, 12) * 60}ms` }}
              >
                <button
                  type="button"
                  className="gallery_open"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`View ${item.name}`}
                >
                  <span className="gallery_media">
                    <img src={item.image} alt={item.name} loading="lazy" />
                  </span>

                  <span className="gallery_info">
                    <span className="gallery_occasion">{item.occasion}</span>
                    <span className="gallery_name">{item.name}</span>
                  </span>

                  <span className="gallery_zoom" aria-hidden="true">
                    <i className="ri-zoom-in-line"></i>
                  </span>
                </button>

                <button
                  type="button"
                  className="gallery_whatsapp"
                  aria-label={`Buy ${item.name}`}
                  onClick={() => openWhatsAppEnquiry(item)}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        ) : (
          status !== "loading" && (
            <p className="gallery_empty">
              No {occasion.toLowerCase()} cakes yet - check back soon.
            </p>
          )
        )}
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
          <div className="lightbox_text">
            <strong>{item.name}</strong>
            <span>
              {item.occasion} &middot; {index + 1} / {items.length}
            </span>
          </div>

          <button
            type="button"
            className="lightbox_whatsapp"
            onClick={() => {
              openWhatsAppEnquiry(item);
              onClose();
            }}
          >
            Buy
          </button>
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

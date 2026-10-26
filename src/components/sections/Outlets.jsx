import { useEffect, useRef, useState } from "react";

import { allOutletsLink, outlets } from "../../data/outlets.js";

/*=============== OUR OUTLETS SECTION ===============*/
const Outlets = () => {
  const listRef = useRef(null);
  const [current, setCurrent] = useState(0);

  /* Track which card is at the left edge of the swipe row (for the dots) */
  useEffect(() => {
    const list = listRef.current;

    const onScroll = () => {
      const cards = [...list.children];
      const left = list.getBoundingClientRect().left;
      let nearest = 0;
      let best = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(card.getBoundingClientRect().left - left);

        if (distance < best) {
          best = distance;
          nearest = index;
        }
      });

      /* At the very end, the last card is the one just reached */
      if (list.scrollLeft + list.clientWidth >= list.scrollWidth - 2) {
        nearest = cards.length - 1;
      }

      setCurrent(nearest);
    };

    list.addEventListener("scroll", onScroll, { passive: true });

    return () => list.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (index) => {
    const list = listRef.current;
    const card = list.children[index];

    list.scrollTo({
      left: card.offsetLeft - list.firstElementChild.offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className="outlets section" id="outlets">
      <div className="outlets_container container">
        <div className="outlets_header">
          <div>
            <span className="outlets_eyebrow">Find your nearest Feraro</span>
            <h2 className="outlets_title">Our Outlets</h2>
          </div>

          <a
            href={allOutletsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="outlets_view-all"
          >
            View All
            <i className="ri-arrow-right-line"></i>
          </a>
        </div>

        {/* Swipe row on phones & tablets, one row of all cards on desktop */}
        <div className="outlets_list" ref={listRef}>
          {outlets.map((outlet) => (
            <article className="outlets_card" key={outlet.id}>
              {/* Storefront photo if provided, otherwise a live map */}
              <a
                href={outlet.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="outlets_media"
                aria-label={`Open ${outlet.name} in Google Maps`}
              >
                {outlet.image ? (
                  <img src={outlet.image} alt={outlet.name} loading="lazy" />
                ) : (
                  <iframe
                    src={outlet.mapEmbed}
                    title={`Map of ${outlet.name}`}
                    loading="lazy"
                    tabIndex={-1}
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                )}

                <span className="outlets_open" aria-hidden="true">
                  <i className="ri-map-pin-2-line"></i>
                  Open in Maps
                </span>
              </a>

              <div className="outlets_body">
                <h3 className="outlets_name">{outlet.name}</h3>

                <address className="outlets_address">
                  <i className="ri-map-pin-2-fill" aria-hidden="true"></i>
                  <span>
                    {outlet.address.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                </address>

                <a
                  href={outlet.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outlets_directions"
                >
                  Get Directions
                  <i className="ri-arrow-right-line"></i>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Dots - show (and jump to) the current outlet while swiping */}
        <div className="outlets_dots" role="tablist" aria-label="Choose an outlet">
          {outlets.map((outlet, index) => (
            <button
              key={outlet.id}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={outlet.name}
              className={`outlets_dot ${index === current ? "active" : ""}`}
              onClick={() => goTo(index)}
            ></button>
          ))}
        </div>

        {/* Decorative divider */}
        <div className="outlets_divider" aria-hidden="true">
          <i className="ri-leaf-line"></i>
        </div>
      </div>
    </section>
  );
};

export default Outlets;

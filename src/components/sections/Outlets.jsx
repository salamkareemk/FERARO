import { allOutletsLink, outlets } from "../../data/outlets.js";

/*=============== OUR OUTLETS SECTION ===============*/
const Outlets = () => {
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

        <div className="outlets_list">
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

        {/* Decorative divider */}
        <div className="outlets_divider" aria-hidden="true">
          <i className="ri-leaf-line"></i>
        </div>
      </div>
    </section>
  );
};

export default Outlets;

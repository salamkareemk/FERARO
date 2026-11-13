import { Link } from "react-router";

import WetPaintButton from "../ui/WetPaintButton.jsx";
import { useSectionCakes } from "../../context/CakesContext.jsx";

/*=============== CUSTOMIZED CAKES SECTION ===============*/
const CustomCakes = () => {
  /* One tile per occasion that has a photo, in tile order */
  const tiles = useSectionCakes("custom");

  return (
    <section className="custom section" id="custom">
      <div className="custom_container container">
        <div className="custom_header">
          <h2 className="custom_title">Customized Cakes</h2>

          <blockquote className="custom_quote">
            <p>&ldquo;A party without cake is just a meeting.&rdquo;</p>
            <cite>&mdash; Julia Child</cite>
          </blockquote>
        </div>

        {/* Masonry grid - tile heights vary, columns stay level.
            Each tile opens the gallery filtered to its occasion */}
        <div className="custom_grid">
          {tiles.map(({ image, occasion }) => (
            <Link
              className="custom_tile"
              key={occasion}
              to={`/gallery?occasion=${encodeURIComponent(occasion)}`}
              aria-label={`View ${occasion} cakes in the gallery`}
            >
              <img
                src={image}
                alt={`Custom ${occasion.toLowerCase()} cake`}
                loading="lazy"
              />
              <span className="custom_caption">{occasion}</span>
            </Link>
          ))}
        </div>

        <div className="custom_more">
          <WetPaintButton to="/gallery" className="custom_more-button">
            View More
            <i className="ri-arrow-right-line"></i>
          </WetPaintButton>
        </div>
      </div>
    </section>
  );
};

export default CustomCakes;

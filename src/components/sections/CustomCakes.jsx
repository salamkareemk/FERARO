import WetPaintButton from "../ui/WetPaintButton.jsx";
import { customCakes } from "../../data/customCakes.js";

/*=============== CUSTOMIZED CAKES SECTION ===============*/
const CustomCakes = () => {
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

        {/* Masonry grid - tile heights vary, columns stay level */}
        <div className="custom_grid">
          {customCakes.map(({ image, occasion }) => (
            <figure className="custom_tile" key={occasion}>
              <img
                src={image}
                alt={`Custom ${occasion.toLowerCase()} cake`}
                loading="lazy"
              />
              <figcaption className="custom_caption">{occasion}</figcaption>
            </figure>
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

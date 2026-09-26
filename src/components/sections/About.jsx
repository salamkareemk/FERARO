import cupcake1 from "../../assets/img/about-cupcake-1.png";
import cupcake2 from "../../assets/img/about-cupcake-2.png";
import cupcake3 from "../../assets/img/about-cupcake-3.png";
import aboutBlob from "../../assets/img/about-blob.svg";
import aboutImg from "../../assets/img/about-img.png";
import leaf2 from "../../assets/img/leaf-2.png";
import sticker1 from "../../assets/img/sticker-1.svg";
import sticker2 from "../../assets/img/sticker-2.svg";

/*=============== ABOUT SECTION ===============*/
const About = () => {
  return (
    <section className="about section" id="about">
      <img src={cupcake1} alt="" className="about_cupcake-1" />
      <img src={cupcake2} alt="" className="about_cupcake-2" />

      <div className="about_container container grid">
        <div className="about_data">
          <h2 className="section_title">
            Our Passion For <br />
            Baking Cakes
          </h2>

          <p className="about_description">
            We are a bakery specializing in homemade desserts, custom cakes,
            brownies, and a wide variety of gourmet sweets. Our passion for
            baking allows us to create perfect sweet experiences for
            celebrations, special events, or simply to enjoy anytime.
          </p>

          <a href="#product" className="button">
            View our products
          </a>

          <img src={sticker1} alt="" className="about_sticker-1" />
          <img src={sticker2} alt="" className="about_sticker-2" />
        </div>

        <div className="about_images">
          <img src={aboutBlob} alt="" className="about_blob" />
          <img
            src={aboutImg}
            alt="Pastry team creating cakes"
            className="about_img"
          />
          <img src={leaf2} alt="" className="about_leaf" />
          <img src={cupcake3} alt="" className="about_cupcake-3" />
        </div>
      </div>
    </section>
  );
};

export default About;

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative, Navigation } from "swiper/modules";

import leaf1 from "../../assets/img/leaf-1.png";
import leaf2 from "../../assets/img/leaf-2.png";
import leaf3 from "../../assets/img/leaf-3.png";
import newCake1 from "../../assets/img/new-cake-1.png";
import newCake2 from "../../assets/img/new-cake-2.png";
import newCake3 from "../../assets/img/new-cake-3.png";
import newCake4 from "../../assets/img/new-cake-4.png";
import newCake5 from "../../assets/img/new-cake-5.png";

const newCakes = [
  { image: newCake1, name: "Premium Chocolate Cake" },
  { image: newCake2, name: "Premium Vanilla Cake" },
  { image: newCake3, name: "Premium Cherry Cake" },
  { image: newCake4, name: "Premium Blueberry Cake" },
  { image: newCake5, name: "Premium Raspberry Cake" },
];

/*=============== NEW SECTION ===============*/
const NewCreations = () => {
  return (
    <section className="new section" id="new">
      <div className="new_container container grid">
        <div className="new_data">
          <h2 className="section_title">
            Try Our <br />
            New Creations
          </h2>

          <p className="new_description">
            Discover the latest from our artisanal pastry shop, where we
            constantly add new desserts and homemade cakes, made with fresh,
            high-quality ingredients.
          </p>

          <a href="#contact" className="button">
            Order your cake now
          </a>
        </div>

        <div className="new_images">
          <div className="new_titles">
            {Array.from({ length: 4 }, (_, index) => (
              <p className="new_text" key={index}>
                DELICIOUS
              </p>
            ))}
          </div>

          <img src={leaf1} alt="" className="new_leaf-1" />
          <img src={leaf2} alt="" className="new_leaf-2" />
          <img src={leaf3} alt="" className="new_leaf-3" />

          <Swiper
            className="new_swiper"
            modules={[Autoplay, EffectCreative, Navigation]}
            loop
            grabCursor
            centeredSlides
            slidesPerView="auto"
            speed={600}
            effect="creative"
            creativeEffect={{
              limitProgress: 2,
              prev: { translate: ["-32%", 0, 0], scale: 0.58 },
              next: { translate: ["32%", 0, 0], scale: 0.58 },
            }}
            navigation={{
              nextEl: ".new .swiper-button-next",
              prevEl: ".new .swiper-button-prev",
            }}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
          >
            {newCakes.map(({ image, name }) => (
              <SwiperSlide key={name} tag="article" className="new_article">
                <img
                  src={image}
                  alt="Delicious decorated cake"
                  className="new_cake"
                />
                <h3 className="new_name">{name}</h3>
              </SwiperSlide>
            ))}

            {/* Navigation buttons */}
            <div className="swiper-button-prev" slot="container-end">
              <i className="ri-arrow-left-long-line"></i>
            </div>

            <div className="swiper-button-next" slot="container-end">
              <i className="ri-arrow-right-long-line"></i>
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default NewCreations;

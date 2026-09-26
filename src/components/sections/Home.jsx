import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCreative } from "swiper/modules";

import WetPaintButton from "../ui/WetPaintButton.jsx";

import sliceCake1 from "../../assets/img/home-slice-cake-1.png";
import sliceCake2 from "../../assets/img/home-slice-cake-2.png";
import balloons from "../../assets/img/home-balloons.png";
import homeBlob from "../../assets/img/home-blob.svg";
import homeBase from "../../assets/img/home-base.png";
import leaf1 from "../../assets/img/leaf-1.png";
import leaf3 from "../../assets/img/leaf-3.png";
import sticker1 from "../../assets/img/sticker-1.svg";
import sticker2 from "../../assets/img/sticker-2.svg";
import sticker3 from "../../assets/img/sticker-3.svg";
import sticker4 from "../../assets/img/sticker-4.svg";
import homeCake1 from "../../assets/img/home-cake-1.png";
import homeCake2 from "../../assets/img/home-cake-2.png";
import homeCake3 from "../../assets/img/home-cake-3.png";
import homeCake4 from "../../assets/img/home-cake-4.png";

const homeCakes = [homeCake1, homeCake2, homeCake3, homeCake4];

/*=============== HOME SECTION ===============*/
const Home = () => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="home section" id="home">
      <div className="home_container container grid">
        <div className="home_data">
          <h1 className="home_title">
            Make Your Celebration <br />
            Unforgettable
          </h1>

          <p className="home_description">
            Stunning chocolate cakes baked to order. The perfect centerpiece
            for birthdays, weddings, and special moments.
          </p>

          <div className="home_actions">
            <WetPaintButton
              href="#contact"
              className="home_button home_button-primary"
            >
              Order a Custom Cake
            </WetPaintButton>

            <WetPaintButton
              href="#product"
              className="home_button home_button-outline"
            >
              View Menu
            </WetPaintButton>
          </div>

          {/* Slider controls - drive the cake slider on the right */}
          <div className="home_controls">
            <div className="home_dots">
              {homeCakes.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`home_dot ${index === activeIndex ? "active" : ""}`}
                  aria-label={`Show cake ${index + 1}`}
                  onClick={() => swiper?.slideToLoop(index)}
                ></button>
              ))}
            </div>

            <div className="home_arrows">
              <button
                type="button"
                className="home_arrow"
                aria-label="Previous cake"
                onClick={() => swiper?.slidePrev()}
              >
                <i className="ri-arrow-left-line"></i>
              </button>

              <button
                type="button"
                className="home_arrow"
                aria-label="Next cake"
                onClick={() => swiper?.slideNext()}
              >
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>

          <img src={sliceCake1} alt="" className="home_slice-1" />
          <img src={sliceCake2} alt="" className="home_slice-2" />
          <img src={balloons} alt="" className="home_balloons" />
          <img src={sticker4} alt="" className="home_sticker-1" />
          <img src={sticker3} alt="" className="home_sticker-2" />
        </div>

        <div className="home_images">
          <img src={homeBlob} alt="" className="home_blob" />
          <img src={homeBase} alt="" className="home_base" />
          <img src={leaf1} alt="" className="home_leaf-1" />
          <img src={leaf3} alt="" className="home_leaf-2" />
          <img src={sticker1} alt="" className="home_sticker-3" />
          <img src={sticker2} alt="" className="home_sticker-4" />

          <Swiper
            className="home_swiper"
            modules={[Autoplay, EffectCreative]}
            loop
            grabCursor
            speed={800}
            effect="creative"
            creativeEffect={{
              prev: {
                translate: ["-120%", 0, -500],
                rotate: [0, 0, -45],
                opacity: 0,
              },
              next: {
                translate: ["120%", 0, -500],
                rotate: [0, 0, 45],
                opacity: 0,
              },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            onSwiper={setSwiper}
            onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
          >
            {homeCakes.map((cake, index) => (
              <SwiperSlide key={index} tag="article" className="home_article">
                <img
                  src={cake}
                  alt="Delicious decorated cake"
                  className="home_cake"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Home;

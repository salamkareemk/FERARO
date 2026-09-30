import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import ProductCard from "./ProductCard.jsx";
import { categories, products } from "../../data/products.js";
import { useSectionCakes } from "../../context/CakesContext.jsx";

const ALL = "All";
const tabs = [ALL, ...categories];

/*=============== PRODUCTS SECTION ===============*/
const Products = ({ onQuickView }) => {
  const [activeTab, setActiveTab] = useState(ALL);
  const addedProducts = useSectionCakes("products");
  const allProducts = [...products, ...addedProducts];

  const visibleProducts =
    activeTab === ALL
      ? allProducts
      : allProducts.filter((product) => product.category === activeTab);

  return (
    <section className="product menu section" id="product">
      <div className="menu_container container">
        <div className="menu_header">
          <h2 className="menu_title">Your Indulgence</h2>
          <p className="menu_subtitle">
            From moist cakes to artisan brownies, find the perfect treat for
            any moment.
          </p>
        </div>

        {/* Category tabs */}
        <div className="menu_tabs" role="tablist" aria-label="Cake categories">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`menu_tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product carousel - remounts per tab so it starts at the first card */}
        <Swiper
          key={activeTab}
          className="menu_swiper"
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.15}
          watchOverflow
          navigation={{
            prevEl: ".menu_arrow-prev",
            nextEl: ".menu_arrow-next",
          }}
          breakpoints={{
            540: { slidesPerView: 2 },
            900: { slidesPerView: 3 },
            1150: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {visibleProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} onQuickView={onQuickView} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="menu_arrows">
          <button
            type="button"
            className="menu_arrow menu_arrow-prev"
            aria-label="Previous products"
          >
            <i className="ri-arrow-left-line"></i>
          </button>

          <button
            type="button"
            className="menu_arrow menu_arrow-next"
            aria-label="Next products"
          >
            <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Products;

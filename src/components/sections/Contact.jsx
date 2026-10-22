import { getProductById } from "../../data/products.js";
import { formatPrice } from "../../utils/format.js";
import { WHATSAPP_NUMBER } from "../../utils/whatsapp.js";

/* Shown as +91 62827 99461 */
const PHONE_DISPLAY = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 7)} ${WHATSAPP_NUMBER.slice(7)}`;

const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Feraro! I'd like to order a custom cake.",
)}`;

/* Cakes shown inside the phone mockups */
const menuCakes = ["strawberry-2", "chocolate-3", "vanilla-1", "others-2"].map(
  getProductById,
);
const featuredCake = getProductById("chocolate-1");

/*=============== ORDER / CONTACT SECTION ===============*/
const Contact = () => {
  return (
    <section className="order section" id="contact">
      <div className="order_container container">
        {/* Text + buttons */}
        <div className="order_content">
          <h2 className="order_title">
            Feraro &mdash; <br />
            Order. <br />
            Celebrate. Enjoy.
          </h2>

          <p className="order_description">
            Custom cakes handcrafted for birthdays, weddings and every
            celebration in between. Tell us your idea on WhatsApp, give us a
            call, or drop by your nearest Feraro outlet.
          </p>

          <div className="order_buttons">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="order_button"
            >
              <i className="ri-whatsapp-line order_button-icon"></i>
              <span className="order_button-text">
                <small>Order on</small>
                WhatsApp
              </span>
            </a>

            <a href={`tel:+${WHATSAPP_NUMBER}`} className="order_button">
              <i className="ri-phone-line order_button-icon"></i>
              <span className="order_button-text">
                <small>Call us</small>
                {PHONE_DISPLAY}
              </span>
            </a>
          </div>

          <a href="#outlets" className="order_outlets-link">
            <i className="ri-map-pin-2-line"></i>
            Or visit one of our outlets
          </a>
        </div>

        {/* Visual: two phone mockups wrapped by a glowing ribbon (decorative) */}
        <div className="order_visual" aria-hidden="true">
          <Ribbon className="order_ribbon order_ribbon-back" id="back" />

          {/* Back phone - cake menu */}
          <div className="order_phone order_phone-back">
            <div className="order_screen">
              <div className="order_status">
                <span>9:41</span>
                <span className="order_notch"></span>
                <i className="ri-signal-wifi-fill"></i>
              </div>

              <div className="order_chips">
                <span className="active">For you</span>
                <span>Cakes</span>
                <span>Cupcakes</span>
              </div>

              <div className="order_grid">
                {menuCakes.map((cake) => (
                  <div className="order_tile" key={cake.id}>
                    <img src={cake.image} alt="" />
                    <span>{formatPrice(cake.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Front phone - order screen */}
          <div className="order_phone order_phone-front">
            <div className="order_screen">
              <div className="order_status">
                <span>9:41</span>
                <span className="order_notch"></span>
                <i className="ri-signal-wifi-fill"></i>
              </div>

              <div className="order_app-bar">
                <i className="ri-menu-line"></i>
                <strong>FERARO</strong>
                <i className="ri-shopping-bag-3-line"></i>
              </div>

              <div className="order_feature">
                <span className="order_badge">Bestseller</span>
                <img src={featuredCake.image} alt="" />
              </div>

              <div className="order_feature-info">
                <strong>{featuredCake.name}</strong>
                <span>{formatPrice(featuredCake.price)}</span>
              </div>

              <div className="order_chat">
                <span className="order_bubble">
                  Can you add &ldquo;Happy Birthday Ammu&rdquo;? 🎂
                </span>
                <span className="order_bubble order_bubble-reply">
                  Of course! Ready by 6pm ✨
                </span>
              </div>

              <span className="order_cta">
                <i className="ri-whatsapp-line"></i>
                Order on WhatsApp
              </span>
            </div>
          </div>

          <Ribbon className="order_ribbon order_ribbon-front" id="front" />
        </div>
      </div>
    </section>
  );
};

/* Glowing neon ribbon. The same curve is drawn twice - once behind the phones
   and once in front (clipped to its lower part) - so it weaves through them. */
const RIBBON_PATH =
  "M -60 150 C 180 40, 560 60, 580 230 C 600 380, 160 360, 140 500 C 120 640, 520 700, 700 600";

const Ribbon = ({ className, id }) => (
  <svg
    className={className}
    viewBox="0 0 640 720"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
  >
    <defs>
      <linearGradient id={`ribbon-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff8a9b" />
        <stop offset="45%" stopColor="#ff3355" />
        <stop offset="100%" stopColor="#c4122f" />
      </linearGradient>

      <filter id={`glow-${id}`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="18" />
      </filter>

      {id === "front" && (
        <clipPath id="ribbon-front-clip">
          <rect x="300" y="470" width="400" height="260" />
        </clipPath>
      )}
    </defs>

    <g clipPath={id === "front" ? "url(#ribbon-front-clip)" : undefined}>
      {/* Soft outer glow */}
      <path
        d={RIBBON_PATH}
        stroke="#ff2d55"
        strokeOpacity="0.55"
        strokeWidth="70"
        strokeLinecap="round"
        filter={`url(#glow-${id})`}
      />
      {/* Ribbon body */}
      <path
        d={RIBBON_PATH}
        stroke={`url(#ribbon-${id})`}
        strokeWidth="44"
        strokeLinecap="round"
      />
      {/* Shine along the ribbon */}
      <path
        className="order_ribbon-shine"
        d={RIBBON_PATH}
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export default Contact;

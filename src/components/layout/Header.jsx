import { useState } from "react";
import { useLocation } from "react-router";

import SectionLink from "./SectionLink.jsx";

import { useCart } from "../../context/CartContext.jsx";
import { useActiveSection } from "../../hooks/useActiveSection.js";
import { useHideOnScroll } from "../../hooks/useHideOnScroll.js";
import { useScrolledPast } from "../../hooks/useScrolledPast.js";

import logo from "../../assets/img/logo.svg";
import leaf3 from "../../assets/img/leaf-3.png";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "product", label: "Products" },
  { id: "new", label: "New" },
  { id: "custom", label: "Custom" },
  { id: "outlets", label: "Outlets" },
  { id: "contact", label: "Contact" },
];

/*=============== HEADER & NAV ===============*/
const Header = ({ onCartOpen }) => {
  const { totalItems } = useCart();
  const isScrolled = useScrolledPast(50);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const activeId = useActiveSection(
    navLinks.map(({ id }) => id),
    pathname,
  );

  const isScrollingDown = useHideOnScroll();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /* Keep the header visible while the mobile menu is open */
  const isHidden = isScrollingDown && !isMenuOpen;

  return (
    <header
      className={[
        "header",
        isScrolled && "scroll-header",
        isHidden && "hide-header",
      ]
        .filter(Boolean)
        .join(" ")}
      id="header"
    >
      <nav className="nav container">
        <SectionLink id="home" className="nav_logo">
          <img src={logo} alt="Logo FERARO" />
          <span>FERARO</span>
        </SectionLink>

        <div className={`nav_menu ${isMenuOpen ? "show-menu" : ""}`}>
          <ul className="nav_list">
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <SectionLink
                  id={id}
                  className={`nav_link ${isHome && activeId === id ? "active-link" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </SectionLink>
              </li>
            ))}
          </ul>

          {/* Close */}
          <button
            className="nav_close"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-close-large-line"></i>
          </button>

          <img src={leaf3} alt="" className="nav_img" />
        </div>

        {/* Cart */}
        <button
          className="cart_button"
          aria-label="Open shopping cart"
          onClick={onCartOpen}
        >
          <i className="ri-shopping-bag-3-line"></i>
          {/* Re-keying replays the bump animation when the count changes */}
          <span className="cart_count bump" key={totalItems}>
            {totalItems}
          </span>
        </button>

        {/* Toggle */}
        <button
          className="nav_toggle"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <i className="ri-apps-2-line"></i>
        </button>
      </nav>
    </header>
  );
};

export default Header;

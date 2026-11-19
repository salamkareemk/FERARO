import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import SectionLink from "./SectionLink.jsx";

import { useCart } from "../../context/CartContext.jsx";
import { useActiveSection } from "../../hooks/useActiveSection.js";
import { useHideOnScroll } from "../../hooks/useHideOnScroll.js";
import { useScrolledPast } from "../../hooks/useScrolledPast.js";
import { useScrollLock } from "../../hooks/useSmoothScroll.js";

import logo from "../../assets/img/logo-feraro.png";

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "product", label: "Products" },
  { id: "custom", label: "Custom" },
  { id: "outlets", label: "Outlets" },
  { id: "contact", label: "Contact" },
];

/*=============== HEADER & NAV ===============*/
/* Desktop: logo left, links centred, cart right.
   Phones / tablets: logo left, cart + menu button right, slide-in menu. */
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
  const closeMenu = () => setIsMenuOpen(false);

  /* Keep the header visible while the mobile menu is open */
  const isHidden = isScrollingDown && !isMenuOpen;

  /* Mobile menu: page doesn't scroll behind it, Esc closes it */
  useScrollLock(isMenuOpen);

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKey = (event) => event.key === "Escape" && setIsMenuOpen(false);

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

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
      <nav className="nav container" aria-label="Main">
        <SectionLink id="home" className="nav_logo" aria-label="FERARO - back to top" onClick={closeMenu}>
          {/* The logo artwork already contains the word FERARO */}
          <img src={logo} alt="FERARO" className="nav_logo-img" />
        </SectionLink>

        <div className={`nav_menu ${isMenuOpen ? "show-menu" : ""}`} id="nav-menu">
          <ul className="nav_list">
            {navLinks.map(({ id, label }) => {
              const isActive = isHome && activeId === id;

              return (
                <li key={id}>
                  <SectionLink
                    id={id}
                    className={`nav_link ${isActive ? "active-link" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={closeMenu}
                  >
                    {label}
                  </SectionLink>
                </li>
              );
            })}
          </ul>

          {/* Close (mobile menu) */}
          <button className="nav_close" type="button" aria-label="Close menu" onClick={closeMenu}>
            <i className="ri-close-large-line"></i>
          </button>
        </div>

        <div className="nav_actions">
          {/* Cart */}
          <button
            className="cart_button"
            type="button"
            aria-label={`Open shopping cart (${totalItems} items)`}
            onClick={onCartOpen}
          >
            <i className="ri-shopping-bag-3-line"></i>
            {/* Re-keying replays the bump animation when the count changes */}
            <span className="cart_count bump" key={totalItems} aria-hidden="true">
              {totalItems}
            </span>
          </button>

          {/* Toggle (mobile menu) */}
          <button
            className="nav_toggle"
            type="button"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="nav-menu"
            onClick={() => setIsMenuOpen(true)}
          >
            <i className="ri-menu-3-line"></i>
          </button>
        </div>
      </nav>

      {/* Tap outside the mobile menu to close it */}
      <div
        className={`nav_backdrop ${isMenuOpen ? "show-backdrop" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      ></div>
    </header>
  );
};

export default Header;

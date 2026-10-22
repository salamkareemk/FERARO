import { useState } from "react";
import { Link } from "react-router";

import SectionLink from "./SectionLink.jsx";
import { outlets } from "../../data/outlets.js";
import { WHATSAPP_NUMBER } from "../../utils/whatsapp.js";

const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const PHONE_DISPLAY = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 7)} ${WHATSAPP_NUMBER.slice(7)}`;

/* Round icons under the signup box.
   To add your pages: { href: "https://instagram.com/yourpage", label: "Instagram", icon: "ri-instagram-line" } */
const socialLinks = [
  {
    href: whatsappLink("Hello Feraro!"),
    label: "WhatsApp",
    icon: "ri-whatsapp-line",
  },
  { href: `tel:+${WHATSAPP_NUMBER}`, label: "Call us", icon: "ri-phone-line" },
];

/* Link columns - `section` scrolls to a homepage section, `to` is a page,
   `href` is an outside link */
const columns = [
  {
    title: "Explore",
    links: [
      { label: "About Us", section: "about" },
      { label: "Our Cakes", section: "product" },
      { label: "New Creations", section: "new" },
      { label: "Customized Cakes", section: "custom" },
      { label: "Cake Gallery", to: "/gallery" },
    ],
  },
  {
    title: "Our Outlets",
    links: outlets.map(({ name, mapLink }) => ({
      label: name.replace("Feraro ", ""),
      href: mapLink,
    })),
  },
  {
    title: "Get in Touch",
    links: [
      {
        label: "Order on WhatsApp",
        href: whatsappLink("Hello Feraro! I'd like to order a cake."),
        highlight: true,
      },
      { label: PHONE_DISPLAY, href: `tel:+${WHATSAPP_NUMBER}` },
      { label: "Find an Outlet", section: "outlets" },
    ],
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/*=============== FOOTER ===============*/
const Footer = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  /* No email service is connected, so signing up sends the address to the
     shop on WhatsApp. Swap this for a mailing-list service when you have one. */
  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    window.open(
      whatsappLink(
        `Hi Feraro! Please add me to your updates list.\nEmail: ${email.trim()}`,
      ),
      "_blank",
      "noopener,noreferrer",
    );
    setEmail("");
  };

  return (
    <footer className="ft">
      <div className="ft_container container">
        <div className="ft_top">
          {/* Signup + social */}
          <div className="ft_signup">
            <h2 className="ft_signup-title">
              Join our list for new cakes, seasonal specials and offers.
            </h2>

            <form className="ft_form" onSubmit={handleSubscribe} noValidate>
              <label htmlFor="ft-email" className="ft_sr-only">
                Email address
              </label>
              <input
                id="ft-email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby="ft-note"
              />
              <button type="submit">Subscribe</button>
            </form>

            <p
              className={`ft_note ${error ? "ft_note-error" : ""}`}
              id="ft-note"
              role={error ? "alert" : undefined}
            >
              {error ||
                "By subscribing, you agree to receive updates from Feraro on WhatsApp."}
            </p>

            <ul className="ft_social">
              {socialLinks.map(({ href, label, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="ft_social-link"
                  >
                    <i className={icon}></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          <nav className="ft_columns" aria-label="Footer">
            {columns.map(({ title, links }) => (
              <div className="ft_column" key={title}>
                <h3 className="ft_column-title">{title}</h3>

                <ul className="ft_links">
                  {links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Giant brand wordmark */}
        <SectionLink
          id="home"
          className="ft_brand"
          aria-label="Feraro - back to top"
        >
          <span className="ft_wordmark">feraro</span>
        </SectionLink>

        <div className="ft_bottom">
          <small>&#169; All Rights Reserved By Azeem Toretto</small>
          <SectionLink id="home" className="ft_back">
            Back to top
            <i className="ri-arrow-up-line"></i>
          </SectionLink>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ link }) => {
  const className = `ft_link ${link.highlight ? "ft_link-highlight" : ""}`;

  if (link.section) {
    return (
      <SectionLink id={link.section} className={className}>
        {link.label}
      </SectionLink>
    );
  }

  if (link.to) {
    return (
      <Link to={link.to} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      className={className}
      target={link.href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
    >
      {link.label}
    </a>
  );
};

export default Footer;

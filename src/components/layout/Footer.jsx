import SectionLink from "./SectionLink.jsx";

import leaf1 from "../../assets/img/leaf-1.png";
import leaf2 from "../../assets/img/leaf-2.png";
import footerBlob from "../../assets/img/footer-blob.svg";
import logoFull from "../../assets/img/logo-feraro-full.webp";

const socialLinks = [
  {
    href: "https://www.facebook.com/Delizia",
    label: "facebook",
    icon: "ri-facebook-circle-line",
  },
  {
    href: "https://www.instagram.com/Delizia",
    label: "Instagram",
    icon: "ri-instagram-line",
  },
  { href: "https://x.com/Delizia", label: "X", icon: "ri-twitter-x-line" },
];

/*=============== FOOTER ===============*/
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_container container grid">
        {/* Full-width brand logo */}
        <SectionLink
          id="home"
          className="footer_logo"
          aria-label="Feraro - back to top"
        >
          <img src={logoFull} alt="Feraro" className="footer_logo-img" />
        </SectionLink>

        <div className="footer_bottom">
          <small className="footer_copy">
            &#169; All Rights Reserved By Azeem Toretto
          </small>

          <ul className="footer_social">
            {socialLinks.map(({ href, label, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer_social-link"
                >
                  <i className={icon}></i>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <img src={leaf1} alt="" className="footer_leaf-1" />
        <img src={leaf2} alt="" className="footer_leaf-2" />
      </div>

      <img src={footerBlob} alt="" className="footer_blob" />
    </footer>
  );
};

export default Footer;

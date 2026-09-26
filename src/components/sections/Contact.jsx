import sticker1 from "../../assets/img/sticker-1.svg";
import sticker4 from "../../assets/img/sticker-4.svg";
import sticker5 from "../../assets/img/sticker-5.svg";

const socialLinks = [
  {
    href: "https://api.whatsapp.com/send?phone=51123456789&text=Hello, more information!",
    label: "Whatsapp",
    icon: "ri-whatsapp-line",
  },
  {
    href: "https://m.me/Azeem Toretto",
    label: "Messenger",
    icon: "ri-messenger-line",
  },
  {
    href: "mailto:delizia@email.com",
    label: "Email",
    icon: "ri-mail-line",
  },
];

const MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249743.68803786347!2d-76.98777915!3d-12.0266383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5f619ee3ec7%3A0x14206cb9cc452e4a!2zTGltYSwgUMOpcm91!5e0!3m2!1sfr!2s!4v1789066251673!5m2!1sfr!2s";

/*=============== CONTACT SECTION ===============*/
const Contact = () => {
  return (
    <section className="contact section" id="contact">
      <div className="contact_container container grid">
        <div className="contact_content">
          <h2 className="section_title">
            Order Your <br />
            Custom Cake Now!
          </h2>

          <div className="contact_data">
            <div className="contact_info">
              <h3 className="contact_title">Location:</h3>
              <address className="contact_address">
                128th Street Avenue, <br />
                Miraflores, Lima - Peru
              </address>
            </div>

            <div className="contact_info">
              <h3 className="contact_title">Call Us:</h3>
              <address className="contact_address">
                <a href="tel:+1234-9876-00">+1234-9876-00</a>
                <a href="tel:+00987654321">+00987654321</a>
              </address>
            </div>

            <div className="contact_info">
              <h3 className="contact_title">Operational:</h3>
              <p
                className="contact_address"
                itemScope
                itemType="https://schema.org/LocalBusiness"
              >
                <span itemProp="openingHours" content="Mo-Sa 09:00-20:00">
                  Monday - Saturday: 9am - 8pm
                </span>
                <span itemProp="openingHours" content="Su 09:00-18:00">
                  Sunday: 9am - 6pm
                </span>
              </p>
            </div>

            <div className="contact_info">
              <h3 className="contact_title">Messages:</h3>
              <ul className="contact_social">
                {socialLinks.map(({ href, label, icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="contact_social-link"
                    >
                      <i className={icon}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <img src={sticker4} alt="" className="contact_sticker-1" />
            <img src={sticker1} alt="" className="contact_sticker-2" />
            <img src={sticker5} alt="" className="contact_sticker-3" />
          </div>
        </div>

        <div className="contact_map">
          <iframe
            src={MAP_URL}
            title="FERARO location"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;

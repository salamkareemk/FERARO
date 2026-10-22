import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import chefsImg from "../../assets/img/about-img.png";
import cupcake1 from "../../assets/img/about-cupcake-1.png";
import cupcake2 from "../../assets/img/about-cupcake-2.png";
import cupcake3 from "../../assets/img/about-cupcake-3.png";
import cakeSlice from "../../assets/img/home-slice-cake-1.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE = ["Our", "passion", "for", "baking", "cakes"];

const stats = [
  { value: 5, suffix: "", label: "Outlets" },
  { value: 15, suffix: "+", label: "Signature cakes" },
  { value: 100, suffix: "%", label: "Handmade" },
];

/* Treats floating around the photo - `speed` sets the parallax depth
   (bigger = moves further while scrolling), `spin` the rotation */
const treats = [
  { image: cupcake1, className: "passion_treat-1", speed: 0.9, spin: -25 },
  { image: cakeSlice, className: "passion_treat-2", speed: 1.4, spin: 35 },
  { image: cupcake2, className: "passion_treat-3", speed: 0.6, spin: 18 },
  { image: cupcake3, className: "passion_treat-4", speed: 1.15, spin: -30 },
];

const MARQUEE = [
  "Handmade with love",
  "Custom cakes",
  "Baked fresh",
  "Celebrate with Feraro",
];

/*=============== ABOUT SECTION ("Our passion") ===============*/
/* Scroll motion with GSAP + ScrollTrigger (Lenis provides the smooth scroll):
   image reveal, parallax treats, word-by-word title, count-up stats,
   and a marquee that reacts to scroll speed and direction. */
const About = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      /* Full motion only when the visitor hasn't asked for reduced motion */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const section = root.current;

        /* 1. Image reveal - the frame opens up and the photo settles */
        const reveal = {
          trigger: ".passion_visual",
          start: "top 90%",
          end: "top 30%",
          scrub: 1,
        };

        gsap.fromTo(
          ".passion_frame",
          { clipPath: "inset(16% 16% 16% 16% round 3rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 2rem)", ease: "none", scrollTrigger: reveal },
        );

        gsap.fromTo(
          ".passion_chefs",
          { scale: 1.3, yPercent: 8 },
          { scale: 1, yPercent: 0, ease: "none", scrollTrigger: reveal },
        );

        /* 2. Parallax - each treat drifts and spins at its own speed */
        gsap.utils.toArray(".passion_treat").forEach((treat) => {
          const speed = Number(treat.dataset.speed);

          gsap.fromTo(
            treat,
            { yPercent: 60 * speed, rotate: 0 },
            {
              yPercent: -60 * speed,
              rotate: Number(treat.dataset.spin),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        /* 3. Text reveal - title word by word, then the rest in sequence */
        const textTl = gsap.timeline({
          scrollTrigger: { trigger: ".passion_content", start: "top 78%" },
        });

        textTl
          .from(".passion_eyebrow", { y: 20, autoAlpha: 0, duration: 0.6 })
          .from(
            ".passion_word-inner",
            { yPercent: 115, duration: 0.9, ease: "power4.out", stagger: 0.07 },
            "-=0.3",
          )
          .from(
            [".passion_description", ".passion_stats", ".passion_cta"],
            { y: 30, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.12 },
            "-=0.5",
          );

        /* 4. Count-up numbers */
        gsap.utils.toArray(".passion_stat-number").forEach((number) => {
          const counter = { value: 0 };

          number.textContent = 0;

          gsap.to(counter, {
            value: Number(number.dataset.value),
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: ".passion_stats", start: "top 90%" },
            onUpdate: () => {
              number.textContent = Math.round(counter.value);
            },
          });
        });

        /* 5. Marquee - loops forever; scroll speed boosts it and
              scrolling up reverses it */
        const marquee = gsap.to(".passion_marquee-track", {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);

            gsap.to(marquee, {
              timeScale: boost * self.direction,
              duration: 0.25,
              overwrite: true,
              onComplete: () =>
                gsap.to(marquee, { timeScale: self.direction, duration: 1.2 }),
            });
          },
        });
      });

      /* Reduced motion: show final numbers straight away */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray(".passion_stat-number").forEach((number) => {
          number.textContent = number.dataset.value;
        });
      });
    },
    { scope: root },
  );

  /* Micro-interaction: the photo tilts slightly towards the mouse */
  const tilt = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frame = event.currentTarget;
    const { left, top, width, height } = frame.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    gsap.to(frame, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const resetTilt = (event) => {
    gsap.to(event.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  };

  return (
    <section className="passion section" id="about" ref={root}>
      <div className="passion_container container">
        {/* Visual: revealing photo + parallax treats */}
        <div className="passion_visual">
          <div
            className="passion_frame"
            onMouseMove={tilt}
            onMouseLeave={resetTilt}
          >
            <img
              src={chefsImg}
              alt="Feraro pastry chefs holding a slice of cake"
              className="passion_chefs"
            />
          </div>

          {treats.map(({ image, className, speed, spin }) => (
            <img
              key={className}
              src={image}
              alt=""
              aria-hidden="true"
              className={`passion_treat ${className}`}
              data-speed={speed}
              data-spin={spin}
            />
          ))}
        </div>

        {/* Text */}
        <div className="passion_content">
          <span className="passion_eyebrow">Our story</span>

          <h2 className="passion_title" aria-label={TITLE.join(" ")}>
            {TITLE.map((word) => (
              <span className="passion_word" key={word} aria-hidden="true">
                <span className="passion_word-inner">{word}</span>
              </span>
            ))}
          </h2>

          <p className="passion_description">
            We are a bakery specializing in homemade desserts, custom cakes,
            brownies, and a wide variety of gourmet sweets. Our passion for
            baking allows us to create perfect sweet experiences for
            celebrations, special events, or simply to enjoy anytime.
          </p>

          <ul className="passion_stats">
            {stats.map(({ value, suffix, label }) => (
              <li className="passion_stat" key={label}>
                <strong>
                  <span className="passion_stat-number" data-value={value}>
                    {value}
                  </span>
                  {suffix}
                </strong>
                <span className="passion_stat-label">{label}</span>
              </li>
            ))}
          </ul>

          <a href="#product" className="passion_cta">
            View our products
            <i className="ri-arrow-right-line"></i>
          </a>
        </div>
      </div>

      {/* Marquee band - content doubled so the loop is seamless */}
      <div className="passion_marquee" aria-hidden="true">
        <div className="passion_marquee-track">
          {[...MARQUEE, ...MARQUEE].map((text, index) => (
            <span className="passion_marquee-item" key={index}>
              {text}
              <i className="ri-sparkling-2-fill"></i>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;

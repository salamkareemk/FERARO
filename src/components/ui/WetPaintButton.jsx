import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router";

/*=============== WET PAINT BUTTON ===============*/
/* A button (a link when `href` is given, a page link when `to` is given)
   with paint drips running off its bottom edge. Drips use the CSS variable
   --drip-color, so they match whatever colour the button already has.
   Styles: .wet-paint in styles.css */

const drips = [
  { left: "10%", height: 24, delay: 0.5 },
  { left: "30%", height: 20, delay: 3 },
  { left: "57%", height: 10, delay: 4.25 },
  { left: "85%", height: 16, delay: 1.5 },
];

const WetPaintButton = ({ children, className = "", href, to, ...props }) => {
  const Tag = to ? Link : href ? "a" : "button";
  const linkProps = to ? { to } : href ? { href } : { type: "button" };

  return (
    <Tag className={`wet-paint ${className}`} {...linkProps} {...props}>
      {children}

      {drips.map((drip) => (
        <Drip key={drip.left} {...drip} />
      ))}
    </Tag>
  );
};

/* Right-angle curve that joins a drip smoothly to the button edge */
const DripCurve = ({ className }) => (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.4 0H0V5.4C0 2.41765 2.41766 0 5.4 0Z"
    />
  </svg>
);

/* One drip: stretches and relaxes, then drops a droplet that falls away */
const Drip = ({ left, height, delay }) => {
  const reduceMotion = useReducedMotion();

  const loop = {
    duration: 2,
    delay,
    ease: "easeIn",
    repeat: Infinity,
    repeatDelay: 2,
  };

  return (
    <motion.span
      className="wet-paint_drip"
      style={{ left }}
      aria-hidden="true"
      initial={{ scaleY: 0.75 }}
      animate={reduceMotion ? undefined : { scaleY: [0.75, 1, 0.75] }}
      transition={{ ...loop, times: [0, 0.25, 1] }}
    >
      {/* Main body of the drip */}
      <span className="wet-paint_body" style={{ height }} />

      {/* Curves on each side of the drip */}
      <DripCurve className="wet-paint_curve wet-paint_curve-right" />
      <DripCurve className="wet-paint_curve wet-paint_curve-left" />

      {/* Detached droplet that falls and fades */}
      {!reduceMotion && (
        <motion.span
          className="wet-paint_drop"
          initial={{ y: -8, opacity: 1 }}
          animate={{ y: [-8, 50], opacity: [1, 0] }}
          transition={{ ...loop, times: [0, 1] }}
        />
      )}
    </motion.span>
  );
};

export default WetPaintButton;

import { useScrolledPast } from "../../hooks/useScrolledPast.js";

/*=============== SCROLL UP ===============*/
const ScrollUp = () => {
  const isVisible = useScrolledPast(350);

  return (
    <a
      href="#top"
      className={`scrollup ${isVisible ? "show-scroll" : ""}`}
      aria-label="Scroll to top"
    >
      <i className="ri-arrow-up-line"></i>
    </a>
  );
};

export default ScrollUp;

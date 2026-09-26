import { Link, useLocation } from "react-router";

/*=============== LINK TO A HOMEPAGE SECTION ===============*/
/* On the homepage: a plain #anchor, so Lenis scrolls there smoothly.
   On any other page: a router link back to the homepage at that section. */
const SectionLink = ({ id, children, ...props }) => {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return (
      <a href={`#${id}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={`/#${id}`} {...props}>
      {children}
    </Link>
  );
};

export default SectionLink;

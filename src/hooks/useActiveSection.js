import { useEffect, useState } from "react";

/*=============== ACTIVE SECTION FOR NAV LINKS ===============*/
/* Watches which section crosses the middle of the viewport,
   without measuring the layout on every scroll event */
export const useActiveSection = (ids, pageKey, initialId = ids[0]) => {
  const [activeId, setActiveId] = useState(initialId);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    ids.forEach((id) => {
      const section = document.getElementById(id);

      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(), pageKey]);

  return activeId;
};

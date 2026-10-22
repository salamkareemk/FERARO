import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import newCake1 from "../../assets/img/new-cake-1.png";
import newCake2 from "../../assets/img/new-cake-2.png";
import newCake3 from "../../assets/img/new-cake-3.png";
import newCake4 from "../../assets/img/new-cake-4.png";
import newCake5 from "../../assets/img/new-cake-5.png";

import { useSectionCakes } from "../../context/CakesContext.jsx";
import { WHATSAPP_NUMBER } from "../../utils/whatsapp.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const newCakes = [
  { image: newCake1, name: "Premium Chocolate Cake" },
  { image: newCake2, name: "Premium Vanilla Cake" },
  { image: newCake3, name: "Premium Cherry Cake" },
  { image: newCake4, name: "Premium Blueberry Cake" },
  { image: newCake5, name: "Premium Raspberry Cake" },
];

/* Tile widths (x tile height) - varied like an editorial layout */
const WIDTHS = [1.15, 0.9, 1.45, 1.05, 0.95, 1.3];

const GROW = 1.75; // how much bigger the centre (active) tile is - keep in sync with --grow
const AUTOPLAY_MS = 3200; // time on each cake before moving to the next
const FLICK = 40; // px - a swipe longer than this always moves at least one cake
const HOVER_DELAY = 180; // ms the mouse rests on a cake before it moves to the centre

const orderLink = (name) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Feraro! I'd like to order the ${name}.`,
  )}`;

const mod = (value, length) => ((value % length) + length) % length;

/*=============== NEW CREATIONS (editorial strip) ===============*/
/* Inspired by "M. Editorial Website Wishlist Animation" (Zhenya Rynzhuk).
   The cake in the centre is always the active (enlarged) one. The strip
   glides to the next cake on its own and can be swiped or dragged; it always
   settles with a cake in the centre. Tiles are laid out by the engine below
   on a loop, so the strip never ends. */
const NewCreations = () => {
  const root = useRef(null);
  const viewportRef = useRef(null);
  const tileRefs = useRef([]);
  const engineRef = useRef(null); // lets click / focus handlers move the strip
  const motion = useRef({ offset: 0, target: 0, ready: false }); // survives re-renders

  const adminCakes = useSectionCakes("new");
  const cakes = useMemo(() => [...newCakes, ...adminCakes], [adminCakes]);
  const count = String(cakes.length).padStart(2, "0");

  /* The cake list is repeated until the loop is wider than the screen */
  const [repeats, setRepeats] = useState(3);
  const items = useMemo(
    () =>
      Array.from({ length: repeats }, (_, copy) =>
        cakes.map((cake, index) => ({ ...cake, index, copy })),
      ).flat(),
    [cakes, repeats],
  );

  /* Intro: title, labels and tiles rise into view one after another */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top 70%" },
          })
          .from(".nc_title-inner", {
            yPercent: 110,
            duration: 1,
            ease: "power4.out",
          })
          .from(
            [".nc_caption", ".nc_meta-item"],
            { y: 12, autoAlpha: 0, duration: 0.6, stagger: 0.06 },
            "-=0.6",
          )
          .from(
            ".nc_tile-link",
            {
              yPercent: 60,
              autoAlpha: 0,
              duration: 1,
              ease: "power3.out",
              stagger: 0.05,
            },
            "-=0.5",
          );
      });
    },
    { scope: root, dependencies: [cakes.length] },
  );

  /*=============== STRIP ENGINE ===============*/
  useEffect(() => {
    const viewport = viewportRef.current;
    const tiles = tileRefs.current.slice(0, items.length);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = motion.current;

    let width = 0; // viewport width
    let tileH = 0; // tile height at rest
    let gap = 0;
    let restW = []; // tile widths at rest
    let restPos = []; // tile positions along the loop at rest
    let loopLength = 0;
    let grow = items.map(() => 0); // 0 = rest size, 1 = fully enlarged
    let active = -1;
    let isVisible = false;
    let isHovering = false;
    let drag = null;
    let lastStep = performance.now();
    let lastTime = performance.now();
    let frame;

    const measure = () => {
      width = viewport.clientWidth;
      tileH = viewport.clientHeight / GROW;
      gap = Math.min(14, Math.max(8, window.innerWidth * 0.01));
      restW = items.map(({ index }) => tileH * WIDTHS[index % WIDTHS.length]);
      restPos = [];

      let position = 0;

      restW.forEach((tileWidth) => {
        restPos.push(position);
        position += tileWidth + gap;
      });

      loopLength = position;

      /* Need enough tiles that wrapping always happens off-screen */
      const needed = width + 2 * Math.max(...restW) * GROW + 200;

      if (loopLength < needed) {
        const perCopy = loopLength / repeats;
        setRepeats(repeats + Math.ceil((needed - loopLength) / perCopy));
        return false;
      }

      return true;
    };

    /* Where a tile's centre would be on screen if nothing were enlarged */
    const restCenter = (i, offset = state.offset) => {
      const base = width / 2 - loopLength / 2;
      return mod(restPos[i] + restW[i] / 2 - offset - base, loopLength) + base;
    };

    const nearestToCenter = (offset) => {
      let best = 0;
      let bestDistance = Infinity;

      restW.forEach((_, i) => {
        const distance = Math.abs(restCenter(i, offset) - width / 2);

        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });

      return best;
    };

    /* Glide so that tile i ends up in the centre. Measured from where the
       strip is heading (target), so quick repeated steps add up correctly */
    const goTo = (i) => {
      state.target += restCenter(i, state.target) - width / 2;
      lastStep = performance.now();
    };

    /* Centre the closest copy of a cake (used for keyboard focus) */
    const goToCake = (cakeIndex) => {
      let best = -1;
      let bestDistance = Infinity;

      items.forEach((item, i) => {
        if (item.index !== cakeIndex) return;

        const distance = Math.abs(restCenter(i, state.target) - width / 2);

        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });

      if (best !== -1 && best !== nearestToCenter(state.target)) goTo(best);
    };

    const step = (direction) => {
      const from = nearestToCenter(state.target);
      goTo(mod(from + direction, items.length));
    };

    engineRef.current = {
      goTo,
      goToCake,
      step,
      isActive: (i) => i === active,
      wasDragged: () => drag?.moved,
    };

    const layout = () => {
      const widths = restW.map((w, i) => w * (1 + (GROW - 1) * grow[i]));
      const heights = grow.map((g) => tileH * (1 + (GROW - 1) * g));
      let position = 0;
      const starts = widths.map((w) => {
        const start = position;
        position += w + gap;
        return start;
      });
      const length = position;

      /* Shift everything back by half the extra width, so an enlarged tile
         grows evenly to both sides and stays centred */
      const shift = -(length - loopLength) / 2;
      const base = width / 2 - length / 2;

      tiles.forEach((tile, i) => {
        if (!tile) return;

        const x = mod(starts[i] - state.offset - base, length) + base + shift;
        tile.style.transform = `translate3d(${x}px, 0, 0)`;
        tile.style.width = `${widths[i]}px`;
        tile.style.height = `${heights[i]}px`;
      });
    };

    const setActive = (i) => {
      if (i === active) return;

      tiles[active]?.classList.remove("is-active");
      tiles[i]?.classList.add("is-active");
      active = i;
    };

    const tick = (time) => {
      const dt = Math.min(time - lastTime, 50) / 1000;
      const instant = reduceMotion.matches;
      lastTime = time;

      /* Ease towards the target position (unless the user is dragging) */
      if (!drag) {
        const ease = instant ? 1 : 1 - Math.exp(-dt * 7);
        state.offset += (state.target - state.offset) * ease;

        if (Math.abs(state.target - state.offset) < 0.1) {
          state.offset = state.target;
        }
      }

      /* Autoplay: move on to the next cake every few seconds */
      if (
        isVisible &&
        !isHovering &&
        !drag &&
        !instant &&
        state.offset === state.target &&
        time - lastStep > AUTOPLAY_MS
      ) {
        step(1);
      }

      setActive(nearestToCenter(state.offset));

      /* Ease each tile's size towards enlarged (active) or rest */
      const sizeEase = instant ? 1 : 1 - Math.exp(-dt * 6);
      grow = grow.map((g, i) => g + ((i === active ? 1 : 0) - g) * sizeEase);

      layout();
      frame = requestAnimationFrame(tick);
    };

    if (!measure()) return; // more tiles needed - the effect re-runs

    /* Start with the first cake centred */
    if (!state.ready) {
      state.offset = restPos[0] + restW[0] / 2 - width / 2;
      state.target = state.offset;
      state.ready = true;
    }

    active = nearestToCenter(state.offset);
    tiles[active]?.classList.add("is-active");
    grow = grow.map((_, i) => (i === active ? 1 : 0));
    layout();

    /*----- Swipe / drag -----*/
    const onDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      drag = {
        x: event.clientX,
        offset: state.offset,
        startActive: active,
        moved: false,
        lastX: event.clientX,
        lastT: performance.now(),
        velocity: 0,
      };
    };

    const onMove = (event) => {
      if (!drag) return;

      const distance = event.clientX - drag.x;
      const now = performance.now();

      if (Math.abs(distance) > 4) drag.moved = true;

      drag.velocity = (event.clientX - drag.lastX) / Math.max(now - drag.lastT, 1);
      drag.lastX = event.clientX;
      drag.lastT = now;

      state.offset = drag.offset - distance;
      state.target = state.offset;
    };

    const onUp = () => {
      if (!drag) return;

      const distance = drag.lastX - drag.x;

      if (drag.moved) {
        /* Carry a little momentum (at most one tile), then settle on the
           nearest cake */
        const maxCarry = Math.max(...restW);
        const carry = Math.max(-maxCarry, Math.min(maxCarry, drag.velocity * 120));
        const projected = state.offset - carry;
        let next = nearestToCenter(projected);

        if (next === drag.startActive && Math.abs(distance) > FLICK) {
          next = mod(drag.startActive + (distance < 0 ? 1 : -1), items.length);
        }

        goTo(next);
      }

      const finished = drag;
      setTimeout(() => {
        if (drag === finished) drag = null;
      }, 0);
    };

    const onEnter = (event) => {
      if (event.pointerType === "mouse") isHovering = true;
    };

    const onLeave = () => {
      isHovering = false;
      clearTimeout(hoverTimer);
      hoverTile = -1;
    };

    /*----- Hover a cake -> it glides to the centre and becomes active -----
       Only real mouse movement counts (movementX/Y), so a cake sliding under
       a still cursor while the strip moves does not trigger another hover */
    let hoverTile = -1;
    let hoverTimer;

    const onHoverMove = (event) => {
      if (event.pointerType !== "mouse" || drag) return;
      if (!event.movementX && !event.movementY) return;

      const tile = event.target.closest(".nc_tile");
      const i = tiles.indexOf(tile);

      if (i === -1 || i === hoverTile) return;

      hoverTile = i;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (!drag && i !== nearestToCenter(state.target)) goTo(i);
      }, HOVER_DELAY);
    };

    const onResize = () => {
      if (measure()) goTo(active);
    };

    /* Autoplay timer starts when the strip comes into view, so visitors
       always see the first cake before it moves */
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) lastStep = performance.now();
      isVisible = entry.isIntersecting;
    });

    observer.observe(viewport);
    viewport.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("pointermove", onHoverMove);
    window.addEventListener("resize", onResize);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("pointermove", onHoverMove);
      window.removeEventListener("resize", onResize);
      clearTimeout(hoverTimer);
      tiles.forEach((tile) => tile?.classList.remove("is-active"));
    };
  }, [items, repeats]);

  /* Side cake -> bring it to the centre (touch / keyboard; a mouse already
     brings it there on hover). Centre cake -> open the order link */
  const handleTileClick = (event, i) => {
    const engine = engineRef.current;

    if (!engine) return;

    if (engine.wasDragged() || !engine.isActive(i)) {
      event.preventDefault();

      if (!engine.wasDragged()) engine.goTo(i);
    }
  };

  return (
    <section className="nc section" id="new" ref={root}>
      <div className="nc_container container">
        <header className="nc_header">
          <h2 className="nc_title">
            <span className="nc_title-inner">New Creations</span>
          </h2>

          <p className="nc_caption">
            Freshly baked <br />
            this season
          </p>
        </header>

        <ul className="nc_meta">
          <li className="nc_meta-item nc_meta-hint">Swipe &middot; Drag to explore</li>
          <li className="nc_meta-item">{new Date().getFullYear()}</li>
          <li className="nc_meta-item">{count} Cakes</li>
          <li className="nc_meta-item">Made to order</li>
          <li className="nc_meta-item">
            <a href="#contact" className="nc_meta-link">
              Order now
            </a>
          </li>
        </ul>
      </div>

      {/* Strip of cakes - the centre one is always active */}
      <div
        className="nc_viewport"
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="New creations - use the arrow keys to browse"
      >
        <ul className="nc_track">
          {items.map(({ image, name, index, copy }, i) => (
            <li
              className="nc_tile"
              key={`${copy}-${name}-${index}`}
              ref={(element) => (tileRefs.current[i] = element)}
              style={{ "--w": WIDTHS[index % WIDTHS.length] }}
              aria-hidden={copy > 0 ? "true" : undefined}
            >
              <a
                href={orderLink(name)}
                target="_blank"
                rel="noopener noreferrer"
                className="nc_tile-link"
                tabIndex={copy > 0 ? -1 : undefined}
                draggable="false"
                onClick={(event) => handleTileClick(event, i)}
                onFocus={() => engineRef.current?.goToCake(index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                    event.preventDefault();
                    engineRef.current?.step(event.key === "ArrowRight" ? 1 : -1);
                  }
                }}
              >
                <img src={image} alt={name} draggable="false" />

                <span className="nc_tile-info">
                  <span className="nc_tile-name">{name}</span>
                  <span className="nc_tile-order">
                    Order <i className="ri-arrow-right-up-line"></i>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NewCreations;

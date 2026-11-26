import { useEffect, useRef, useState } from "react";

/*=============== IMAGE SEQUENCE CONFIG ===============*/
/* 1080p frames: landscape (1920x1080) for desktop, portrait (1080x1920) for phones.
   desktop: steps whole frames, easing 0.12 of the way per screen refresh.
   mobile: blends neighbouring frames and eases by time (catch-up speed per
   second), so the shorter phone scroll still glides on any screen. */
const SEQUENCES = {
  desktop: { folder: "desktop", count: 120, easing: 0.12 },
  mobile: { folder: "mobile", count: 94, smoothing: 7, blend: true },
};
const MAX_CANVAS_WIDTH = 1920; // source frames are 1080p - no point going higher
const LOAD_CONCURRENCY = 6;

const pickSequence = () =>
  window.matchMedia("(orientation: portrait) and (max-width: 768px)").matches
    ? SEQUENCES.mobile
    : SEQUENCES.desktop;

const framePath = (folder, index) =>
  `/sequence/${folder}/frame-${String(index + 1).padStart(3, "0")}.webp`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/* Load + fully decode a frame up front, so drawing it later never stalls */
const loadFrame = async (src) => {
  const image = new Image();

  image.src = src;
  await image.decode();

  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(image);
    } catch {
      // Fall back to the decoded <img>
    }
  }

  return image;
};

/* Draw a frame like CSS `object-fit: cover` */
const drawCover = (context, frame, width, height) => {
  const scale = Math.max(width / frame.width, height / frame.height);
  const drawWidth = frame.width * scale;
  const drawHeight = frame.height * scale;

  context.drawImage(
    frame,
    (width - drawWidth) / 2,
    (height - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
};

/*=============== SCROLL SEQUENCE SECTION ===============*/
const ScrollSequence = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const [loadedPercent, setLoadedPercent] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: false });

    const { folder, count: FRAME_COUNT, easing, smoothing, blend: canBlend } = pickSequence();
    const frames = new Array(FRAME_COUNT).fill(null);
    let isActive = true;
    let loadedCount = 0;
    let currentFrame = 0; // eased, fractional
    let targetFrame = 0;
    let drawnPosition = -1; // fractional frame last drawn; -1 = redraw needed
    let rafId = null;
    let lastTime = 0;

    /* Nearest frame that is ready to draw */
    const getReadyFrame = (index) => {
      for (let offset = 0; offset < FRAME_COUNT; offset++) {
        if (frames[index - offset]) return frames[index - offset];
        if (frames[index + offset]) return frames[index + offset];
      }

      return null;
    };

    /* Draws the current position. On phones the two nearest frames are
       blended so playback glides between them instead of stepping. */
    const render = (force = false) => {
      const position = canBlend ? Math.round(currentFrame * 100) / 100 : Math.round(currentFrame);

      if (!force && position === drawnPosition) return;

      const base = Math.floor(position);
      const blend = position - base;
      const frame = getReadyFrame(base);

      if (!frame) return;

      context.globalAlpha = 1;
      drawCover(context, frame, canvas.width, canvas.height);

      const next = blend > 0 ? frames[base + 1] : null;

      if (next) {
        context.globalAlpha = blend;
        drawCover(context, next, canvas.width, canvas.height);
        context.globalAlpha = 1;
      }

      /* Redraw once the real frames arrive if a stand-in was used */
      const isExact = frames[base] && (blend === 0 || next);
      drawnPosition = isExact ? position : -1;
    };

    /* Ease towards the target frame each animation frame */
    const tick = (time) => {
      const seconds = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime = time;

      const step = smoothing ? 1 - Math.exp(-smoothing * seconds) : easing;
      currentFrame += (targetFrame - currentFrame) * step;

      if (Math.abs(targetFrame - currentFrame) < 0.01) {
        currentFrame = targetFrame;
      }

      render();

      if (currentFrame === targetFrame) {
        rafId = null;
        lastTime = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    /* Scroll position inside the section -> 0..1 progress */
    const updateTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = clamp(-rect.top / scrollable, 0, 1);

      section.style.setProperty("--progress", progress.toFixed(4));
      section.classList.toggle("is-end", progress > 0.9);
      targetFrame = progress * (FRAME_COUNT - 1);

      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    /* Match canvas resolution to its on-screen size (capped). Skipped when
       nothing changed - phones fire resize whenever the address bar moves,
       and resetting the canvas would clear it and cause a flicker. */
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(Math.min(canvas.clientWidth * ratio, MAX_CANVAS_WIDTH));
      const height = Math.round(canvas.clientHeight * (width / canvas.clientWidth));

      if (width !== canvas.width || height !== canvas.height) {
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingQuality = "high";
        render(true);
      }

      updateTarget();
    };

    /* Load frames in order, a few at a time */
    let nextIndex = 0;

    const loadWorker = async () => {
      while (isActive && nextIndex < FRAME_COUNT) {
        const index = nextIndex++;

        try {
          frames[index] = await loadFrame(framePath(folder, index));
        } catch {
          // Skip a frame that fails - neighbours are used instead
        }

        if (!isActive) return;

        loadedCount += 1;

        /* Update the loading label in 5% steps, not one re-render per frame */
        setLoadedPercent(Math.floor((loadedCount / FRAME_COUNT) * 20) * 5);

        if (drawnPosition === -1 || Math.abs(index - currentFrame) <= 1) {
          render(true);
        }
      }
    };

    const loadAll = () => {
      Array.from({ length: LOAD_CONCURRENCY }, loadWorker);
    };

    resize();
    updateTarget();
    loadAll();

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      isActive = false;
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
      frames.forEach((frame) => frame?.close?.());
    };
  }, []);

  const isLoading = loadedPercent < 100;

  return (
    <section className="sequence" ref={sectionRef} aria-label="Intro">
      <div className="sequence_sticky">
        <canvas className="sequence_canvas" ref={canvasRef}></canvas>

        <div className="sequence_shade"></div>

        {/* Intro text - fades out as the story starts */}
        <div className="sequence_intro container">
          <span className="sequence_subtitle">FERARO CAKES</span>
          <h2 className="sequence_title">
            Every Cake <br />
            Starts From Scratch
          </h2>
        </div>

        {/* Outro text - fades in on the finished cake */}
        <div className="sequence_outro container">
          <h2 className="sequence_title">Made With Love</h2>
          <a href="#home" className="button">
            Discover Our Cakes
          </a>
        </div>

        <div className={`sequence_hint ${isLoading ? "is-loading" : ""}`}>
          {isLoading ? (
            <span>Loading {loadedPercent}%</span>
          ) : (
            <>
              <span>Scroll</span>
              <i className="ri-arrow-down-line"></i>
            </>
          )}
        </div>

        <div className="sequence_progress"></div>
      </div>
    </section>
  );
};

export default ScrollSequence;

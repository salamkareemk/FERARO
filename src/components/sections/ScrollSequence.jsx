import { useEffect, useRef, useState } from "react";

/*=============== IMAGE SEQUENCE CONFIG ===============*/
const FRAME_COUNT = 169;
const EASING = 0.12; // 0-1, lower = slower & smoother frame changes
const MAX_CANVAS_WIDTH = 1920; // source frames are 1280px wide - no point going higher
const LOAD_CONCURRENCY = 6;

const framePath = (index) =>
  `/sequence/frame-${String(index + 1).padStart(3, "0")}.webp`;

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

    const frames = new Array(FRAME_COUNT).fill(null);
    let isActive = true;
    let loadedCount = 0;
    let currentFrame = 0; // eased, fractional
    let targetFrame = 0;
    let drawnFrame = -1;
    let rafId = null;

    /* Nearest frame that is ready to draw */
    const getReadyFrame = (index) => {
      for (let offset = 0; offset < FRAME_COUNT; offset++) {
        if (frames[index - offset]) return frames[index - offset];
        if (frames[index + offset]) return frames[index + offset];
      }

      return null;
    };

    const render = (force = false) => {
      const index = Math.round(currentFrame);

      if (!force && index === drawnFrame) return;

      const frame = getReadyFrame(index);

      if (!frame) return;

      drawCover(context, frame, canvas.width, canvas.height);
      drawnFrame = frames[index] ? index : -1; // redraw once the real frame arrives
    };

    /* Ease towards the target frame each animation frame */
    const tick = () => {
      currentFrame += (targetFrame - currentFrame) * EASING;

      if (Math.abs(targetFrame - currentFrame) < 0.01) {
        currentFrame = targetFrame;
      }

      render();

      rafId =
        currentFrame === targetFrame ? null : requestAnimationFrame(tick);
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

    /* Match canvas resolution to its on-screen size (capped) */
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.min(canvas.clientWidth * ratio, MAX_CANVAS_WIDTH);
      const scale = width / canvas.clientWidth;

      canvas.width = Math.round(width);
      canvas.height = Math.round(canvas.clientHeight * scale);
      context.imageSmoothingQuality = "high";
      render(true);
    };

    /* Load frames in order, a few at a time */
    let nextIndex = 0;

    const loadWorker = async () => {
      while (isActive && nextIndex < FRAME_COUNT) {
        const index = nextIndex++;

        try {
          frames[index] = await loadFrame(framePath(index));
        } catch {
          // Skip a frame that fails - neighbours are used instead
        }

        if (!isActive) return;

        loadedCount += 1;

        /* Update the loading label in 5% steps, not 169 re-renders */
        setLoadedPercent(Math.floor((loadedCount / FRAME_COUNT) * 20) * 5);

        if (drawnFrame === -1 || index === Math.round(currentFrame)) {
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
          <span className="sequence_subtitle">FERARO Bakery</span>
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

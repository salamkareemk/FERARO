import { useEffect, useState } from "react";

const CONFETTI_COUNT = 90;
const CONFETTI_LIFETIME = 5500;

const confettiColors = [
  "var(--first-color)",
  "#181e21",
  "#dad8d3",
  "#eee9e2",
  "#3b4144",
  "#c9b49f",
];

const random = (min, max) => Math.random() * (max - min) + min;

const createPieces = () =>
  Array.from({ length: CONFETTI_COUNT }, (_, id) => {
    const size = random(6, 11);

    return {
      id,
      style: {
        backgroundColor:
          confettiColors[Math.floor(Math.random() * confettiColors.length)],
        left: `${random(0, 100)}%`,
        width: `${size}px`,
        height: `${size * 1.5}px`,
        animationDelay: `${random(0, 1.2)}s`,
        animationDuration: `${random(3, 4.5)}s`,
        "--confetti-x": `${random(-150, 150)}px`,
      },
    };
  });

/*=============== CONFETTI ===============*/
const Confetti = ({ active }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    setPieces(createPieces());

    const timer = setTimeout(() => setPieces([]), CONFETTI_LIFETIME);

    return () => clearTimeout(timer);
  }, [active]);

  return (
    <div className="confetti_container" aria-hidden="true">
      {pieces.map(({ id, style }) => (
        <span className="confetti" key={id} style={style}></span>
      ))}
    </div>
  );
};

export default Confetti;

import { useEffect, useState } from 'react';

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setSnowflakes(Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 5,
        size: Math.random() * 10 + 5,
        opacity: Math.random() * 0.5 + 0.3,
      })));
    }, 0);
  }, []);

  return (
    <>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="fixed pointer-events-none animate-fall"
          style={{
            left: `${flake.left}%`,
            top: '-10px',
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `fall ${flake.duration}s linear ${flake.delay}s infinite`,
          }}
        >
          ❄️
        </div>
      ))}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotateZ(360deg);
          }
        }
      `}</style>
    </>
  );
}

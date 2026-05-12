import { useMemo } from 'react';

export default function AnimatedBackground() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      tx: (Math.random() - 0.5) * 300,
      ty: (Math.random() - 0.5) * 300,
      delay: Math.random() * 15,
      duration: Math.random() * 15 + 15,
    })), []);

  return (
    <div className="animated-bg">
      <div className="grid-pattern absolute inset-0 opacity-30" />
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

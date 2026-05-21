import { useEffect, useRef } from "react";
import { AntigravityScene } from "../lib/antigravity/AntigravityScene";

interface AmbientParticleBackgroundProps {
  className?: string;
}

function AmbientParticleBackground({ className }: AmbientParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const scene = new AntigravityScene({
      container: containerRef.current,
      theme: "light",
      mode: "ambient",
      interactive: false,
      density: 165,
      particlesScale: 0.87,
      alpha: 1.3,
      ringDisplacement: 0
    });

    let isVisible = true;
    let frameId: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (entry.isIntersecting) {
          scene.resume();
        } else {
          scene.stop();
        }
      },
      { threshold: 0 }
    );

    observer.observe(containerRef.current);

    const animate = (): void => {
      frameId = window.requestAnimationFrame(animate);
      if (isVisible) {
        scene.render();
      }
    };

    animate();

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      scene.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={["ambient-particle-background", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

export default AmbientParticleBackground;

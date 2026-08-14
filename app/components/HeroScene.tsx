'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Decorative three.js blob behind the hero. Parallax is tracked manually so
 * it keeps working even though the canvas has pointer-events: none.
 *
 * Performance: the WebGL render loop only runs while the hero is on screen
 * AND the user hasn't requested reduced motion (frameloop="never" otherwise).
 */
function GradientBlob() {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.1;
      mesh.current.rotation.y += delta * 0.14;
      const targetX = mouse.current.x * 0.35;
      const targetY = mouse.current.y * 0.25;
      mesh.current.position.x += (targetX - mesh.current.position.x) * 0.04;
      mesh.current.position.y += (targetY - mesh.current.position.y) * 0.04;
    }
    if (material.current) {
      material.current.distort = 0.22 + Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 48]} />
      <MeshDistortMaterial
        ref={material}
        color="#0077b6"
        emissive="#01121c"
        roughness={0.25}
        metalness={0.15}
      />
    </mesh>
  );
}

export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Stop rendering when the hero scrolls out of view. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setInView(entry.isIntersecting);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* With reduced motion, or when off-screen, render a single static frame. */
  const animate = !reducedMotion && inView;

  return (
    <div ref={wrapRef} className="hero-scene" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        frameloop={animate ? 'always' : 'never'}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} color="#00b4d8" />
        {reducedMotion ? (
          <GradientBlob />
        ) : (
          <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
            <GradientBlob />
          </Float>
        )}
      </Canvas>
    </div>
  );
}

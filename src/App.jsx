import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import vfrLogo from './assets/vfr-logo.svg';

const VAULT_ENTRIES = [
  { id: 'VFR–NOIR–777', title: 'ANTI-NORMALITY DOCTRINE', body: 'Normality is not neutral. It is a design system for predictable people.' },
  { id: 'ARCHIVE//773', title: 'VISUAL IDENTITY FRAGMENTS', body: 'Identity is pressure rendered as visual architecture.' },
  { id: 'OBSESSION–BLACKBOX', title: 'CREATOR PHILOSOPHY', body: 'Built for minds that cannot sleep. Obsession is strategic stamina.' },
  { id: 'FUTURE–RELIC–001', title: 'LEGACY SYSTEMS', body: 'Rare minds create different futures and leave cultural evidence.' }
];

function Monolith({ intensity = 1 }) {
  const mesh = useRef();
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#111111',
        metalness: 1,
        roughness: 0.18,
        transmission: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: '#520000',
        emissiveIntensity: 0.25 * intensity
      }),
    [intensity]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.y = t * 0.35;
    mesh.current.rotation.x = Math.sin(t * 0.35) * 0.05;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.18} floatIntensity={0.4}>
      <mesh ref={mesh} material={material}>
        <boxGeometry args={[1.3, 2.4, 0.7]} />
      </mesh>
    </Float>
  );
}

function Scene3D({ entered }) {
  return (
    <Canvas camera={{ position: [0, 0.2, 3.8], fov: 42 }} dpr={[1, 1.8]}>
      <color attach="background" args={['#030303']} />
      <fog attach="fog" args={['#030303', 3.2, 8]} />
      <ambientLight intensity={0.15} />
      <spotLight position={[3, 4, 4]} intensity={1.4} color="#c6c6ff" angle={0.35} penumbra={0.8} />
      <pointLight position={[-2, -1, 2]} intensity={1.6} color="#9f0000" />
      <Suspense fallback={null}>
        <Monolith intensity={entered ? 1 : 0.2} />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [selectedVault, setSelectedVault] = useState(VAULT_ENTRIES[0]);
  const [mobile, setMobile] = useState(false);
  const holdRef = useRef();

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const beginHold = () => {
    const start = performance.now();
    holdRef.current = requestAnimationFrame(function tick(now) {
      const value = Math.min((now - start) / 1800, 1);
      setHoldProgress(value);
      if (value >= 1) {
        setEntered(true);
        return;
      }
      holdRef.current = requestAnimationFrame(tick);
    });
  };

  const endHold = () => {
    cancelAnimationFrame(holdRef.current);
    if (!entered) setHoldProgress(0);
  };

  return (
    <main>
      <header className={`gate ${entered ? 'gate--entered' : ''}`}>
        <div className="scan" />
        <img className="vfr-logo" src={vfrLogo} alt="VFR logo" />
        <h1>VFR — VERYFXCKENRARE®</h1>
        <p>NOT A BRAND. NOT A PORTFOLIO. A CULTURAL IDENTITY SYSTEM FOR PEOPLE WHO REFUSE ORDINARY OUTCOMES.</p>
        <button
          onMouseDown={beginHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={beginHold}
          onTouchEnd={endHold}
        >
          HOLD TO ENTER THE MYTH <span>{Math.round(holdProgress * 100)}%</span>
        </button>
      </header>

      <section className="hero">
        <div className="canvas-wrap"><Scene3D entered={entered} /></div>
        <div className="overlay-copy">
          <img className="vfr-logo vfr-logo--hero" src={vfrLogo} alt="VFR mark" />
          <h2>VERY<br/>FXCKEN<br/>RARE</h2>
          <p>NOT A BRAND. A PRESSURE SYSTEM.</p>
        </div>
      </section>

      <section className="chambers">
        <article><h3>NORMALITY IS THE MOST EXPENSIVE PRISON.</h3></article>
        <article><h3>BUILT FOR MINDS THAT CANNOT SLEEP.</h3></article>
        <article><h3>RARE MINDS CREATE DIFFERENT FUTURES.</h3></article>
      </section>

      <section className="vault">
        <aside>
          {VAULT_ENTRIES.map((entry) => (
            <button key={entry.id} className={selectedVault.id === entry.id ? 'active' : ''} onClick={() => setSelectedVault(entry)}>
              {entry.id}
            </button>
          ))}
        </aside>
        <div className="vault-panel">
          <h4>{selectedVault.id}</h4>
          <h5>{selectedVault.title}</h5>
          <p>{selectedVault.body}</p>
        </div>
      </section>

      <section className="network">
        <h3>RARE MINDS NETWORK</h3>
        <p>{mobile ? 'Swipe to move between identity nodes.' : 'Hover identity nodes.'}</p>
        <div className="nodes">
          {['CREATOR', 'FOUNDER', 'ARTIST', 'STRATEGIST', 'VISIONARY', 'BUILDER', 'REBEL'].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </section>
    </main>
  );
}

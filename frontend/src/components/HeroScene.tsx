import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────
// HERO SCENE — the "Himesh universe": glossy planet, orbital
// ring + moon, floating pixels, transparent water bottle with
// sloshing water, camera lens, quantum circuit, and Rocky the
// rock who looks at your cursor. Reacts to pointer + scroll.
// (This is the fallback/dev scene — SplineHero can override it
// by setting SPLINE_SCENE_URL in SplineHero.tsx.)
// ─────────────────────────────────────────────────────────────

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 640;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 5.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.75 : 2));
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    // ── lights: soft sunlight in space ──
    scene.add(new THREE.AmbientLight(0x8fb6e0, 0.55));
    const key = new THREE.DirectionalLight(0xfff2dd, 1.35);
    key.position.set(4, 5, 3);
    scene.add(key);
    const fill = new THREE.PointLight(0x38bdf8, 1.1, 30);
    fill.position.set(-4, -2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x7dd3fc, 0.6);
    rim.position.set(-3, 2, -3);
    scene.add(rim);

    // ── stars ──
    const starCount = small ? 420 : 900;
    const starGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      pos[i * 3 + 2] = -6 - Math.random() * 14;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xbfe3ff, size: 0.045, transparent: true, opacity: 0.9 })
    );
    scene.add(stars);

    // ── planet ──
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 48, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x1d4ed8,
        roughness: 0.32,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.25,
        emissive: 0x0b1d3a,
        emissiveIntensity: 0.5,
      })
    );
    world.add(planet);

    // atmosphere shells
    const atmo1 = new THREE.Mesh(
      new THREE.SphereGeometry(1.32, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.14, side: THREE.BackSide })
    );
    const atmo2 = new THREE.Mesh(
      new THREE.SphereGeometry(1.52, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.06, side: THREE.BackSide })
    );
    world.add(atmo1, atmo2);

    // ── orbital ring + moon ──
    const ringGroup = new THREE.Group();
    ringGroup.rotation.set(1.25, 0, 0.35);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.018, 16, 128),
      new THREE.MeshStandardMaterial({ color: 0xc7d2de, metalness: 0.95, roughness: 0.3 })
    );
    const ringGlow = new THREE.Mesh(
      new THREE.TorusGeometry(1.95, 0.05, 8, 128),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.22 })
    );
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: 0xf4faff, roughness: 0.15, clearcoat: 1 })
    );
    moon.position.set(1.95, 0, 0);
    ringGroup.add(ring, ringGlow, moon);
    world.add(ringGroup);

    // ── floating pixels ──
    const pixelColors = [0x38bdf8, 0x7dd3fc, 0xf4faff, 0x34d399];
    const pixels: THREE.Mesh[] = [];
    const pixelCount = small ? 8 : 14;
    for (let i = 0; i < pixelCount; i++) {
      const s = 0.06 + Math.random() * 0.07;
      const px = new THREE.Mesh(
        new THREE.BoxGeometry(s, s, s),
        new THREE.MeshPhysicalMaterial({
          color: pixelColors[i % pixelColors.length],
          roughness: 0.2,
          clearcoat: 1,
          transparent: true,
          opacity: 0.9,
        })
      );
      px.position.set(
        (Math.random() - 0.5) * 5.6,
        (Math.random() - 0.5) * 3.6,
        (Math.random() - 0.5) * 2.2
      );
      px.userData.phase = Math.random() * Math.PI * 2;
      px.userData.speed = 0.5 + Math.random() * 0.7;
      pixels.push(px);
      world.add(px);
    }

    // ── water bottle (transparent, sloshing water) ──
    const bottle = new THREE.Group();
    bottle.position.set(2.0, 0.75, 0.35);
    const bottleGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.21, 0.23, 0.72, 24, 1, true),
      new THREE.MeshPhysicalMaterial({
        color: 0xdff3ff,
        transmission: 0.92,
        thickness: 0.4,
        roughness: 0.06,
        ior: 1.4,
        transparent: true,
        clearcoat: 1,
        side: THREE.DoubleSide,
      })
    );
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.11, 0.12, 20),
      new THREE.MeshStandardMaterial({ color: 0xc7d2de, metalness: 0.9, roughness: 0.25 })
    );
    cap.position.y = 0.42;
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.19, 0.36, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        roughness: 0.1,
        clearcoat: 0.6,
      })
    );
    water.position.y = -0.14;
    bottle.add(bottleGlass, cap, water);
    world.add(bottle);

    // ── camera lens ──
    const lens = new THREE.Group();
    lens.position.set(-2.0, 0.85, 0.3);
    const lensBody = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.075, 20, 60),
      new THREE.MeshStandardMaterial({ color: 0xc7d2de, metalness: 0.95, roughness: 0.22 })
    );
    const lensGlass = new THREE.Mesh(
      new THREE.CircleGeometry(0.27, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x0a1220,
        roughness: 0.05,
        clearcoat: 1,
        transparent: true,
        opacity: 0.92,
      })
    );
    const glint = new THREE.Mesh(
      new THREE.CircleGeometry(0.05, 24),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.85 })
    );
    glint.position.set(0.08, 0.1, 0.01);
    lens.add(lensBody, lensGlass, glint);
    world.add(lens);

    // ── quantum circuit chip ──
    const chip = new THREE.Group();
    chip.position.set(-1.55, -1.05, -0.5);
    chip.rotation.set(-0.4, 0.5, 0.05);
    const chipBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.6, 0.04),
      new THREE.MeshPhysicalMaterial({
        color: 0x0b132b,
        roughness: 0.3,
        clearcoat: 1,
        transparent: true,
        opacity: 0.85,
      })
    );
    chip.add(chipBase);
    const traceMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    for (let i = 0; i < 3; i++) {
      const trace = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.012, 0.012), traceMat);
      trace.position.set(0, -0.16 + i * 0.16, 0.03);
      chip.add(trace);
    }
    const q1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshPhysicalMaterial({ color: 0xf4faff, clearcoat: 1 })
    );
    q1.position.set(-0.32, 0, 0.04);
    const q2 = q1.clone();
    q2.position.set(0.32, 0, 0.04);
    const photon = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x34d399 })
    );
    chip.add(q1, q2, photon);
    world.add(chip);

    // ── ROCKY ──
    const rocky = new THREE.Group();
    rocky.position.set(0.55, -0.95, 1.35);
    rocky.scale.setScalar(0.5);
    const rockGeo = new THREE.IcosahedronGeometry(0.62, 1);
    const rockPos = rockGeo.attributes.position;
    for (let i = 0; i < rockPos.count; i++) {
      const jitter = 0.86 + Math.random() * 0.24;
      rockPos.setXYZ(i, rockPos.getX(i) * jitter, rockPos.getY(i) * jitter, rockPos.getZ(i) * jitter);
    }
    rockGeo.computeVertexNormals();
    const rockBody = new THREE.Mesh(
      rockGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0xc3d2e3,
        roughness: 0.32,
        metalness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.3,
      })
    );
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0b132b, roughness: 0.15 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), eyeMat);
    eyeL.position.set(-0.19, 0.1, 0.52);
    eyeL.scale.set(1, 1.25, 0.6);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.19;
    const glintL = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xe0f2fe })
    );
    glintL.position.set(-0.16, 0.15, 0.58);
    const glintR = glintL.clone();
    glintR.position.x = 0.22;
    rocky.add(rockBody, eyeL, eyeR, glintL, glintR);
    world.add(rocky);

    // ── interaction state ──
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove);

    let scrollP = 0;
    const onScroll = () => {
      scrollP = Math.min(window.scrollY / window.innerHeight, 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── animation loop ──
    const clock = new THREE.Clock();
    let nextBlink = 2.5;
    let blinkT = 0;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      smooth.x += (pointer.x - smooth.x) * 0.06;
      smooth.y += (pointer.y - smooth.y) * 0.06;

      if (!reduced) {
        world.rotation.y = t * 0.03 + scrollP * 0.9;
        world.position.y = scrollP * 1.5;
        camera.position.z = 5.4 + scrollP * 1.4;
        camera.position.x += (smooth.x * 0.35 - camera.position.x) * 0.05;
        camera.position.y += (smooth.y * 0.25 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        planet.rotation.y += 0.0016;
        ringGroup.rotation.z += dt * 0.25;

        pixels.forEach((px, i) => {
          px.position.y += Math.sin(t * px.userData.speed + px.userData.phase) * 0.0016;
          px.rotation.x += 0.004 + i * 0.0002;
          px.rotation.y += 0.005;
        });

        bottle.position.y = 0.75 + Math.sin(t * 0.9) * 0.07;
        bottle.rotation.z = Math.sin(t * 0.6) * 0.16 + smooth.x * 0.12;
        water.rotation.z = -bottle.rotation.z * 0.55 + Math.sin(t * 1.4) * 0.05;

        lens.rotation.z += 0.004;
        lens.position.y = 0.85 + Math.sin(t * 0.8 + 1) * 0.06;

        chip.rotation.y = 0.5 + Math.sin(t * 0.5) * 0.12;
        const pt = (t * 0.45) % 1;
        photon.position.x = -0.32 + pt * 0.64;

        rocky.position.y = -0.95 + Math.sin(t * 1.1) * 0.07;
        rocky.rotation.y += (smooth.x * 0.7 - rocky.rotation.y) * 0.07;
        rocky.rotation.x += (-smooth.y * 0.4 - rocky.rotation.x) * 0.07;

        // blink
        if (t > nextBlink) {
          blinkT = 0.14;
          nextBlink = t + 3 + Math.random() * 3;
        }
        if (blinkT > 0) {
          blinkT -= dt;
          const s = 0.08;
          eyeL.scale.y = s;
          eyeR.scale.y = s;
        } else {
          eyeL.scale.y = 1.25;
          eyeR.scale.y = 1.25;
        }

        stars.rotation.y = t * 0.004;
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => m.dispose());
        }
      });
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="hero-3d-canvas"
      className="h-full w-full"
      aria-label="Interactive 3D scene — a glossy planet, floating objects and Rocky the rock"
    />
  );
}

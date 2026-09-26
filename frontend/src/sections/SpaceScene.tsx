import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ─────────────────────────────────────────────────────────────
// SPACE SCENE — the cinematic core. Stars, nebulae, a glossy
// toy spaceship, a planet, floating pixels and ROCKY, driven
// by scroll progress (0 → 1). Spline slot included above the
// canvas — a real Spline scene URL replaces this fallback.
// ─────────────────────────────────────────────────────────────

export default function SpaceScene({ progress }: { progress: React.RefObject<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 120);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.75 : 2));
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    // lights — cinematic, cold key + warm planet rim
    scene.add(new THREE.AmbientLight(0x24344e, 1.1));
    const key = new THREE.DirectionalLight(0xcfe9ff, 1.5);
    key.position.set(-4, 6, 4);
    scene.add(key);
    const engineLight = new THREE.PointLight(0x38bdf8, 2.2, 12);
    scene.add(engineLight);

    // ── stars: two parallax layers ──
    const makeStars = (n: number, spread: number, size: number, opacity: number) => {
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() - 0.5) * spread;
        pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.62;
        pos[i * 3 + 2] = -8 - Math.random() * 30;
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return new THREE.Points(
        g,
        new THREE.PointsMaterial({ color: 0xcfe9ff, size, transparent: true, opacity, sizeAttenuation: true })
      );
    };
    const farStars = makeStars(small ? 700 : 1600, 70, 0.05, 0.75);
    const nearStars = makeStars(small ? 180 : 420, 48, 0.09, 0.95);
    scene.add(farStars, nearStars);

    // ── nebulae: soft gradient sprites ──
    const nebulaTexture = (c1: string, c2: string) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      const cx = cv.getContext('2d')!;
      const g = cx.createRadialGradient(128, 128, 10, 128, 128, 128);
      g.addColorStop(0, c1);
      g.addColorStop(0.5, c2);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      cx.fillStyle = g;
      cx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(cv);
    };
    const nebs: THREE.Sprite[] = [];
    const nebSpecs: Array<[string, string, number, number, number, number]> = [
      ['rgba(56,120,240,0.55)', 'rgba(20,40,120,0.22)', 26, -12, 6, -18],
      ['rgba(150,90,250,0.4)', 'rgba(60,30,140,0.16)', 22, 14, -4, -22],
      ['rgba(45,190,230,0.34)', 'rgba(15,70,110,0.14)', 18, 2, 8, -14],
    ];
    for (const [c1, c2, scale, x, y, z] of nebSpecs) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: nebulaTexture(c1, c2),
          transparent: true,
          opacity: 0.6,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      s.scale.setScalar(scale);
      s.position.set(x, y, z);
      nebs.push(s);
      scene.add(s);
    }

    // ── planet + moon ──
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(4.2, 48, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x14507a,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.35,
        emissive: 0x061c2e,
        emissiveIntensity: 0.6,
      })
    );
    planet.position.set(-9, -6.2, -6);
    world.add(planet);
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: 0xcfd8e3, roughness: 0.5 })
    );
    moon.position.set(-4.6, -2.6, -5.5);
    world.add(moon);

    // ── floating pixels ──
    const pixelColors = [0x38bdf8, 0x7dd3fc, 0xf4faff, 0x34d399];
    const pixels: THREE.Mesh[] = [];
    for (let i = 0; i < (small ? 8 : 14); i++) {
      const s = 0.08 + Math.random() * 0.09;
      const px = new THREE.Mesh(
        new THREE.BoxGeometry(s, s, s),
        new THREE.MeshPhysicalMaterial({
          color: pixelColors[i % pixelColors.length],
          roughness: 0.25,
          clearcoat: 1,
          transparent: true,
          opacity: 0.9,
        })
      );
      px.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9, -2 - Math.random() * 8);
      px.userData = { p: Math.random() * 6.28, s: 0.4 + Math.random() * 0.8 };
      pixels.push(px);
      world.add(px);
    }

    // ── the spaceship — glossy toy-like craft ──
    const ship = new THREE.Group();
    const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xe8f0f8, roughness: 0.2, metalness: 0.35, clearcoat: 1 });
    const accent = new THREE.MeshPhysicalMaterial({ color: 0x1668b8, roughness: 0.3, clearcoat: 1 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 1.5, 8, 20), bodyMat);
    body.rotation.z = Math.PI / 2;
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: 0x9fdcff, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.85 })
    );
    cockpit.position.set(0.45, 0.32, 0);
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.5), accent);
    wingL.position.set(-0.35, -0.05, 0.5);
    wingL.rotation.z = -0.18;
    const wingR = wingL.clone();
    wingR.position.z = -0.5;
    wingR.rotation.z = 0.18;
    const engine = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.9, 20),
      new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.65 })
    );
    engine.rotation.z = -Math.PI / 2;
    engine.position.set(-1.25, 0, 0);
    ship.add(body, cockpit, wingL, wingR, engine);
    world.add(ship);

    // ── ROCKY — the real printable Rocky model (GLB from Himesh's STL),
    // with the procedural rock kept as an automatic fallback ──
    const rocky = new THREE.Group();
    const fallback = new THREE.Group();
    const rockGeo = new THREE.IcosahedronGeometry(0.6, 1);
    const rp = rockGeo.attributes.position;
    for (let i = 0; i < rp.count; i++) {
      const j = 0.94 + Math.random() * 0.12;
      rp.setXYZ(i, rp.getX(i) * j, rp.getY(i) * j, rp.getZ(i) * j);
    }
    rockGeo.computeVertexNormals();
    fallback.add(
      new THREE.Mesh(
        rockGeo,
        new THREE.MeshPhysicalMaterial({ color: 0xd7e3ef, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.25 })
      )
    );
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0b132b, roughness: 0.12 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 20), eyeMat);
    eyeL.position.set(-0.21, 0.12, 0.54);
    eyeL.scale.set(1, 1.3, 0.45);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.21;
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xe8f6ff });
    const glintL = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), glintMat);
    glintL.position.set(-0.17, 0.19, 0.62);
    const glintR = glintL.clone();
    glintR.position.x = 0.25;
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.36, 6, 12), new THREE.MeshPhysicalMaterial({ color: 0xc3d2e3, roughness: 0.3, clearcoat: 0.9 }));
    arm.position.set(0.6, 0.3, 0.05);
    arm.rotation.z = -0.9;
    fallback.add(eyeL, eyeR, glintL, glintR, arm);
    rocky.add(fallback);

    // the real model — Himesh's Rocky (textured), swaps in over the fallback
    new GLTFLoader().load(
      '/models/rocky.glb',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scale = 1.55 / Math.max(size.x, size.y, size.z, 0.0001);
        model.scale.setScalar(scale);
        rocky.add(model);
        fallback.visible = false;
      },
      undefined,
      () => {
        // load failed — the procedural Rocky stays visible
      }
    );
    world.add(rocky);
    const rockyLight = new THREE.PointLight(0xdceeff, 2.6, 14);
    rockyLight.position.set(2.2, 2.6, 5.5);
    world.add(rockyLight);
    const rockyFill = new THREE.PointLight(0xbfe3ff, 1.1, 10);
    rockyFill.position.set(-1.5, -1.5, 5);
    world.add(rockyFill);

    // ── THE COMPUTER — the destination. Reveals late in the act; Rocky
    // drifts over and turns toward it. ──
    const computer = new THREE.Group();
    const caseMat = new THREE.MeshPhysicalMaterial({ color: 0x1c344e, roughness: 0.35, clearcoat: 0.8 });
    const monitor = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 0.16), caseMat);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x9fdcff, transparent: true, opacity: 0.3 });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.4), screenMat);
    screen.position.z = 0.09;
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.7, 0.16), caseMat);
    stand.position.y = -1.15;
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.5), caseMat);
    base.position.y = -1.5;
    computer.add(monitor, screen, stand, base);
    computer.position.set(3.6, -0.55, 1.5);
    computer.rotation.y = -0.35;
    computer.scale.setScalar(0.001);
    world.add(computer);
    const screenGlow = new THREE.PointLight(0x7dd3fc, 0, 12);
    screenGlow.position.set(3.6, -0.4, 3);
    world.add(screenGlow);

    // ── sizing ──
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

    // ── animation ──
    const clock = new THREE.Clock();
    const pointer = { x: 0, y: 0 };
    const onPtr = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onPtr);
    let nextBlink = 3;
    let blinkT = 0;
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();
      const p = progress.current ?? 0;

      if (!reduced) {
        // camera drift + pointer parallax
        camera.position.x += (pointer.x * 0.7 + (p - 0.5) * 1.2 - camera.position.x) * 0.04;
        camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, -2);

        // spaceship flies across during the transition
        const shipP = Math.min(Math.max((p - 0.08) / 0.6, 0), 1.15);
        ship.position.set(-9 + shipP * 18, Math.sin(t * 0.6) * 0.4 + 2.4 - shipP * 1.6, 2);
        ship.rotation.z = 0.06 + Math.sin(t * 0.8) * 0.05;
        ship.rotation.y = -0.12;
        engineLight.position.copy(ship.position).x -= 1.3;
        engineLight.intensity = 1.8 + Math.sin(t * 22) * 0.7;
        engine.material.opacity = 0.5 + Math.sin(t * 18) * 0.2;

        // rocky enters midway, floats, looks at viewer, waves — then drifts
        // over beside the computer and turns toward it
        const rIn = Math.min(Math.max((p - 0.38) / 0.25, 0), 1);
        const rTo = Math.min(Math.max((p - 0.7) / 0.3, 0), 1);
        rocky.position.set(
          6.5 - rIn * 6.2 + rTo * 1.5,
          -1.6 + Math.sin(t * 0.9) * 0.22 + rIn * 0.8 + rTo * 0.75,
          3.4 - rTo * 1.2
        );
        rocky.rotation.y += ((rTo > 0.4 ? 0.35 : -0.3 + pointer.x * 0.25) - rocky.rotation.y) * 0.06;
        rocky.rotation.x += ((pointer.y * 0.15) - rocky.rotation.x) * 0.06;
        const waveP = p > 0.45 && p < 0.78 ? Math.sin(t * 5) * 0.5 : 0;
        arm.rotation.z = -0.9 + waveP;

        // the computer reveals at the end of the act
        const cIn = Math.min(Math.max((p - 0.74) / 0.18, 0), 1);
        computer.scale.setScalar(0.001 + cIn * 0.999);
        computer.position.y = -0.55 + Math.sin(t * 0.7) * 0.05;
        screenMat.opacity = 0.2 + cIn * 0.65 + Math.sin(t * 2.2) * 0.06;
        screenGlow.intensity = cIn * 2.4;

        planet.rotation.y = t * 0.02 + p * 0.6;
        moon.position.y = -2.6 + Math.sin(t * 0.3) * 0.3;

        pixels.forEach((px, i) => {
          px.position.y += Math.sin(t * px.userData.s + px.userData.p) * 0.002;
          px.rotation.x += 0.005 + i * 0.0003;
          px.rotation.y += 0.006;
        });

        farStars.rotation.y = t * 0.004 + p * 0.25;
        nearStars.rotation.y = t * 0.007 + p * 0.45;
        nebs.forEach((n, i) => (n.material.rotation = t * 0.01 * (i % 2 === 0 ? 1 : -1)));

        if (t > nextBlink) {
          blinkT = 0.13;
          nextBlink = t + 2.5 + Math.random() * 3;
        }
        if (blinkT > 0) {
          blinkT -= dt;
          eyeL.scale.y = 0.08;
          eyeR.scale.y = 0.08;
        } else {
          eyeL.scale.y = 1.25;
          eyeR.scale.y = 1.25;
        }
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPtr);
      ro.disconnect();
      renderer.dispose();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm.dispose());
        }
      });
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, [progress]);

  return (
    <div ref={mountRef} data-testid="space-scene" className="absolute inset-0 h-full w-full" aria-label="Cinematic space scene with Rocky" />
  );
}

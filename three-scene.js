// ===== 3D BACKGROUND SCENE =====
// A scroll-choreographed WebGL backdrop: a glowing "core" object with orbit
// rings and a starfield, with the camera flying between a fixed viewpoint
// per section as the visitor scrolls the (perfectly normal, readable) HTML
// content in front of it.

import * as THREE from 'three';

const canvas = document.getElementById('bg-canvas');

function supportsWebGL() {
  try {
    const testCanvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

if (!canvas || !supportsWebGL()) {
  document.body.classList.add('no-webgl');
} else {
  runScene();
}

function runScene() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.innerWidth < 700;

  // Order matches the navbar / document order of sections.
  const SECTION_KEYFRAMES = [
    { id: 'home', pos: [0, 0, 9], look: [0, 0, 0], hue: 0.58 },
    { id: 'about', pos: [3.4, 0.8, 7], look: [-0.6, 0.1, 0], hue: 0.55 },
    { id: 'experience', pos: [-3.6, 1.6, 6.4], look: [0.6, 0.1, 0], hue: 0.63 },
    { id: 'projects', pos: [0, 3.4, 7.6], look: [0, -0.4, 0], hue: 0.74 },
    { id: 'skills', pos: [4.2, -1.4, 6], look: [-0.5, 0.3, 0], hue: 0.48 },
    { id: 'education', pos: [-4, -1, 6.5], look: [0.5, 0.2, 0], hue: 0.66 },
    { id: 'contact', pos: [0, 0.4, 10.5], look: [0, 0, 0], hue: 0.58 },
  ];

  let scene, camera, renderer, coreGroup, coreMesh, coreWire, ringGroup, clock;
  let anchors = [];
  const camState = {
    pos: new THREE.Vector3(0, 0, 9),
    look: new THREE.Vector3(0, 0, 0),
    hue: 0.58,
  };
  const mouse = { x: 0, y: 0 };

  init();

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05050f, 0.032);

    camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.AmbientLight(0x203040, 1.4));

    const keyLight = new THREE.PointLight(0xa0d8ff, 3, 30);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x7c5cff, 2, 30);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    buildCore();
    buildOrbitRings();
    buildStarfield();

    clock = new THREE.Clock();
    refreshAnchors();

    window.addEventListener('resize', onResize);
    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', onMouseMove);
    }
    window.addEventListener('load', () => setTimeout(refreshAnchors, 300));

    canvas.classList.add('is-ready');
    animate();
  }

  function buildCore() {
    coreGroup = new THREE.Group();

    const solidGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x0d1b2a,
      emissive: 0xa0d8ff,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.6,
      flatShading: true,
    });
    coreMesh = new THREE.Mesh(solidGeo, solidMat);
    coreGroup.add(coreMesh);

    const wireGeo = new THREE.IcosahedronGeometry(1.75, 1);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xc6e2ff,
      transparent: true,
      opacity: 0.35,
    });
    coreWire = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), wireMat);
    coreGroup.add(coreWire);

    scene.add(coreGroup);
  }

  function buildOrbitRings() {
    ringGroup = new THREE.Group();
    const ringDefs = [
      { radius: 2.6, tilt: [Math.PI / 2.2, 0, 0] },
      { radius: 3.1, tilt: [Math.PI / 3, Math.PI / 4, 0] },
      { radius: 3.6, tilt: [-Math.PI / 5, -Math.PI / 3, 0] },
    ];

    ringDefs.forEach((def, i) => {
      const geo = new THREE.TorusGeometry(def.radius, 0.008, 8, 96);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xa0d8ff,
        transparent: true,
        opacity: 0.28 - i * 0.05,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.set(...def.tilt);
      ring.userData.spinSpeed = 0.05 + i * 0.02;
      ringGroup.add(ring);
    });

    scene.add(ringGroup);
  }

  function buildStarfield() {
    const count = isSmallScreen ? 400 : 1000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(geo, mat));
  }

  function refreshAnchors() {
    anchors = SECTION_KEYFRAMES.map((kf) => {
      const el = document.getElementById(kf.id);
      if (!el) return { ...kf, anchor: 0 };
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      return { ...kf, anchor: top + el.offsetHeight / 2 };
    }).sort((a, b) => a.anchor - b.anchor);
  }

  function computeTarget() {
    const scrollY = window.scrollY;
    if (!anchors.length) return SECTION_KEYFRAMES[0];
    if (scrollY <= anchors[0].anchor) return anchors[0];
    const last = anchors[anchors.length - 1];
    if (scrollY >= last.anchor) return last;

    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (scrollY >= a.anchor && scrollY <= b.anchor) {
        const span = b.anchor - a.anchor || 1;
        const t = (scrollY - a.anchor) / span;
        const eased = t * t * (3 - 2 * t); // smoothstep
        return {
          pos: lerpArr(a.pos, b.pos, eased),
          look: lerpArr(a.look, b.look, eased),
          hue: THREE.MathUtils.lerp(a.hue, b.hue, eased),
        };
      }
    }
    return last;
  }

  function lerpArr(a, b, t) {
    return [
      THREE.MathUtils.lerp(a[0], b[0], t),
      THREE.MathUtils.lerp(a[1], b[1], t),
      THREE.MathUtils.lerp(a[2], b[2], t),
    ];
  }

  function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    refreshAnchors();
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.getElapsedTime();

    const target = computeTarget();
    const damp = 1 - Math.exp(-4 * dt);

    camState.pos.x = THREE.MathUtils.lerp(camState.pos.x, target.pos[0], damp);
    camState.pos.y = THREE.MathUtils.lerp(camState.pos.y, target.pos[1], damp);
    camState.pos.z = THREE.MathUtils.lerp(camState.pos.z, target.pos[2], damp);
    camState.look.x = THREE.MathUtils.lerp(camState.look.x, target.look[0], damp);
    camState.look.y = THREE.MathUtils.lerp(camState.look.y, target.look[1], damp);
    camState.look.z = THREE.MathUtils.lerp(camState.look.z, target.look[2], damp);
    camState.hue = THREE.MathUtils.lerp(camState.hue, target.hue, damp);

    const parallaxX = prefersReducedMotion ? 0 : mouse.x * 0.35;
    const parallaxY = prefersReducedMotion ? 0 : mouse.y * 0.2;
    camera.position.set(
      camState.pos.x + parallaxX,
      camState.pos.y + parallaxY,
      camState.pos.z
    );
    camera.lookAt(camState.look.x, camState.look.y, camState.look.z);

    if (!prefersReducedMotion) {
      coreGroup.rotation.y = elapsed * 0.15;
      coreGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.08;
      coreGroup.position.y = Math.sin(elapsed * 0.6) * 0.15;
      ringGroup.children.forEach((ring, i) => {
        ring.rotation.z += ring.userData.spinSpeed * dt;
      });
    }

    const hueColor = new THREE.Color().setHSL(camState.hue, 0.65, 0.62);
    coreMesh.material.emissive.copy(hueColor);
    coreWire.material.color.copy(hueColor);

    renderer.render(scene, camera);
  }
}

/* ==============================================================
   RANGEBORN — Hero 3D Cowboy Hat
   Built with Three.js (ES module, loaded from CDN)
   - Procedurally modelled hat (lathe crown/brim + band + buckle)
   - Physical leather-style material with generated grain texture
   - Studio three-point lighting + soft PCF shadows
   - Pointer (mouse) + touch drag rotation with inertia
   - Slow continuous auto-rotation when idle
   ============================================================== */

import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

(function initHeroHat() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const container = canvas.parentElement;
  let width = container.clientWidth;
  let height = container.clientHeight;

  /* ---------------- Renderer ---------------- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  /* ---------------- Scene / Camera ---------------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  camera.position.set(0, 0.35, 6.4);

  /* ---------------- Leather grain texture (generated, no external assets) ---------------- */
  function makeLeatherTexture() {
    const size = 512;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#8B5E3C";
    ctx.fillRect(0, 0, size, size);

    // base mottling
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = Math.random() * 14 + 2;
      const shade = Math.random() * 30 - 15;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${139 + shade},${94 + shade},${60 + shade},${Math.random() * 0.18})`;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // fine grain noise
    const imgData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      imgData.data[i] += n;
      imgData.data[i + 1] += n * 0.85;
      imgData.data[i + 2] += n * 0.6;
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function makeRoughnessTexture() {
    const size = 256;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#9a9a9a";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1400; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const v = 120 + Math.random() * 110;
      ctx.fillStyle = `rgba(${v},${v},${v},0.5)`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  const leatherMap = makeLeatherTexture();
  const roughMap = makeRoughnessTexture();

  /* ---------------- Hat group ---------------- */
  const hat = new THREE.Group();
  scene.add(hat);

  // Crown + brim profile, revolved with LatheGeometry
  const profile = [
    new THREE.Vector2(0.0, 1.18),
    new THREE.Vector2(0.16, 1.18),
    new THREE.Vector2(0.5, 1.1),
    new THREE.Vector2(0.62, 0.86),
    new THREE.Vector2(0.64, 0.42),
    new THREE.Vector2(0.6, 0.18),
    new THREE.Vector2(0.66, 0.12),
    new THREE.Vector2(0.86, 0.07),
    new THREE.Vector2(1.55, -0.02),
    new THREE.Vector2(1.68, 0.07),
    new THREE.Vector2(1.62, 0.1)
  ];
  const hatGeo = new THREE.LatheGeometry(profile, 96);
  hatGeo.computeVertexNormals();

  const leatherMaterial = new THREE.MeshPhysicalMaterial({
    map: leatherMap,
    roughnessMap: roughMap,
    roughness: 0.55,
    metalness: 0.04,
    clearcoat: 0.18,
    clearcoatRoughness: 0.55,
    sheen: 0.25,
    sheenColor: new THREE.Color(0xc49a6c),
    color: new THREE.Color(0xffffff),
    side: THREE.DoubleSide
  });

  const hatMesh = new THREE.Mesh(hatGeo, leatherMaterial);
  hatMesh.castShadow = true;
  hatMesh.receiveShadow = true;
  hat.add(hatMesh);

  // Pinched crown crease (two shallow boxes pressed into the top, classic cattleman dent)
  const creaseMat = new THREE.MeshPhysicalMaterial({
    color: 0x6e4a2f,
    roughness: 0.6,
    metalness: 0.05,
    clearcoat: 0.15
  });
  const crease = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 1.3, 1, 1, 1), creaseMat);
  crease.position.y = 1.05;
  crease.castShadow = true;
  hat.add(crease);

  // Gold hat band
  const bandMat = new THREE.MeshPhysicalMaterial({
    color: 0xc49a6c,
    roughness: 0.32,
    metalness: 0.65,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2
  });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.655, 0.1, 24, 96), bandMat);
  band.rotation.x = Math.PI / 2;
  band.position.y = 0.18;
  band.castShadow = true;
  hat.add(band);

  // Small buckle accent on the band
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.05), bandMat);
  buckle.position.set(0.66, 0.18, 0.05);
  buckle.castShadow = true;
  hat.add(buckle);

  hat.scale.setScalar(1.05);
  hat.rotation.x = 0.06;

  /* ---------------- Ground shadow catcher ---------------- */
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.ShadowMaterial({ opacity: 0.45 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -0.06;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  /* ---------------- Lighting (studio three-point + rim) ---------------- */
  const ambient = new THREE.HemisphereLight(0xfff3e0, 0x1a1410, 0.55);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffdfb0, 3.1);
  keyLight.position.set(3.4, 4.6, 3.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.bias = -0.0015;
  keyLight.shadow.radius = 4;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xbcd4ff, 0.55);
  fillLight.position.set(-4, 1.6, 2.4);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xc49a6c, 6, 14, 2);
  rimLight.position.set(-2.4, 1.2, -3);
  scene.add(rimLight);

  const underGlow = new THREE.PointLight(0xc49a6c, 1.4, 8, 2);
  underGlow.position.set(0, -0.8, 1.8);
  scene.add(underGlow);

  /* ---------------- Interaction: pointer + touch drag, inertia, idle auto-rotate ---------------- */
  let dragging = false;
  let prevX = 0, prevY = 0;
  let velX = 0, velY = 0;
  let targetRotY = 0.4, targetRotX = 0.06;
  let idleTimer = 0;
  const AUTO_SPEED = 0.0028;

  function pointerPos(e) {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function onDown(e) {
    dragging = true;
    idleTimer = 0;
    const p = pointerPos(e);
    prevX = p.x; prevY = p.y;
    velX = 0; velY = 0;
  }
  function onMove(e) {
    if (!dragging) return;
    const p = pointerPos(e);
    const dx = p.x - prevX;
    const dy = p.y - prevY;
    prevX = p.x; prevY = p.y;
    velX = dx * 0.0042;
    velY = dy * 0.0042;
    targetRotY += velX;
    targetRotX = THREE.MathUtils.clamp(targetRotX + velY, -0.5, 0.6);
  }
  function onUp() { dragging = false; }

  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  canvas.addEventListener("touchstart", onDown, { passive: true });
  window.addEventListener("touchmove", onMove, { passive: true });
  window.addEventListener("touchend", onUp);

  // gentle parallax toward cursor when idle (desktop only)
  let mouseNX = 0, mouseNY = 0;
  window.addEventListener("pointermove", (e) => {
    mouseNX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  /* ---------------- Resize ---------------- */
  function onResize() {
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", onResize);

  /* ---------------- Render loop ---------------- */
  const clock = new THREE.Clock();
  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    idleTimer += dt;

    if (!dragging) {
      // inertia decay after release
      velX *= 0.94; velY *= 0.94;
      targetRotY += velX;

      // slow continuous auto-rotation once settled
      if (idleTimer > 0.6) targetRotY += AUTO_SPEED * (dt * 60);

      // subtle idle bob + cursor parallax
      hat.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.045;
      targetRotX = THREE.MathUtils.lerp(targetRotX, 0.06 + mouseNY * 0.12, 0.02);
    }

    hat.rotation.y += (targetRotY - hat.rotation.y) * 0.12;
    hat.rotation.x += (targetRotX - hat.rotation.x) * 0.08;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

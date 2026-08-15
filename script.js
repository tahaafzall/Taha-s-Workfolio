// ============================================================
// Custom cursor
// ============================================================
function setupCursor() {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring || window.matchMedia("(hover: none)").matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll("a, button, .tilt-card").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("hover");
      dot.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("hover");
      dot.classList.remove("hover");
    });
  });
}

// ============================================================
// Scroll progress bar
// ============================================================
function setupProgressBar() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;
  function update() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = pct + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// ============================================================
// Reveal-on-scroll
// ============================================================
function setupReveal() {
  const els = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => observer.observe(el));
}

// ============================================================
// Active nav link on scroll
// ============================================================
function setupActiveNav() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".navlink");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((l) => {
        l.classList.toggle("active", l.getAttribute("href") === "#" + id);
      });
    });
  }, { threshold: 0.5, rootMargin: "-80px 0px -40% 0px" });
  sections.forEach((s) => observer.observe(s));
}

// ============================================================
// Certification progress rings
// ============================================================
function setupRings() {
  const rings = document.querySelectorAll(".cert-ring");
  const CIRC = 264; // 2 * PI * 42
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const ring = entry.target;
      const pct = parseInt(ring.dataset.pct, 10);
      const fill = ring.querySelector(".ring-fill");
      const offset = CIRC - (pct / 100) * CIRC;
      requestAnimationFrame(() => { fill.style.strokeDashoffset = offset; });
      observer.unobserve(ring);
    });
  }, { threshold: 0.4 });
  rings.forEach((r) => observer.observe(r));
}

// ============================================================
// Tilt effect on glass cards
// ============================================================
function setupTilt() {
  const cards = document.querySelectorAll(".tilt-card");
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (isTouch) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotY = ((x - cx) / cx) * 6;
      const rotX = -((y - cy) / cy) * 6;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0) rotateY(0)";
    });
  });
}

// ============================================================
// Magnetic buttons — true proximity pull, not just on-hover
// ============================================================
function setupMagnetic() {
  const isTouch = window.matchMedia("(hover: none)").matches;
  if (isTouch) return;

  const items = Array.from(document.querySelectorAll(".magnetic")).map((el) => ({
    el, x: 0, y: 0, tx: 0, ty: 0,
  }));
  const RADIUS = 110;   // how far out the pull starts reaching
  const STRENGTH = 0.5; // how strongly it snaps toward the cursor

  window.addEventListener("mousemove", (e) => {
    items.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < RADIUS) {
        const pull = 1 - dist / RADIUS;
        item.tx = dx * pull * STRENGTH;
        item.ty = dy * pull * STRENGTH;
      } else {
        item.tx = 0;
        item.ty = 0;
      }
    });
  });

  function loop() {
    items.forEach((item) => {
      item.x += (item.tx - item.x) * 0.18;
      item.y += (item.ty - item.y) * 0.18;
      item.el.style.transform = `translate(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px)`;
    });
    requestAnimationFrame(loop);
  }
  loop();
}

// ============================================================
// Three.js hero scene — rotating wireframe icosahedron + particles
// ============================================================
function setupHeroScene() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || typeof THREE === "undefined") return;

  const heroSection = document.querySelector(".hero");
  let width = heroSection.clientWidth;
  let height = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);

  // Wireframe icosahedron
  const geo = new THREE.IcosahedronGeometry(2.1, 1);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00c2ff, wireframe: true, transparent: true, opacity: 0.5 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Inner glow sphere
  const glowGeo = new THREE.IcosahedronGeometry(1.7, 1);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x7fe1ff, wireframe: true, transparent: true, opacity: 0.2 });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glowMesh);

  // Particle field
  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 3.4 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.45 });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  let targetRotX = 0, targetRotY = 0;
  window.addEventListener("mousemove", (e) => {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.6;
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  function resize() {
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener("resize", resize);

  let raf;
  function animate() {
    mesh.rotation.y += 0.0022;
    mesh.rotation.x += 0.0009;
    glowMesh.rotation.y -= 0.0016;
    glowMesh.rotation.x -= 0.0012;
    particles.rotation.y += 0.0006;

    scene.rotation.y += (targetRotY - scene.rotation.y) * 0.03;
    scene.rotation.x += (targetRotX - scene.rotation.x) * 0.03;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }
  animate();
}

// ============================================================
// Resume download — point both resume links at the embedded
// base64 copy so download works with no dependency on file paths
// ============================================================
function setupResumeLinks() {
  if (typeof RESUME_DATA_URI === "undefined") return;
  ["resumeLinkHero", "resumeLinkContact"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = RESUME_DATA_URI;
  });
}

// ============================================================
// In-page anchor links — explicit smooth scroll so nav/CTA
// buttons always work, even in restrictive embedded viewers
// ============================================================
function setupAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    });
  });
}

// ============================================================
// init — each piece wrapped so one failure can't block the rest
// ============================================================
function safeRun(fn, label) {
  try {
    fn();
  } catch (err) {
    console.error(`[site init] ${label} failed:`, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navlinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  safeRun(setupResumeLinks, "resume links");
  safeRun(setupAnchorScroll, "anchor scroll");
  safeRun(setupCursor, "cursor");
  safeRun(setupProgressBar, "progress bar");
  safeRun(setupReveal, "reveal");
  safeRun(setupActiveNav, "active nav");
  safeRun(setupRings, "rings");
  safeRun(setupTilt, "tilt");
  safeRun(setupMagnetic, "magnetic");
  safeRun(setupHeroScene, "hero scene");
});

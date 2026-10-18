(() => {
  const scene = document.querySelector('.cipher-cursor-scene');
  const canvas = document.getElementById('cipher-cursor-canvas');
  const dustCanvas = document.getElementById('cipher-cursor-dust');
  if (!scene || !canvas || !dustCanvas) return;
  const ctx = canvas.getContext('2d');
  const dustCtx = dustCanvas.getContext('2d');
  const logo = new Image();
  logo.src = 'assets/logos/CiPHER%20Logo%20Black.png';

  let w = 0, h = 0, dpr = 1, scale = 1;
  let start = performance.now();
  let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
  let yaw = 0, pitch = 0, velYaw = 0, velPitch = 0;
  let dragging = false, lastX = 0, lastY = 0;
  const particles = [];
  const specks = Array.from({length: 26}, () => ({
    x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + .5,
    phase: Math.random() * Math.PI * 2
  }));

  function resize() {
    const rect = scene.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    [canvas, dustCanvas].forEach(c => {
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      c.style.width = w + 'px';
      c.style.height = h + 'px';
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dustCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = Math.min(w, h) * 0.62;
    buildParticles();
  }

  function buildParticles() {
    particles.length = 0;
    if (!logo.complete || !logo.naturalWidth) return;
    const sample = document.createElement('canvas');
    const sw = 150, sh = Math.max(1, Math.round(sw * logo.naturalHeight / logo.naturalWidth));
    sample.width = sw; sample.height = sh;
    const sctx = sample.getContext('2d', {willReadFrequently:true});
    sctx.drawImage(logo, 0, 0, sw, sh);
    const data = sctx.getImageData(0, 0, sw, sh).data;
    const step = 2;
    for (let y = 0; y < sh; y += step) {
      for (let x = 0; x < sw; x += step) {
        const i = (y * sw + x) * 4;
        if (data[i + 3] > 70 && (data[i] < 100 && data[i + 1] < 100 && data[i + 2] < 100)) {
          const tx = (x / sw - .5) * 1.75;
          const ty = (y / sh - .5) * (1.75 * sh / sw);
          const u = Math.random() * Math.PI * 2, v = Math.acos(2 * Math.random() - 1);
          const r = 1.15 + Math.random() * 1.8;
          particles.push({
            tx, ty,
            sx: r * Math.sin(v) * Math.cos(u),
            sy: r * Math.sin(v) * Math.sin(u),
            sz: r * Math.cos(v),
            delay: Math.random() * .45 + Math.hypot(tx, ty) * .16
          });
        }
      }
    }
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeOutCubic(v) { return 1 - Math.pow(1 - v, 3); }

  scene.addEventListener('pointermove', e => {
    const r = scene.getBoundingClientRect();
    pointerX = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    pointerY = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      velYaw = dx * .008; velPitch = -dy * .008;
      yaw += velYaw; pitch += velPitch;
      lastX = e.clientX; lastY = e.clientY;
    }
  });
  scene.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    scene.classList.add('is-dragging');
    scene.setPointerCapture(e.pointerId);
  });
  function endDrag() { dragging = false; scene.classList.remove('is-dragging'); }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  scene.addEventListener('pointerleave', () => { if (!dragging) { pointerX = 0; pointerY = 0; } });

  function drawDust(t) {
    dustCtx.clearRect(0, 0, w, h);
    specks.forEach(s => {
      dustCtx.globalAlpha = .06 + .16 * Math.abs(Math.sin(t * .8 + s.phase));
      dustCtx.fillStyle = '#000';
      dustCtx.beginPath(); dustCtx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2); dustCtx.fill();
    });
    dustCtx.globalAlpha = 1;
  }

  function frame(now) {
    const t = (now - start) / 1000;
    ctx.clearRect(0, 0, w, h);
    drawDust(t);
    smoothX += (pointerX - smoothX) * .075;
    smoothY += (pointerY - smoothY) * .075;
    if (!dragging) { yaw += velYaw; pitch += velPitch; velYaw *= .94; velPitch *= .94; }
    const intro = clamp(t / 2.4, 0, 1);
    const settle = 1 - easeOutCubic(clamp(t / 5, 0, 1));
    const ry = yaw - smoothX * .62 + Math.sin(t * 1.2) * .45 * settle;
    const rx = pitch - smoothY * .42 + Math.sin(t + 1) * .35 * settle;
    const c = Math.cos(ry), s = Math.sin(ry), cp = Math.cos(rx), sp = Math.sin(rx);
    const cx = w / 2 + smoothX * 7, cy = h / 2 + smoothY * 5;
    const sc = scale;
    const focal = 2.4;
    const faces = [];
    for (const p of particles) {
      const m = easeOutCubic(clamp((intro * 2.05 - p.delay) / 1, 0, 1));
      const X = p.sx + (p.tx - p.sx) * m;
      const Y = p.sy + (p.ty - p.sy) * m;
      const Z = p.sz * (1 - m);
      const x1 = c * X + s * Z;
      const z1 = -s * X + c * Z;
      const y1 = cp * Y - sp * z1;
      const z2 = sp * Y + cp * z1;
      const perspective = focal / (focal + z2);
      const size = Math.max(.8, sc / 150 * 1.05 * (.25 + .75 * m) * perspective);
      const x = cx + x1 * perspective * sc;
      const y = cy + y1 * perspective * sc;
      faces.push({x,y,size,z:z2,alpha:.18 + .82 * m});
    }
    faces.sort((a,b) => a.z - b.z);
    for (const p of faces) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(p.x + p.size * .8, p.y + p.size * 1.05, p.size, p.size);
    }
    for (const p of faces) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#050505';
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  logo.onload = () => { buildParticles(); };
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(frame);
})();
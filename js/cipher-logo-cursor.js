(() => {
  const scene = document.querySelector('.cipher-cursor-scene');
  const canvas = document.getElementById('cipher-cursor-canvas');
  if (!scene || !canvas) return;
  const ctx = canvas.getContext('2d');
  const logo = new Image();
  logo.src = 'assets/logos/CiPHER%20Logo%20Black.png';
  let w = 0, h = 0, dpr = 1, pointerX = 0, pointerY = 0;
  let yaw = 0, pitch = 0, dragYaw = 0, dragPitch = 0;
  let dragging = false, lastX = 0, lastY = 0, lastTime = 0;
  let velYaw = 0, velPitch = 0;
  function resize() {
    const rect = scene.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function draw(now) {
    ctx.clearRect(0, 0, w, h);
    yaw += velYaw; pitch += velPitch;
    if (!dragging) { velYaw *= .94; velPitch *= .94; }
    const targetYaw = pointerX * .48 + dragYaw;
    const targetPitch = -pointerY * .32 + dragPitch;
    yaw += (targetYaw - yaw) * .045;
    pitch += (targetPitch - pitch) * .045;
    if (logo.complete && logo.naturalWidth) {
      const maxW = Math.min(w * .42, 520), maxH = Math.min(h * .68, 520);
      const ratio = Math.min(maxW / logo.naturalWidth, maxH / logo.naturalHeight);
      const iw = logo.naturalWidth * ratio, ih = logo.naturalHeight * ratio;
      const cx = w / 2 + pointerX * 12, cy = h / 2 + pointerY * 9;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.transform(Math.cos(yaw), Math.sin(pitch) * .22, Math.sin(yaw) * .25, Math.cos(pitch), 0, 0);
      // Layer the black mark with a short graphite extrusion for a solid 3D effect.
      ctx.globalAlpha = 1;
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      for (let depth = 12; depth >= 1; depth--) {
        ctx.globalAlpha = 0.10 + (12 - depth) * 0.025;
        ctx.drawImage(logo, -iw / 2 + depth * 0.8, -ih / 2 + depth * 1.1, iw, ih);
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(logo, -iw / 2, -ih / 2, iw, ih);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }
  scene.addEventListener('pointermove', e => {
    const r = scene.getBoundingClientRect();
    pointerX = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    if (dragging) {
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      velYaw = dx * .003; velPitch = -dy * .003;
      dragYaw += velYaw; dragPitch += velPitch;
      lastX = e.clientX; lastY = e.clientY;
    }
  });
  scene.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    scene.classList.add('is-dragging'); scene.setPointerCapture(e.pointerId);
  });
  function endDrag() { dragging = false; scene.classList.remove('is-dragging'); }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
    scene.addEventListener('dblclick', () => document.getElementById('cipher-cursor-reset').click());
  document.getElementById('cipher-cursor-reset').addEventListener('click', () => {
    yaw = pitch = dragYaw = dragPitch = velYaw = velPitch = 0;
  });
  window.addEventListener('resize', resize);
  resize(); logo.onload = () => {}; requestAnimationFrame(draw);
})();
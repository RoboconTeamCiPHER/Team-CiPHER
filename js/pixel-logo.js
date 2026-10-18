/* Pixel-reveal effect that works on a plain HTML page (no Framer runtime required). */
(() => {
  const canvas = document.querySelector('[data-pixel-logo]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  const source = new Image();
  source.src = 'assets/logos/Team%20CiPHER.png';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cols = 76;
  let rows = 26;
  let pixelBuffer;
  let pixelCtx;
  let thresholds = [];
  let progress = reducedMotion ? 1 : 0;
  let animationFrame = 0;
  let startTime = 0;
  let fromProgress = 0;
  let toProgress = 1;
  const duration = 1500;

  function setup() {
    if (!source.naturalWidth || !source.naturalHeight) return;
    rows = Math.max(12, Math.round(cols * source.naturalHeight / source.naturalWidth));
    canvas.width = cols * 6;
    canvas.height = rows * 6;
    canvas.style.aspectRatio = source.naturalWidth + ' / ' + source.naturalHeight;
    pixelBuffer = document.createElement('canvas');
    pixelBuffer.width = cols;
    pixelBuffer.height = rows;
    pixelCtx = pixelBuffer.getContext('2d', { willReadFrequently: true });
    pixelCtx.clearRect(0, 0, cols, rows);
    pixelCtx.drawImage(source, 0, 0, cols, rows);
    thresholds = new Array(cols * rows);
    for (let i = 0; i < thresholds.length; i++) {
      const x = i % cols;
      const y = Math.floor(i / cols);
      const wave = (x / cols) * 0.22 + (y / rows) * 0.14;
      thresholds[i] = Math.min(0.96, Math.max(0.02, Math.random() * 0.72 + wave));
    }
    draw();
    if (!reducedMotion) animateTo(1);
  }

  function draw() {
    if (!pixelCtx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const data = pixelCtx.getImageData(0, 0, cols, rows).data;
    const tileW = canvas.width / cols;
    const tileH = canvas.height / rows;
    const p = Math.max(0, Math.min(1, progress));
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const alpha = data[i * 4 + 3] / 255;
        if (alpha < 0.025 || p < thresholds[i]) continue;
        const local = Math.min(1, (p - thresholds[i]) * 4 + 0.35);
        ctx.globalAlpha = alpha * local;
        ctx.fillStyle = 'rgb(' + data[i * 4] + ',' + data[i * 4 + 1] + ',' + data[i * 4 + 2] + ')';
        ctx.fillRect(Math.floor(x * tileW), Math.floor(y * tileH), Math.ceil(tileW), Math.ceil(tileH));
      }
    }
    ctx.globalAlpha = 1;
    if (p >= 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    }
  }

  function animate(time) {
    const elapsed = Math.min(1, (time - startTime) / duration);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    progress = fromProgress + (toProgress - fromProgress) * eased;
    draw();
    if (elapsed < 1) animationFrame = requestAnimationFrame(animate);
    else animationFrame = 0;
  }

  function animateTo(target) {
    if (!pixelCtx || reducedMotion) {
      progress = target;
      draw();
      return;
    }
    if (animationFrame) cancelAnimationFrame(animationFrame);
    fromProgress = progress;
    toProgress = target;
    startTime = performance.now();
    animationFrame = requestAnimationFrame(animate);
  }

  canvas.addEventListener('pointerenter', () => {
    if (progress >= 1) {
      progress = 0.72;
      draw();
      animateTo(1);
    }
  });
  canvas.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && progress >= 1) {
      event.preventDefault();
      progress = 0.65;
      draw();
      animateTo(1);
    }
  });

  source.addEventListener('load', setup);
  source.addEventListener('error', () => {
    canvas.hidden = true;
    const fallback = document.querySelector('[data-pixel-logo-fallback]');
    if (fallback) fallback.hidden = false;
  });
  if (source.complete && source.naturalWidth) setup();
})();
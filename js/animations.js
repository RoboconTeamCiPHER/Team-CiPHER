/* ==========================================================================
   TEAM CiPHER — animations.js
   Short technical loading sequence, IntersectionObserver scroll reveals,
   gallery lightbox. Respects prefers-reduced-motion throughout.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Loading sequence ---------------- */
  var loader = document.querySelector('.loader');
  if (loader) {
    if (reduceMotion) {
      loader.classList.add('is-hidden');
    } else {
      var lines = loader.querySelectorAll('.loader-line');
      lines.forEach(function (line, i) {
        setTimeout(function () {
          line.classList.add('is-visible');
        }, 180 * i);
      });
      var totalDelay = 180 * lines.length + 420;
      setTimeout(function () {
        loader.classList.add('is-hidden');
      }, totalDelay);
    }
  }

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Hero load-in (single orchestrated moment) ---------------- */
  var hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    window.requestAnimationFrame(function () {
      setTimeout(function () {
        hero.querySelectorAll('[data-reveal]').forEach(function (el) {
          el.classList.add('is-visible');
        });
      }, 60);
    });
  } else if (hero) {
    hero.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Gallery lightbox ---------------- */
  var galleryItems = document.querySelectorAll('.gallery .g-item[data-full]');
  var lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    var lightboxImg = lightbox.querySelector('img');
    var closeBtn = lightbox.querySelector('.lightbox-close');

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('is-open');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        openLightbox(item.getAttribute('data-full'), item.getAttribute('data-alt'));
      });
    });
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }
})();

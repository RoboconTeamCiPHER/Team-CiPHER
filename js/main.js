/* ==========================================================================
   TEAM CiPHER — main.js
   Site-wide data and lightweight dynamic behavior.
   ========================================================================== */

var REPOSITORIES = [
  {
    name: 'AMR-Simulation',
    description: 'ROS 2 + Gazebo simulation of an autonomous mobile robot: SLAM, Nav2, LiDAR and camera-based navigation.',
    language: 'Python',
    url: 'https://github.com/sam-airobotics/amr-simulation'
  },
  {
    name: 'FusionToDescription',
    description: 'Fusion 360 add-in that exports CAD assemblies into ROS-ready robot description packages.',
    language: 'Python',
    url: 'https://github.com/sam-airobotics/FusionToDescription'
  },
  {
    name: 'CURA',
    description: 'Simulation and control software for a healthcare-assistance robot developed for Robofest.',
    language: 'JavaScript',
    url: 'https://github.com/sam-airobotics/cortex'
  }
];

(function () {
  'use strict';

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var slider = document.querySelector('[data-robocon-slider]');
  if (slider) {
    var slides = slider.querySelectorAll('.robocon-slide');
    var dots = slider.querySelectorAll('.robocon-slider-dots button');
    var current = 0;
    var timer;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
        slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }

    function restartTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5500);
    }

    slider.querySelector('.robocon-slider-prev').addEventListener('click', function () {
      showSlide(current - 1);
      restartTimer();
    });

    slider.querySelector('.robocon-slider-next').addEventListener('click', function () {
      showSlide(current + 1);
      restartTimer();
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        restartTimer();
      });
    });

    slider.addEventListener('mouseenter', function () {
      window.clearInterval(timer);
    });

    slider.addEventListener('mouseleave', restartTimer);

    showSlide(0);
    restartTimer();
  }

  var repoRoot = document.querySelector('[data-repo-grid]');
  if (!repoRoot) return;

  repoRoot.innerHTML = REPOSITORIES.map(function (repo) {
    return (
      '<article class="repo-card">' +
      '<h4>' + repo.name + '</h4>' +
      '<p>' + repo.description + '</p>' +
      '<div class="repo-meta"><span>' + repo.language + '</span></div>' +
      '<a class="link-arrow" href="' + repo.url + '" target="_blank" rel="noopener">' +
      'View on GitHub ' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
      '<path d="M5 12h14M13 6l6 6-6 6"/>' +
      '</svg></a>' +
      '</article>'
    );
  }).join('');
})();

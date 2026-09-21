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

/* ==========================================================================
   TEAM CiPHER — main.js
   Site-wide data structures (team roster, repositories) and small
   dynamic behaviors (footer year, empty-state rendering).

   TEAM HISTORY is maintained in team.html. The TEAM_MEMBERS array below
   remains available for individual member profiles and future roster cards.

   HOW TO ADD A TEAM MEMBER
   -------------------------------------------------------------------------
   Add an object to TEAM_MEMBERS below. Nothing else needs to change —
   team.html reads this array and builds the cards automatically.

   {
     name: 'Full Name',
     role: 'Role / Position',           // e.g. 'Team Lead', 'Mechanical Lead'
     domain: 'mechanical',              // 'mechanical' | 'electronics' | 'programming' | 'administration'
     photo: 'assets/images/team/name.jpg', // optional, omit to show placeholder
     linkedin: 'https://linkedin.com/in/...', // optional
     github: 'https://github.com/...'         // optional
   }
   ========================================================================== */

var TEAM_MEMBERS = [
  // No members published yet — add entries above using the schema shown.
];

var REPOSITORIES = [
  {
    name: 'AMR-Simulation',
    description: 'ROS 2 + Gazebo simulation of an autonomous mobile robot: SLAM, Nav2, LiDAR and camera-based navigation.',
    language: 'Python',
    url: 'https://github.com/RoboconTeamCiPHER'
  },
  {
    name: 'FusionToDescription',
    description: 'Fusion 360 add-in that exports CAD assemblies into ROS-ready robot description packages.',
    language: 'Python',
    url: 'https://github.com/RoboconTeamCiPHER'
  },
  {
    name: 'CURA',
    description: 'Dashboard and control software for a healthcare-assistant robot built for Robofest.',
    language: 'JavaScript',
    url: 'https://github.com/RoboconTeamCiPHER'
  }
];

(function () {
  'use strict';

  /* ---- Footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Team roster rendering (team.html) ---- */
  var rosterRoot = document.querySelector('[data-team-roster]');
  if (rosterRoot) {
    if (!TEAM_MEMBERS.length) {
      rosterRoot.innerHTML =
        '<p class="placeholder-note">Member profiles are being added. Check back soon, or see js/main.js to add the team roster.</p>';
    } else {
      var grid = document.createElement('div');
      grid.className = 'team-grid';
      TEAM_MEMBERS.forEach(function (m) {
        var card = document.createElement('article');
        card.className = 'member-card';
        card.innerHTML =
          '<div class="member-photo">' +
          (m.photo ? '<img src="' + m.photo + '" alt="' + m.name + '" loading="lazy">' : 'PHOTO') +
          '</div>' +
          '<div class="member-info">' +
          '<div class="name">' + m.name + '</div>' +
          '<div class="role">' + m.role + '</div>' +
          '<div class="member-links">' +
          (m.linkedin ? '<a href="' + m.linkedin + '" target="_blank" rel="noopener">LinkedIn</a>' : '') +
          (m.github ? '<a href="' + m.github + '" target="_blank" rel="noopener">GitHub</a>' : '') +
          '</div></div>';
        grid.appendChild(card);
      });
      rosterRoot.innerHTML = '';
      rosterRoot.appendChild(grid);
    }
  }

  /* ---- Repository cards (index.html open-source section) ---- */
  var repoRoot = document.querySelector('[data-repo-grid]');
  if (repoRoot) {
    repoRoot.innerHTML = REPOSITORIES.map(function (r) {
      return (
        '<div class="repo-card">' +
        '<h4>' + r.name + '</h4>' +
        '<p>' + r.description + '</p>' +
        '<div class="repo-meta"><span>' + r.language + '</span><span>★ —</span><span>Forks —</span></div>' +
        '<a class="link-arrow" href="' + r.url + '" target="_blank" rel="noopener">View on GitHub ' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>' +
        '</a></div>'
      );
    }).join('');
  }
})();

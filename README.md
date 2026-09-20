# Team CiPHER — Official Website

The public website for **Team CiPHER**, the national-level robotics team at
JSPM's Rajarshi Shahu College of Engineering (RSCOE), Pune.

Plain HTML5 / CSS3 / vanilla JavaScript. No build step, no framework —
open `index.html` directly, or deploy straight to GitHub Pages.

## Structure

```text
team-cipher-website/
│
├── index.html          Homepage — hero, domains, pipeline, projects,
│                        competitions preview, toolchain, research,
│                        laboratory, stats, open source, CTA
├── about.html           Team identity and mission
├── projects.html        Full project grid + per-project detail sections
├── team.html             Domain breakdown + member roster (data-driven)
├── competitions.html     Full competition timeline
├── contact.html          Contact form + direct contact info
│
├── css/
│   ├── style.css         Design tokens, reset, layout, all components
│   ├── animations.css    Keyframes, scroll-reveal, lightbox
│   └── responsive.css    Breakpoint-specific structural adjustments
│
├── js/
│   ├── main.js           Site data (TEAM_MEMBERS, REPOSITORIES) + small
│   │                      dynamic behaviors
│   ├── navigation.js      Sticky nav, mobile menu, active link
│   └── animations.js      Loading sequence, scroll reveal, lightbox
│
└── assets/
    ├── images/
    │   ├── hero/ team/ projects/ competitions/ laboratory/ robots/ events/
    ├── videos/
    ├── logos/
    └── icons/
```

## Before you launch — replace these placeholders

The content follows a strict "no invented facts" rule, so several things are
intentionally left as placeholders:

- **Images.** Every image slot is a labeled placeholder block (e.g. "AMR
  SIMULATION — IMAGE PLACEHOLDER"). Drop real photos/renders into the
  matching `assets/images/<category>/` folder using descriptive filenames
  (e.g. `cipher-robocon-2025.jpg`), then swap the placeholder `<div>` for an
  `<img>` tag (or add the image inside it) using `loading="lazy"` for
  anything below the fold.
- **Team roster.** Open `js/main.js` and add entries to the `TEAM_MEMBERS`
  array — the team page renders cards automatically, no HTML editing
  required.
- **Repositories.** `REPOSITORIES` in `js/main.js` lists real project repos
  with `url: '#'` placeholders — update the URLs (and star/fork counts if
  you want to hardcode them, since GitHub Pages can't safely call the
  GitHub API without a backend).
- **Stats.** The "By the numbers" section on the homepage uses `XX+`
  placeholders on purpose — replace with real, confirmed figures only.
- **Competition results.** Each competition entry has an
  `[ADD ACTUAL COMPETITION RESULT]` marker — replace with the real outcome.
- **Contact details & social links.** `contact.html` and the site footer use
  placeholder email/LinkedIn/Instagram links — update them to the team's
  real accounts.
- **Logo.** `assets/icons/favicon.svg` is a placeholder mark. Replace it
  (and add a full logo file to `assets/logos/`) once the official Team
  CiPHER logo is available, and reference it from the `.nav-logo` markup in
  each page.

## Local preview

No server required — just open `index.html` in a browser. If you want a
local server (useful for testing relative paths exactly as GitHub Pages
will serve them):

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Push this folder's contents to a GitHub repository (e.g.
   `team-cipher/team-cipher-website`), with `index.html` at the repo root
   (or inside `/docs` if you prefer that convention).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a
   branch."
4. Choose the branch (usually `main`) and the folder (`/root` or `/docs`
   depending on where you placed the files), then **Save**.
5. GitHub will publish the site at
   `https://<org-or-username>.github.io/<repo-name>/` within a few
   minutes.
6. Once you have a custom domain, add it under **Settings → Pages → Custom
   domain**, and update `<link rel="canonical">` in each page's `<head>`
   accordingly.

## Editing checklist before going live

- [ ] Replace all image placeholders with real photos/renders
- [ ] Add real team members to `js/main.js`
- [ ] Add real repository URLs to `js/main.js`
- [ ] Replace `XX+` stats with confirmed numbers
- [ ] Fill in competition results
- [ ] Replace contact email and social links (site-wide — appears in every
      page's footer and in `contact.html`)
- [ ] Add the official Team CiPHER logo and favicon
- [ ] Update `<link rel="canonical">` and Open Graph image paths once a
      domain and OG image exist
- [ ] Test keyboard navigation, mobile menu, and `prefers-reduced-motion`
      on a real device

## Notes on design decisions

- **No frameworks.** Everything is hand-written HTML/CSS/JS so the team can
  maintain it without a build pipeline.
- **Content accuracy first.** Nothing here fabricates achievements,
  statistics, member names, or competition results — every uncertain fact
  is a clearly marked placeholder, per the brief this site was built
  against.
- **Team CiPHER is not a department.** The site intentionally describes
  Team CiPHER as an independent, multidisciplinary student team whose lab
  happens to sit inside the Automation and Robotics building — not as a
  department or sub-department of RSCOE.

---

Design. Build. Program. Test. Iterate.

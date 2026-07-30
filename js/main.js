// ============================================================
// Micah Guevarra Portfolio — main.js
// - Reads content from window.SITE_DATA (js/data.js)
// - Renders it into stable containers in index.html
// - Wires up interactivity (nav, scroll-spy, carousel, form)
// ============================================================

// --- Mobile menu toggle (used by inline onclick in navbar) ---
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.SITE_DATA === 'undefined') {
    console.error('SITE_DATA missing — make sure js/data.js loads before main.js');
    return;
  }
  const data = window.SITE_DATA;

  renderNav(data);
  renderHero(data);
  renderSectionTitles(data);
  renderAbout(data);
  renderServices(data);
  renderExperience(data);
  renderSkills(data);
  // Note: renderTestimonials is no longer called — renderFeedback() now
  // owns the testimonials container and merges hard-coded + approved
  // visitor feedback into a single carousel.
  renderFeedback();
  renderProjects(data);
  renderContact(data);
  renderFooter(data);

  // After content is in the DOM, wire up interactivity.
  initMobileMenuClose();
  initNavbarScrollEffect();
  initContactForm();
  initScrollAnimation();
  initActiveNav();
  initProjectsCarousel();
  initAdminMode();

  // Floating AI assistant (talks to the Netlify function).
  if (typeof renderChatbot === 'function') renderChatbot();
});

// ============================================================
// Render helpers
// ============================================================

// --- Logo ---
function renderNav(data) {
  const logo = document.getElementById('navLogo');
  if (logo) logo.innerHTML = `${escapeHtml(data.profile.name)}<span class="text-accent">.</span>`;

  // Desktop nav (links + Resume button)
  const desktop = document.querySelector('[data-nav-desktop]');
  if (desktop) {
    const links = data.navLinks.map(linkHtml(data, 'nav-link')).join('');
    const resume = `
      <a href="${escapeAttr(data.resume.href)}" download class="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-accent transition flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        ${escapeHtml(data.resume.label)}
      </a>`;
    desktop.innerHTML = links + resume;
  }

  // Mobile nav (links + Resume button)
  const mobile = document.querySelector('[data-nav-mobile]');
  if (mobile) {
    const links = data.navLinks.map(linkHtml(data, 'nav-link')).join('');
    const resume = `
      <a href="${escapeAttr(data.resume.href)}" download class="bg-primary text-white px-5 py-2 rounded-full font-medium text-center">${escapeHtml(data.resume.mobileLabel)}</a>`;
    mobile.innerHTML = links + resume;
  }
}

function linkHtml(data, cls) {
  return (item) => `
    <a href="#${escapeAttr(item.id)}" class="${cls} text-gray-600 hover:text-accent transition font-medium">${escapeHtml(item.label)}</a>`;
}

// --- Hero ---
function renderHero(data) {
  setText('[data-hero-badge]', data.profile.badge);
  setText('[data-hero-greeting]', data.profile.greeting);
  setText('[data-hero-name]', data.profile.name);
  setText('[data-hero-role]', data.profile.role);
  setText('[data-hero-tagline]', data.profile.tagline);
  setAttr('[data-hero-portrait]', { src: data.profile.portrait.src, alt: data.profile.portrait.alt });
  setText('[data-hero-portrait-badge-title]', data.profile.portraitBadge.title);
  setText('[data-hero-portrait-badge-subtitle]', data.profile.portraitBadge.subtitle);
}

// --- Section titles / subtitles (uses data-section-title="key") ---
function renderSectionTitles(data) {
  document.querySelectorAll('[data-section-title]').forEach((el) => {
    const key = el.getAttribute('data-section-title');
    if (data[key] && data[key].title) el.textContent = data[key].title;
  });
  document.querySelectorAll('[data-section-subtitle]').forEach((el) => {
    const key = el.getAttribute('data-section-subtitle');
    if (data[key] && data[key].subtitle) el.textContent = data[key].subtitle;
  });
}

// --- About ---
function renderAbout(data) {
  setAttr('[data-about-image]', { src: data.about.image.src, alt: data.about.image.alt });
  setText('[data-about-heading]', data.about.heading);

  const paraContainer = document.querySelector('[data-about-paragraphs]');
  if (paraContainer) {
    paraContainer.innerHTML = data.about.paragraphs
      .map((p) => `<p>${p}</p>`) // already contains <strong> markup from data.js
      .join('');
  }

  const stats = document.querySelector('[data-about-stats]');
  if (stats) {
    stats.innerHTML = data.about.stats
      .map(
        (s) => `
        <div class="bg-gray-50 p-4 rounded-xl text-center">
          <p class="text-3xl font-bold text-accent">${escapeHtml(s.value)}</p>
          <p class="text-gray-500 text-sm">${escapeHtml(s.label)}</p>
        </div>`,
      )
      .join('');
  }
}

// --- Services ---
function renderServices(data) {
  const root = document.querySelector('[data-services]');
  if (!root) return;
  root.innerHTML = data.services.items
    .map(
      (svc) => `
      <div class="card bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 fade-in">
        <div class="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
          <span class="text-3xl">${escapeHtml(svc.icon)}</span>
        </div>
        <h3 class="font-display text-xl font-bold text-primary mb-3">${escapeHtml(svc.title)}</h3>
        <p class="text-gray-500 mb-4">${escapeHtml(svc.description)}</p>
        <ul class="text-gray-600 text-sm space-y-2">
          ${svc.bullets.map((b) => `<li>• ${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>`,
    )
    .join('');
}

// --- Experience ---
function renderExperience(data) {
  const root = document.querySelector('[data-experience]');
  if (!root) return;
  root.innerHTML = data.experience.items
    .map(
      (job) => `
      <div class="card bg-sand p-6 rounded-2xl hover:shadow-lg transition fade-in">
        <div class="flex flex-wrap items-center gap-3 mb-2">
          <span class="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">${escapeHtml(job.dateRange)}</span>
        </div>
        <h3 class="font-display text-xl font-bold text-primary">${escapeHtml(job.role)}</h3>
        <p class="text-accent font-medium mb-2">${escapeHtml(job.company)}</p>
        <p class="text-gray-600">${escapeHtml(job.description)}</p>
      </div>`,
    )
    .join('');
}

// --- Skills ---
function renderSkills(data) {
  const root = document.querySelector('[data-skills]');
  if (!root) return;
  root.innerHTML = data.skills.groups
    .map(
      (group) => `
      <div>
        <h3 class="text-lg font-semibold text-primary mb-4">${escapeHtml(group.heading)}</h3>
        <div class="flex flex-wrap gap-3">
          ${group.items
            .map(
              (item) => `<span class="bg-white px-4 py-2 rounded-full text-gray-600 shadow-sm hover:bg-accent hover:text-white transition cursor-pointer">${escapeHtml(item)}</span>`,
            )
            .join('')}
        </div>
      </div>`,
    )
    .join('');
}

// --- Testimonials ---
function renderTestimonials(data) {
  const root = document.querySelector('[data-testimonials]');
  if (!root) return;
  root.innerHTML = data.testimonials.items
    .map(
      (t) => `
      <div class="card bg-sand p-8 rounded-2xl fade-in">
        <div class="text-accent text-xl mb-4">${'★'.repeat(t.rating)}</div>
        <p class="text-gray-600 mb-6 italic">${escapeHtml(t.quote)}</p>
        <p class="font-semibold text-primary">${escapeHtml(t.author)}</p>
        <p class="text-gray-500 text-sm">${escapeHtml(t.authorMeta)}</p>
      </div>`,
    )
    .join('');
}

// --- Projects (carousel slides + dots) ---
// NOTE: data-stage / data-dots are reused by the testimonials carousel
// above, so we must scope these queries to the projects [data-carousel]
// root — otherwise querySelector() picks up the testimonials section's
// stage and projects get injected into the wrong DOM.
function renderProjects(data) {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const stage = root.querySelector('[data-stage]');
  const dots = root.querySelector('[data-dots]');
  if (!stage || !dots) return;

  stage.innerHTML = data.projects.videos
    .map(
      (v, i) => `
      <article class="carousel-slide absolute inset-0 transition-opacity duration-700" data-slide data-index="${i}">
        <video class="w-full h-full object-cover" src="${escapeAttr(v.src)}" muted autoplay loop playsinline preload="metadata"></video>
        <div class="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-primary/85 to-transparent text-white">
          <h3 class="font-display text-xl font-semibold">${escapeHtml(v.title)}</h3>
          <p class="text-white/85 text-sm">${escapeHtml(v.description)}</p>
        </div>
      </article>`,
    )
    .join('');

  dots.innerHTML = data.projects.videos
    .map(
      (_, i) => `<button class="w-2.5 h-2.5 rounded-full transition" data-dot="${i}" aria-label="Go to reel ${i + 1}"></button>`,
    )
    .join('');
}

// --- Contact ---
function renderContact(data) {
  setText('[data-contact-heading]', data.contact.heading);
  setText('[data-contact-blurb]', data.contact.blurb);

  const success = document.getElementById('formSuccess');
  if (success) success.textContent = data.contact.successMessage;
  const error = document.getElementById('formError');
  if (error) error.textContent = data.contact.errorMessage;

  const form = document.getElementById('contactForm');
  if (form && data.contact.formspreeEndpoint) {
    form.setAttribute('action', data.contact.formspreeEndpoint);
  }

  const root = document.querySelector('[data-contact-methods]');
  if (!root) return;
  root.innerHTML = data.contact.methods
    .map((m) => {
      const inner = `
        <div class="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white">${escapeHtml(m.icon)}</div>
        <span class="text-white">${escapeHtml(m.label)}</span>`;
      if (m.href) {
        const target = m.external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeAttr(m.href)}"${target} class="flex items-center gap-4 bg-white/10 p-4 rounded-xl hover:bg-white/20 transition">${inner}</a>`;
      }
      return `<div class="flex items-center gap-4 bg-white/10 p-4 rounded-xl">${inner}</div>`;
    })
    .join('');
}

// --- Footer ---
function renderFooter(data) {
  setText('[data-footer-copyright]', data.footer.copyright);
  setText('[data-footer-tagline]', data.footer.tagline);
}

// ============================================================
// Interactivity (unchanged from before, just kept tidy)
// ============================================================

function initMobileMenuClose() {
  const menu = document.getElementById('mobileMenu');
  if (!menu) return;
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      requestAnimationFrame(() => menu.classList.add('hidden'));
    });
  });
}

function initNavbarScrollEffect() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;
  const update = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    ticking = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
}

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) contactForm.addEventListener('submit', handleSubmit);
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const success = document.getElementById('formSuccess');
  const error = document.getElementById('formError');
  const submitBtn = form.querySelector('button[type="submit"]');
  const endpoint = form.getAttribute('action');

  // Populate _replyto so Gmail lets you hit Reply directly.
  const replyTo = form.querySelector('#formReplyTo');
  const emailInput = form.querySelector('#formEmail');
  if (replyTo && emailInput) replyTo.value = emailInput.value;

  if (!endpoint) {
    console.error('Form has no action set');
    return;
  }

  // Disable button + show "Sending..." state.
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  if (error) error.classList.add('hidden');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      form.style.display = 'none';
      if (success) success.classList.remove('hidden');
      setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        if (success) success.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }, 5000);
    } else {
      throw new Error(`Formspree responded ${response.status}`);
    }
  } catch (err) {
    console.error('Contact form submit failed:', err);
    if (error) error.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
}

function initScrollAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
}

function initActiveNav() {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  if (!navLinks.length) return;

  const linkBySectionId = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#') && href.length > 1) {
      linkBySectionId.set(href.slice(1), link);
    }
  });

  const sections = Array.from(document.querySelectorAll('section[id]')).filter(
    (s) => linkBySectionId.has(s.id),
  );
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sections.forEach((s) => s.classList.remove('is-visible'));
          entry.target.classList.add('is-visible');
        }
      });
      const visible = sections.filter((s) => s.classList.contains('is-visible'));
      const current = visible[0];

      navLinks.forEach((link) => link.classList.remove('is-active'));
      if (current && linkBySectionId.has(current.id)) {
        linkBySectionId.get(current.id).classList.add('is-active');
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
  );

  sections.forEach((section) => observer.observe(section));
}

// ============================================================
// Generic carousel helper
// ------------------------------------------------------------
// Two modes:
//   mode: 'fade' (default) — slides are layered via position:absolute
//         (Projects). Non-active slides are hidden via .is-active / CSS.
//   mode: 'slide'           — slides are laid out in a flex strip and
//         the strip is translated by -page * (100% / pageCount) (used by
//         the testimonials row). Caller must ensure the slides'
//         container is a flex row; the helper sets slide widths.
//
// Arrows + dots are hidden when only one page exists. Keyboard
// arrows + horizontal swipe work when the root has focus.
// ============================================================

function initCarousel(root, opts = {}) {
  if (!root) return;
  // If this root has been inited before, abort the previous listeners so
  // they don't stack on repeated admin re-renders (Show/Hide/Delete).
  if (root.__carouselAbort) root.__carouselAbort.abort();
  root.__carouselAbort = new AbortController();
  const { signal } = root.__carouselAbort;

  const pageSize = Math.max(1, opts.pageSize || 1);
  const mode = opts.mode === 'slide' ? 'slide' : 'fade';
  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-dot]'));
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  if (!slides.length) return;

  const total = slides.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  let page = 0;

  // For slide mode, each slide is (100% / pageSize) of the stage width,
  // and the strip itself is pageCount * stage wide. We set this on the
  // slides' parent strip rather than on each slide so the layout is
  // computed from a single source of truth.
  const strip = slides[0].parentElement;
  if (mode === 'slide' && strip) {
    // The strip's width is pageCount * 100% of the stage.
    strip.style.width = `${pageCount * 100}%`;
    // Each slide is pageSize-wide of the stage, expressed as a fraction
    // of the strip: (pageCount * 100) / pageSize. (gap is preserved by
    // flex's natural spacing; total = pageSize per stage.)
    const slideWidthPct = (pageCount * 100) / pageSize;
    slides.forEach((s) => {
      s.style.width = `${slideWidthPct}%`;
    });
  }

  // Optional per-slide media handler (Projects uses this for video play/pause).
  // opts.onShow(index) fires whenever the visible page changes.
  const onShow = typeof opts.onShow === 'function' ? opts.onShow : null;

  const show = (i) => {
    page = ((i % pageCount) + pageCount) % pageCount;

    if (mode === 'slide' && strip) {
      // Translate by -page * (100% / pageCount).
      strip.style.transform = `translateX(${(page * -100) / pageCount}%)`;
    }

    slides.forEach((slide, k) => {
      const inPage = Math.floor(k / pageSize) === page;
      slide.classList.toggle('is-active', inPage);
      // Keep non-active pages out of the tab order.
      if (slide.hasAttribute('tabindex')) {
        slide.setAttribute('tabindex', inPage ? '0' : '-1');
      }
    });
    dots.forEach((dot, k) => dot.classList.toggle('is-active', k === page));

    if (onShow) onShow(page);
  };

  // Hide arrows + dots if only one page.
  // Use the HTML `hidden` attribute rather than inline style.display so the
  // carousel's own markup-level `hidden` defaults are respected (the carousel
  // root starts with arrows + dots hidden; setting display='' would defeat
  // the initial state if a previous render had toggled display).
  const arrowsHidden = pageCount <= 1;
  if (prev) prev.hidden = arrowsHidden;
  if (next) next.hidden = arrowsHidden;
  const dotsRow = root.querySelector('[data-dots]');
  if (dotsRow) dotsRow.hidden = arrowsHidden;

  if (prev) prev.addEventListener('click', () => show(page - 1), { signal });
  if (next) next.addEventListener('click', () => show(page + 1), { signal });
  dots.forEach((dot, k) => dot.addEventListener('click', () => show(k), { signal }));

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { show(page - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(page + 1); e.preventDefault(); }
  }, { signal });

  let startX = null;
  root.addEventListener('pointerdown', (e) => { startX = e.clientX; }, { signal });
  root.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) show(page + (dx < 0 ? 1 : -1));
    startX = null;
  }, { signal });
  root.addEventListener('pointercancel', () => { startX = null; }, { signal });

  show(0);
}

function initProjectsCarousel() {
  const root = document.querySelector('[data-carousel]');
  if (!root) return;

  // Pre-collect videos so the onShow callback can pause inactive / play active.
  const slides = Array.from(root.querySelectorAll('[data-slide]'));
  const videos = slides.map((s) => s.querySelector('video'));
  let currentIndex = 0;

  initCarousel(root, {
    pageSize: 1,
    onShow: () => {
      // For per-page slides (pageSize=1), the visible slide index equals the
      // active slide index — derive it from the .is-active class.
      const idx = slides.findIndex((s) => s.classList.contains('is-active'));
      if (idx < 0) return;
      currentIndex = idx;
      videos.forEach((video, k) => {
        if (!video) return;
        try { video.pause(); } catch (_) {}
        if (k === idx) {
          try { video.currentTime = 0; } catch (_) {}
          const p = video.play();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
      });
    },
  });

  // Hover pause/resume (Projects-specific, kept here because it depends on the
  // videos array which isn't part of the generic helper).
  root.addEventListener('mouseenter', () => {
    const v = videos[currentIndex];
    if (v) try { v.pause(); } catch (_) {}
  });
  root.addEventListener('mouseleave', () => {
    const v = videos[currentIndex];
    if (!v) return;
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  });
}

// ============================================================
// Testimonials carousel (3-up sliding, pageSize=3, both public + admin)
// ------------------------------------------------------------
// The strip is a horizontal flex of slides inside [data-stage]. We
// measure the stage's pixel width, set every slide to exactly
// stageWidth/3 minus the gap, and translate the strip by -page*stageWidth
// to slide between pages. Arrows + dots hide when there's only one page.
//
// Why a dedicated helper instead of the generic initCarousel:
//   - The generic helper computes slide widths as percentages of the
//     strip, which compounds incorrectly when the strip is widened to
//     `pageCount * 100%` (each slide becomes pageCount/pageSize of a
//     pageCount-times wider strip = 100% / pageSize of the *strip* —
//     confusing to reason about, easy to break).
//   - Using a fixed pixel width measured off the stage sidesteps the
//     whole percent-of-strip dance: 3 cards always equal 1/3 of the
//     stage regardless of how many pages exist.
// ============================================================
function initTestimonialsCarousel(root, opts = {}) {
  if (!root) return;
  // Reset listeners from a previous init (e.g. admin re-render after
  // Show/Hide/Delete re-renders the strip).
  if (root.__tCarouselAbort) root.__tCarouselAbort.abort();
  root.__tCarouselAbort = new AbortController();
  const { signal } = root.__tCarouselAbort;

  // pageSize is responsive: 1 card on phones (cards would otherwise be
  // ~100px wide and unreadable), 3 cards on tablet/desktop. The breakpoint
  // mirrors the CSS @media (max-width: 640px) rule that compacts card
  // height on phones.
  const basePageSize = Math.max(1, opts.pageSize || 3);
  const pageSize = window.matchMedia && window.matchMedia('(max-width: 640px)').matches
    ? Math.min(basePageSize, 1)
    : basePageSize;
  const GAP = 32; // matches Tailwind gap-8 = 2rem

  const strip = root.querySelector('[data-testimonials]');
  const stage = root.querySelector('[data-stage]');
  const slides = Array.from(strip ? strip.querySelectorAll('[data-slide]') : []);
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  const dotsRow = root.querySelector('[data-dots]');
  if (!strip || !stage || !slides.length) return;

  const total = slides.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  let page = 0;

  // Clear any inline styles a previous init might have left so the
  // measurements below are accurate.
  strip.style.width = '';
  strip.style.transform = '';
  slides.forEach((s) => { s.style.width = ''; });

  // measure() reads stage.clientWidth, applies per-slide widths, sets the
  // strip width to pageCount * stageWidth, and re-shows the current page.
  // We expose it so a ResizeObserver can call it whenever the stage's
  // size changes (which happens after re-renders if the browser hadn't
  // fully laid out the previous frame) — without that, the strip's
  // translateX would point at a stale stageWidth and clicking an arrow
  // would not move the strip correctly until a refresh.
  let stageWidth = 0;
  let slideWidth = 0;

  function measure() {
    const w = Math.max(1, Math.round(stage.clientWidth));
    if (w === stageWidth) return false; // nothing changed, skip work
    stageWidth = w;
    slideWidth = Math.floor((stageWidth - GAP * (pageSize - 1)) / pageSize);
    slides.forEach((s) => { s.style.width = slideWidth + 'px'; });
    strip.style.width = (pageCount * stageWidth) + 'px';
    // Keep the strip pinned to the current page using the new width.
    strip.style.transform = `translateX(${-page * stageWidth}px)`;
    return true;
  }

  // Render dots whenever pageCount changes (so the user can jump).
  function renderDots() {
    if (!dotsRow) return;
    dotsRow.innerHTML = pageCount > 1
      ? Array.from({ length: pageCount }, (_, i) =>
          `<button class="w-2.5 h-2.5 rounded-full transition" data-dot="${i}" aria-label="Go to page ${i + 1}"></button>`,
        ).join('')
      : '';
    dotsRow.hidden = pageCount <= 1;
  }

  function updateArrowVisibility() {
    const hidden = pageCount <= 1;
    if (prev) prev.hidden = hidden;
    if (next) next.hidden = hidden;
    if (dotsRow) dotsRow.hidden = hidden;
  }

  const show = (i) => {
    page = ((i % pageCount) + pageCount) % pageCount;
    if (!stageWidth) measure();
    strip.style.transform = `translateX(${-page * stageWidth}px)`;
    if (dotsRow) {
      Array.from(dotsRow.querySelectorAll('[data-dot]')).forEach((dot, k) => {
        dot.classList.toggle('is-active', k === page);
      });
    }
  };

  renderDots();
  updateArrowVisibility();

  if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); show(page - 1); }, { signal });
  if (next) next.addEventListener('click', (e) => { e.stopPropagation(); show(page + 1); }, { signal });
  if (prev) prev.addEventListener('pointerdown', (e) => e.stopPropagation(), { signal });
  if (next) next.addEventListener('pointerdown', (e) => e.stopPropagation(), { signal });
  if (dotsRow) {
    dotsRow.addEventListener('click', (e) => {
      const t = e.target.closest('[data-dot]');
      if (!t) return;
      const idx = Number(t.getAttribute('data-dot'));
      if (Number.isFinite(idx)) show(idx);
    }, { signal });
  }

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { show(page - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(page + 1); e.preventDefault(); }
  }, { signal });

  let startX = null;
  root.addEventListener('pointerdown', (e) => { startX = e.clientX; }, { signal });
  root.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) show(page + (dx < 0 ? 1 : -1));
    startX = null;
  }, { signal });
  root.addEventListener('pointercancel', () => { startX = null; }, { signal });

  // First measurement + first show happen on the next frame, so the
  // browser has had a chance to lay out the new DOM (slides were just
  // innerHTML-replaced) before we read stage.clientWidth. Without this
  // rAF, the measurement sometimes runs against a stale layout where the
  // stage hasn't been re-sized yet — leaving the strip at the wrong
  // translateX and breaking the arrow buttons until a refresh.
  requestAnimationFrame(() => {
    measure();
    show(0);
  });

  // Re-measure if the stage's size changes after init (window resize,
  // font load shifting card heights, sidebar opens, etc.). Skips work
  // when the width is unchanged, so it's cheap to leave attached.
  if (typeof ResizeObserver !== 'undefined' && stage) {
    const ro = new ResizeObserver(() => { if (measure()) show(page); });
    ro.observe(stage);
    // Tie the observer's lifetime to this init's signal so it doesn't
    // outlive the carousel across re-renders.
    signal.addEventListener('abort', () => ro.disconnect(), { once: true });
  }

  // Window-resize handler (kept for browsers without ResizeObserver and
  // for the responsive pageSize switch at the 640px breakpoint, which
  // ResizeObserver on `stage` alone doesn't cover because the breakpoint
  // is viewport-width-based, not stage-width-based).
  let resizeTimer = null;
  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPageSize = window.matchMedia && window.matchMedia('(max-width: 640px)').matches
        ? Math.min(basePageSize, 1)
        : basePageSize;
      const newPageCount = Math.max(1, Math.ceil(total / newPageSize));
      if (page >= newPageCount) page = newPageCount - 1;
      measure();
      renderDots();
      updateArrowVisibility();
      show(page);
    }, 80);
  };
  window.addEventListener('resize', onResize, { signal });
}

// ============================================================
// Visitor feedback form (backed by /.netlify/functions/feedback)
// ------------------------------------------------------------
// Submissions and admin actions are persisted on the server so every
// visitor sees the same set of approved feedback. localStorage is kept
// only as a small offline cache so the page still renders something
// when the function is unreachable (e.g. file:// testing).
// ============================================================

const FEEDBACK_KEY = 'micah-portfolio-feedback';
const FEEDBACK_CACHE_MAX = 50; // tiny cache, capped
const FEEDBACK_ENDPOINT = '/.netlify/functions/feedback';
let selectedRating = 0;

// --- Server-backed feedback (the source of truth) ---

async function fetchFeedback(opts = {}) {
  // opts.admin = true -> ?view=admin (returns all entries, server requires x-admin-hash)
  const url = FEEDBACK_ENDPOINT + (opts.admin ? '?view=admin' : '');
  const headers = {};
  if (opts.admin && window.ADMIN_CONFIG && window.ADMIN_CONFIG.passwordHash) {
    headers['x-admin-hash'] = window.ADMIN_CONFIG.passwordHash;
  }
  const res = await fetch(url, { method: 'GET', headers });
  if (!res.ok) throw new Error('Feedback fetch failed: ' + res.status);
  const data = await res.json();
  return Array.isArray(data && data.entries) ? data.entries : [];
}

async function submitFeedbackToServer(entry) {
  let res;
  try {
    res = await fetch(FEEDBACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch (networkErr) {
    // True network failure (offline, DNS, mixed content, blocked by an
    // extension, etc). The function call itself never happened.
    throw new Error('Network error reaching ' + FEEDBACK_ENDPOINT + ': ' + networkErr.message);
  }
  if (!res.ok) {
    let msg = 'Submit failed (' + res.status + ').';
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (_) {
      // Non-JSON response (e.g. an HTML error page if a rewrite is
      // intercepting the function URL) — surface enough of the body to
      // diagnose without dumping pages of HTML into the user's status line.
      try {
        const text = await res.text();
        msg = 'Server returned ' + res.status + ' (non-JSON): ' + text.slice(0, 120);
      } catch (_) { /* keep generic */ }
    }
    throw new Error(msg);
  }
  return res.json();
}

async function adminFeedbackAction(action, id) {
  if (!window.ADMIN_CONFIG || !window.ADMIN_CONFIG.passwordHash) {
    throw new Error('Admin not configured.');
  }
  const res = await fetch(FEEDBACK_ENDPOINT + '?action=' + encodeURIComponent(action), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-hash': window.ADMIN_CONFIG.passwordHash,
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    let msg = 'Action failed (' + res.status + ').';
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch (_) { /* keep generic */ }
    throw new Error(msg);
  }
  return res.json();
}

function renderFeedbackAdminFromEntries(entries) {
  // Paint a fresh admin view from a list of entries we already have in
  // hand — no fetch, no cache flash. Used after an admin action returns
  // its updated list, so the change is visible immediately rather than
  // after a second network round-trip.
  const root = document.querySelector('[data-testimonials]');
  const carouselRoot = document.querySelector('[data-testimonials-root]');
  if (!root) return;
  const hardcoded = (window.SITE_DATA && window.SITE_DATA.testimonials && window.SITE_DATA.testimonials.items) || [];
  saveFeedbackCache(entries);
  paintFeedbackAdmin(root, carouselRoot, hardcoded, entries);
}

// --- localStorage cache (offline fallback only) ---

function loadFeedbackCache() {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

function saveFeedbackCache(list) {
  try {
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list.slice(0, FEEDBACK_CACHE_MAX)));
  } catch (_) { /* private mode / disabled */ }
}

function renderStars(container, rating, opts = {}) {
  const interactive = !!opts.interactive;
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'star-btn' + (i <= rating ? ' is-active' : '');
    btn.setAttribute('aria-label', `${i} star${i === 1 ? '' : 's'}`);
    btn.dataset.value = String(i);
    btn.textContent = '★';
    if (interactive) {
      btn.addEventListener('mouseenter', () => previewStars(container, i));
      btn.addEventListener('focus', () => previewStars(container, i));
      btn.addEventListener('click', () => {
        selectedRating = i;
        previewStars(container, i);
      });
    }
    container.appendChild(btn);
  }
  if (interactive) {
    container.addEventListener('mouseleave', () => previewStars(container, selectedRating));
    container.addEventListener('blur', () => previewStars(container, selectedRating), true);
  }
}

function previewStars(container, n) {
  Array.from(container.children).forEach((btn, idx) => {
    btn.classList.toggle('is-active', idx < n);
  });
}

// --- Unified testimonial row (hard-coded + approved visitor feedback) ---
// Public view: only approved visitor feedback mixes with hard-coded.
// Admin view: show all feedback (approved + pending) plus the admin banner,
//            and re-render the row as a vertical list with per-card actions.

// After a re-render (e.g. submit feedback, admin Show/Hide/Delete), freshly
// inserted cards must NOT carry the `.fade-in` class — see buildCardHtml.
// Re-rendered cards are replacing existing content, not revealing fresh
// content on scroll, so the scroll-in animation is meaningless and the
// IntersectionObserver from initScrollAnimation() would never observe them
// anyway. Keeping them out of the fade-in pipeline avoids the "cards
// disappear after action" bug entirely.

// Tracks whether the testimonials strip has been rendered before, so the
// initial page-load render can apply the scroll-in fade-in animation while
// every subsequent re-render skips it. (Re-rendered cards replace existing
// content — animating them in is meaningless and the IntersectionObserver
// from initScrollAnimation() only ran on page load, so animated re-rendered
// cards would never get observed and would stay at opacity:0.)
let testimonialsRendered = false;

function buildCardHtml(item) {
  // item: { kind: 'hardcoded'|'visitor', rating, message, author, authorMeta, ts?, id?, status? }
  // Cards look identical regardless of origin — same stars / quote /
  // author / company line. No "Visitor Feedback" tag.
  // Admin view adds a status pip (approved/pending) to visitor cards so
  // the moderator can triage at a glance; it's only rendered when status
  // is provided (admin context).
  const stars = '★'.repeat(Math.max(0, Math.min(5, Number(item.rating) || 0))) ||
    '<span class="text-gray-400">No rating</span>';
  const meta = escapeHtml(item.authorMeta || '');
  const status = item.status === 'approved' || item.status === 'pending'
    ? `<span class="admin-status-pip" data-status="${escapeAttr(item.status)}"><span class="admin-status-dot"></span>${item.status === 'approved' ? 'Approved' : 'Pending'}</span>`
    : '';
  const statusClass = (item.status === 'approved' || item.status === 'pending') ? ' has-status' : '';

  // Only apply the scroll-in fade-in animation on the initial page-load
  // render. Re-renders (after admin Show/Hide/Delete or feedback submit)
  // replace existing content in place — animating them in is meaningless
  // and they'd never get observed by the IntersectionObserver from
  // initScrollAnimation(), which only ran once on page load.
  const fadeClass = testimonialsRendered ? '' : ' fade-in';
  return `
    <div class="card bg-sand p-8 rounded-2xl${fadeClass} h-full flex flex-col${statusClass}" data-slide data-id="${escapeAttr(item.id || '')}" data-kind="${escapeAttr(item.kind)}"${item.status ? ` data-status="${escapeAttr(item.status)}"` : ''}>
      <div class="flex items-start justify-between gap-3 mb-4">
        <div class="text-accent text-xl">${stars}</div>
        ${status}
      </div>
      <p class="text-gray-600 mb-6 italic flex-1">"${escapeHtml(item.message || '')}"</p>
      <div class="mt-auto">
        <p class="font-semibold text-primary">— ${escapeHtml(item.author || 'Anonymous')}</p>
        ${meta ? `<p class="text-gray-500 text-sm">${meta}</p>` : ''}
      </div>
    </div>`;
}

function renderFeedbackList() {
  const root = document.querySelector('[data-testimonials]');
  const carouselRoot = document.querySelector('[data-testimonials-root]');
  if (!root) return;

  // Public: hard-coded + approved visitor only. Newest first for visitors.
  const hardcoded = (window.SITE_DATA && window.SITE_DATA.testimonials && window.SITE_DATA.testimonials.items) || [];

  // Render ASAP with the localStorage cache so the strip isn't empty while
  // the network request is in flight, then overwrite with the server's view.
  const cache = loadFeedbackCache()
    .filter((f) => f.status === 'approved')
    .map(toVisitorCard);
  paintFeedbackList(root, carouselRoot, hardcoded, cache);

  fetchFeedback()
    .then((entries) => {
      // Keep the cache fresh (only approved — that's all the public sees).
      const approved = entries.filter((f) => f.status === 'approved');
      saveFeedbackCache(approved);
      paintFeedbackList(root, carouselRoot, hardcoded, approved.map(toVisitorCard));
    })
    .catch((err) => {
      console.warn('Feedback fetch failed, using cached list:', err);
    });
}

function toVisitorCard(f) {
  return {
    id: f.id, kind: 'visitor',
    rating: f.rating, message: f.message,
    author: (f.name && f.name.trim()) || 'Anonymous',
    authorMeta: f.authorMeta || '', ts: f.ts,
    // No `status` here on the public site — the server still filters to
    // approved only, so the status field is omitted to keep the markup
    // identical to the pre-server version.
  };
}

function paintFeedbackList(root, carouselRoot, hardcoded, visitorCards) {
  const items = [
    ...hardcoded.map((t) => ({
      kind: 'hardcoded',
      rating: t.rating, message: t.quote,
      author: t.author, authorMeta: t.authorMeta,
    })),
    ...visitorCards,
  ];
  root.innerHTML = items.map(buildCardHtml).join('');
  testimonialsRendered = true;
  if (carouselRoot) initTestimonialsCarousel(carouselRoot, { pageSize: 3 });
}

function renderFeedbackAdmin() {
  const root = document.querySelector('[data-testimonials]');
  const carouselRoot = document.querySelector('[data-testimonials-root]');
  if (!root) return;

  // Admin view = public carousel (3-up sliding) + per-visitor-card actions.
  // Hard-coded + ALL visitor feedback (approved + pending) flow through the
  // same merge logic as the public view, so the layout stays consistent.
  // Only visitor cards get a Show/Hide/Delete action row; hard-coded cards
  // are pinned and cannot be moderated.
  const hardcoded = (window.SITE_DATA && window.SITE_DATA.testimonials && window.SITE_DATA.testimonials.items) || [];

  // Paint immediately with the cache so admin mode shows something even
  // before the server responds.
  const cached = loadFeedbackCache();
  paintFeedbackAdmin(root, carouselRoot, hardcoded, cached);

  fetchFeedback({ admin: true })
    .then((entries) => {
      saveFeedbackCache(entries);
      paintFeedbackAdmin(root, carouselRoot, hardcoded, entries);
    })
    .catch((err) => {
      console.warn('Admin feedback fetch failed:', err);
      const status = document.getElementById('feedbackStatus');
      if (status) {
        status.textContent = "Couldn't reach the feedback server — showing cached list. Admin actions won't persist until it's back.";
        status.className = 'text-sm text-accent';
      }
    });
}

function paintFeedbackAdmin(root, carouselRoot, hardcoded, allVisitor) {
  const sortedVisitor = allVisitor.slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const hardcodedCards = hardcoded.map((t) => buildCardHtml({
    kind: 'hardcoded',
    rating: t.rating, message: t.quote,
    author: t.author, authorMeta: t.authorMeta,
  })).join('');

  const visitorCards = sortedVisitor.map((f) => {
    const base = buildCardHtml({
      id: f.id, kind: 'visitor', status: f.status,
      rating: f.rating, message: f.message,
      author: (f.name && f.name.trim()) || 'Anonymous',
      authorMeta: f.authorMeta || '', ts: f.ts,
    });
    // Inject per-card action row (Show/Hide/Delete) — only on visitor cards.
    const showHide = f.status === 'approved'
      ? `<button type="button" class="admin-action admin-action-hide" data-admin-action="hide" data-id="${escapeAttr(f.id)}">Hide</button>`
      : `<button type="button" class="admin-action admin-action-show" data-admin-action="show" data-id="${escapeAttr(f.id)}">Show</button>`;
    return base.replace(
      '</div>\n    </div>',
      `<div class="admin-card-actions">${showHide}<button type="button" class="admin-action admin-action-delete" data-admin-action="delete" data-id="${escapeAttr(f.id)}">Delete</button></div></div>\n    </div>`
    );
  }).join('');

  root.innerHTML = hardcodedCards + visitorCards;
  testimonialsRendered = true;
  root.classList.remove('is-carousel');

  if (carouselRoot) {
    initTestimonialsCarousel(carouselRoot, { pageSize: 3 });
  }

  // Wire admin action buttons.
  root.querySelectorAll('[data-admin-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-admin-action');
      handleAdminAction(action, id);
    });
  });
}

async function handleAdminAction(action, id) {
  try {
    // The server returns the full updated list in the same response —
    // painting from it skips a second round-trip and avoids the brief
    // stale-cache flash that made the change look like it didn't apply.
    const data = await adminFeedbackAction(action, id);
    const entries = Array.isArray(data && data.entries) ? data.entries : null;
    if (entries) {
      renderFeedbackAdminFromEntries(entries);
    } else {
      renderFeedbackAdmin();
    }
  } catch (err) {
    console.error('Admin action failed:', err);
    const status = document.getElementById('feedbackStatus');
    if (status) {
      status.textContent = "Couldn't reach the feedback server. Try again in a moment.";
      status.className = 'text-sm text-accent';
    }
  }
}

function renderFeedback() {
  // 1. Build the interactive star picker.
  const stars = document.getElementById('feedbackStars');
  if (stars) renderStars(stars, 0, { interactive: true });

  // 2. Render testimonials row (public or admin mode).
  if (isAdminAuthed()) {
    renderFeedbackAdmin();
  } else {
    renderFeedbackList();
  }

  // 3. Wire up the form.
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  const nameInput = document.getElementById('feedbackName');
  const companyInput = document.getElementById('feedbackCompany');
  const messageInput = document.getElementById('feedbackMessage');
  const statusEl = document.getElementById('feedbackStatus');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!statusEl || !submitBtn) return;

    const name = (nameInput && nameInput.value.trim()) || '';
    const company = (companyInput && companyInput.value.trim()) || '';
    const message = (messageInput && messageInput.value.trim()) || '';
    const rating = selectedRating;

    if (!message) {
      statusEl.textContent = 'Please write a short message before submitting.';
      statusEl.className = 'text-sm text-accent';
      messageInput && messageInput.focus();
      return;
    }
    if (!rating) {
      statusEl.textContent = 'Please pick a star rating (1–5).';
      statusEl.className = 'text-sm text-accent';
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Submitting…';

    const payload = {
      name: name.slice(0, 60),
      authorMeta: company.slice(0, 80),
      rating,
      message: message.slice(0, 500),
    };

    submitFeedbackToServer(payload)
      .then(() => {
        statusEl.textContent = 'Thanks! Your feedback is awaiting admin review.';
        statusEl.className = 'text-sm text-green-700';
        // If we're in admin mode, refresh so the new pending entry shows up
        // for moderation immediately.
        if (typeof isAdminAuthed === 'function' && isAdminAuthed()) {
          renderFeedbackAdmin();
        }
      })
      .catch((err) => {
        // Network/server failure — keep a local copy as a best-effort so
        // the visitor can at least see their own feedback locally. It won't
        // be visible to others until the server is reachable again. The full
        // error is logged to the console for diagnosis (open DevTools and
        // look for "Feedback submit failed").
        console.warn('Feedback submit failed, saving locally:', err);
        const list = loadFeedbackCache();
        list.push({
          id: 'fb_local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
          name: payload.name,
          authorMeta: payload.authorMeta,
          rating: payload.rating,
          message: payload.message,
          ts: Date.now(),
          status: 'pending',
        });
        saveFeedbackCache(list);
        const detail = (err && err.message) ? ' (' + err.message + ')' : '';
        statusEl.textContent = "Couldn't reach the server — saved locally for now and will be lost when you close this tab." + detail;
        statusEl.className = 'text-sm text-accent';
      })
      .finally(() => {
        // Reset form + clear stars regardless of success/failure.
        form.reset();
        selectedRating = 0;
        if (stars) previewStars(stars, 0);
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        setTimeout(() => {
          if (statusEl.textContent && statusEl.textContent.startsWith('Thanks')) {
            statusEl.textContent = '';
            statusEl.className = 'text-sm text-gray-500';
          }
        }, 5000);
      });
  });
}

// ============================================================
// Tiny DOM helpers (avoid pulling in a library for this)
// ============================================================

function setText(selector, value) {
  const el = document.querySelector(selector);
  if (el && value != null) el.textContent = value;
}

function setAttr(selector, attrs) {
  const el = document.querySelector(selector);
  if (!el) return;
  Object.entries(attrs).forEach(([k, v]) => {
    if (v != null) el.setAttribute(k, v);
  });
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

// ============================================================
// Admin mode (hidden feature for moderation of visitor feedback)
// ------------------------------------------------------------
// Trigger: triple-click (3 clicks within 600ms) on the hero name span
//   <span data-hero-name>Micah</span>.
// Auth: SHA-256 of the entered password is compared in constant time to
//   window.ADMIN_CONFIG.passwordHash. Auth persists for 30 minutes.
// ============================================================

function isAdminAuthed() {
  if (typeof window === 'undefined' || !window.ADMIN_CONFIG) return false;
  try {
    const raw = localStorage.getItem(window.ADMIN_CONFIG.authStorageKey);
    if (!raw) return false;
    const expiresAt = Number(raw);
    if (!Number.isFinite(expiresAt)) return false;
    return Date.now() < expiresAt;
  } catch (_) {
    return false;
  }
}

function setAdminAuthed(flag) {
  if (typeof window === 'undefined' || !window.ADMIN_CONFIG) return;
  try {
    if (flag) {
      const expiresAt = Date.now() + window.ADMIN_CONFIG.authTtlMs;
      localStorage.setItem(window.ADMIN_CONFIG.authStorageKey, String(expiresAt));
    } else {
      localStorage.removeItem(window.ADMIN_CONFIG.authStorageKey);
    }
  } catch (_) { /* private mode / disabled */ }
}

// Constant-time string compare (avoid timing attacks on the hash).
function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function sha256Hex(text) {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback (older browsers): compute via a synchronous JS SHA-256.
  return sha256HexSync(text);
}

// Minimal synchronous SHA-256 (RFC 6234) used as a fallback when Web Crypto
// isn't available. ~100 lines; matches Node's crypto.createHash('sha256').
function sha256HexSync(text) {
  function rr(n, x) { return (x >>> n) | (x << (32 - n)); }
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const bytes = new TextEncoder().encode(text);
  const len = bytes.length;
  const bitLen = len * 8;
  const padLen = (len + 9 + 63) & ~63;
  const padded = new Uint8Array(padLen);
  padded.set(bytes);
  padded[len] = 0x80;
  // Append length in bits as 64-bit big-endian.
  const view = new DataView(padded.buffer);
  view.setUint32(padLen - 4, bitLen & 0xffffffff);
  // (We only support messages < 2^32 bits, which is fine for a password.)

  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const W = new Uint32Array(64);

  for (let chunk = 0; chunk < padLen; chunk += 64) {
    for (let i = 0; i < 16; i++) W[i] = view.getUint32(chunk + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rr(7, W[i-15]) ^ rr(18, W[i-15]) ^ (W[i-15] >>> 3);
      const s1 = rr(17, W[i-2]) ^ rr(19, W[i-2]) ^ (W[i-2] >>> 10);
      W[i] = (W[i-16] + s0 + W[i-7] + s1) >>> 0;
    }
    let [a,b,c,d,e,f,g,h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rr(6, e) ^ rr(11, e) ^ rr(25, e);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
      const S0 = rr(2, a) ^ rr(13, a) ^ rr(22, a);
      const mj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + mj) >>> 0;
      h = g; g = f; f = e;
      e = (d + t1) >>> 0;
      d = c; c = b; b = a;
      a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }
  return H.map((x) => x.toString(16).padStart(8, '0')).join('');
}

// --- Modal markup (injected on demand) ---
let adminModalOpen = false;
let lastFocusedBeforeModal = null;

function ensureAdminModal() {
  let backdrop = document.getElementById('admin-modal-backdrop');
  if (backdrop) return backdrop;
  backdrop = document.createElement('div');
  backdrop.id = 'admin-modal-backdrop';
  backdrop.className = 'admin-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'admin-modal-title');
  backdrop.innerHTML = `
    <div class="admin-modal">
      <h3 id="admin-modal-title" class="font-display text-xl font-bold text-primary mb-2">Admin unlock</h3>
      <p class="text-sm text-gray-500 mb-4">Enter the admin password to moderate visitor feedback.</p>
      <label class="block text-gray-700 font-medium mb-2 text-sm" for="admin-modal-password">Password</label>
      <input id="admin-modal-password" type="password" autocomplete="off"
        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition bg-white"
        placeholder="••••••••">
      <p id="admin-modal-error" class="text-sm text-accent mt-2 hidden" aria-live="polite"></p>
      <div class="flex items-center justify-end gap-2 mt-5">
        <button type="button" class="admin-modal-cancel" data-admin-modal-cancel>Cancel</button>
        <button type="button" class="admin-modal-submit" data-admin-modal-submit>Unlock</button>
      </div>
    </div>`;
  document.body.appendChild(backdrop);

  // Close handlers.
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeAdminModal();
  });
  backdrop.querySelector('[data-admin-modal-cancel]').addEventListener('click', closeAdminModal);
  backdrop.querySelector('[data-admin-modal-submit]').addEventListener('click', submitAdminPassword);
  backdrop.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeAdminModal(); e.preventDefault(); }
    if (e.key === 'Enter')  { submitAdminPassword(); e.preventDefault(); }
  });
  return backdrop;
}

function openAdminModal() {
  if (adminModalOpen) return;
  const backdrop = ensureAdminModal();
  const input = backdrop.querySelector('#admin-modal-password');
  const err = backdrop.querySelector('#admin-modal-error');
  err.classList.add('hidden');
  err.textContent = '';
  input.value = '';
  backdrop.classList.add('is-open');
  adminModalOpen = true;
  lastFocusedBeforeModal = document.activeElement;
  // Slight delay so the transition can play before focus moves.
  setTimeout(() => input.focus(), 30);
}

function closeAdminModal() {
  const backdrop = document.getElementById('admin-modal-backdrop');
  if (!backdrop) return;
  backdrop.classList.remove('is-open');
  adminModalOpen = false;
  if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
    lastFocusedBeforeModal.focus();
  }
}

async function submitAdminPassword() {
  const backdrop = document.getElementById('admin-modal-backdrop');
  if (!backdrop) return;
  const input = backdrop.querySelector('#admin-modal-password');
  const err = backdrop.querySelector('#admin-modal-error');
  const value = (input.value || '').trim();

  if (!window.ADMIN_CONFIG || !window.ADMIN_CONFIG.passwordHash) {
    err.textContent = 'Admin is not configured.';
    err.classList.remove('hidden');
    return;
  }
  if (!value) {
    err.textContent = 'Password required.';
    err.classList.remove('hidden');
    input.focus();
    return;
  }

  const hash = await sha256Hex(value);
  if (constantTimeEqual(hash.toLowerCase(), window.ADMIN_CONFIG.passwordHash.toLowerCase())) {
    setAdminAuthed(true);
    setAdminModeUI(true);
    closeAdminModal();
    renderFeedbackAdmin(); // switch to admin view
  } else {
    err.textContent = 'Incorrect password.';
    err.classList.remove('hidden');
    input.select();
  }
}

function setAdminModeUI(on) {
  // The navbar logo doubles as the admin-mode indicator. In public mode
  // it's "micah." (rendered by renderNav with an accent-colored period).
  // In admin mode it becomes "micah.admin" with the same accent treatment,
  // and an "Exit admin" pill appears right next to it so the moderator
  // can leave admin mode from anywhere on the page without scrolling back
  // to the testimonials section.
  const logo = document.getElementById('navLogo');
  if (!logo) return;
  const name = (window.SITE_DATA && window.SITE_DATA.profile && window.SITE_DATA.profile.name) || 'micah';
  logo.innerHTML = on
    ? `${escapeHtml(name)}<span style="color:#16213E;font-weight:700;">.admin</span><button type="button" data-nav-admin-exit class="text-xs font-sans font-semibold px-3 py-1 rounded-full bg-primary text-white hover:bg-accent transition ml-1">Exit admin</button>`
    : `${escapeHtml(name)}<span class="text-accent">.</span>`;

  // The Exit pill is built dynamically inside <a href="#home">, so we
  // attach its click handler directly and stop propagation to keep the
  // anchor's navigation from firing.
  if (on) {
    const exitBtn = logo.querySelector('[data-nav-admin-exit]');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        exitAdminMode();
      });
    }
  }
}

function exitAdminMode() {
  setAdminAuthed(false);
  setAdminModeUI(false);
  renderFeedbackList(); // back to public view
}

function initAdminMode() {
  // 1. Triple-click trigger on the hero "Micah" name.
  const trigger = document.querySelector('[data-hero-name]');
  if (!trigger) return;
  let clickTimes = [];
  trigger.addEventListener('click', (e) => {
    const now = Date.now();
    clickTimes = clickTimes.filter((t) => now - t < 600);
    clickTimes.push(now);
    if (clickTimes.length >= 3) {
      clickTimes = [];
      e.preventDefault();
      openAdminModal();
    }
  });
  // Make the trigger look interactive (subtle cursor hint, no UI change).
  trigger.style.cursor = 'default';

  // 2. Exit-admin button — the nav logo pill binds its own click handler
  // (see setAdminModeUI) so we don't need a delegated handler here.
  // [data-admin-exit] used to live in a now-removed testimonials banner
  // and is kept as a no-op for backward compatibility if that element ever
  // returns.

  // 3. If already authed from a previous session (within TTL), reflect that
  // in the hero UI (the testimonials strip is already in admin mode via
  // renderFeedback's isAdminAuthed check).
  setAdminModeUI(isAdminAuthed());
}
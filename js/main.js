/* ============================================================
   morganyoungblood.com — main.js
   Field Mode toggle + scroll reveals + nav behavior
   ============================================================ */

(function () {
  'use strict';

  /* ── Field Mode ── */
  const FIELD_KEY = '`'; // backtick — easy to find, unlikely to be accidental
  let fieldActive = false;

  function toggleFieldMode() {
    fieldActive = !fieldActive;
    document.body.classList.toggle('field-mode', fieldActive);

    if (fieldActive) {
      animateCoordsTyped();
      showFieldToast();
    } else {
      resetCoords();
    }

    // Persist across page navigation within session
    sessionStorage.setItem('fieldMode', fieldActive);
  }

  // Restore on load
  window.addEventListener('DOMContentLoaded', function () {
    if (sessionStorage.getItem('fieldMode') === 'true') {
      fieldActive = true;
      document.body.classList.add('field-mode');
    }
  });

  // Keypress trigger
  document.addEventListener('keydown', function (e) {
    if (e.key === FIELD_KEY && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Don't fire if user is typing in an input
      if (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA') return;
      toggleFieldMode();
    }
  });

  // Click triggers (footer + hero)
  document.addEventListener('DOMContentLoaded', function () {
    const trigger = document.getElementById('field-trigger');
    if (trigger) trigger.addEventListener('click', toggleFieldMode);
    const heroTrigger = document.getElementById('hero-field-trigger');
    if (heroTrigger) heroTrigger.addEventListener('click', toggleFieldMode);
  });

  /* ── Coords type-in animation (field mode only) ── */
  function animateCoordsTyped() {
    const el = document.querySelector('.hero-coords');
    if (!el) return;
    const target = '19.9083°N  155.0916°W  //  elev: sea_level  //  sys: nominal';
    el.textContent = '';
    el.classList.add('typed');
    let i = 0;
    const interval = setInterval(function () {
      el.textContent += target[i];
      i++;
      if (i >= target.length) clearInterval(interval);
    }, 28);
  }

  function resetCoords() {
    const el = document.querySelector('.hero-coords');
    if (!el) return;
    el.classList.remove('typed');
    el.textContent = '19.9083° N   155.0916° W';
  }

  /* ── Field Mode toast ── */
  function showFieldToast() {
    const existing = document.getElementById('field-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'field-toast';
    toast.style.cssText = `
      position: fixed;
      top: 72px;
      right: 24px;
      background: #272822;
      border: 1px solid #3E3D32;
      color: #66D9E8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      padding: 0.6rem 1rem;
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    toast.textContent = '// field_mode: active';
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      setTimeout(function () {
        toast.style.opacity = '0';
        setTimeout(function () { toast.remove(); }, 400);
      }, 2200);
    });
  }

  /* ── Scroll reveal ── */
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      revealObserver.observe(el);
    });
  });

  /* ── Sticky nav shadow on scroll ── */
  window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });

  /* ── Mobile nav toggle ── */
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  });

  /* ── Stagger reveal for cards ── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.research-card, .repo-card, .credential-item').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.06) + 's';
    });
  });

})();

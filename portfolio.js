/* ==========================================================================
   Jeong Jiwoo — Portfolio Scripts
   Minimal, fast, zero gimmicks.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Theme (Light Editorial Default / Deep Slate Dark Toggle) ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('jw_theme_v2');
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  } else {
    root.setAttribute('data-theme', 'light');
  }

  function paintThemeLabel() {
    if (!themeBtn) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = isDark
      ? '<i class="ri-sun-line"></i><span>Light mode</span>'
      : '<i class="ri-moon-line"></i><span>Dark mode</span>';
  }
  paintThemeLabel();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('jw_theme_v2', next);
      paintThemeLabel();
    });
  }

  /* ---------- Subtle Cursor Spotlight ---------- */
  const spot = document.querySelector('.spotlight');
  if (spot && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener(
      'mousemove',
      (e) => {
        spot.style.setProperty('--cx', `${e.clientX}px`);
        spot.style.setProperty('--cy', `${e.clientY}px`);
      },
      { passive: true }
    );
  }

  /* ---------- Growing-Line Scrollspy ---------- */
  const navLinks = Array.from(document.querySelectorAll('.side-nav a'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function updateActiveNav() {
    const scrollBottom = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    let currentId = sections[0] ? sections[0].id : '';

    if (scrollBottom >= docHeight - 24 && sections.length) {
      currentId = sections[sections.length - 1].id;
    } else {
      const triggerY = window.scrollY + 180;
      for (const sec of sections) {
        if (sec.offsetTop <= triggerY) currentId = sec.id;
      }
    }

    navLinks.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${currentId}`);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- Inline Project Detail Accordion ---------- */
  document.querySelectorAll('.entry__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('aria-controls');
      const panel = targetId ? document.getElementById(targetId) : null;
      if (!panel) return;
      const open = panel.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.innerHTML = open
        ? '<span>상세 접기</span><i class="ri-subtract-line"></i>'
        : '<span>구현 상세 보기</span><i class="ri-add-line"></i>';
    });
  });

  /* ---------- One-click Copy + Toast ---------- */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2000);
  }

  function copyValue(text, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => showToast(`${label} 복사됨 · ${text}`),
        () => fallbackCopy(text, label)
      );
    } else {
      fallbackCopy(text, label);
    }
  }
  function fallbackCopy(text, label) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`${label} 복사됨 · ${text}`);
    } catch (e) {
      showToast('복사하지 못했습니다');
    }
    document.body.removeChild(ta);
  }

  document.querySelectorAll('[data-copy]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      copyValue(el.getAttribute('data-copy'), el.getAttribute('data-copy-label') || '내용');
    });
  });

  /* ---------- Current Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

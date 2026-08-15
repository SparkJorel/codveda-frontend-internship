/* ============================================================
   Codveda Technologies — Landing page interactions
   Level 1 · Task 1
   Vanilla JS, no dependencies. Everything degrades gracefully:
   the page is fully readable and navigable with JS disabled.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Mobile navigation ---------- */
  var head = document.getElementById('siteHead');
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    head.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    // Lock the page behind the overlay so the body doesn't scroll under it.
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (burger && nav && head) {
    burger.addEventListener('click', function () {
      setMenu(!head.classList.contains('nav-open'));
    });

    // Any in-page link closes the overlay before the smooth scroll runs.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && head.classList.contains('nav-open')) {
        setMenu(false);
        burger.focus();
      }
    });

    // Returning to desktop width must never leave the body scroll-locked.
    window.matchMedia('(min-width: 62.5em)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- 2. Sticky header + scroll progress bar ---------- */
  var progress = document.getElementById('scrollProgress');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;

    if (head) head.classList.toggle('is-stuck', y > 24);

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  /* ---------- 3. Scroll-triggered reveals ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');

  // Stagger siblings inside a group so grids cascade instead of popping.
  Array.prototype.forEach.call(revealables, function (el) {
    var siblings = el.parentElement ? el.parentElement.children : [];
    el.style.setProperty('--i', Array.prototype.indexOf.call(siblings, el));
  });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealables, function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- 4. Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;

    if (reduceMotion) {
      el.textContent = String(target);
      return;
    }

    var duration = 1400;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var p = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast out of the gate, settles precisely on the value.
      var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
  }

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(counters, countUp);
  } else {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    Array.prototype.forEach.call(counters, function (el) {
      countObserver.observe(el);
    });
  }

  /* ---------- 5. Smooth scrolling fallback ---------- */
  // Modern browsers handle this via `scroll-behavior: smooth`; this keeps
  // older engines consistent and applies the header offset either way.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute('href');
    if (!id || id === '#') return;

    var target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });

    // Keep the URL and focus in sync so keyboard users land in the section.
    history.pushState(null, '', id);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- 6. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();

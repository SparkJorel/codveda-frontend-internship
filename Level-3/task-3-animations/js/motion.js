/* ============================================================
   Codveda Technologies — Advanced animations
   Level 3 · Task 3

   Built on GSAP 3 with ScrollTrigger.

   Three rules the whole file follows:

   1. Only `transform` and `opacity` are animated. Both are handled by
      the compositor, so no frame triggers layout or paint.
   2. Every animation is registered inside a `gsap.matchMedia()` context
      keyed on `prefers-reduced-motion`. When motion is off, GSAP reverts
      every tween and clears every trigger — nothing is left running.
   3. Content is visible by default in the CSS. GSAP hides it just before
      animating, so a failed CDN or blocked script leaves a readable page
      rather than a blank one.
   ============================================================ */
(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) {
    // The page stays fully readable — nothing was hidden by CSS.
    console.warn('GSAP failed to load; the page renders without animation.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();
  var toggle = document.getElementById('motionToggle');
  var label = document.getElementById('motionLabel');

  /* ---------- Visitor override ----------
     The OS setting is respected by default, but a visitor may want to stop
     the motion on this page alone. Forcing the media query lets one switch
     control both paths. */
  var forced = null; // null = follow the OS

  function motionAllowed() {
    if (forced !== null) return forced;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ============================================================
     Animations — registered per motion preference
     ============================================================ */
  function register() {
    mm.revert(); // tear down anything from a previous pass

    if (!motionAllowed()) {
      // Reduced motion: clear inline styles so everything sits in its
      // final, readable state.
      gsap.set('[data-hero], .word, .card, .step, [data-reveal], .mark', {
        clearProps: 'all',
      });
      paintCountersInstantly();
      updateProgressBarStatically();
      return;
    }

    mm.add('(min-width: 0px)', function () {
      /* ---------- 1. Hero entrance timeline ---------- */
      var hero = gsap.timeline({ defaults: { ease: 'power3.out' } });

      hero
        .from('.hero .eyebrow', { y: 12, opacity: 0, duration: 0.5 })
        .from('.word', { yPercent: 110, duration: 0.75, stagger: 0.08 }, '-=0.25')
        .from('.hero__lede', { y: 14, opacity: 0, duration: 0.55 }, '-=0.35')
        .from('.hero__actions', { y: 14, opacity: 0, duration: 0.5 }, '-=0.4')
        .from('.mark', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.35');

      /* ---------- 2. The logo shapes drift ---------- */
      // Each mark gets its own duration so they never sync into a pulse.
      gsap.utils.toArray('[data-float]').forEach(function (mark, i) {
        gsap.to(mark, {
          y: i % 2 === 0 ? -14 : 14,
          duration: 2.4 + i * 0.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });

      /* ---------- 3. Section headings reveal ---------- */
      gsap.utils.toArray('[data-reveal]').forEach(function (el) {
        gsap.from(el, {
          y: 16,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });

      /* ---------- 4. Staggered card grid ----------
         One trigger and one timeline for the whole grid rather than six
         separate observers. */
      gsap.from('#cardGrid .card', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '#cardGrid', start: 'top 80%', once: true },
      });

      /* ---------- 5. Pinned, scrubbed timeline ----------
         The showpiece. The section pins and the scrollbar becomes the
         playhead: `scrub` ties progress to scroll position, so the
         sequence plays backwards when the visitor scrolls up. */
      var steps = gsap.utils.toArray('#steps .step');
      var stepLabel = document.getElementById('pinStep');

      var pinned = gsap.timeline({
        scrollTrigger: {
          trigger: '.pin',
          start: 'top top',
          end: '+=' + steps.length * 320,
          pin: '.pin__inner',
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: function (self) {
            var index = Math.min(
              steps.length - 1,
              Math.floor(self.progress * steps.length)
            );
            var next = String(index + 1).padStart(2, '0');
            if (stepLabel.textContent !== next) stepLabel.textContent = next;
          },
        },
      });

      steps.forEach(function (step, i) {
        pinned
          .to(step, { opacity: 1, x: 0, duration: 0.4 }, i * 0.5)
          .to(step, { opacity: 0.25, duration: 0.3 }, i * 0.5 + 0.4);
      });
      // The last card stays lit rather than fading out into nothing.
      pinned.to(steps[steps.length - 1], { opacity: 1, duration: 0.2 });

      /* ---------- 6. Tweened counters ----------
         GSAP tweens a plain object and the number is written each frame,
         so the easing matches every other animation on the page. */
      gsap.utils.toArray('[data-count]').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var proxy = { value: 0 };

        gsap.to(proxy, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: function () {
            el.textContent = Math.round(proxy.value).toLocaleString('en-US');
          },
        });
      });

      /* ---------- 7. Scroll progress bar ---------- */
      gsap.to('#progressBar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });

      /* ---------- 8. Magnetic buttons (fine pointers only) ---------- */
      if (window.matchMedia('(pointer: fine)').matches) {
        gsap.utils.toArray('[data-magnet]').forEach(function (btn) {
          // quickTo caches the tween, so pointermove does not allocate a
          // new one on every event.
          var moveX = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' });
          var moveY = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' });

          btn.addEventListener('pointermove', function (event) {
            var r = btn.getBoundingClientRect();
            moveX((event.clientX - (r.left + r.width / 2)) * 0.35);
            moveY((event.clientY - (r.top + r.height / 2)) * 0.35);
          });

          btn.addEventListener('pointerleave', function () {
            moveX(0);
            moveY(0);
          });
        });
      }

      return function cleanup() {
        // Returned to matchMedia so every tween above is reverted when the
        // context stops matching.
      };
    });

    ScrollTrigger.refresh();
  }

  /* ---------- Reduced-motion fallbacks ---------- */
  function paintCountersInstantly() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      el.textContent = target.toLocaleString('en-US');
    });
  }

  function updateProgressBarStatically() {
    var bar = document.getElementById('progressBar');
    if (bar) bar.style.transform = 'scaleX(0)';
  }

  /* ---------- Wiring ---------- */
  if (toggle) {
    toggle.addEventListener('click', function () {
      forced = !motionAllowed();
      toggle.setAttribute('aria-pressed', String(forced));
      label.textContent = forced ? 'Motion on' : 'Motion off';
      document.body.classList.toggle('no-motion', !forced);
      register();
    });

    // Reflect the OS preference in the switch on first paint.
    var allowed = motionAllowed();
    toggle.setAttribute('aria-pressed', String(allowed));
    label.textContent = allowed ? 'Motion on' : 'Motion off';
    document.body.classList.toggle('no-motion', !allowed);
  }

  register();

  // Fonts land after first paint and change element heights, which moves
  // every trigger point. Recalculate once they are ready.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }
})();

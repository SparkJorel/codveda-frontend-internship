/* ============================================================
   Codveda Technology — Counter
   Level 1 · Task 3

   Single source of truth: `state`. Every interaction mutates the
   state, then `render()` pushes it into the DOM. Nothing reads the
   current value back out of the markup, so the UI can never drift
   out of sync with the model.
   ============================================================ */
(function () {
  'use strict';

  var FLOOR = 0;

  var state = {
    value: 0,
    step: 1,
    clicks: 0,
    peak: 0
  };

  var el = {
    stage:   document.querySelector('.stage'),
    display: document.getElementById('display'),
    value:   document.getElementById('value'),
    hint:    document.getElementById('hint'),
    inc:     document.getElementById('incBtn'),
    dec:     document.getElementById('decBtn'),
    reset:   document.getElementById('resetBtn'),
    clicks:  document.getElementById('statClicks'),
    peak:    document.getElementById('statPeak')
  };

  var DEFAULT_HINT = el.hint.innerHTML;
  var hintTimer = null;

  /* ---------- Rendering ---------- */
  function render(direction) {
    el.value.textContent = String(state.value);
    el.clicks.textContent = String(state.clicks);
    el.peak.textContent = String(state.peak);

    var atFloor = state.value === FLOOR;

    // The floor is enforced twice: the buttons go dead, and `change()`
    // clamps anyway — so a keyboard shortcut can't sneak past the UI.
    el.dec.disabled = atFloor;
    el.reset.disabled = atFloor && state.clicks === 0;
    el.stage.classList.toggle('is-zero', atFloor);

    if (direction) {
      el.display.classList.remove('is-up', 'is-down');
      void el.display.offsetWidth; // restart the animation
      el.display.classList.add(direction > 0 ? 'is-up' : 'is-down');
    }
  }

  function setHint(message, isWarning) {
    window.clearTimeout(hintTimer);

    if (!message) {
      el.hint.innerHTML = DEFAULT_HINT;
      el.hint.classList.remove('is-warning');
      return;
    }

    el.hint.textContent = message;
    el.hint.classList.toggle('is-warning', !!isWarning);
    hintTimer = window.setTimeout(function () { setHint(null); }, 2200);
  }

  /* ---------- Behaviour ---------- */
  function change(delta) {
    var next = state.value + delta;

    if (next < FLOOR) {
      // Already at the bottom: refuse, and say why.
      setHint('The counter cannot go below ' + FLOOR + '.', true);
      return;
    }

    state.value = next;
    state.clicks += 1;
    state.peak = Math.max(state.peak, state.value);

    render(delta > 0 ? 1 : -1);
  }

  function reset() {
    if (state.value === FLOOR && state.clicks === 0) return;

    state.value = FLOOR;
    state.clicks = 0;
    state.peak = 0;

    render(-1);
    setHint('Counter reset.');
  }

  /* ---------- Event listeners ---------- */
  el.inc.addEventListener('click', function () { change(state.step); });
  el.dec.addEventListener('click', function () { change(-state.step); });
  el.reset.addEventListener('click', reset);

  Array.prototype.forEach.call(
    document.querySelectorAll('input[name="step"]'),
    function (radio) {
      radio.addEventListener('change', function () {
        state.step = parseInt(radio.value, 10) || 1;
        setHint('Step set to ' + state.step + '.');
      });
    }
  );

  // Keyboard shortcuts — skipped whenever focus sits in a control that
  // already owns the arrow keys (the radio group).
  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea, select')) return;

    switch (e.key) {
      case 'ArrowUp':
      case '+':
        e.preventDefault();
        change(state.step);
        break;
      case 'ArrowDown':
      case '-':
        e.preventDefault();
        change(-state.step);
        break;
      case 'r':
      case 'R':
        reset();
        break;
      default:
        return;
    }
  });

  render();
})();

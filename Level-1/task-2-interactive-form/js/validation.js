/* ============================================================
   Codveda Technology — Interactive form validation
   Level 1 · Task 2

   Validation model
   ----------------
   A field is only judged once the user has *left* it (blur). After
   that first blur it re-validates on every keystroke, so errors
   clear the moment they are fixed. This avoids yelling "invalid
   email" at someone who has only typed the letter "j".
   ============================================================ */
(function () {
  'use strict';

  var form = document.getElementById('signupForm');
  if (!form) return;

  var successPanel = document.getElementById('success');
  var statusRegion = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
  var meter = document.getElementById('pwMeter');
  var meterValue = meter ? meter.querySelector('.meter__label span') : null;
  var rulesList = document.getElementById('pwRules');

  /* ---------- 1. Patterns ---------- */
  // Letters (incl. accented), spaces, hyphens and apostrophes — nothing else.
  var NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
  // Pragmatic email check: one @, a dot-separated domain, no whitespace.
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
  // Phone: optional +, then digits with spaces / dots / dashes / parens.
  var PHONE_CHARS_RE = /^\+?[\d\s().\-]+$/;

  /* ---------- 2. Field rules ----------
     Each validator returns null when valid, or an error string.     */
  var validators = {
    name: function (value) {
      if (!value) return 'Your full name is required.';
      if (value.length < 2) return 'That looks too short — at least 2 characters.';
      if (value.length > 60) return 'Please keep it under 60 characters.';
      if (!NAME_RE.test(value)) return 'Letters, spaces, hyphens and apostrophes only.';
      return null;
    },

    email: function (value) {
      if (!value) return 'We need an email address to reach you.';
      if (!EMAIL_RE.test(value)) return 'That is not a valid email — check for a missing @ or domain.';
      return null;
    },

    phone: function (value) {
      if (!value) return 'A phone number is required.';
      if (!PHONE_CHARS_RE.test(value)) return 'Only digits, spaces, +, -, . and parentheses are allowed.';
      var digits = value.replace(/\D/g, '').length;
      if (digits < 8) return 'Too short — a phone number needs at least 8 digits.';
      if (digits > 15) return 'Too long — 15 digits is the international maximum.';
      return null;
    },

    password: function (value) {
      if (!value) return 'Choose a password.';
      if (value.length < 8) return 'At least 8 characters, please.';
      if (score(value).level < 2) return 'Too weak — mix in uppercase, numbers or symbols.';
      return null;
    },

    confirm: function (value) {
      var pw = form.elements.password.value;
      if (!value) return 'Please confirm your password.';
      if (value !== pw) return 'The two passwords do not match.';
      return null;
    },

    terms: function (_value, input) {
      if (!input.checked) return 'You need to accept the terms to continue.';
      return null;
    }
  };

  /* ---------- 3. Password strength ---------- */
  function checks(pw) {
    return {
      len:  pw.length >= 8,
      case: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
      num:  /\d/.test(pw),
      sym:  /[^A-Za-z0-9]/.test(pw)
    };
  }

  var LABELS = ['—', 'Weak', 'Fair', 'Good', 'Strong'];

  function score(pw) {
    var c = checks(pw);
    var level = (c.len ? 1 : 0) + (c.case ? 1 : 0) + (c.num ? 1 : 0) + (c.sym ? 1 : 0);

    // A short password can never rate above "Weak", however exotic it is.
    if (!c.len) level = Math.min(level, 1);
    // ...but anything typed at all must still register, otherwise the meter
    // sits blank at "—" and the user gets no feedback while typing.
    if (pw.length > 0) level = Math.max(level, 1);
    // Genuinely long passphrases earn the top slot outright.
    if (pw.length >= 14 && level >= 3) level = 4;

    return { level: level, checks: c };
  }

  function paintStrength(pw) {
    if (!meter || !rulesList) return;

    var show = pw.length > 0;
    meter.hidden = !show;
    rulesList.hidden = !show;
    if (!show) {
      meter.removeAttribute('data-score');
      return;
    }

    var s = score(pw);
    meter.setAttribute('data-score', String(s.level));
    if (meterValue) meterValue.textContent = LABELS[s.level];

    Array.prototype.forEach.call(rulesList.children, function (li) {
      li.classList.toggle('is-met', !!s.checks[li.getAttribute('data-rule')]);
    });
  }

  /* ---------- 4. Field state helpers ---------- */
  function wrapperOf(input) { return input.closest('[data-field]'); }

  function errorNodeOf(input) {
    return document.getElementById(input.id + '-error');
  }

  function applyState(input, message) {
    var wrap = wrapperOf(input);
    var errorNode = errorNodeOf(input);
    if (!wrap) return;

    var invalid = message !== null;
    var filled = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';

    wrap.classList.toggle('is-invalid', invalid);
    wrap.classList.toggle('is-valid', !invalid && filled);
    input.setAttribute('aria-invalid', invalid ? 'true' : 'false');

    if (errorNode) errorNode.textContent = invalid ? message : '';
  }

  function validateField(input, force) {
    var validate = validators[input.name];
    if (!validate) return true;

    // Silent until the field has been visited at least once.
    if (!force && input.dataset.touched !== 'true') return !validate(valueOf(input), input);

    var message = validate(valueOf(input), input);
    applyState(input, message);
    return message === null;
  }

  function valueOf(input) {
    return input.type === 'checkbox' ? String(input.checked) : input.value.trim();
  }

  /* ---------- 5. Wire up every field ---------- */
  var inputs = Array.prototype.slice.call(
    form.querySelectorAll('input[name]')
  ).filter(function (input) { return validators[input.name]; });

  inputs.forEach(function (input) {
    var wrap = wrapperOf(input);

    // focus / blur — required by the brief, and they drive the label colour.
    input.addEventListener('focus', function () {
      if (wrap) wrap.classList.add('is-focused');
    });

    input.addEventListener('blur', function () {
      if (wrap) wrap.classList.remove('is-focused');
      input.dataset.touched = 'true';
      validateField(input, true);
    });

    input.addEventListener('input', function () {
      if (input.name === 'password') {
        paintStrength(input.value);
        // Confirm depends on password, so it has to be re-judged too.
        var confirmInput = form.elements.confirm;
        if (confirmInput.dataset.touched === 'true') validateField(confirmInput, true);
      }
      if (input.dataset.touched === 'true') validateField(input, true);
    });

    if (input.type === 'checkbox') {
      input.addEventListener('change', function () {
        input.dataset.touched = 'true';
        validateField(input, true);
      });
    }
  });

  /* ---------- 6. Show / hide password ---------- */
  Array.prototype.forEach.call(form.querySelectorAll('[data-toggle]'), function (btn) {
    btn.addEventListener('click', function () {
      var input = document.getElementById(btn.getAttribute('data-toggle'));
      if (!input) return;

      var reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(reveal));
      btn.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
      btn.querySelector('.field__toggle-text').textContent = reveal ? 'Hide' : 'Show';

      // Keep the caret where the user left it.
      input.focus();
      var end = input.value.length;
      try { input.setSelectionRange(end, end); } catch (e) { /* type=text only */ }
    });
  });

  /* ---------- 7. Submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // no page reload, ever

    var firstInvalid = null;

    inputs.forEach(function (input) {
      input.dataset.touched = 'true';
      var ok = validateField(input, true);
      if (!ok && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      var count = form.querySelectorAll('[data-field].is-invalid').length;
      announce(count + (count === 1 ? ' field needs' : ' fields need') + ' attention.');

      // Shake only the offending fields, then send focus to the first one.
      Array.prototype.forEach.call(form.querySelectorAll('[data-field].is-invalid'), function (wrap) {
        wrap.classList.remove('is-shaking');
        void wrap.offsetWidth; // force reflow so the animation can restart
        wrap.classList.add('is-shaking');
      });

      firstInvalid.focus();
      return;
    }

    // Valid — simulate a network round-trip so the busy state is visible.
    submitBtn.classList.add('is-busy');
    submitBtn.disabled = true;
    announce('Submitting your details…');

    window.setTimeout(function () {
      submitBtn.classList.remove('is-busy');
      submitBtn.disabled = false;
      showSuccess();
    }, 900);
  });

  function announce(message) {
    if (statusRegion) statusRegion.textContent = message;
  }

  /* ---------- 8. Success state ---------- */
  function showSuccess() {
    var data = {
      'Name':  form.elements.name.value.trim(),
      'Email': form.elements.email.value.trim(),
      'Phone': form.elements.phone.value.trim()
    };

    document.getElementById('successEmail').textContent = data.Email;

    var recap = document.getElementById('successRecap');
    recap.innerHTML = '';
    Object.keys(data).forEach(function (label) {
      var dt = document.createElement('dt');
      dt.textContent = label;
      var dd = document.createElement('dd');
      dd.textContent = data[label]; // textContent, never innerHTML — no injection surface
      recap.appendChild(dt);
      recap.appendChild(dd);
    });

    form.hidden = true;
    document.querySelector('.form-head').hidden = true;
    successPanel.hidden = false;
    announce('Account created successfully.');

    successPanel.setAttribute('tabindex', '-1');
    successPanel.focus();
  }

  /* ---------- 9. Reset ---------- */
  document.getElementById('resetBtn').addEventListener('click', function () {
    form.reset();

    inputs.forEach(function (input) {
      delete input.dataset.touched;
      var wrap = wrapperOf(input);
      if (wrap) wrap.classList.remove('is-valid', 'is-invalid', 'is-focused');
      input.removeAttribute('aria-invalid');
      var errorNode = errorNodeOf(input);
      if (errorNode) errorNode.textContent = '';
    });

    paintStrength('');

    successPanel.hidden = true;
    form.hidden = false;
    document.querySelector('.form-head').hidden = false;
    announce('');
    form.elements.name.focus();
  });
})();

/* Ria Corp International — site behaviour
   Vanilla JS, no dependencies. Every feature is guarded so any page can omit it. */
(function () {
  "use strict";

  /* ---- Site constants: edit these once, the whole site follows ----------- */
  var WHATSAPP_NUMBER = "REPLACE-WITH-WHATSAPP-NUMBER"; // digits only, with country code, e.g. 9779800000000
  var SITE_EMAIL = "info@riacorpinternational.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile navigation ----------------------------------------------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    var closeNav = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav();
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) closeNav();
    });
  }

  /* ---- Route progress: a ship sails the header line as you read ---------- */
  var routeDone = document.querySelector("[data-route-done]");
  var routeShip = document.querySelector("[data-route-ship]");
  if (routeDone && routeShip) {
    var paint = function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var w = routeDone.parentElement.clientWidth;
      routeDone.style.width = (p * 100).toFixed(2) + "%";
      routeShip.style.transform = "translateX(" + (p * (w - 30)).toFixed(1) + "px)";
      routeShip.classList.toggle("is-sailing", p > 0.01);
    };
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
    paint();
  }

  /* ---- Ports ticker: duplicate content once so the loop is seamless ------ */
  var track = document.querySelector("[data-ticker]");
  if (track && !reduceMotion) {
    track.innerHTML += track.innerHTML;
  }

  /* ---- Contact form: validate, then hand off to WhatsApp or email -------- */
  var form = document.querySelector("[data-enquiry]");
  if (form) {
    var status = form.querySelector("[data-form-status]");
    var fields = {
      name: form.querySelector("#f-name"),
      company: form.querySelector("#f-company"),
      email: form.querySelector("#f-email"),
      phone: form.querySelector("#f-phone"),
      direction: form.querySelector("#f-direction"),
      goods: form.querySelector("#f-goods"),
      message: form.querySelector("#f-message"),
      honey: form.querySelector("#f-website")
    };

    var setInvalid = function (input, bad) {
      var wrap = input.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("is-invalid", bad);
      input.setAttribute("aria-invalid", bad ? "true" : "false");
    };

    var validate = function () {
      var ok = true;
      var required = [fields.name, fields.email, fields.goods, fields.message];
      required.forEach(function (input) {
        var bad = !input.value.trim();
        setInvalid(input, bad);
        if (bad) ok = false;
      });
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim());
      if (fields.email.value.trim() && !emailOk) {
        setInvalid(fields.email, true);
        ok = false;
      }
      return ok;
    };

    Object.keys(fields).forEach(function (k) {
      var input = fields[k];
      if (!input) return;
      input.addEventListener("input", function () { setInvalid(input, false); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (fields.honey && fields.honey.value) return; // bot

      if (!validate()) {
        status.textContent = "Please fill in the highlighted fields.";
        status.className = "form__status is-error";
        var firstBad = form.querySelector(".is-invalid input, .is-invalid textarea, .is-invalid select");
        if (firstBad) firstBad.focus();
        return;
      }

      var lines = [
        "Enquiry from riacorpinternational.com",
        "",
        "Name: " + fields.name.value.trim(),
        fields.company.value.trim() ? "Company: " + fields.company.value.trim() : null,
        "Email: " + fields.email.value.trim(),
        fields.phone.value.trim() ? "Phone: " + fields.phone.value.trim() : null,
        "Direction: " + fields.direction.value,
        "Goods: " + fields.goods.value.trim(),
        "",
        fields.message.value.trim()
      ].filter(function (l) { return l !== null; });

      var body = lines.join("\n");
      var subject = "Trade enquiry: " + fields.goods.value.trim();
      var waReady = /^\d{8,15}$/.test(WHATSAPP_NUMBER);

      if (waReady) {
        window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(body), "_blank", "noopener");
        status.textContent = "Opening WhatsApp with your enquiry. We reply within one working day.";
      } else {
        window.location.href = "mailto:" + SITE_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        status.textContent = "Opening your email app with the enquiry ready to send. We reply within one working day.";
      }
      status.className = "form__status is-ok";
      form.reset();
    });
  }

  /* ---- Scroll reveal: sections fade up as they enter ---------------------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".section-head, .step, .pillar, .ledger__row, .statement, .fact, .contact__details, .form, .cta__inner, .lanes, .manifest__table"
    );
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    targets.forEach(function (el, i) {
      var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(siblings, 5) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---- Footer year ------------------------------------------------------ */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();

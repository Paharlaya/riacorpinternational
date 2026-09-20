/* Riacorp International — site behaviour
   Vanilla JS, no dependencies. Every feature is guarded so any page can omit it. */
(function () {
  "use strict";

  /* ---- Site constants: edit these once, the whole site follows ----------- */
  var WHATSAPP_NUMBER = "REPLACE-WITH-WHATSAPP-NUMBER"; // digits only, with country code, e.g. 9779800000000
  var SITE_EMAIL = "info@riacorpinternational.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Current page highlight -------------------------------------------
     Marking the active link here rather than in the markup keeps the <header>
     block byte-identical across every page, so changing the nav is one
     find-and-replace instead of eight careful edits. */
  (function () {
    var path = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".nav__link");
    var matched = null;
    Array.prototype.forEach.call(links, function (link) {
      var href = (link.getAttribute("href") || "").split("/").pop();
      if (href === path) matched = matched || link;
    });
    if (!matched) return;
    matched.setAttribute("aria-current", "page");
    // A submenu match should also light up its parent Products link.
    var sub = matched.closest(".nav__sub");
    if (sub && sub.parentElement) {
      var parent = sub.parentElement.querySelector(":scope > .nav__link");
      if (parent) parent.setAttribute("aria-current", "true");
    }
  })();

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

  /* ---- Corporate intake form ---------------------------------------------
     Eleven fields, a dependent material list, and a soft check on free email
     domains. Everything degrades: with JS off the form still submits natively
     and the material list simply shows every product. */
  (function () {
    var form = document.querySelector("[data-enquiry]");
    if (!form) return;

    /* The markup ships without novalidate and with a mailto action, so with
       JavaScript off the browser validates and the form still reaches us.
       Both are taken over here once this script runs. */
    form.setAttribute("novalidate", "");

    var status = form.querySelector("[data-form-status]");
    var category = form.querySelector("[data-category]");
    var material = form.querySelector("[data-material]");
    var emailField = form.querySelector("[data-corporate-email]");
    var emailHint = form.querySelector("[data-email-hint]");

    /* Field 7 depends on Field 6. */
    var MATERIALS = {
      "Premium Himalayan Botanicals": [
        "Himalayan Large Cardamom — Bold",
        "Himalayan Large Cardamom — Jumbo",
        "Pristine Nepal Ginger — Whole Dry Rhizome",
        "Pristine Nepal Ginger — Sliced Flakes",
        "Pristine Nepal Ginger — Powder",
        "High-Curcumin Turmeric — Finger",
        "High-Curcumin Turmeric — Powder"
      ],
      "Plant-Based Bio-Nutrients": [
        "Psyllium Husk 95%",
        "Psyllium Husk 98%",
        "Psyllium Husk 99%",
        "Psyllium Husk Powder (40–100 mesh)",
        "Organic Psyllium Husk",
        "High-Purity Berberine Extract 95%",
        "High-Purity Berberine Extract 97%",
        "High-Purity Berberine Extract 98%"
      ],
      "Collagen Raw Materials": [
        "Marine Collagen Peptides",
        "Bovine Collagen Peptides"
      ]
    };

    if (category && material) {
      material.disabled = false;

      /* A product-page CTA can arrive with ?category=... (and optionally
         &material=...) so the buyer lands on a form already scoped to what
         they were reading. */
      var params = new URLSearchParams(window.location.search);
      var wantCategory = params.get("category");
      var wantMaterial = params.get("material");
      if (wantCategory) {
        for (var ci = 0; ci < category.options.length; ci++) {
          if (category.options[ci].value === wantCategory) { category.value = wantCategory; break; }
        }
      }
      var fillMaterials = function (preserve) {
        var list = MATERIALS[category.value] || [];
        var previous = preserve ? material.value : "";
        material.innerHTML = "";
        var first = document.createElement("option");
        first.value = "";
        first.textContent = list.length ? "Select a material" : "Select a product category first";
        material.appendChild(first);
        list.forEach(function (name) {
          var o = document.createElement("option");
          o.textContent = name;
          material.appendChild(o);
        });
        if (previous && list.indexOf(previous) > -1) material.value = previous;
        material.disabled = list.length === 0;
      };
      fillMaterials(false);
      if (wantMaterial) {
        for (var mi = 0; mi < material.options.length; mi++) {
          if (material.options[mi].value === wantMaterial) { material.value = wantMaterial; break; }
        }
      }
      category.addEventListener("change", function () { fillMaterials(false); });
    }

    /* Free-domain check. A warning, never a block: plenty of legitimate buyers
       trade from a personal address, and locking them out costs more than it
       saves. */
    var FREE = ["gmail.com","googlemail.com","yahoo.com","yahoo.co.uk","hotmail.com","outlook.com",
                "live.com","aol.com","icloud.com","me.com","proton.me","protonmail.com",
                "mail.com","gmx.com","yandex.com","zoho.com","rediffmail.com"];
    var isFreeDomain = function (value) {
      var at = value.lastIndexOf("@");
      if (at < 0) return false;
      return FREE.indexOf(value.slice(at + 1).trim().toLowerCase()) > -1;
    };
    if (emailField && emailHint) {
      var checkEmail = function () {
        emailHint.hidden = !isFreeDomain(emailField.value);
      };
      emailField.addEventListener("blur", checkEmail);
      emailField.addEventListener("input", function () { if (!emailHint.hidden) checkEmail(); });
    }

    var setInvalid = function (field, bad) {
      var wrap = field.closest(".field");
      if (wrap) wrap.classList.toggle("is-invalid", bad);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (form.querySelector(".honey input").value) return; // bot

      var required = form.querySelectorAll("[required]");
      var firstBad = null;
      Array.prototype.forEach.call(required, function (field) {
        var bad = !field.value.trim();
        if (!bad && field.type === "email") bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value.trim());
        setInvalid(field, bad);
        if (bad && !firstBad) firstBad = field;
      });

      if (firstBad) {
        status.textContent = "Please complete the highlighted fields.";
        status.className = "form__status is-error";
        firstBad.focus();
        return;
      }

      var val = function (n) { var f = form.querySelector('[name="' + n + '"]'); return f ? f.value.trim() : ""; };
      var lines = [
        "CORPORATE INQUIRY — Riacorp International",
        "",
        "Full name:            " + val("name"),
        "Corporate email:      " + val("email"),
        "Company legal name:   " + val("company"),
        "Company website:      " + (val("website_url") || "—"),
        "Country of destination: " + val("country"),
        "",
        "Product category:     " + val("category"),
        "Specific material:    " + val("material"),
        "Format / purity:      " + val("grade"),
        "Estimated volume:     " + val("volume"),
        "Application industry: " + val("industry"),
        "",
        "Technical specifications / packaging:",
        val("message") || "—"
      ];
      var body = lines.join("\n");
      var subject = "Bulk quotation request — " + (val("material") || val("category"));

      var wa = WHATSAPP_NUMBER.replace(/\D/g, "");
      if (/^\d{8,15}$/.test(wa)) {
        status.textContent = "Opening WhatsApp with your enquiry ready to send.";
        window.location.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent(body);
      } else {
        status.textContent = "Opening your email client with the enquiry ready to send. We reply within 24–48 hours.";
        window.location.href = "mailto:" + SITE_EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
      }
      status.className = "form__status is-ok";
    });
  })();

  /* ---- Product/certificate image slots -----------------------------------
     Each slot shows a globe watermark until its photo is supplied. A photo
     that is not there yet still paints a small broken-image marker, so hide
     any slot image that fails to load and let the placeholder stand alone.
     Listeners go on each image directly, and a sweep on window load catches
     anything that had already failed or is lazy-loaded further down. */
  (function () {
    // Each selector needs its own "> img"; appending it to a comma-separated
    // list would bind the child combinator to the last selector only.
    var imgs = document.querySelectorAll(
      ".prodgrid__img > img, .ledger__media > img, .cert__scan > img"
    );
    if (!imgs.length) return;

    var check = function (img) {
      if (img.complete && img.naturalWidth === 0) img.hidden = true;
      else if (img.naturalWidth > 0) img.hidden = false;
    };

    Array.prototype.forEach.call(imgs, function (img) {
      img.addEventListener("error", function () { img.hidden = true; });
      img.addEventListener("load", function () { check(img); });
      check(img);
    });

    // Lazy images below the fold settle later; sweep again once and on scroll.
    var sweep = function () { Array.prototype.forEach.call(imgs, check); };
    window.addEventListener("load", sweep);
    window.addEventListener("scroll", sweep, { passive: true });
  })();

  /* ---- Scroll reveal: sections fade up as they enter ---------------------- */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(
      ".section-head, .step, .pillar, .ledger__row, .statement, .fact, .contact__details, " +
      ".form, .cta__inner, .lanes, .manifest__table, .prodgrid__item, .spectable-wrap, " +
      ".quote, .faq__item, .cert, .reason, .timeline__item, .doclist li"
    );
    var observerFired = false;
    var io = new IntersectionObserver(function (entries) {
      observerFired = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    /* Safety net. .reveal hides its element until the observer says otherwise,
       so anything that stops those callbacks arriving would leave the page
       blank rather than merely un-animated. If nothing has been reported after
       three seconds, show everything. Costs nothing when the observer works. */
    window.setTimeout(function () {
      if (observerFired) return;
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add("is-visible");
      });
    }, 3000);

    targets.forEach(function (el, i) {
      var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(siblings, 5) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---- Shapes: parallax and route drawing with GSAP (optional) ----------- */
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    document.documentElement.classList.add("has-gsap");

    document.querySelectorAll(".shape[data-speed]").forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-speed")) || 0.25;
      var scope = el.closest(".section, .page-hero, .hero") || document.body;
      window.gsap.fromTo(el, { y: speed * 140 }, {
        y: -speed * 140,
        ease: "none",
        scrollTrigger: { trigger: scope, start: "top bottom", end: "bottom top", scrub: 0.6 }
      });
    });

    document.querySelectorAll(".route-draw, .lanes .lane").forEach(function (path) {
      path.setAttribute("pathLength", "1");
      window.gsap.fromTo(path, { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: path.closest(".section, .page-hero") || path, start: "top 85%", end: "bottom 55%", scrub: 0.8 }
      });
    });
  }

  /* ---- Footer year ------------------------------------------------------ */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();

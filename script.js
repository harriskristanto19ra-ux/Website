/* HARRIS KRISTANTO — 2026 EDITION */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* year */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* nav scrolled state */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* reveal on scroll */
  var revealed = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add("in"); });
  }

  /* cinematic pacing: slow the hero film slightly */
  var heroVid = document.getElementById("hero-video");
  if (heroVid && !reduced) {
    heroVid.playbackRate = 0.85;
  }

  /* gentle parallax on the hero name */
  var heroName = document.querySelector(".hero-name");
  if (heroName && !reduced) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroName.style.transform = "translateY(" + y * 0.18 + "px)";
      }
    }, { passive: true });
  }

  /* ── bilingual toggle (EN ⇄ 繁體中文) ── */
  var langBtn = document.getElementById("lang-toggle");
  var current = "en";

  var nodes = [];
  document.querySelectorAll("[data-zh]").forEach(function (el) {
    nodes.push({ el: el, en: el.innerHTML, zh: el.getAttribute("data-zh") });
  });

  function setLang(lang) {
    current = lang;
    nodes.forEach(function (n) {
      n.el.innerHTML = lang === "zh" ? n.zh : n.en;
    });
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
    if (langBtn) {
      langBtn.textContent = lang === "zh" ? "EN" : "中文";
      langBtn.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切換為繁體中文");
    }
    try { localStorage.setItem("hk-lang", lang); } catch (e) { /* private mode */ }
  }

  if (langBtn) {
    langBtn.addEventListener("click", function () {
      setLang(current === "en" ? "zh" : "en");
    });
  }

  try {
    if (localStorage.getItem("hk-lang") === "zh") setLang("zh");
  } catch (e) { /* private mode */ }
})();

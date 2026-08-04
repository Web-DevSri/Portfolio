/* ————— Hariharan D — portfolio interactions ————— */
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── duplicate marquee sets so the loop is seamless ── */
  document.querySelectorAll(".ticker__track, .work__rail").forEach((track) => {
    const set = track.firstElementChild;
    track.appendChild(set.cloneNode(true));
  });
  document.querySelectorAll(".mrow").forEach((row) => {
    const track = document.createElement("div");
    track.className = "mrow__track";
    const set = row.querySelector(".mrow__set");
    track.appendChild(set);
    track.appendChild(set.cloneNode(true));
    row.appendChild(track);
  });

  if (!window.gsap) {
    document.documentElement.classList.add("no-js");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis smooth scroll ── */
  if (window.Lenis && !reduceMotion) {
    const lenis = new Lenis({ lerp: 0.1 });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ── split serif headlines into word-reveal spans ── */
  document.querySelectorAll("[data-split]").forEach((el) => {
    el.innerHTML = el.textContent
      .trim()
      .split(/\s+/)
      .map((w) => `<span class="w"><span>${w}</span></span>`)
      .join(" ");
    gsap.to(el.querySelectorAll(".w > span"), {
      y: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.045,
      scrollTrigger: { trigger: el, start: "top 82%" },
    });
  });

  /* ── generic fade-up reveals ── */
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
      onComplete: () => el.classList.add("reveal-done"),
    });
  });

  /* ── hero entrance ── */
  gsap.from(".hero__arc", { opacity: 0, duration: 1.6, ease: "power2.out", delay: 0.2 });
  gsap.from(".badge", {
    scale: 0,
    opacity: 0,
    duration: 0.9,
    ease: "back.out(1.7)",
    stagger: 0.08,
    delay: 0.35,
  });

  /* ── work carousel: slow auto-drift, pause on hover ── */
  const rail = document.querySelector(".work__rail");
  if (rail && !reduceMotion) {
    const setWidth = () => rail.firstElementChild.offsetWidth;
    const drift = gsap.to(rail, {
      x: () => -setWidth(),
      duration: 55,
      ease: "none",
      repeat: -1,
      modifiers: { x: (x) => (parseFloat(x) % setWidth()) + "px" },
    });
    rail.addEventListener("mouseenter", () => gsap.to(drift, { timeScale: 0.15, duration: 0.6 }));
    rail.addEventListener("mouseleave", () => gsap.to(drift, { timeScale: 1, duration: 0.6 }));
  }

  /* ── skills marquee rows, alternating directions, scroll-reactive ── */
  document.querySelectorAll(".mrow").forEach((row) => {
    if (reduceMotion) return;
    const dir = Number(row.dataset.dir) || 1;
    const track = row.querySelector(".mrow__track");
    const w = () => row.querySelector(".mrow__set").offsetWidth;
    gsap.fromTo(
      track,
      { x: dir === 1 ? 0 : -w() },
      {
        x: dir === 1 ? -w() : 0,
        duration: 38,
        ease: "none",
        repeat: -1,
        modifiers: { x: (x) => (parseFloat(x) % w()) + "px" },
      }
    );
  });

  /* ── stat counters ── */
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
      onUpdate: () => {
        el.textContent = target >= 1000
          ? Math.round(obj.v).toLocaleString() + "+"
          : Math.round(obj.v);
      },
    });
  });

  /* ── mobile menu ── */
  const burger = document.querySelector(".header__burger");
  const mobnav = document.querySelector(".mobnav");
  if (burger && mobnav) {
    burger.addEventListener("click", () => document.body.classList.add("nav-open"));
    mobnav.addEventListener("click", () => document.body.classList.remove("nav-open"));
  }

  /* ── ticker pause when off-screen (saves battery) ── */
  const ticker = document.querySelector(".ticker__track");
  if (ticker) {
    new IntersectionObserver(([e]) => {
      ticker.style.animationPlayState = e.isIntersecting ? "running" : "paused";
    }).observe(ticker);
  }
})();

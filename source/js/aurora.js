(() => {
  const aurora = document.querySelector("[data-aurora]");
  const toggle = document.querySelector("[data-aurora-toggle]");

  if (!aurora || !toggle) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;

  function update() {
    const stopped = paused || reduceMotion.matches || document.hidden;
    aurora.dataset.paused = String(stopped);
    toggle.hidden = reduceMotion.matches;
    toggle.textContent = paused ? "Play motion" : "Pause motion";
    toggle.setAttribute("aria-pressed", String(paused));
  }

  toggle.addEventListener("click", () => {
    paused = !paused;
    update();
  });
  reduceMotion.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  update();
})();

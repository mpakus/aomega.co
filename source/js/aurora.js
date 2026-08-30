(() => {
  const aurora = document.querySelector("[data-aurora]");
  const toggle = document.querySelector("[data-aurora-toggle]");
  const icon = toggle?.querySelector("[data-aurora-toggle-icon]");

  if (!aurora || !toggle || !icon) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = false;

  function update() {
    const stopped = paused || reduceMotion.matches || document.hidden;
    const label = paused ? "Play motion" : "Pause motion";
    aurora.dataset.paused = String(stopped);
    toggle.hidden = reduceMotion.matches;
    icon.src = paused ? "/img/play.svg" : "/img/pause.svg";
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.title = label;
  }

  toggle.addEventListener("click", () => {
    paused = !paused;
    update();
  });
  reduceMotion.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  update();
})();

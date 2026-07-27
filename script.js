(() => {
  const ids = ["inicio", "projetos", "ajuda"];
  const buttons = [...document.querySelectorAll("[data-tab]")];
  const panels = ids.map((id) => document.getElementById("panel-" + id));

  function activate(id, updateHash = true) {
    if (!ids.includes(id)) id = "inicio";
    buttons.forEach((button) => {
      const active = button.dataset.tab === id;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== "panel-" + id;
    });
    if (updateHash) history.replaceState(null, "", "#" + id);
    requestAnimationFrame(observeReveals);
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => activate(button.dataset.tab));
    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + direction + buttons.length) % buttons.length;
      activate(buttons[next].dataset.tab);
      buttons[next].focus();
    });
  });

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  function observeReveals() {
    document.querySelectorAll(".js-reveal:not(.is-visible)").forEach((element) => {
      if (element.closest("[hidden]")) return;
      if (observer) observer.observe(element);
      else element.classList.add("is-visible");
    });
  }

  activate(location.hash.slice(1), false);
  observeReveals();
})();

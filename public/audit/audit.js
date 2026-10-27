(function () {
  "use strict";
  const pages = Array.from(document.querySelectorAll(".paper-page"));
  if (!pages.length) return;
  const prev = document.getElementById("prev-leaf");
  const next = document.getElementById("next-leaf");
  const first = document.getElementById("first-leaf");
  const jumps = Array.from(document.querySelectorAll("[data-jump]"));
  const counter = document.getElementById("leaf-counter");
  const fill = document.getElementById("leaf-fill");
  const announcement = document.getElementById("page-announcement");
  const secret = document.getElementById("secret-appendix");
  const total = pages.length;
  const match = location.hash.match(/^#page-(\d+)$/);
  const starting = match ? Number(match[1]) - 1 : 0;
  let current = Number.isInteger(starting) && starting >= 0 && starting < total ? starting : 0;
  const visited = new Set([current]);
  let lastAction = "";
  const pageLabel = index => String(index + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
  function render() {
    pages.forEach((page, index) => {
      const active = index === current;
      page.hidden = !active;
      page.classList.toggle("is-current", active);
    });
    jumps.forEach(button => {
      const index = Number(button.dataset.jump);
      if (index === current) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
      button.classList.toggle("is-visited", visited.has(index));
    });
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
    first.disabled = current === 0;
    counter.textContent = pageLabel(current);
    fill.style.width = ((current + 1) / total * 100) + "%";
    announcement.textContent = pages[current].dataset.title + " · " + (current + 1) + " / " + total;
    if (secret) secret.hidden = !(current === total - 1 && visited.size === total);
    const hash = current ? "#page-" + (current + 1) : "";
    history.replaceState(null, "", location.pathname + hash);
  }
  function go(index) {
    if (!Number.isInteger(index) || index < 0 || index >= total || index === current) return;
    lastAction = "page";
    current = index;
    visited.add(current);
    render();
  }
  prev.addEventListener("click", () => go(current - 1));
  next.addEventListener("click", () => go(current + 1));
  first.addEventListener("click", () => go(0));
  jumps.forEach(button => button.addEventListener("click", () => go(Number(button.dataset.jump))));
  window.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(current + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(current - 1); }
  });
  window.addEventListener("hashchange", () => {
    const incoming = location.hash.match(/^#page-(\d+)$/);
    if (incoming) go(Number(incoming[1]) - 1);
    else if (!location.hash) go(0);
  });
  render();
})();
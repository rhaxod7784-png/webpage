(function () {
  "use strict";

  const pages = Array.from(document.querySelectorAll(".paper-page"));
  if (!pages.length) return;

  const prev = document.getElementById("prev-leaf");
  const next = document.getElementById("next-leaf");
  const first = document.getElementById("first-leaf");
  const prevTop = document.getElementById("prev-top");
  const nextTop = document.getElementById("next-top");
  const jumps = Array.from(document.querySelectorAll("[data-jump]"));
  const counter = document.getElementById("leaf-counter");
  const fill = document.getElementById("leaf-fill");
  const announcement = document.getElementById("page-announcement");
  const total = pages.length;

  const parseHash = () => {
    const match = window.location.hash.match(/^#page-(\d+)$/);
    if (!match) return 0;
    const page = Number(match[1]) - 1;
    return Number.isInteger(page) && page >= 0 && page < total ? page : 0;
  };

  let current = parseHash();

  function render() {
    pages.forEach((page, index) => {
      const active = index === current;
      page.hidden = !active;
      page.classList.toggle("is-current", active);
    });
    jumps.forEach(button => {
      const active = Number(button.dataset.jump) === current;
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    prev.disabled = current === 0;
    next.disabled = current === total - 1;
    prevTop.disabled = current === 0;
    nextTop.disabled = current === total - 1;
    first.disabled = current === 0;
    counter.textContent = String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    fill.style.width = ((current + 1) * 100 / total) + "%";
    announcement.textContent = pages[current].dataset.title + " · " + (current + 1) + " / " + total;
  }

  function show(index, updateUrl = true) {
    if (!Number.isInteger(index) || index < 0 || index >= total) return;
    current = index;
    render();
    if (updateUrl) {
      const newUrl = window.location.pathname + window.location.search + (current ? "#page-" + (current + 1) : "");
      window.history.replaceState(null, "", newUrl);
    }
  }

  prev.addEventListener("click", () => show(current - 1));
  prevTop.addEventListener("click", () => show(current - 1));
  nextTop.addEventListener("click", () => show(current + 1));
  next.addEventListener("click", () => show(current + 1));
  first.addEventListener("click", () => show(0));
  jumps.forEach(button => button.addEventListener("click", () => show(Number(button.dataset.jump))));

  window.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const focused = document.activeElement;
    if (focused && (["INPUT", "TEXTAREA", "SELECT"].includes(focused.tagName) || focused.isContentEditable)) return;
    if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1); }
  });
  window.addEventListener("hashchange", () => show(parseHash(), false));
  render();
})();
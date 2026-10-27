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
  const sealedFile = document.querySelector("[data-sealed-gate]");
  const sealedSummary = sealedFile && sealedFile.querySelector("summary");
  const sealedNotice = document.querySelector("[data-sealed-locked]");
  const readStateKey = "cbzp-audit-read-v1";
  const caseId = (document.querySelector(".binder-num")?.textContent || "").trim();
  const total = pages.length;
  let registryPromise = null;
  function readState() {
    try { const value = JSON.parse(window.localStorage.getItem(readStateKey) || "{}"); return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
    catch (_) { return {}; }
  }
  function markCurrentPageRead() {
    if (!/^\d+$/.test(caseId)) return;
    const state = readState();
    const visited = new Set(Array.isArray(state[caseId]) ? state[caseId].filter(Number.isInteger) : []);
    visited.add(current);
    state[caseId] = Array.from(visited).sort((a, b) => a - b);
    try { window.localStorage.setItem(readStateKey, JSON.stringify(state)); } catch (_) { /* Fail closed if persistent progress is unavailable. */ }
  }
  async function registeredDiaries() {
    if (registryPromise) return registryPromise;
    registryPromise = (async () => {
      const response = await fetch("/sitemap.xml", { cache: "no-store" });
      if (!response.ok) return null;
      const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
      if (xml.querySelector("parsererror")) return null;
      const ids = Array.from(xml.getElementsByTagName("*"))
        .filter(node => node.localName === "loc")
        .map(node => { try { return new URL(node.textContent.trim(), window.location.href).pathname.match(/^\/audit\/(\d+)\/?$/)?.[1] || null; } catch (_) { return null; } })
        .filter((id, index, all) => id && all.indexOf(id) === index);
      if (!ids.length || !ids.includes(caseId)) return null;
      const entries = await Promise.all(ids.map(async id => {
        const pageResponse = await fetch("/audit/" + id + "/", { cache: "no-store" });
        if (!pageResponse.ok) return null;
        const doc = new DOMParser().parseFromString(await pageResponse.text(), "text/html");
        const count = doc.querySelectorAll(".paper-page").length;
        return count > 0 ? { id, count } : null;
      }));
      return entries.every(Boolean) ? entries : null;
    })().catch(() => null);
    return registryPromise;
  }
  async function allRegisteredDiariesRead() {
    const registry = await registeredDiaries();
    if (!registry) return false;
    const state = readState();
    return registry.every(({ id, count }) => {
      const visited = new Set(Array.isArray(state[id]) ? state[id].filter(Number.isInteger) : []);
      for (let page = 0; page < count; page += 1) if (!visited.has(page)) return false;
      return true;
    });
  }
  async function updateSealedFileGate() {
    if (!sealedFile || !sealedSummary) return;
    const unlocked = await allRegisteredDiariesRead();
    sealedFile.classList.toggle("is-locked", !unlocked);
    sealedSummary.setAttribute("aria-disabled", String(!unlocked));
    if (sealedNotice) sealedNotice.hidden = unlocked;
    if (!unlocked) sealedFile.removeAttribute("open");
  }
  if (sealedFile && sealedSummary) {
    sealedSummary.addEventListener("click", event => {
      if (sealedFile.classList.contains("is-locked")) { event.preventDefault(); event.stopImmediatePropagation(); }
    }, true);
    sealedFile.addEventListener("toggle", () => {
      if (sealedFile.classList.contains("is-locked") && sealedFile.open) sealedFile.removeAttribute("open");
    });
  }
  function parseHash() {
    const match = window.location.hash.match(/^#page-(\d+)$/);
    if (!match) return 0;
    const page = Number(match[1]) - 1;
    return Number.isInteger(page) && page >= 0 && page < total ? page : 0;
  }
  let current = parseHash();
  function render() {
    pages.forEach((page, index) => { const active = index === current; page.hidden = !active; page.classList.toggle("is-current", active); });
    jumps.forEach(button => { const active = Number(button.dataset.jump) === current; if (active) button.setAttribute("aria-current", "page"); else button.removeAttribute("aria-current"); });
    prev.disabled = current === 0; next.disabled = current === total - 1; prevTop.disabled = current === 0; nextTop.disabled = current === total - 1; first.disabled = current === 0;
    counter.textContent = String(current + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
    fill.style.width = ((current + 1) * 100 / total) + "%";
    announcement.textContent = pages[current].dataset.title + " · " + (current + 1) + " / " + total;
    markCurrentPageRead();
    updateSealedFileGate();
  }
  function show(index, updateUrl = true) {
    if (!Number.isInteger(index) || index < 0 || index >= total) return;
    current = index; render();
    if (updateUrl) { const url = window.location.pathname + window.location.search + (current ? "#page-" + (current + 1) : ""); window.history.replaceState(null, "", url); }
  }
  prev.addEventListener("click", () => show(current - 1)); prevTop.addEventListener("click", () => show(current - 1));
  nextTop.addEventListener("click", () => show(current + 1)); next.addEventListener("click", () => show(current + 1));
  first.addEventListener("click", () => show(0)); jumps.forEach(button => button.addEventListener("click", () => show(Number(button.dataset.jump))));
  window.addEventListener("keydown", event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const focused = document.activeElement;
    if (focused && (["INPUT", "TEXTAREA", "SELECT"].includes(focused.tagName) || focused.isContentEditable)) return;
    if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1); }
  });
  window.addEventListener("hashchange", () => show(parseHash(), false));
  window.addEventListener("storage", event => { if (event.key === readStateKey || event.key === null) updateSealedFileGate(); });
  render();
})();

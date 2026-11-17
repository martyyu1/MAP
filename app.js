const main = document.querySelector("#main");
let screen = "home";
let activityId = "";
let toastTimer;
function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { node.hidden = true; }, 3500);
}
function currentActivity() { return findActivity(activityId); }
function route() {
  stopVideoPreview();
  clearTimeout(islandTimer);
  videoTime = 0;
  const [path, query] = (location.hash.slice(1) || "/").split("?");
  const parts = path.split("/").filter(Boolean);
  screen = parts[0] || "home";
  activityId = parts[1] || "";
  document.body.classList.toggle("presentation", ["teach", "watch"].includes(screen));
  if (screen === "library") renderLibrary(new URLSearchParams(query));
  else if (screen === "saved") renderSaved();
  else if (["activity", "teach", "watch"].includes(screen)) {
    const activity = currentActivity();
    if (!activity) {
      main.innerHTML = '<div class="page empty-state"><h1>Activity not found</h1><a class="button primary" href="#/library">Find Lesson</a></div>';
    } else {
      recordRecent(activity.id);
      if (screen === "activity") renderActivity(activity);
      else if (screen === "teach") renderTeach(activity);
      else renderWatch(activity);
    }
  } else {
    screen = "home";
    renderHome();
  }
  renderTopbar();
  document.title = (currentActivity()?.name || ({ home: "Home", library: "Movement Library", saved: "Saved activities" }[screen]) || "MAP") + " · MAP";
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}
function updateSaveControls(id) {
  const activity = findActivity(id);
  const saved = state.saved.includes(id);
  document.querySelectorAll('[data-save="' + id + '"]').forEach(button => {
    button.classList.toggle("is-saved", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute("aria-label", (saved ? "Unsave " : "Save ") + activity.name);
    const text = button.querySelector("span");
    if (text) text.textContent = saved ? "Saved" : "Save";
  });
  renderTopbar();
}
function syncFilters() {
  document.querySelectorAll("[data-filter]").forEach(select => { select.value = state.filters[select.dataset.filter]; });
  document.querySelectorAll('input[name="category"]').forEach(input => { input.checked = input.value === libraryState.category; });
}
function clearFilters() {
  state.filters = emptyFilters();
  libraryState.category = "";
  libraryState.skills = {};
  libraryState.search = "";
  libraryState.about = false;
  libraryState.view = "grid";
  document.querySelector("#movement-search").value = "";
  persist();
  syncFilters();
  updateLibrary();
}
document.addEventListener("input", event => {
  if (event.target.id === "movement-search") {
    libraryState.search = event.target.value;
    updateLibrary();
  }
});
document.addEventListener("change", event => {
  const input = event.target;
  if (input.dataset.filter) {
    state.filters[input.dataset.filter] = input.value;
    persist();
    if (screen === "home") updateHomeMatch();
    if (screen === "library") updateLibrary();
  }
  if (input.name === "category") {
    libraryState.category = input.value;
    libraryState.about = false;
    libraryState.skills = {};
    updateLibrary();
  }
  if (input.id === "sort") {
    libraryState.sort = input.value;
    updateLibrary();
  }
  if (input.hasAttribute("data-material")) {
    state.materialChecks[input.dataset.material] = input.checked;
    persist();
  }
  if (input.id === "class-stars-toggle") {
    state.showClassStars = input.checked;
    persist();
    if (screen === "library") updateLibrary();
  }
});
document.addEventListener("click", event => {
  const target = event.target.closest("button");
  if (!target) return;
  const data = target.dataset;
  if (target.hasAttribute("data-help")) openHelp();
  if (target.hasAttribute("data-tip")) {
    const tip = target.nextElementSibling;
    tip.hidden = !tip.hidden;
    target.setAttribute("aria-expanded", String(!tip.hidden));
  }
  if (data.save) {
    state.saved = state.saved.includes(data.save) ? state.saved.filter(id => id !== data.save) : [...state.saved, data.save];
    persist();
    if (screen === "saved") renderSaved();
    updateSaveControls(data.save);
  }
  if (target.hasAttribute("data-clear-filters")) clearFilters();
  if (data.removeFilter) {
    state.filters[data.removeFilter] = "";
    persist();
    syncFilters();
    updateLibrary();
  }
  if (target.hasAttribute("data-remove-category")) {
    libraryState.category = "";
    libraryState.about = false;
    libraryState.skills = {};
    syncFilters();
    updateLibrary();
  }
  if (target.hasAttribute("data-clear-search")) {
    libraryState.search = "";
    document.querySelector("#movement-search").value = "";
    updateLibrary();
  }
  if (target.hasAttribute("data-skill")) {
    libraryState.skills[data.skillCategory] = data.skill;
    updateLibrary();
  }
  if (data.view) {
    libraryState.view = data.view;
    updateLibrary();
  }
  if (data.islandStop) selectIslandStop(target);
  if (target.id === "mobile-filters") {
    const expanded = target.getAttribute("aria-expanded") !== "true";
    target.setAttribute("aria-expanded", String(expanded));
    document.querySelector(".filter-sidebar").classList.toggle("expanded", expanded);
  }
  if (data.printActivity) printActivity(data.printActivity);
  if (target.hasAttribute("data-print-materials")) printMaterials();
  if (target.hasAttribute("data-play")) toggleVideoPreview();
  if (target.hasAttribute("data-timestamp")) {
    videoTime = Number(data.timestamp);
    updateVideoUI();
  }
  if (data.practiced) {
    markPracticed(data.practiced);
    if (screen === "saved") renderSaved();
    else {
      target.disabled = true;
      target.textContent = practicedText(currentActivity());
    }
  }
  if (target.hasAttribute("data-teach-next")) {
    teachStep = Math.min(3, teachStep + 1);
    renderTeach(currentActivity(), false);
    document.querySelector(".teach-copy h1").setAttribute("tabindex", "-1");
    document.querySelector(".teach-copy h1").focus();
  }
  if (target.hasAttribute("data-teach-back")) {
    teachStep = Math.max(0, teachStep - 1);
    renderTeach(currentActivity(), false);
  }
  if (target.hasAttribute("data-replay")) {
    document.querySelector("#clip-feedback").textContent = "Clip placeholder — “" + currentActivity().steps[teachStep].cue + "”";
  }
  if (data.teachPracticed) {
    markPracticed(data.teachPracticed);
    target.disabled = true;
    target.textContent = "✓ Practiced";
  }
});
window.addEventListener("hashchange", route);
route();

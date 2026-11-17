// Library state belongs to the current visit. Classroom filters persist separately.
let libraryState = { category: "", skills: {}, search: "", sort: "easiest", view: "grid", about: false };
let islandSelection = "";
let islandTimer;
function islandPositions() {
  return matchMedia("(max-width: 480px)").matches
    ? [[18, 82], [50, 68], [78, 52], [48, 39], [20, 24], [64, 12]]
    : [[14, 70], [30, 43], [46, 64], [61, 33], [77, 53], [88, 27]];
}
function renderLibrary(params) {
  clearTimeout(islandTimer);
  islandSelection = "";
  libraryState = {
    category: CATEGORIES[params.get("category")] ? params.get("category") : "",
    skills: {}, search: "", sort: "easiest", view: "grid", about: params.get("about") === "1"
  };
  document.querySelector("#main").innerHTML = `<div class="page library-page"><div class="page-heading"><div><a class="back-link" href="#/">← Home</a><h1>Movement Library</h1></div><label class="search-field"><span class="sr-only">Search movements</span><input id="movement-search" type="search" placeholder="Search movements" autocomplete="off"></label></div>
    <div class="library-layout"><aside class="filter-sidebar"><button class="filter-disclosure button secondary" id="mobile-filters" aria-expanded="false" aria-controls="library-filters">${icon("filter")} Filters</button><div id="library-filters"><h2>Filters</h2><fieldset class="category-filter"><legend>Category</legend>${["", ...Object.keys(CATEGORIES)].map(category => `<label class="${category ? categoryClass(category) : ""}"><input type="radio" name="category" value="${category}" ${libraryState.category === category ? "checked" : ""}> ${category || "All activities"}</label>`).join("")}</fieldset>${FilterPanel("library")}</div></aside>
    <div class="library-results"><div class="results-toolbar"><div><h2 class="result-count" id="result-count" aria-live="polite"></h2><p class="helper">Stars show how hard the skill is. Effort shows how much energy it takes.</p></div><label class="sort-label">Sort<select id="sort"><option value="easiest">Easiest first</option><option value="shortest">Shortest first</option></select></label></div>
    <div id="filter-chips" class="filter-chips"></div><div id="category-about"></div><div id="view-switch"></div><div id="library-content"></div></div></div>
    <p class="content-notice">${CONTENT_NOTICE}</p></div>`;
  updateLibrary();
}
function libraryMatches() {
  const matches = activities.filter(activity => matchesActivity(activity, state.filters, libraryState.category, libraryState.search, libraryState.skills));
  return matches.sort((a, b) => libraryState.sort === "shortest"
    ? a.duration - b.duration || a.difficulty - b.difficulty
    : a.difficulty - b.difficulty || a.duration - b.duration);
}
function updateLibrary() {
  clearTimeout(islandTimer);
  const matches = libraryMatches();
  document.querySelector("#result-count").textContent = matches.length + (matches.length === 1 ? " activity matches" : " activities match");
  const chips = FILTER_FIELDS.filter(field => state.filters[field.key]).map(field => {
    const label = field.options.find(([value]) => value === state.filters[field.key])?.[1];
    return `<button class="filter-chip" data-remove-filter="${field.key}" aria-label="Remove ${label} filter">${label} ${icon("close", 14)}</button>`;
  });
  if (libraryState.category) chips.push(`<button class="filter-chip ${categoryClass(libraryState.category)}" data-remove-category aria-label="Remove ${libraryState.category} filter">${libraryState.category} ${icon("close", 14)}</button>`);
  if (libraryState.search) chips.push(`<button class="filter-chip" data-clear-search aria-label="Remove search filter">Search: ${escapeHtml(libraryState.search)} ${icon("close", 14)}</button>`);
  document.querySelector("#filter-chips").innerHTML = chips.join("") + '<button class="text-button" data-clear-filters>Clear all</button>';
  const about = document.querySelector("#category-about");
  const aboutOpen = about.querySelector("details")?.open ?? true;
  about.innerHTML = libraryState.about && libraryState.category ? `<details class="category-about ${categoryClass(libraryState.category)}" ${aboutOpen ? "open" : ""}><summary>About ${libraryState.category}</summary><p>${CATEGORIES[libraryState.category].description}</p><small>Placeholder · To be reviewed by Dr. Palmer</small></details>` : "";
  document.querySelector("#view-switch").innerHTML = libraryState.category ? `<div class="view-toggle" role="group" aria-label="Library view"><button data-view="grid" aria-pressed="${libraryState.view === "grid"}">Grid</button><button data-view="island" aria-pressed="${libraryState.view === "island"}">Island view</button></div>` : "";
  if (!libraryState.category) libraryState.view = "grid";
  document.querySelector("#library-content").innerHTML = libraryState.view === "island"
    ? renderIsland(matches)
    : renderGrid(matches);
}
function emptyLibrary() {
  // Recommend a single constraint whose removal makes a result possible.
  let remove = "";
  for (const field of FILTER_FIELDS) {
    if (state.filters[field.key] && activities.some(activity => matchesActivity(activity, { ...state.filters, [field.key]: "" }, libraryState.category, libraryState.search, libraryState.skills))) {
      remove = field.options.find(([value]) => value === state.filters[field.key])[1];
      break;
    }
  }
  if (!remove) remove = libraryState.search ? "the search" : libraryState.category || Object.values(state.filters).find(Boolean) || "the skill selection";
  return `<div class="empty-state"><h3>No matches.</h3><p>Try removing ${escapeHtml(remove)}.</p><button class="button secondary" data-clear-filters>Clear all filters</button></div>`;
}
function skillHeader(category) {
  return `<div class="category-section-head ${categoryClass(category)}"><h2>${category}</h2><div class="skill-chips" role="group" aria-label="${category} skills">${["All", ...CATEGORIES[category].skills].map(skill => `<button data-skill="${skill === "All" ? "" : skill}" data-skill-category="${category}" aria-pressed="${(libraryState.skills[category] || "All") === skill}">${skill}</button>`).join("")}</div></div>`;
}
function renderGrid(matches) {
  return Object.keys(CATEGORIES).filter(category => !libraryState.category || libraryState.category === category).map(category => {
    const group = matches.filter(activity => activity.category === category);
    return `<section class="library-category">${skillHeader(category)}${group.length ? `<div class="activity-grid">${group.map(ActivityCard).join("")}</div>` : `<div class="category-empty">${emptyLibrary()}</div>`}</section>`;
  }).join("");
}
function renderIsland(matches) {
  const category = libraryState.category;
  const visible = [...matches].sort((a, b) => a.difficulty - b.difficulty || a.duration - b.duration).slice(0, 6);
  const stopPositions = islandPositions();
  const trail = stopPositions.map(([x, y], index) => (index ? "L" : "M") + (x * 9) + " " + (y * 4.5)).join(" ");
  if (!visible.length) return skillHeader(category) + emptyLibrary();
  return `${skillHeader(category)}<div class="island-board ${categoryClass(category)}">
    <svg class="island-terrain" viewBox="0 0 900 450" preserveAspectRatio="none" aria-hidden="true"><path class="island-sand" d="M40 285Q5 170 95 115Q105 32 250 70Q360 5 466 56Q610 15 715 82Q870 62 865 190Q922 270 817 345Q730 445 620 381Q450 445 337 385Q140 432 67 350Z"/><path class="island-grass" d="M64 276Q39 172 118 129Q133 62 250 94Q365 30 470 80Q610 43 713 107Q842 84 841 190Q890 268 802 326Q722 411 620 358Q449 418 338 360Q143 409 88 334Z"/><path class="island-path" d="${trail}"/><path d="m114 104 24-45 24 45Zm565 242 26-52 26 52Z" fill="#549A79"/><circle cx="765" cy="74" r="18" fill="#FFCE76"/></svg>
    <div class="island-character" aria-label="Explorer character" style="left:7%;top:77%"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m8 17 2-13 11 8h7L40 4l1 15-7 21-20 1Z" fill="#FF7A59"/><path d="m11 24 13 8 14-8-6 17H17Z" fill="#FFF5DF"/><circle cx="17" cy="23" r="2" fill="#1F2937"/><circle cx="31" cy="23" r="2" fill="#1F2937"/><path d="m21 31 3 4 3-4Z" fill="#1F2937"/></svg></div>
    ${visible.map((activity, i) => `<button class="island-stop" data-island-stop="${activity.id}" data-position="${i}" style="--x:${stopPositions[i][0]}%;--y:${stopPositions[i][1]}%" aria-label="Preview ${activity.name}, difficulty ${activity.difficulty} of 4${practiceRecords()[activity.id] ? ", practiced" : ""}"><span class="stop-dot ${practiceRecords()[activity.id] ? "practiced-stop" : ""}">${practiceRecords()[activity.id] ? icon("check") : i + 1}</span><span class="stop-label"><strong>${activity.name}</strong><span aria-hidden="true">${"★".repeat(activity.difficulty)}${"☆".repeat(4 - activity.difficulty)}</span></span></button>`).join("")}</div>
    <div class="island-under"><p>Every stop is open. Choose any activity.</p>${state.signedIn && state.showClassStars ? `<strong class="class-stars">Class stars: ${Object.values(classStarAwards()).reduce((sum, number) => sum + number, 0)} ★</strong>` : ""}${matches.length > 6 ? '<button class="text-button" data-view="grid">See all in grid</button>' : ""}</div><div id="island-preview" aria-live="polite"><p class="helper">Choose a stop to preview an activity.</p></div>`;
}
function selectIslandStop(button) {
  clearTimeout(islandTimer);
  const index = Number(button.dataset.position);
  const character = document.querySelector(".island-character");
  const positions = [[7, 77], ...islandPositions()];
  const previous = Number(character.dataset.position ?? 0);
  const destination = index + 1;
  const path = positions.slice(Math.min(previous, destination), Math.max(previous, destination) + 1);
  if (previous > destination) path.reverse();
  const [left, top] = positions[destination];
  character.getAnimations().forEach(animation => animation.cancel());
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && previous !== destination) {
    character.animate(path.map(([x, y]) => ({ left: x + "%", top: y + "%" })), { duration: 400, easing: "ease-in-out" });
  }
  character.dataset.position = destination;
  character.style.left = left + "%";
  character.style.top = top + "%";
  islandSelection = button.dataset.islandStop;
  islandTimer = setTimeout(() => {
    const activity = findActivity(islandSelection);
    document.querySelector("#island-preview").innerHTML = `<div class="island-preview ${categoryClass(activity.category)}"><div><span class="category-label">${activity.category} · ${activity.skill}</span><h3>${activity.name}</h3><p>${activity.duration} min · ${activity.effort} effort</p></div>${DifficultyStars(activity.difficulty)}<a class="button primary" href="#/activity/${activity.id}">Open activity ${icon("arrow")}</a></div>`;
  }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 400);
}

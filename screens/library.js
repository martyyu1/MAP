// Library state belongs to the current visit. Classroom filters persist separately.
let libraryState = { category: "", skills: {}, search: "", sort: "easiest", view: "grid", about: false };
function renderLibrary(params) {
  disposeIslandMap();
  libraryState = {
    category: CATEGORIES[params.get("category")] ? params.get("category") : "",
    skills: {}, search: "", sort: "easiest", view: params.has("category") ? "island" : "grid", about: params.get("about") === "1"
  };
  if (CATEGORIES[libraryState.category]?.skills.includes(params.get("skill"))) {
    libraryState.skills[libraryState.category] = params.get("skill");
  }
  document.querySelector("#main").innerHTML = `<div class="page library-page"><div class="page-heading"><div><a class="back-link" href="#/">← Home</a><h1>Movement Library</h1></div><label class="search-field"><span class="sr-only">Search movements</span><input id="movement-search" type="search" placeholder="Search movements" autocomplete="off"></label></div>
    <div class="library-layout"><aside class="filter-sidebar"><button class="filter-disclosure button secondary" id="mobile-filters" aria-expanded="false" aria-controls="library-filters">${icon("filter")} Filters</button><div id="library-filters"><h2>Filters</h2><fieldset class="category-filter"><legend>Category</legend>${["", ...Object.keys(CATEGORIES)].map(category => `<label class="${category ? categoryClass(category) : ""}"><input type="radio" name="category" value="${category}" ${libraryState.category === category ? "checked" : ""}> ${category || "All activities"}</label>`).join("")}</fieldset>${FilterPanel("library")}</div></aside>
    <div class="library-results"><div class="results-toolbar"><div><h2 class="result-count" id="result-count" aria-live="polite"></h2></div><label class="sort-label">Sort<select id="sort"><option value="easiest">Easiest first</option><option value="shortest">Shortest first</option></select></label></div>
    <div id="filter-chips" class="filter-chips"></div><div id="category-about"></div><div id="view-switch"></div><div id="library-content"></div></div></div>
    </div>`;
  updateLibrary();
}
function libraryMatches() {
  const matches = activities.filter(activity => matchesActivity(activity, state.filters, libraryState.category, libraryState.search, libraryState.skills));
  return matches.sort((a, b) => libraryState.sort === "shortest"
    ? a.duration - b.duration || a.difficulty - b.difficulty
    : a.difficulty - b.difficulty || a.duration - b.duration);
}
function updateLibrary() {
  disposeIslandMap();
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
  about.innerHTML = libraryState.about && libraryState.category ? `<details class="category-about ${categoryClass(libraryState.category)}" ${aboutOpen ? "open" : ""}><summary>About ${libraryState.category}</summary><p>${CATEGORIES[libraryState.category].description}</p></details>` : "";
  document.querySelector("#view-switch").innerHTML = libraryState.category ? `<div class="view-toggle" role="group" aria-label="Library view"><button data-view="island" aria-pressed="${libraryState.view === "island"}">Island view</button><button data-view="grid" aria-pressed="${libraryState.view === "grid"}">Grid</button></div>` : "";
  if (!libraryState.category) libraryState.view = "grid";
  document.querySelector("#library-content").innerHTML = libraryState.view === "island"
    ? renderIsland(matches)
    : renderGrid(matches);
  if (libraryState.view === "island" && !libraryState.skills[libraryState.category]) mountIslandMap();
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
    const group = matches.filter(activity => activity.category === category && (!libraryState.skills[category] || activity.skill === libraryState.skills[category]));
    return `<section class="library-category">${skillHeader(category)}${group.length ? `<div class="activity-grid">${group.map(activity => ActivityCard(activity, libraryState.skills[category] || activity.skill)).join("")}</div>` : `<div class="category-empty">${emptyLibrary()}</div>`}</section>`;
  }).join("");
}

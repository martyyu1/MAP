// Library state belongs to the current visit. Classroom filters persist separately.
let libraryState = { category: "", skills: {}, search: "", sort: "easiest", view: "grid", about: false };
let islandSelection = "";
let islandTimer;
let islandMotion;
// Stops stay on the open meadow, with enough room for readable lesson labels.
// The artwork keeps its proportions on small screens inside a scrollable map.
function islandPositions() {
  return [[20, 68], [22, 36], [48, 66], [48, 32], [74, 67], [72, 43]];
}
function islandTrail(positions) {
  const [firstX, firstY] = positions[0];
  let trail = "M" + firstX * 10 + " " + firstY * 6.25;
  positions.slice(1).forEach(([x, y], index) => {
    const [previousX, previousY] = positions[index];
    const middleX = (previousX + x) * 5;
    trail += "C" + middleX + " " + previousY * 6.25 + " " + middleX + " " + y * 6.25 + " " + x * 10 + " " + y * 6.25;
  });
  return trail;
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
    <div class="library-results"><div class="results-toolbar"><div><h2 class="result-count" id="result-count" aria-live="polite"></h2><p class="helper">Star count shows difficulty. Hollow stars mean not yet practiced; solid stars mean practiced. Effort shows how much energy it takes.</p></div><label class="sort-label">Sort<select id="sort"><option value="easiest">Easiest first</option><option value="shortest">Shortest first</option></select></label></div>
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
  const positions = islandPositions().slice(0, visible.length);
  if (!visible.length) return skillHeader(category) + emptyLibrary();
  const trail = islandTrail(positions);
  const [startX, startY] = positions[0];
  islandMotion = null;
  return `${skillHeader(category)}
    <div class="island-map-viewport" role="region" aria-label="${category} activity island. Scroll sideways to explore on a small screen." tabindex="0">
      <div class="island-board ${categoryClass(category)}">
        ${IslandArt(category)}
        <svg class="island-trails" viewBox="0 0 1000 625" preserveAspectRatio="none" aria-hidden="true">
          <path class="island-path-edge" d="${trail}"/>
          <path class="island-path" d="${trail}"/>
          <path class="island-route" d="${trail}"/>
        </svg>
        <div class="island-character" data-distance="0" style="left:${startX}%;top:${startY}%" aria-hidden="true"><img src="assets/explorer-fox.png" alt="" width="64" height="76"></div>
        ${visible.map((activity, index) => `<button class="island-stop" data-island-stop="${activity.id}" data-position="${index}" style="--x:${positions[index][0]}%;--y:${positions[index][1]}%" aria-pressed="false" aria-label="Preview ${activity.name}, difficulty ${activity.difficulty} of 4${practiceRecords()[activity.id] ? ", practiced" : ""}">
          <span class="stop-dot ${practiceRecords()[activity.id] ? "practiced-stop" : ""}">${practiceRecords()[activity.id] ? icon("check", 22) : index + 1}</span>
          <span class="stop-label"><strong>${activity.name}</strong><span class="stop-stars ${practiceRecords()[activity.id] ? "earned-stars" : ""}" aria-hidden="true">${(practiceRecords()[activity.id] ? "★" : "☆").repeat(activity.difficulty)}</span></span>
        </button>`).join("")}
      </div>
    </div>
    <p class="map-scroll-hint">Swipe sideways to explore the island.</p>
    <div class="island-under"><p>Every stop is open. Choose any activity.</p>${matches.length > 6 ? '<button class="text-button" data-view="grid">See all in grid</button>' : ""}</div>
    <div id="island-preview" aria-live="polite"><p class="helper">Choose a stop to preview an activity.</p></div>`;
}
function selectIslandStop(button) {
  clearTimeout(islandTimer);
  const index = Number(button.dataset.position);
  const character = document.querySelector(".island-character");
  const route = document.querySelector(".island-route");
  const partialRoute = document.createElementNS("http://www.w3.org/2000/svg", "path");
  partialRoute.setAttribute("d", islandTrail(islandPositions().slice(0, index + 1)));
  const destination = partialRoute.getTotalLength();
  let start = Number(character.dataset.distance);
  // Continue from the current position when another stop is tapped mid-slide.
  if (islandMotion) {
    const progress = islandMotion.animation.effect.getComputedTiming().progress ?? 1;
    start = islandMotion.start + (islandMotion.destination - islandMotion.start) * progress;
    islandMotion.animation.cancel();
  }
  const [left, top] = islandPositions()[index];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion || Math.abs(destination - start) < 1 ? 0 : 400;
  character.style.left = left + "%";
  character.style.top = top + "%";
  character.dataset.distance = destination;
  if (duration) {
    const frames = Array.from({ length: 41 }, (_, frame) => {
      const point = route.getPointAtLength(start + (destination - start) * frame / 40);
      return { left: point.x / 10 + "%", top: point.y / 6.25 + "%" };
    });
    const animation = character.animate(frames, { duration, easing: "ease-in-out" });
    islandMotion = { animation, start, destination };
  } else {
    islandMotion = null;
  }
  document.querySelectorAll("[data-island-stop]").forEach(stop => {
    stop.setAttribute("aria-pressed", String(stop === button));
  });
  islandSelection = button.dataset.islandStop;
  document.querySelector("#island-preview").innerHTML = '<p class="helper">Opening activity preview…</p>';
  islandTimer = setTimeout(() => {
    const activity = findActivity(islandSelection);
    document.querySelector("#island-preview").innerHTML = `<div class="island-preview ${categoryClass(activity.category)}"><div><span class="category-label">${activity.category} · ${activity.skill}</span><h3>${activity.name}</h3><p>${activity.duration} min · ${activity.effort} effort</p></div>${DifficultyStars(activity)}<a class="button primary" href="#/activity/${activity.id}">Open activity ${icon("arrow")}</a></div>`;
  }, duration);
}

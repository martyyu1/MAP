function renderHome() {
  const recent = state.recent.map(findActivity);
  document.querySelector("#main").innerHTML = `<div class="page home-page">
    <section class="lesson-finder" aria-labelledby="finder-title">
      <div class="finder-heading"><div class="finder-copy"><h1 id="finder-title">What do you want to practice today?</h1><p>Find a movement lesson.</p></div><img class="finder-fox" src="assets/explorer-fox.png" alt="" width="220" height="240"></div>
      <div class="booking-panel"><div class="booking-controls"><div class="booking-filters">${FilterPanel("home", false)}</div><a class="button primary" href="#/library">Find Lesson ${icon("arrow")}</a></div></div>
    </section>
    <section class="home-islands" aria-labelledby="explore-title"><div class="home-section-heading"><h2 id="explore-title">Explore the islands</h2></div>
    <div class="category-choices">${Object.entries(CATEGORIES).map(([category]) => `<a class="category-choice ${categoryClass(category)}" href="#/library?category=${encodeURIComponent(category)}&about=1"><div class="choice-heading"><h2>${category}</h2></div>${IslandCover(category)}<span class="choice-arrow">${icon("arrow", 24)}</span></a>`).join("")}
    <div class="coming-soon"><svg viewBox="0 0 60 30" width="60" height="30" aria-hidden="true"><path d="M4 8q10-8 20 0t20 0M4 22q10-8 20 0t20 0" fill="none" stroke="#768492" stroke-width="3" stroke-linecap="round"/></svg><span>More <br>coming soon</span></div></div>
    </section>
    <section class="recent-section" aria-labelledby="recent-title"><h2 id="recent-title">Recently viewed</h2><div id="recent-strip" class="${recent.length ? "recent-strip" : ""}">${recent.length ? recent.map(activity => ActivityCard(activity)).join("") : '<p class="empty-strip">Activities you open will appear here.</p>'}</div></section>
    <section class="about-map" aria-labelledby="about-title"><div class="about-art" aria-hidden="true">${IslandArt("Object Control")}</div><h2 id="about-title">About MAP</h2><div><p>${ABOUT_MAP}</p></div></section>
  </div>`;
}

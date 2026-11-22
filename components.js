// Shared interface components. All activity text comes from activities.js.
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const categoryClass = category => category === "Locomotor" ? "locomotor" : "object-control";
const formatTime = seconds => Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
function icon(name, size = 20) {
  const paths = {
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    play: '<path d="m9 5 11 7-11 7Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    print: '<path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7Z"/>',
    filter: '<path d="M3 6h18M6 12h12m-8 6h4"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? paths.arrow}</svg>`;
}
function Logo() {
  return `<a class="logo" href="#/" aria-label="MAP, Movement, Activity and Play, Home"><svg width="103" height="48" viewBox="0 0 103 48" aria-hidden="true"><text x="0" y="37" font-family="Nunito, sans-serif" font-size="40" font-weight="900" letter-spacing="-2"><tspan fill="#FF7A59">M</tspan><tspan fill="#2F80ED">A</tspan><tspan fill="#FF7A59">P</tspan></text></svg><span>Movement,<br>Activity &amp; Play</span></a>`;
}
function DifficultyStars(activity) {
  const practiced = Boolean(practiceRecords()[activity.id]);
  const status = practiced ? "Practiced" : "Not yet practiced";
  return `<span class="difficulty"><span class="star-button ${practiced ? "earned-stars" : ""}" role="img" aria-label="Difficulty ${activity.difficulty} of 4. ${status}."><span aria-hidden="true">${(practiced ? "★" : "☆").repeat(activity.difficulty)}</span></span>`;
}
function EffortPill(effort) {
  return `<span class="effort effort-${effort.toLowerCase()}">${effort} effort</span>`;
}
function SaveButton(activity, full = false) {
  const saved = state.saved.includes(activity.id);
  return `<button class="save-button ${saved ? "is-saved" : ""} ${full ? "button secondary" : ""}" data-save="${activity.id}" data-save-skill="${activity.skill}" aria-pressed="${saved}" aria-label="${saved ? "Unsave" : "Save"} ${activity.name}">${icon("heart")}${full ? `<span>${saved ? "Saved" : "Save"}</span>` : ""}</button>`;
}
// The same locally stored storybook artwork is used on Home and the map.
function IslandArt(category) {
  const filename = category === "Locomotor" ? "locomotor-island-orange" : "object-control-island";
  return `<img class="island-art" src="assets/${filename}.png" alt="" width="1584" height="992" decoding="async">`;
}
function sceneStyle(skill) {
  const place = SKILL_PLACES[skill];
  return "--atlas-x:" + (place.cell % 4) * 100 / 3 + "%;--atlas-y:" + Math.floor(place.cell / 4) * 100 + "%";
}
function placeArt(skill, extraClass = "") {
  return `<span class="place-art ${categoryClass(skillCategory(skill))} ${extraClass}" style="${sceneStyle(skill)}" aria-hidden="true"></span>`;
}
function IslandCover(category) {
  const coverPositions = [[24, 39], [50, 37], [76, 41], [48, 72]];
  return `<div class="category-cover">${IslandArt(category)}
    <svg class="cover-route" viewBox="0 0 1000 625" preserveAspectRatio="none" aria-hidden="true">
      <path d="M230 390C290 390 310 260 420 260S590 420 750 380"/>
      <circle cx="230" cy="390" r="13"/><circle cx="420" cy="260" r="13"/><circle cx="750" cy="380" r="13"/>
    </svg>
    ${CATEGORIES[category].skills.slice(0, 4).map((skill, index) => `<span class="home-skill-place" style="left:${coverPositions[index][0]}%;top:${coverPositions[index][1]}%">${placeArt(skill)}</span>`).join("")}
    <img class="cover-explorer" src="assets/explorer-fox.png" alt="" width="60" height="72">
  </div>`;
}
function ActivityArt(activity, label = "Activity illustration") {
  const locomotor = activity.category === "Locomotor";
  const action = {
    Run: "M63 64 83 57 100 67M80 62 75 83 58 98M75 83 98 94",
    Gallop: "M63 64 82 57 97 47M81 61 88 82 107 85M88 82 72 102",
    Hop: "M64 54 81 65 99 54M81 65 82 85 68 101M82 85 100 76",
    Throw: "M58 48 81 64 99 51M81 64 80 84 61 102M80 84 102 100",
    Roll: "M66 61 81 71 99 87M81 71 74 87 60 100M74 87 94 101",
    Kick: "M62 61 81 67 97 60M81 67 77 86 67 104M77 86 105 86"
  }[activity.skill] ?? "M63 64 83 57 100 67M80 62 75 83 58 98M75 83 98 94";
  return `<svg viewBox="0 0 270 150" role="img" aria-label="${label}" class="activity-art">
    <rect width="270" height="150" fill="${locomotor ? "var(--locomotor-tint)" : "#DCEBFF"}"/>
    <circle cx="226" cy="29" r="15" fill="#FFCF73"/><path d="M0 118Q70 97 128 120T270 114V150H0Z" fill="${locomotor ? "var(--locomotor-land)" : "#B5D8F2"}"/>
    <path d="M19 128h28m159 5h25" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(28 7)"><circle cx="81" cy="43" r="10" fill="#1F2937"/><path d="${action}" fill="none" stroke="#1F2937" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
    ${locomotor ? '<path d="m196 99 9-16 9 16Z" fill="var(--locomotor)"/>' : '<circle cx="188" cy="95" r="13" fill="#2F80ED"/><path d="M176 91q12 14 25 0" fill="none" stroke="#fff" stroke-width="2"/>'}
  </svg>`;
}
function ActivityCard(activity, focusSkill = activity.skill) {
  activity = lessonForSkill(activity, focusSkill);
  const href = "#/activity/" + activity.id + "?skill=" + encodeURIComponent(activity.skill);
  const practiced = Boolean(practiceRecords()[activity.id]);
  return `<article class="activity-card ${categoryClass(activity.category)}">
    <div class="card-image"><a href="${href}" tabindex="-1" aria-hidden="true">${ActivityArt(activity)}<img class="session-thumbnail" src="https://i.ytimg.com/vi/${activity.videoId}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="play-badge">${icon("play", 18)}</span></a>${SaveButton(activity)}${practiced ? `<span class="practiced-flag">${icon("check", 16)} Practiced</span>` : ""}</div>
    <div class="card-body"><small class="session-label">MAP Session ${activity.sessionNumber} · ${formatTime(activity.video.length)} video</small><span class="category-label">${activity.category} · ${activity.skill}</span><h3><a href="${href}">${activity.name}</a></h3>
    <div class="card-level">${DifficultyStars(activity)}${EffortPill(activity.effort)}</div><p class="card-time">${activity.duration} min <span>·</span> ${activity.space === "Either" ? "Indoor or outdoor" : activity.space}</p><p class="card-materials">${activity.materials.map(item => item.name).join(", ") || "Nothing needed"}</p></div>
  </article>`;
}
function FilterPanel(location, showHelper = true) {
  return `<div class="filter-fields ${location === "home" ? "horizontal" : ""}">${FILTER_FIELDS.map(field => `
    <label class="filter-field"><span>${field.label}</span><select data-filter="${field.key}" aria-label="${field.label}" ${field.key === "equipment" && showHelper ? `aria-describedby="${location}-equipment-help"` : ""}>${field.options.map(([value, label]) => `<option value="${value}" ${state.filters[field.key] === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>`).join("")}</div>
    ${showHelper ? `<p class="helper" id="${location}-equipment-help">${EQUIPMENT_HELP}</p>` : ""}`;
}
function practicedText(activity) {
  if (!practiceRecords()[activity.id]) return "";
  const day = new Date(practiceRecords()[activity.id]).toLocaleDateString("en-US", { weekday: "short" });
  return "✓ Practiced " + day;
}
function PracticeButton(activity, placement = "activity") {
  const practiced = Boolean(practiceRecords()[activity.id]);
  const classes = placement === "saved" ? "text-button" : "button success";
  const completedText = placement === "teach" ? "✓ Practiced" : practicedText(activity);
  const label = practiced ? completedText + " · Undo" : "✓ Mark as practiced";
  const classroom = state.signedIn ? " for " + currentClass().name : "";
  const accessibleLabel = practiced
    ? "Undo practiced status for " + activity.name + classroom
    : "Mark " + activity.name + " as practiced" + classroom;
  return `<button class="${classes}" data-practiced="${activity.id}" aria-pressed="${practiced}" aria-label="${escapeHtml(accessibleLabel)}">${label}</button>`;
}
function renderTopbar() {
  document.querySelector("#topbar").innerHTML = `<div class="topbar-inner">${Logo()}<nav aria-label="Main navigation"><a href="#/library" class="${location.hash.startsWith("#/library") ? "active" : ""}">Find Lesson</a><a href="#/saved" class="${location.hash === "#/saved" ? "active" : ""}">Saved (${state.saved.length})</a></nav>${AccountControls()}</div>`;
  renderClassStars();
}


// A persistent summary keeps class progress visible while scrolling.
function renderClassStars() {
  const summary = document.querySelector("#class-stars-summary");
  const visible = state.signedIn;
  summary.hidden = !visible;
  if (!visible) {
    summary.replaceChildren();
    return;
  }
  summary.innerHTML = `<div class="class-stars-inner"><span class="class-stars-symbol" aria-hidden="true">★</span><strong class="class-stars-total">${classStarTotal()}</strong><span class="class-stars-title">Class stars</span><span class="class-stars-name">${escapeHtml(currentClass().name)}</span></div>`;
}

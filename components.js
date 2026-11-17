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
function DifficultyStars(difficulty) {
  const explanation = "Difficulty: how hard the skill is, from 1 easy to 4 hard.";
  return `<span class="difficulty"><button type="button" class="star-button" data-tip aria-label="Difficulty ${difficulty} of 4. ${explanation}" aria-expanded="false" title="${explanation}"><span aria-hidden="true">${"★".repeat(difficulty)}<span class="unfilled">${"☆".repeat(4 - difficulty)}</span></span></button><span class="star-tooltip" hidden>${explanation}</span></span>`;
}
function EffortPill(effort) {
  return `<span class="effort effort-${effort.toLowerCase()}">${effort} effort</span>`;
}
function SaveButton(activity, full = false) {
  const saved = state.saved.includes(activity.id);
  return `<button class="save-button ${saved ? "is-saved" : ""} ${full ? "button secondary" : ""}" data-save="${activity.id}" aria-pressed="${saved}" aria-label="${saved ? "Unsave" : "Save"} ${activity.name}">${icon("heart")}${full ? `<span>${saved ? "Saved" : "Save"}</span>` : ""}</button>`;
}
// Flat, inline illustrations are intentionally simple and entirely local.
function IslandArt(category) {
  const coral = category === "Locomotor";
  const color = coral ? "#FF7A59" : "#2F80ED";
  return `<svg class="island-art" viewBox="0 0 400 180" aria-hidden="true">
    <ellipse cx="205" cy="135" rx="158" ry="34" fill="${coral ? "#F8BCA6" : "#9FC8FA"}"/>
    <path d="M53 120Q37 91 81 80Q98 51 140 65Q173 36 208 63Q257 45 281 75Q337 64 351 105Q366 144 312 146H98Q58 148 53 120Z" fill="${coral ? "#FFC9AF" : "#A5D8CD"}"/>
    <path d="M78 120Q124 99 152 113T226 103T317 110" fill="none" stroke="#FFF7E4" stroke-width="12" stroke-linecap="round"/>
    <path d="m115 85 24-43 25 43Z" fill="${color}"/><path d="m221 76 32-52 32 52Z" fill="${coral ? "#E56A4A" : "#2E7E6E"}"/>
    <circle cx="186" cy="111" r="12" fill="${color}"/><circle cx="186" cy="111" r="5" fill="#FFF7E4"/>
    <path d="M40 155h38m244 3h39M17 134h19" stroke="${color}" opacity=".55" stroke-width="3" stroke-linecap="round"/>
    <path d="M298 86V58m-9 10 9 8 9-8" stroke="${coral ? "#97543A" : "#226C5F"}" stroke-width="5" stroke-linecap="round" fill="none"/>
    <circle cx="337" cy="36" r="14" fill="#FFCF73"/>
    <path d="M65 42q12-15 24 0m-12 0q12-15 24 0" fill="none" stroke="#536878" stroke-width="2"/>
  </svg>`;
}
function ActivityArt(activity, label = "Activity illustration") {
  const coral = activity.category === "Locomotor";
  const action = {
    Run: "M63 64 83 57 100 67M80 62 75 83 58 98M75 83 98 94",
    Gallop: "M63 64 82 57 97 47M81 61 88 82 107 85M88 82 72 102",
    Hop: "M64 54 81 65 99 54M81 65 82 85 68 101M82 85 100 76",
    Throw: "M58 48 81 64 99 51M81 64 80 84 61 102M80 84 102 100",
    Roll: "M66 61 81 71 99 87M81 71 74 87 60 100M74 87 94 101",
    Kick: "M62 61 81 67 97 60M81 67 77 86 67 104M77 86 105 86"
  }[activity.skill];
  return `<svg viewBox="0 0 270 150" role="img" aria-label="${label}" class="activity-art">
    <rect width="270" height="150" fill="${coral ? "#FFE3DB" : "#DCEBFF"}"/>
    <circle cx="226" cy="29" r="15" fill="#FFCF73"/><path d="M0 118Q70 97 128 120T270 114V150H0Z" fill="${coral ? "#F8C0AC" : "#B5D8F2"}"/>
    <path d="M19 128h28m159 5h25" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(28 7)"><circle cx="81" cy="43" r="10" fill="#1F2937"/><path d="${action}" fill="none" stroke="#1F2937" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
    ${coral ? '<path d="m196 99 9-16 9 16Z" fill="#FF7A59"/>' : '<circle cx="188" cy="95" r="13" fill="#2F80ED"/><path d="M176 91q12 14 25 0" fill="none" stroke="#fff" stroke-width="2"/>'}
  </svg>`;
}
function ActivityCard(activity) {
  const practiced = Boolean(practiceRecords()[activity.id]);
  return `<article class="activity-card ${categoryClass(activity.category)}">
    <div class="card-image"><a href="#/activity/${activity.id}" tabindex="-1" aria-hidden="true">${ActivityArt(activity)}<span class="play-badge">${icon("play", 18)}</span></a>${SaveButton(activity)}${practiced ? `<span class="practiced-flag">${icon("check", 16)} Practiced</span>` : ""}</div>
    <div class="card-body"><span class="category-label">${activity.category} · ${activity.skill}</span><h3><a href="#/activity/${activity.id}">${activity.name}</a></h3>
    <div class="card-level">${DifficultyStars(activity.difficulty)}${EffortPill(activity.effort)}</div><p class="card-time">${activity.duration} min <span>·</span> ${activity.space === "Either" ? "Indoor or outdoor" : activity.space}</p><p class="card-materials">${activity.materials.map(item => item.name).join(", ") || "Nothing needed"}</p></div>
  </article>`;
}
function FilterPanel(location) {
  return `<div class="filter-fields ${location === "home" ? "horizontal" : ""}">${FILTER_FIELDS.map(field => `
    <label class="filter-field"><span>${field.label}</span><select data-filter="${field.key}" aria-label="${field.label}" ${field.key === "equipment" ? `aria-describedby="${location}-equipment-help"` : ""}>${field.options.map(([value, label]) => `<option value="${value}" ${state.filters[field.key] === value ? "selected" : ""}>${label}</option>`).join("")}</select></label>`).join("")}</div>
    <p class="helper" id="${location}-equipment-help">${EQUIPMENT_HELP}</p>`;
}
function practicedText(activity) {
  if (!practiceRecords()[activity.id]) return "";
  const day = new Date(practiceRecords()[activity.id]).toLocaleDateString("en-US", { weekday: "short" });
  return "✓ Practiced " + day;
}
function renderTopbar() {
  document.querySelector("#topbar").innerHTML = `<div class="topbar-inner">${Logo()}<nav aria-label="Main navigation"><a href="#/library" class="${location.hash.startsWith("#/library") ? "active" : ""}">Find Lesson</a><a href="#/saved" class="${location.hash === "#/saved" ? "active" : ""}">Saved (${state.saved.length})</a><button data-help>Help</button></nav>${AccountControls()}</div>`;
}

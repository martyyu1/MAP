// Keep the storage key so existing saved activities survive the upgrade.
const STORAGE_KEY = "map-v05";
const emptyFilters = () => ({ group: "", space: "", time: "", equipment: "" });
const defaultState = () => ({
  saved: [], recent: [], filters: emptyFilters(),
  materialChecks: {},
  signedIn: false, activeClassId: "sunflower"
});
let stored;
try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("map-v02")); } catch {}
const state = {
  ...defaultState(), ...stored,
  filters: { ...emptyFilters(), ...stored?.filters },
  lessonFocus: { ...stored?.lessonFocus },
  // Older versions had one shared history. Preserve it in the first class.
  classes: stored?.classes ?? [
    { id: "sunflower", name: "Sunflower Class", practiced: stored?.practiced ?? {} },
    { id: "bluebird", name: "Bluebird Class", practiced: {} }
  ]
};
// Retire the old cumulative time choices without changing other saved filters.
if (!["", "under-5", "5-10", "10-20"].includes(state.filters.time)) state.filters.time = "";
delete state.showClassStars;
delete state.practiced;
delete state.starAwards;
// Totals now come directly from completed activities, including older records.
state.classes.forEach(classroom => { delete classroom.starAwards; });
if (!state.classes.some(classroom => classroom.id === state.activeClassId)) {
  state.activeClassId = state.classes[0].id;
}
const knownIds = new Set(activities.map(activity => activity.id));
state.saved = [...new Set(state.saved)].filter(id => knownIds.has(id));
state.recent = [...new Set(state.recent)].filter(id => knownIds.has(id)).slice(0, 5);
function currentClass() {
  return state.classes.find(classroom => classroom.id === state.activeClassId);
}
function practiceRecords() {
  return state.signedIn ? currentClass().practiced : {};
}
function classStarTotal() {
  const practiced = practiceRecords();
  return activities.reduce((total, activity) => total + (practiced[activity.id] ? activity.difficulty : 0), 0);
}
function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch { toast("Browser storage is unavailable. Changes will last for this visit."); }
}
function findActivity(id) {
  const activity = activities.find(activity => activity.id === id);
  return activity ? lessonForSkill(activity, state.lessonFocus[id] ?? activity.skill) : undefined;
}
function markPracticed(id) {
  if (!state.signedIn) {
    openAccountDialog();
    return false;
  }
  const classroom = currentClass();
  if (!classroom.practiced[id]) {
    classroom.practiced[id] = new Date().toISOString();
    persist();
    toast("Marked as practiced for " + classroom.name + ".");
  }
  return true;
}
// Undoing completion also updates the derived class-star total.
function unmarkPracticed(id) {
  if (!state.signedIn) {
    openAccountDialog();
    return false;
  }
  const classroom = currentClass();
  delete classroom.practiced[id];
  persist();
  toast("Practice mark removed for " + classroom.name + ".");
  return true;
}
function recordRecent(id) {
  state.recent = [id, ...state.recent.filter(item => item !== id)].slice(0, 5);
  persist();
}
function matchesActivity(activity, filters = state.filters, category = "", search = "", skills = {}) {
  const skillMatch = (!category || activity.category === category) &&
    (!skills[activity.category] || activity.skill === skills[activity.category]);
  return skillMatch &&
    (!search || (activity.name + " " + activity.sessionTitle + " " + activity.sourceSkillTags.join(" ")).toLowerCase().includes(search.toLowerCase().trim())) &&
    (!filters.group || activity.group === filters.group) &&
    (!filters.space || activity.space === "Either" || activity.space === filters.space) &&
    matchesTimeRange(activity.duration, filters.time) &&
    (!filters.equipment || activity.equipment === filters.equipment);
}
function combinedMaterials() {
  const materials = new Map();
  state.saved.forEach(id => {
    findActivity(id).materials.forEach(material => {
      const key = material.name.toLowerCase();
      const existing = materials.get(key) ?? { key, name: material.name, alternatives: new Set(), activities: [] };
      existing.alternatives.add(material.substitution);
      existing.activities.push(findActivity(id).name);
      materials.set(key, existing);
    });
  });
  return [...materials.values()].sort((a, b) => a.name.localeCompare(b.name));
}

// Non-overlapping classroom-duration groups: 10 minutes belongs to 5–10.
function matchesTimeRange(minutes, range) {
  if (!range) return true;
  if (range === "under-5") return minutes < 5;
  if (range === "5-10") return minutes >= 5 && minutes <= 10;
  if (range === "10-20") return minutes > 10 && minutes <= 20;
  return false;
}

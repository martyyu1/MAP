// Keep the storage key so existing saved activities survive the upgrade.
const STORAGE_KEY = "map-v02";
const emptyFilters = () => ({ group: "", space: "", time: "", equipment: "" });
const defaultState = () => ({
  saved: [], recent: [], filters: emptyFilters(),
  materialChecks: {}, showClassStars: false,
  signedIn: false, activeClassId: "sunflower"
});
let stored;
try { stored = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch {}
const state = {
  ...defaultState(), ...stored,
  filters: { ...emptyFilters(), ...stored?.filters },
  // Older versions had one shared history. Preserve it in the first class.
  classes: stored?.classes ?? [
    { id: "sunflower", name: "Sunflower Class", practiced: stored?.practiced ?? {} },
    { id: "bluebird", name: "Bluebird Class", practiced: {} }
  ]
};
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
function findActivity(id) { return activities.find(activity => activity.id === id); }
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
  return (!category || activity.category === category) &&
    (!skills[activity.category] || activity.skill === skills[activity.category]) &&
    (!search || (activity.name + " " + activity.skill + " " + activity.category).toLowerCase().includes(search.toLowerCase().trim())) &&
    (!filters.group || activity.group === filters.group) &&
    (!filters.space || activity.space === "Either" || activity.space === filters.space) &&
    (!filters.time || activity.duration <= Number(filters.time)) &&
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

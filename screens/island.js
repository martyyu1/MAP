// Two-level islands: skill destinations on the world, all matching videos in a scene.
let mapDisposer;
let skillTravel;
let arrivedSkill;
let travelVersion = 0;
const islandCameras = {};
function disposeIslandMap() {
  arrivedSkill = undefined;
  travelVersion += 1;
  if (skillTravel) skillTravel.cancel();
  skillTravel = undefined;
  if (mapDisposer) mapDisposer();
  mapDisposer = undefined;
}
function worldPath(skills) {
  const points = skills.map(skill => [SKILL_PLACES[skill].x * 16, SKILL_PLACES[skill].y * 10]);
  let path = "M" + points[0].join(" ");
  points.slice(1).forEach(([x, y], index) => {
    const [lastX, lastY] = points[index];
    const middle = (lastX + x) / 2;
    path += "C" + middle + " " + lastY + " " + middle + " " + y + " " + x + " " + y;
  });
  return path;
}
function renderIsland(matches) {
  const category = libraryState.category;
  const selected = libraryState.skills[category];
  if (selected) return renderSkillScene(category, selected, matches);
  const skills = CATEGORIES[category].skills;
  return `${skillHeader(category)}
    <section class="world-shell ${categoryClass(category)}" aria-label="${category} island">
      <div class="world-toolbar"><div><h3>${category} island</h3><p>Click a skill to move the fox. Click it again to see lessons.</p></div>
        <div class="map-tools" role="group" aria-label="Map zoom"><button data-map-zoom="out" aria-label="Zoom out">−</button><output id="map-zoom-label" aria-live="polite">100%</output><button data-map-zoom="in" aria-label="Zoom in">+</button><button data-map-fit>Fit island</button></div>
      </div>
      <div class="world-viewport" tabindex="0" role="region" aria-label="Interactive island. Drag to move. Use plus and minus to zoom, or arrow keys to pan.">
        <div class="world-canvas">
          ${IslandArt(category)}
          <svg class="world-path" viewBox="0 0 1600 1000" aria-hidden="true"><path d="${worldPath(skills)}"/></svg>
          ${skills.map(skill => {
            const place = SKILL_PLACES[skill];
            const lessons = matches.filter(activity => activity.category === category && activity.skill === skill);
            const practiced = lessons.filter(activity => practiceRecords()[activity.id]).length;
            return `<button class="skill-destination" data-skill-place="${skill}" style="--place-x:${place.x}%;--place-y:${place.y}%" aria-label="${skill}, ${lessons.length} lessons${state.signedIn ? ", " + practiced + " practiced" : ""}">
              ${placeArt(skill)}
              <span class="place-label"><strong>${skill}</strong><small>${lessons.length} lessons${state.signedIn ? " · " + practiced + " practiced" : ""}</small></span>
            </button>`;
          }).join("")}
          <img class="world-fox" src="assets/explorer-fox.png" alt="" draggable="false">
        </div>
      </div>
      <p class="map-instructions">Drag to explore · Pinch or use + / − to zoom · Select a place or a skill above</p>
    </section>`;
}
function renderSkillScene(category, skill, matches) {
  const place = SKILL_PLACES[skill];
  const lessons = matches.filter(activity => activity.category === category && activity.skill === skill);
  const practiced = lessons.filter(activity => practiceRecords()[activity.id]).length;
  return `${skillHeader(category)}
    <section class="skill-stage ${categoryClass(category)}" aria-label="${skill} lessons">
      <div class="skill-scene-hero">
        <div class="scene-landscape">${IslandArt(category)}</div>
        ${placeArt(skill, "scene-closeup")}
        <div class="skill-scene-copy"><button class="button secondary" data-all-skills>← All skills</button><h3>${skill}</h3><p>${lessons.length} lessons${state.signedIn ? " · " + practiced + " practiced for " + escapeHtml(currentClass().name) : ""}</p><p class="scene-goal">${skillContent[skill].goal}</p></div>
      </div>
      <div class="scene-lessons">${lessons.length ? `<div class="activity-grid">${lessons.map(activity => ActivityCard(activity, skill)).join("")}</div>` : emptyLibrary()}</div>
    </section>`;
}
function mountIslandMap() {
  const viewport = document.querySelector(".world-viewport");
  if (!viewport) return;
  const canvas = viewport.querySelector(".world-canvas");
  const shell = viewport.closest(".world-shell");
  const camera = islandCameras[libraryState.category] ?? { zoom: viewport.clientWidth < 600 ? 2.2 : 1.15, x: 0, y: 0, fit: 1 };
  islandCameras[libraryState.category] = camera;
  let initialized = false;
  let suppressClick = false;
  const pointers = new Map();
  let gesture;
  function apply() {
    const scale = camera.fit * camera.zoom;
    const width = 1600 * scale;
    const height = 1000 * scale;
    camera.x = width <= viewport.clientWidth ? (viewport.clientWidth - width) / 2 : Math.min(35, Math.max(viewport.clientWidth - width - 35, camera.x));
    camera.y = height <= viewport.clientHeight ? (viewport.clientHeight - height) / 2 : Math.min(35, Math.max(viewport.clientHeight - height - 35, camera.y));
    canvas.style.transform = "translate(" + camera.x + "px," + camera.y + "px) scale(" + scale + ")";
    canvas.style.setProperty("--label-scale", 1 / scale);
    canvas.classList.toggle("compact-labels", scale < .3);
    shell.querySelector("#map-zoom-label").textContent = Math.round(camera.zoom * 100) + "%";
    shell.querySelector('[data-map-zoom="out"]').disabled = camera.zoom <= 1;
    shell.querySelector('[data-map-zoom="in"]').disabled = camera.zoom >= 3.5;
  }
  function center() {
    const scale = camera.fit * camera.zoom;
    camera.x = (viewport.clientWidth - 1600 * scale) / 2;
    camera.y = (viewport.clientHeight - 1000 * scale) / 2;
  }
  function resize() {
    camera.fit = Math.min(viewport.clientWidth / 1600, viewport.clientHeight / 1000) * .96;
    if (!initialized || camera.zoom === 1) center();
    initialized = true;
    apply();
  }
  function zoom(value, anchorX = viewport.clientWidth / 2, anchorY = viewport.clientHeight / 2) {
    const next = Math.min(3.5, Math.max(1, value));
    const ratio = next / camera.zoom;
    camera.x = anchorX - (anchorX - camera.x) * ratio;
    camera.y = anchorY - (anchorY - camera.y) * ratio;
    camera.zoom = next;
    apply();
  }
  shell.querySelector('[data-map-zoom="in"]').addEventListener("click", () => zoom(camera.zoom * 1.25));
  shell.querySelector('[data-map-zoom="out"]').addEventListener("click", () => zoom(camera.zoom / 1.25));
  shell.querySelector("[data-map-fit]").addEventListener("click", () => {
    camera.zoom = 1;
    center();
    apply();
  });
  viewport.addEventListener("keydown", event => {
    if (event.target !== viewport) return;
    const actions = {
      ArrowLeft: () => { camera.x += 60; },
      ArrowRight: () => { camera.x -= 60; },
      ArrowUp: () => { camera.y += 60; },
      ArrowDown: () => { camera.y -= 60; },
      "+": () => zoom(camera.zoom * 1.25),
      "=": () => zoom(camera.zoom * 1.25),
      "-": () => zoom(camera.zoom / 1.25)
    };
    if (actions[event.key]) {
      event.preventDefault();
      actions[event.key]();
      apply();
    }
  });
  viewport.addEventListener("wheel", event => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoom(camera.zoom * Math.exp(-event.deltaY * .006), event.clientX - rect.left, event.clientY - rect.top);
  }, { passive: false });
  function beginGesture() {
    const values = [...pointers.values()];
    gesture = { x: camera.x, y: camera.y, zoom: camera.zoom, start: values[0] };
    if (values.length === 2) {
      gesture.distance = Math.hypot(values[1].x - values[0].x, values[1].y - values[0].y);
    }
  }
  viewport.addEventListener("pointerdown", event => {
    suppressClick = false;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (!event.target.closest("button")) viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
    beginGesture();
  });
  viewport.addEventListener("pointermove", event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const values = [...pointers.values()];
    if (values.length === 2 && gesture.distance) {
      suppressClick = true;
      viewport.setPointerCapture(event.pointerId);
      const distance = Math.hypot(values[1].x - values[0].x, values[1].y - values[0].y);
      const rect = viewport.getBoundingClientRect();
      zoom(gesture.zoom * distance / gesture.distance, (values[0].x + values[1].x) / 2 - rect.left, (values[0].y + values[1].y) / 2 - rect.top);
    } else {
      const dx = event.clientX - gesture.start.x;
      const dy = event.clientY - gesture.start.y;
      suppressClick = Math.abs(dx) + Math.abs(dy) > 6;
      if (suppressClick) viewport.setPointerCapture(event.pointerId);
      camera.x = gesture.x + dx;
      camera.y = gesture.y + dy;
      apply();
    }
  });
  function endPointer(event) {
    pointers.delete(event.pointerId);
    if (pointers.size) beginGesture();
    else viewport.classList.remove("is-dragging");
  }
  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  viewport.addEventListener("click", event => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);
  const observer = new ResizeObserver(resize);
  observer.observe(viewport);
  resize();
  mapDisposer = () => observer.disconnect();
}

// First click travels and stays on the map. A second click after arrival opens lessons.
async function visitSkillPlace(skill) {
  if (arrivedSkill === skill) {
    libraryState.skills[libraryState.category] = skill;
    updateLibrary();
    return;
  }
  arrivedSkill = undefined;
  const fox = document.querySelector(".world-fox");
  if (!fox) return;
  const version = ++travelVersion;
  const start = { left: getComputedStyle(fox).left, top: getComputedStyle(fox).top };
  if (skillTravel) skillTravel.cancel();
  document.querySelectorAll("[data-skill-place]").forEach(button => button.setAttribute("aria-pressed", "false"));
  const place = SKILL_PLACES[skill];
  const finish = { left: place.x * 16 - 45 + "px", top: place.y * 10 - 70 + "px" };
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    skillTravel = fox.animate([start, finish], { duration: 400, easing: "ease-in-out", fill: "forwards" });
    await skillTravel.finished.catch(() => {});
  }
  if (version !== travelVersion) return;
  Object.assign(fox.style, finish);
  if (skillTravel) skillTravel.cancel();
  skillTravel = undefined;
  arrivedSkill = skill;
  const button = [...document.querySelectorAll("[data-skill-place]")].find(button => button.dataset.skillPlace === skill);
  button?.setAttribute("aria-pressed", "true");
}

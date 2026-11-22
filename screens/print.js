// Clean handouts share the same activity data as the teaching screens.
function handoutMarkup(activity) {
  return `<article class="print-handout"><h1>${activity.name}</h1><p>${activity.category} · ${activity.skill} · ${activity.duration} minutes · Difficulty ${activity.difficulty} of 4 · ${activity.effort} effort</p><h2>Goal</h2><p>${activity.goal}</p><h2>Materials and substitutions</h2>${activity.materials.length ? `<ul>${activity.materials.map(material => `<li>${material.name} — Don't have it? Use ${material.substitution.toLowerCase()}.</li>`).join("")}</ul>` : "<p>Nothing needed.</p>"}<h2>Setup</h2><p>${activity.setup}</p><h2>Set up and steps</h2><ol>${activity.steps.map(step => `<li><strong>${step.title}</strong> — ${step.text} “${step.cue}”</li>`).join("")}</ol><p>Then let children practice.</p><h2>Make it easier</h2><ul>${activity.easier.map(change => `<li>${escapeHtml(change)}</li>`).join("")}</ul><p>Good for: ${activity.easierGood}</p><h2>Add a challenge</h2><ul>${activity.challenge.map(change => `<li>${escapeHtml(change)}</li>`).join("")}</ul><p>Good for: ${activity.challengeGood}</p></article>`;
}
function printActivity(id) {
  document.querySelector("#print-root").innerHTML = handoutMarkup(findActivity(id));
  window.print();
}

function printMaterials() {
  const materials = combinedMaterials();
  document.querySelector("#print-root").innerHTML = `<article class="print-handout"><h1>Materials to prepare</h1><p>Movement, Activity &amp; Play</p><ul>${materials.map(material => `<li>${state.materialChecks[material.key] ? "☑" : "☐"} <strong>${material.name}</strong> — Use ${escapeHtml([...material.alternatives].join(" or ").toLowerCase())} as a substitution.<br>For ${material.activities.join(", ")}</li>`).join("")}</ul>${materials.length ? "" : "<p>No materials to gather.</p>"}</article>`;
  window.print();
}

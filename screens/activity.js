function materialsChecklist(activity) {
  return activity.materials.length ? `<ul class="materials-list">${activity.materials.map((material, i) => `<li><label><input type="checkbox" data-material="${escapeHtml(material.name.toLowerCase())}" ${state.materialChecks[material.name.toLowerCase()] ? "checked" : ""}><span>${material.name}</span></label><small>Don't have it? Use ${material.substitution.toLowerCase()}.</small></li>`).join("")}</ul>` : '<p>Nothing needed.</p>';
}
function photoPlaceholder(activity, step, index) {
  return `<div class="photo-placeholder">${ActivityArt(activity, "Step " + (index + 1) + " illustration placeholder")}<span>Step ${index + 1} photo placeholder</span></div>`;
}
function chapterList(activity, large = false) {
  return `<div class="timestamp-list ${large ? "large-timestamps" : ""}">${activity.video.chapters.map(chapter => `<button data-timestamp="${chapter.time}" aria-label="Seek to ${formatTime(chapter.time)}, ${chapter.label}"><span class="timestamp-thumb" aria-hidden="true">${ActivityArt(activity)}</span><span class="timestamp-time">${formatTime(chapter.time)}</span><span>${chapter.label}</span></button>`).join("")}</div>`;
}
function videoPlaceholder(activity, large = false) {
  return `<div class="video-placeholder ${large ? "watch-player" : ""}">${ActivityArt(activity, "Movement video placeholder")}
    <div class="video-overlay"><button class="video-play" data-play aria-label="Play video preview">${icon("play", 30)}<span>Play preview</span></button><p>Video placeholder · ${formatTime(activity.video.length)}</p></div></div>
    <div class="video-controls"><span data-video-time>0:00 / ${formatTime(activity.video.length)}</span><span>Placeholder preview</span></div>`;
}
function renderActivity(activity) {
  document.querySelector("#main").innerHTML = `<div class="page activity-page ${categoryClass(activity.category)}"><a class="back-link" href="#/library?category=${encodeURIComponent(activity.category)}">← Movement Library</a>
    <div class="activity-title"><div><span class="category-label">${activity.category} · ${activity.skill}</span><h1>${activity.name}</h1></div><div class="activity-practice-controls"><span class="activity-class-context">${state.signedIn ? "Practice for " + escapeHtml(currentClass().name) : "Log in to track class practice"}</span>${PracticeButton(activity)}</div></div>
    <div class="activity-meta"><span class="difficulty-caption">Difficulty ${DifficultyStars(activity)}</span>${EffortPill(activity.effort)}<span>${activity.duration} min</span><span>${activity.space === "Either" ? "Indoor or outdoor" : activity.space}</span><span>${activity.group}</span></div>
    <p class="goal"><strong>Goal</strong> ${activity.goal}</p>
    <div class="activity-actions">${SaveButton(activity, true)}<a class="button primary" href="#/teach/${activity.id}">Teach ${icon("play")}</a><a class="button secondary" href="#/watch/${activity.id}">Watch with the class</a><button class="button secondary" data-print-activity="${activity.id}">${icon("print")} Print setup handout</button></div>
    <p class="content-notice">${CONTENT_NOTICE}</p>
    <div class="activity-preparation"><section class="video-section" aria-label="Instructional video">${videoPlaceholder(activity)}<h2>Video timestamps</h2><p class="helper">Preview chapters below. Approved video and thumbnails will be added here.</p>${chapterList(activity)}</section>
      <aside class="setup-panel"><h2>Materials</h2>${materialsChecklist(activity)}<h2>Setup</h2><p>${activity.setup}</p><div class="teacher-note"><strong>Watch. Guide. Practice.</strong><p>Use the video to introduce the skill, guide children through the steps, then give them time to practice.</p></div></aside></div>
    <section class="steps-section" aria-labelledby="steps-title"><h2 id="steps-title">Set up and steps</h2><ol class="steps-list">${activity.steps.map((step, i) => `<li>${photoPlaceholder(activity, step, i)}<div><span class="step-number">${i + 1}</span><h3>${step.title}</h3><p>${step.text}</p><blockquote>“${step.cue}”</blockquote></div></li>`).join("")}</ol><p class="practice-prompt">Then let children practice.</p></section>
    <section class="adjustments" aria-label="Adapt the activity">${adjustment(activity, "easier", "− Make it easier")}${adjustment(activity, "challenge", "+ Add a challenge")}</section>
    <section class="related-section"><h2>More ways to practice ${activity.skill}</h2><div class="activity-grid">${activity.related.map(findActivity).map(ActivityCard).join("")}</div></section></div>`;
}
function adjustment(activity, kind, title) {
  return `<details class="adjustment"><summary>${title}</summary><ul>${activity[kind].map(change => `<li>${escapeHtml(change)}</li>`).join("")}</ul><p><strong>Good for:</strong> ${activity[kind + "Good"]}</p></details>`;
}

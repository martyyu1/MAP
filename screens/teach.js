let teachStep = 0;
function renderTeach(activity, reset = true) {
  if (reset) teachStep = 0;
  const step = activity.steps[teachStep];
  document.querySelector("#main").innerHTML = `<div class="teaching-screen ${categoryClass(activity.category)}">
    <div class="teach-toolbar"><span>${activity.name} · Step ${teachStep + 1} of 4</span><div><button class="button secondary" data-print-activity="${activity.id}" aria-label="Print setup handout">${icon("print", 28)} Print</button><a class="button secondary" href="#/activity/${activity.id}" aria-label="Close Teach view">${icon("close", 28)}</a></div></div>
    <div class="teach-layout"><div class="teach-photo">${photoPlaceholder(activity, step, teachStep)}<span id="clip-feedback" role="status"></span></div><div class="teach-copy"><h1>${step.title}</h1><blockquote>“${step.cue}”</blockquote><p>${step.text}</p></div></div>
    <div class="teach-controls"><button class="button secondary" data-teach-back ${teachStep === 0 ? "disabled" : ""}>← Back</button><button class="button secondary" data-replay>Replay clip</button>${teachStep < 3 ? '<button class="button primary" data-teach-next>Next →</button>' : PracticeButton(activity, "teach")}</div>
  </div>`;
}

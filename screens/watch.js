// The video is a clearly marked placeholder with a timed preview.
// It never writes practiced status.
let videoTime = 0;
let videoPlaying = false;
let videoInterval;
function stopVideoPreview() {
  clearInterval(videoInterval);
  videoPlaying = false;
}
function renderWatch(activity) {
  document.querySelector("#main").innerHTML = `<div class="watch-screen ${categoryClass(activity.category)}"><div class="watch-toolbar"><h1>${activity.name}</h1><a class="button secondary" href="#/activity/${activity.id}" aria-label="Close Watch with the class">${icon("close", 32)}</a></div><div class="watch-layout"><section aria-label="Video player">${videoPlaceholder(activity, true)}<p class="watch-note">Video placeholder · Preview only</p></section><section class="watch-chapters"><h2>Video timestamps</h2>${chapterList(activity, true)}</section></div></div>`;
}
function updateVideoUI() {
  const activity = currentActivity();
  const control = document.querySelector("[data-play]");
  if (!control || !activity) return;
  control.innerHTML = videoPlaying ? '<span aria-hidden="true">Ⅱ</span><span>Pause preview</span>' : icon("play", 30) + '<span>Play preview</span>';
  control.setAttribute("aria-label", videoPlaying ? "Pause video preview" : "Play video preview");
  document.querySelectorAll("[data-video-time]").forEach(node => { node.textContent = formatTime(videoTime) + " / " + formatTime(activity.video.length); });
  const chapters = activity.video.chapters;
  const active = [...chapters].reverse().find(chapter => videoTime >= chapter.time);
  document.querySelectorAll("[data-timestamp]").forEach(button => {
    button.setAttribute("aria-current", String(Number(button.dataset.timestamp) === active?.time));
  });
}
function toggleVideoPreview() {
  const activity = currentActivity();
  if (videoPlaying) stopVideoPreview();
  else {
    if (videoTime >= activity.video.length) videoTime = 0;
    videoPlaying = true;
    videoInterval = setInterval(() => {
      videoTime += 1;
      if (videoTime >= activity.video.length) stopVideoPreview();
      updateVideoUI();
    }, 1000);
  }
  updateVideoUI();
}

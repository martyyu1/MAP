// YouTube handles playback. Watching never changes class practice records.
let lessonPlayer;
let playerReady = false;
let pendingVideoTime;
let videoInterval;
let playerVersion = 0;
let youtubeApiPromise;
function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve, reject) => {
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => { youtubeApiPromise = undefined; reject(new Error("YouTube API unavailable")); };
      document.head.append(script);
    });
  }
  return youtubeApiPromise;
}
function stopVideoPlayer() {
  playerVersion += 1;
  clearInterval(videoInterval);
  lessonPlayer?.destroy();
  lessonPlayer = undefined;
  playerReady = false;
  pendingVideoTime = undefined;
}
function videoStatus(message) {
  const status = document.querySelector(".player-status");
  if (status) { status.textContent = message; status.hidden = !message; }
}
async function mountVideoPlayer() {
  stopVideoPlayer();
  const version = playerVersion;
  const iframe = document.querySelector("#lesson-video");
  if (!iframe) return;
  try {
    const YT = await loadYouTubeAPI();
    if (version !== playerVersion || !iframe.isConnected) return;
    lessonPlayer = new YT.Player(iframe, { events: {
      onReady: () => {
        if (version !== playerVersion) return;
        playerReady = true;
        if (pendingVideoTime !== undefined) seekLessonVideo(pendingVideoTime);
        videoInterval = setInterval(updateVideoChapters, 500);
      },
      onError: () => {
        if (version === playerVersion) videoStatus("This video cannot play here right now. Try the YouTube link below.");
      },
      onStateChange: () => { if (version === playerVersion) updateVideoChapters(); }
    } });
  } catch {
    // The normal iframe player still works if the optional API is blocked.
  }
}
function updateVideoChapters() {
  if (!playerReady || !lessonPlayer?.getCurrentTime) return;
  const time = lessonPlayer.getCurrentTime();
  const active = [...(currentActivity()?.video.chapters ?? [])].reverse().find(chapter => time >= chapter.time);
  document.querySelectorAll("[data-timestamp]").forEach(button => {
    button.setAttribute("aria-current", String(Number(button.dataset.timestamp) === active?.time));
  });
}
function seekLessonVideo(time) {
  if (playerReady) {
    lessonPlayer.seekTo(time, true);
    lessonPlayer.playVideo();
    pendingVideoTime = undefined;
    updateVideoChapters();
  } else {
    pendingVideoTime = time;
    // A native embed fallback also supports chapter selection without the API.
    const iframe = document.querySelector("#lesson-video");
    if (iframe && !lessonPlayer) {
      const url = new URL(iframe.src);
      url.searchParams.set("start", Math.floor(time));
      url.searchParams.set("autoplay", "1");
      iframe.src = url.href;
    }
  }
}
function renderWatch(activity) {
  document.querySelector("#main").innerHTML = `<div class="watch-screen ${categoryClass(activity.category)}"><div class="watch-toolbar"><h1>${activity.name}</h1><a class="button secondary" href="#/activity/${activity.id}" aria-label="Close Watch with the class">${icon("close", 32)}</a></div><div class="watch-layout"><section aria-label="Video player">${videoPlayer(activity, true)}</section><section class="watch-chapters"><h2>Video timestamps</h2>${chapterList(activity, true)}</section></div></div>`;
  mountVideoPlayer();
}

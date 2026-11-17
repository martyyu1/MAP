// Demo account controls mirror the original prototype's browser-local login.
function AccountControls() {
  if (!state.signedIn) {
    return '<div class="account-controls"><button class="button primary" data-login>Log in</button></div>';
  }
  return `<div class="account-controls"><label class="class-switch"><span>Demo teacher · Current class</span><select id="active-class" aria-label="Current class">${state.classes.map(classroom => `<option value="${escapeHtml(classroom.id)}" ${classroom.id === state.activeClassId ? "selected" : ""}>${escapeHtml(classroom.name)}</option>`).join("")}</select></label><button class="button secondary" data-logout>Log out</button></div>`;
}
function openAccountDialog() {
  const dialog = document.querySelector("#account-dialog");
  dialog.innerHTML = `<div class="dialog-heading"><h2 id="account-title">Your teacher account</h2><form method="dialog"><button class="button secondary" aria-label="Close login">${icon("close")}</button></form></div><p class="account-intro">Keep practice progress for each of your classes.</p><div class="demo-account"><strong>Demo teacher</strong><p>Sunflower Class &amp; Bluebird Class</p></div><button class="button primary" data-demo-login>Continue as demo teacher</button><p class="helper">Demo login. Progress stays in this browser. Existing practice history is kept in Sunflower Class.</p>`;
  dialog.showModal();
}
// Refresh only the visible screen so switching classes preserves library filters
// and the current teaching step.
function refreshClassProgress() {
  clearTimeout(islandTimer);
  if (screen === "library") updateLibrary();
  else if (screen === "saved") renderSaved();
  else if (screen === "activity" && currentActivity()) {
    stopVideoPreview();
    renderActivity(currentActivity());
    updateVideoUI();
  }
  else if (screen === "teach" && currentActivity()) renderTeach(currentActivity(), false);
  else if (screen === "home") renderHome();
  renderTopbar();
}

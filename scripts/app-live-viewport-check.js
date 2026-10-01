// App Live viewport health probe - run in the App Live tab with Claude in Chrome `javascript_tool`
// (paste the whole file as the `text`). Read-only: it inspects the page, it never clicks or types.
// Procedure and thresholds: QA-RUN.md §8 "BrowserStack App Live viewport stability & recovery".
//
// Returns { ok, problems[], actions[], ...measurements }.
//   ok = true  -> device viewport visible and usable; continue testing.
//   ok = false -> do NOT send device input; follow `actions` (recovery), then run this probe again.
(() => {
  const MIN_VIEWPORT = { w: 900, h: 500 };  // App Live page area (CSS px) needed for a readable device
  const MIN_DEVICE = { w: 180, h: 380 };    // rendered device stream (#bslive_video) size
  const problems = [];
  const actions = [];

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const visibility = document.visibilityState;
  const focused = document.hasFocus();
  const zoomHint = window.outerWidth && vw ? +(window.outerWidth / vw).toFixed(2) : null;
  // Windows parks minimised windows off-screen (screenX/Y around -25600/-32000) with a tiny outer size.
  const minimised = window.screenX <= -20000 || window.screenY <= -20000 || window.outerHeight < 100;

  const video = document.querySelector('#bslive_video, video.real-mobile-video');
  let device = null;
  if (video) {
    const r = video.getBoundingClientRect();
    device = {
      w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y),
      readyState: video.readyState, paused: video.paused,
      inView: r.right <= vw + 1 && r.bottom <= vh + 1 && r.x >= -1 && r.y >= -1,
    };
  }

  const logcat = document.querySelector('.al-devtool.logs-panel-right, .al-devtool');
  const logcatWidth = logcat ? Math.round(logcat.getBoundingClientRect().width) : 0;
  const sessionEnded = /session (has )?(ended|expired|timed out)|idle timeout/i.test(document.body.innerText.slice(0, 5000));

  if (sessionEnded) {
    problems.push('App Live session ended/timed out');
    actions.push('Session is gone - start a new App Live session (same device); the APK is reinstalled, so re-do onboarding skip and ask the user to log in again');
  }
  if (minimised) {
    problems.push(`Chrome window is MINIMISED (screenX=${window.screenX}, outer ${window.outerWidth}x${window.outerHeight})`);
    actions.push('Fullscreen restore: arm a once-only click handler calling document.documentElement.requestFullscreen(), then left_click a neutral page area (QA-RUN.md section 8); if that fails, automatic session rebuild');
  }
  // visibilityState is unreliable for the Claude in Chrome window (reports 'hidden' while it still paints), so it is only a
  // warning; a minimised window (above) or failing screenshots are the real signals.
  const warnings = [];
  if (visibility !== 'visible' && !minimised) warnings.push(`visibilityState=${visibility} (may still paint - confirm with one screenshot)`);
  if (vw < MIN_VIEWPORT.w || vh < MIN_VIEWPORT.h) {
    problems.push(`page viewport collapsed (${vw}x${vh}, outer/inner ratio ${zoomHint})`);
    actions.push('Try resize_window to ~1550x820; if innerWidth/innerHeight stay small, ask the user to press Ctrl+0 in the App Live tab and close side panels');
  }
  if (!device) {
    problems.push('device stream element not found (#bslive_video)');
    actions.push('Wait 5-10 s for the device renderer; if still missing take one screenshot to see whether the session ended');
  } else {
    if (device.w < MIN_DEVICE.w || device.h < MIN_DEVICE.h) {
      problems.push(`device rendered too small (${device.w}x${device.h})`);
      actions.push('Collapse the DevTools/Logcat panel (toolbar "DevTools" toggle) and/or use toolbar Zoom -/+ to fit the device');
    }
    if (!device.inView) {
      problems.push('device not fully inside the viewport');
      actions.push('Reset App Live toolbar Zoom (use "-") so the whole device fits without scrollbars');
    }
    if (device.readyState < 2) {
      problems.push(`device stream not rendering (video readyState=${device.readyState})`);
      actions.push('Wait 5-10 s for the renderer to recover before any device input');
    }
  }
  if (logcatWidth > 300 && device && device.w < MIN_DEVICE.w) {
    actions.push(`Logcat panel uses ${logcatWidth}px - collapse it`);
  }

  return {
    ok: problems.length === 0,
    problems,
    warnings,
    actions: [...new Set(actions)],
    viewport: { w: vw, h: vh, visibility, focused, zoomHint, minimised, screenX: window.screenX, outer: [window.outerWidth, window.outerHeight] },
    device,
    logcatWidth,
    checkedAt: new Date().toISOString(),
  };
})();

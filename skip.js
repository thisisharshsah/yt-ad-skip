/*
 * Skip YouTube video ads.
 *
 * While the player shows an ad (#movie_player gets the class `ad-showing`):
 * press Skip as soon as there is one; until then, or for an ad with no Skip,
 * mute it and jump to its end. The sound and speed you had come back when
 * the ad is over. Overlay banners on the video are closed.
 *
 * YouTube changes its page often; if ads start playing again, the class and
 * button names below are the place to look.
 */
(() => {
  const SKIP = [
    ".ytp-skip-ad-button",
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    ".ytp-ad-skip-button-container button",
    "button[id^='skip-button']",
  ].join(",");
  const CLOSE = ".ytp-ad-overlay-close-button, .ytp-ad-overlay-close-container button";

  let saved = null; // { muted, rate } from before the ad
  let skipped = 0;

  const player = () => document.querySelector("#movie_player, .html5-video-player");
  const video = () => player()?.querySelector("video.html5-main-video, video");

  function duringAd(p, v) {
    if (!saved) saved = { muted: v.muted, rate: v.playbackRate };
    const skip = p.querySelector(SKIP) || document.querySelector(SKIP);
    if (skip && skip.offsetParent !== null) {
      skip.click();
      return;
    }
    v.muted = true;
    if (Number.isFinite(v.duration) && v.duration > 0.5 && v.currentTime < v.duration - 0.3) {
      v.currentTime = v.duration - 0.1;
      skipped++;
    } else {
      // Duration not known yet: run it as fast as the browser allows.
      v.playbackRate = 16;
    }
  }

  function afterAd(v) {
    if (!saved) return;
    v.muted = saved.muted;
    v.playbackRate = saved.rate || 1;
    saved = null;
  }

  function tick() {
    const p = player();
    const v = video();
    document.querySelectorAll(CLOSE).forEach((b) => b.click());
    if (!p || !v) return;
    if (p.classList.contains("ad-showing") || p.classList.contains("ad-interrupting")) duringAd(p, v);
    else afterAd(v);
  }

  // Changes to the player's classes catch an ad the moment it starts; the
  // interval covers anything the observer misses (SPA navigation, late DOM).
  const watch = () => {
    const p = player();
    if (!p || p.dataset.adSkipWatched) return;
    p.dataset.adSkipWatched = "1";
    new MutationObserver(tick).observe(p, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true });
  };
  setInterval(() => {
    watch();
    tick();
  }, 300);
  window.addEventListener("yt-navigate-finish", () => {
    watch();
    tick();
  });
})();

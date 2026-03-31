// content.js
(function () {
  if (window.__invisibleAddictionInjected) return;
  window.__invisibleAddictionInjected = true;

  let lastScrollY    = window.scrollY;
  let lastTimestamp  = performance.now();
  let speedSamples   = [];
  let dwellStart     = null;
  let totalDwellTime = 0;

  window.addEventListener("scroll", () => {
    const now    = performance.now();
    const deltaY = Math.abs(window.scrollY - lastScrollY);
    const deltaT = now - lastTimestamp;

    if (deltaT > 0 && deltaY > 0) {
      speedSamples.push(deltaY / deltaT);
      dwellStart = null;
    }

    lastScrollY   = window.scrollY;
    lastTimestamp = now;
  }, { passive: true });

  setInterval(() => {
    const timeSinceScroll = performance.now() - lastTimestamp;
    if (timeSinceScroll >= 2000) {
      if (!dwellStart) {
        dwellStart = performance.now();
      } else {
        totalDwellTime += (performance.now() - dwellStart) / 1000;
        dwellStart = performance.now();
      }
    }
  }, 1000);

  setInterval(() => {
    if (speedSamples.length === 0) return;

    const avgSpeed = speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length;
    const maxSpeed = Math.max(...speedSamples);

    chrome.runtime.sendMessage({
      type: "SCROLL_DATA",
      payload: {
        speed:     parseFloat(avgSpeed.toFixed(4)),
        maxSpeed:  parseFloat(maxSpeed.toFixed(4)),
        dwellTime: parseFloat(totalDwellTime.toFixed(2)),
        timestamp: Date.now(),
        url:       window.location.href,
      }
    }, () => { void chrome.runtime.lastError; });

    speedSamples = [];
  }, 3000);
})();
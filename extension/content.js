// extension/content.js — Member 1: The Tracker

(function () {
  let lastScrollY = window.scrollY;
  let lastTimestamp = performance.now();
  let speedSamples = [];
  let dwellStart = null;
  let totalDwellTime = 0;

  // Listen to scroll events
  window.addEventListener("scroll", () => {
    const now = performance.now();
    const currentScrollY = window.scrollY;

    const deltaY = Math.abs(currentScrollY - lastScrollY);
    const deltaT = now - lastTimestamp;

    if (deltaT > 0) {
      const velocity = deltaY / deltaT; // pixels per millisecond
      speedSamples.push(velocity);
      dwellStart = null; // reset dwell since user is scrolling
    }

    lastScrollY = currentScrollY;
    lastTimestamp = now;
  });

  // Check for dwell/pause every 1 second
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

  // Batch & send every 3 seconds
  setInterval(() => {
    if (speedSamples.length === 0) return;

    const avgSpeed =
      speedSamples.reduce((a, b) => a + b, 0) / speedSamples.length;
    const maxSpeed = Math.max(...speedSamples);

    const payload = {
      speed: parseFloat(avgSpeed.toFixed(4)),
      maxSpeed: parseFloat(maxSpeed.toFixed(4)),
      dwellTime: parseFloat(totalDwellTime.toFixed(2)),
      timestamp: Date.now(),
      url: window.location.href,
    };

    chrome.runtime.sendMessage({ type: "SCROLL_DATA", payload });

    speedSamples = []; // reset after sending
  }, 3000);
})();
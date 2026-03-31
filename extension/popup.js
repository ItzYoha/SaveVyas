function calculateAddictionScore(logs) {
  if (!logs.length) return 0;
  let score = 50;
  for (const log of logs) {
    if (log.speed > 1.5 && log.dwellTime < 2) score += 5;
    else if (log.speed < 0.8 && log.dwellTime > 3) score -= 3;
  }
  return Math.max(0, Math.min(100, score));
}

function addictionLabel(s) {
  if (s < 10) return 'no data yet';
  if (s < 30) return 'light browsing 🟢';
  if (s < 55) return 'moderate scrolling 🟡';
  if (s < 75) return 'heavy doom-scroll ⚠️';
  return 'critical — take a break! 🔴';
}

function addictionColor(s) {
  if (s < 30) return '#4ade80';
  if (s < 55) return '#facc15';
  if (s < 75) return '#fb923c';
  return '#f87171';
}

const chart = new Chart(document.getElementById('scrollChart').getContext('2d'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label:'Speed (px/s)', data:[], borderColor:'#8b5cf6', backgroundColor:'rgba(139,92,246,0.08)', borderWidth:2, pointRadius:0, tension:0.4, fill:true },
      { label:'Dwell (s)',    data:[], borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.05)',  borderWidth:1.5, pointRadius:0, tension:0.4, fill:true }
    ]
  },
  options: {
    responsive: true, animation: { duration: 400 },
    plugins: {
      legend: { labels: { color:'#71717a', font:{ size:10 }, boxWidth:10, padding:12 } },
      tooltip: { backgroundColor:'#18181b', borderColor:'#3f3f46', borderWidth:1, titleColor:'#a1a1aa', bodyColor:'#f4f4f5', padding:8, cornerRadius:6 }
    },
    scales: {
      x: { ticks:{ color:'#52525b', font:{ size:9 } }, grid:{ color:'#1a1a1a' } },
      y: { ticks:{ color:'#52525b', font:{ size:9 } }, grid:{ color:'#1a1a1a' }, min:0 }
    }
  }
});

function updateUI(logs) {
  const total    = logs.reduce((s, d) => s + d.speed * 3000, 0);
  const peak     = logs.length ? Math.max(...logs.map(d => d.maxSpeed)) : 0;
  const score    = calculateAddictionScore(logs);
  const dwell    = logs.reduce((s, d) => s + (d.dwellTime || 0), 0);
  const avgSpeed = logs.length ? logs.reduce((s, d) => s + d.speed * 1000, 0) / logs.length : 0;

  document.getElementById('stat-total').innerHTML     = Math.round(total).toLocaleString() + '<span class="sunit">px</span>';
  document.getElementById('stat-peak').innerHTML      = peak.toFixed(2) + '<span class="sunit">px/ms</span>';
  document.getElementById('stat-avg').innerHTML       = Math.round(avgSpeed) + '<span class="sunit">px/s</span>';
  document.getElementById('stat-dwell').innerHTML     = dwell.toFixed(1) + '<span class="sunit">sec</span>';
  document.getElementById('addiction-label').textContent = addictionLabel(score);
  document.getElementById('bar-pct').textContent      = score + ' / 100';
  document.getElementById('addiction-bar').style.width = score + '%';

  const el = document.getElementById('stat-addiction');
  el.innerHTML   = score + '<span class="sunit">%</span>';
  el.style.color = addictionColor(score);

  chart.data.labels            = logs.map((_, i) => i * 3 + 's');
  chart.data.datasets[0].data  = logs.map(d => parseFloat((d.speed * 1000).toFixed(1)));
  chart.data.datasets[1].data  = logs.map(d => d.dwellTime);
  chart.update();
}

function loadData() {
  chrome.storage.local.get(['scrollData'], r => updateUI(r.scrollData || []));
}

document.getElementById('resetBtn').addEventListener('click', () => {
  chrome.storage.local.set({ scrollData: [] }, () => updateUI([]));
});

loadData();
setInterval(loadData, 5000);
const SITE_COLORS = {
  "youtube.com":   "#ff4444",
  "instagram.com": "#c13584",
  "twitter.com":   "#1da1f2",
  "x.com":         "#1da1f2",
  "reddit.com":    "#ff6314",
  "tiktok.com":    "#69c9d0",
  "facebook.com":  "#1877f2",
  "netflix.com":   "#e50914",
  "twitch.tv":     "#9146ff",
  "pinterest.com": "#e60023",
  "tumblr.com":    "#35465c",
  "snapchat.com":  "#fffc00"
};

function siteColor(d) { return SITE_COLORS[d] || "#8b5cf6"; }

function formatDur(secs) {
  if (secs < 60)  return `${secs}s`;
  if (secs < 3600) return `${Math.floor(secs/60)}m ${secs%60}s`;
  return `${Math.floor(secs/3600)}h ${Math.floor((secs%3600)/60)}m`;
}

function todaySessions(sessions) {
  const start = new Date(); start.setHours(0,0,0,0);
  return sessions.filter(s => s.startTime >= start.getTime());
}

function calcScore(today) {
  if (!today.length) return 0;
  const totalSecs     = today.reduce((s, d) => s + d.duration, 0);
  const sessionCount  = today.length;
  const compulsive    = today.filter(d => d.compulsive).length;
  const lateNight     = today.filter(d => d.hour >= 22 || d.hour <= 2).length;

  let score = 0;
  score += Math.min(30, (totalSecs   / 3600) * 30);  // 1hr = max
  score += Math.min(25, (sessionCount / 20)  * 25);  // 20 sessions = max
  score += Math.min(30, (compulsive  / 5)   * 30);   // 5 compulsive = max
  score += Math.min(15, (lateNight   / 5)   * 15);   // 5 late sessions = max
  return Math.round(Math.min(100, score));
}

function scoreLabel(s) {
  if (s === 0)  return 'No activity yet';
  if (s < 25)   return 'Healthy usage 🟢';
  if (s < 50)   return 'Moderate usage 🟡';
  if (s < 75)   return 'Heavy usage ⚠️';
  return 'Critical — take a break! 🔴';
}

function scoreColor(s) {
  if (s < 25) return '#4ade80';
  if (s < 50) return '#facc15';
  if (s < 75) return '#fb923c';
  return '#f87171';
}

// ── Charts ─────────────────────────────────────────────────────────
const hourChart = new Chart(document.getElementById('hourChart').getContext('2d'), {
  type: 'bar',
  data: {
    labels: Array.from({length:24}, (_,i) => i+'h'),
    datasets: [{ label:'Sessions', data: Array(24).fill(0),
      backgroundColor: 'rgba(139,92,246,0.6)', borderRadius: 4 }]
  },
  options: {
    responsive: true, animation: { duration: 400 },
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks:{ color:'#52525b', font:{size:8} }, grid:{ color:'#1a1a1a' } },
      y: { ticks:{ color:'#52525b', font:{size:9}, stepSize:1 }, grid:{ color:'#1a1a1a' }, min:0 }
    }
  }
});

const siteChart = new Chart(document.getElementById('siteChart').getContext('2d'), {
  type: 'doughnut',
  data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }] },
  options: {
    responsive: true, animation: { duration: 400 },
    plugins: {
      legend: { position:'right', labels:{ color:'#a1a1aa', font:{size:10}, padding:10, boxWidth:10 } }
    },
    cutout: '65%'
  }
});

// ── Render ─────────────────────────────────────────────────────────
function render(sessions) {
  const today       = todaySessions(sessions);
  const score       = calcScore(today);
  const totalSecs   = today.reduce((s, d) => s + d.duration, 0);
  const compulsive  = today.filter(d => d.compulsive).length;
  const avgDur      = today.length ? Math.round(totalSecs / today.length) : 0;

  // Clean streak — time since last session ended
  const lastEnd = today.length ? Math.max(...today.map(d => d.endTime)) : null;
  const streakSecs = lastEnd ? Math.round((Date.now() - lastEnd) / 1000) : null;

  // Score
  const scoreEl = document.getElementById('score-val');
  scoreEl.textContent = score;
  scoreEl.style.color = scoreColor(score);
  document.getElementById('score-label').textContent = scoreLabel(score);
  document.getElementById('score-bar').style.width   = score + '%';
  document.getElementById('score-bar').style.background =
    score < 25 ? '#4ade80' : score < 50 ? '#facc15' : score < 75 ? '#fb923c' : '#f87171';

  // Stats
  document.getElementById('stat-sessions').textContent  = today.length;
  document.getElementById('stat-total-time').textContent = formatDur(totalSecs);
  document.getElementById('stat-compulsive').textContent = compulsive;
  document.getElementById('stat-avg-dur').textContent    = formatDur(avgDur);
  document.getElementById('stat-streak').textContent     = streakSecs !== null ? formatDur(streakSecs) : '—';

  // Hour heatmap
  const hourCounts = Array(24).fill(0);
  today.forEach(s => hourCounts[s.hour]++);
  hourChart.data.datasets[0].data = hourCounts;
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  hourChart.data.datasets[0].backgroundColor = hourCounts.map(
    (_, i) => i === peakHour ? '#f87171' : 'rgba(139,92,246,0.5)'
  );
  hourChart.update();

  // Site breakdown doughnut
  const siteTotals = {};
  today.forEach(s => { siteTotals[s.domain] = (siteTotals[s.domain] || 0) + s.duration; });
  const siteKeys = Object.keys(siteTotals);
  siteChart.data.labels                        = siteKeys;
  siteChart.data.datasets[0].data              = siteKeys.map(k => siteTotals[k]);
  siteChart.data.datasets[0].backgroundColor   = siteKeys.map(k => siteColor(k));
  siteChart.update();

  // Recent sessions list
  const list = document.getElementById('session-list');
  const recent = [...today].reverse().slice(0, 10);
  if (!recent.length) {
    list.innerHTML = '<p style="color:#52525b;font-size:11px;text-align:center;padding:20px 0;">No sessions today yet</p>';
  } else {
    list.innerHTML = recent.map(s => `
      <div style="display:flex;justify-content:space-between;align-items:center;
                  padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:8px;height:8px;border-radius:50%;background:${siteColor(s.domain)};flex-shrink:0;"></span>
          <span style="font-size:11px;color:#a1a1aa;">${s.domain}</span>
          ${s.compulsive ? '<span style="font-size:9px;padding:1px 6px;border-radius:4px;background:rgba(248,113,113,0.15);color:#f87171;font-weight:700;">COMPULSIVE</span>' : ''}
        </div>
        <span style="font-size:11px;color:#71717a;font-family:monospace;">${formatDur(s.duration)}</span>
      </div>
    `).join('');
  }

  // Peak hour insight
  const peakEl = document.getElementById('peak-hour');
  if (Math.max(...hourCounts) > 0) {
    const suffix = peakHour < 12 ? 'AM' : 'PM';
    const h12    = peakHour % 12 || 12;
    peakEl.textContent = `Peak usage at ${h12}${suffix}`;
  } else {
    peakEl.textContent = 'No usage data yet';
  }
}

// ── Time limit ─────────────────────────────────────────────────────
let timeLimitMins = 0;
let timeLimitNotified = false;

document.getElementById('timeLimitConfirm').addEventListener('click', () => {
  const hrs  = parseInt(document.getElementById('timeLimitHr').value)  || 0;
  const mins = parseInt(document.getElementById('timeLimitMin').value) || 0;
  const total = hrs * 60 + mins;

  if (total <= 0) {
    timeLimitMins = 0; timeLimitNotified = false;
    document.getElementById('timeLimitDisplay').textContent = 'No limit set';
    document.getElementById('timeLimitDisplay').style.color = '#a78bfa';
    return;
  }
  timeLimitMins = total; timeLimitNotified = false;
  chrome.runtime.sendMessage({ type: 'SET_LIMIT', limitMins: total });
  const txt = hrs > 0 && mins > 0 ? `Limit: ${hrs}hr ${mins}min`
            : hrs > 0 ? `Limit: ${hrs}hr` : `Limit: ${mins}min`;
  document.getElementById('timeLimitDisplay').textContent = txt;
  document.getElementById('timeLimitDisplay').style.color = '#4ade80';
});

// ── Load ───────────────────────────────────────────────────────────
function loadAndRender() {
  chrome.storage.local.get(['sessions'], r => {
    const sessions = r.sessions || [];
    render(sessions);

    // Time limit check
    if (timeLimitMins > 0 && !timeLimitNotified) {
      const today     = todaySessions(sessions);
      const totalMins = today.reduce((s, d) => s + d.duration, 0) / 60;
      if (totalMins >= timeLimitMins) {
        chrome.notifications.create({
          type:'basic', iconUrl:'icons/icon128.jpeg',
          title:'⏱️ Daily Limit Reached!',
          message:`You've used doom-scroll apps for ${Math.round(totalMins)} mins today.`
        });
        timeLimitNotified = true;
      }
    }
  });
}

document.getElementById('resetBtn').addEventListener('click', () => {
  chrome.storage.local.set({ sessions: [] }, loadAndRender);
});

loadAndRender();
setInterval(loadAndRender, 5000);
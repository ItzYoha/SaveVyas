const DOOM_SITES = [
  "youtube.com","instagram.com","twitter.com","x.com",
  "reddit.com","tiktok.com","facebook.com","netflix.com",
  "twitch.tv","pinterest.com","tumblr.com","snapchat.com"
];

function getDomain(url) {
  try {
    const h = new URL(url).hostname.replace('www.','');
    return DOOM_SITES.find(s => h.includes(s)) || null;
  } catch { return null; }
}

function tsNow() { return Date.now(); }
function getHour() { return new Date().getHours(); }

const activeSessions = {};

async function getData() {
  return new Promise(r => chrome.storage.local.get(['sessions','limitMins'], d => r({
    sessions: d.sessions || [],
    limitMins: d.limitMins || 0
  })));
}

async function saveData(sessions) {
  return new Promise(r => chrome.storage.local.set({ sessions }, r));
}

function todaySessions(sessions) {
  const start = new Date(); start.setHours(0,0,0,0);
  return sessions.filter(s => s.startTime >= start.getTime());
}

async function endSession(tabId) {
  const s = activeSessions[tabId];
  if (!s) return;
  delete activeSessions[tabId];

  const duration = Math.round((tsNow() - s.startTime) / 1000);
  if (duration < 3) return;

  const { sessions, limitMins } = await getData();
  const domainSessions = sessions.filter(x => x.domain === s.domain);
  const last = [...domainSessions].reverse()[0];
  const returnGap = last ? Math.round((s.startTime - last.endTime) / 1000) : null;
  const compulsive = returnGap !== null && returnGap < 300;

  sessions.push({
    domain: s.domain, startTime: s.startTime,
    endTime: tsNow(), duration,
    hour: getHour(), returnGap, compulsive
  });

  await saveData(sessions.slice(-500));

  if (compulsive) {
    const gapStr = returnGap < 60 ? `${returnGap}s` : `${Math.floor(returnGap/60)}m`;
    chrome.notifications.create('compulsive-' + tsNow(), {
      type:'basic', iconUrl:'icons/icon128.jpeg',
      title:'👀 Compulsive Return Detected',
      message:`You opened ${s.domain} again after only ${gapStr}. That's the habit forming.`
    });
  }

  // Time limit notification
  if (limitMins > 0) {
    const today = todaySessions(sessions);
    const totalMins = today.filter(x => x.domain === s.domain)
                           .reduce((a,b) => a + b.duration, 0) / 60;
    if (totalMins >= limitMins) {
      chrome.notifications.create('limit-' + s.domain, {
        type:'basic', iconUrl:'icons/icon128.jpeg',
        title:'⏱️ Time Limit Reached!',
        message:`You've used ${s.domain} for ${Math.round(totalMins)} mins today. Limit: ${limitMins} mins.`
      });
    }
  }
}

async function startSession(tabId, domain) {
  if (activeSessions[tabId]?.domain === domain) return;
  if (activeSessions[tabId]) await endSession(tabId);
  activeSessions[tabId] = { domain, startTime: tsNow() };

  // Inject content script
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js']
  }).catch(() => {});
}

// ── Message handler ────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (msg.type === 'GET_STATUS') {
    getData().then(({ sessions, limitMins }) => {
      const today       = todaySessions(sessions);
      const domSessions = today.filter(s => s.domain === msg.domain);
      const last        = [...domSessions].reverse()[0];
      const lastGapSecs = last ? Math.round((tsNow() - last.endTime) / 1000) : null;
      const totalMins   = domSessions.reduce((a,b) => a + b.duration, 0) / 60;
      const blocked     = limitMins > 0 && totalMins >= limitMins;

      sendResponse({
        todayCount: domSessions.length,
        lastGapSecs,
        totalMins,
        limitMins,
        blocked
      });
    });
    return true;
  }

  if (msg.type === 'SNOOZE') {
    // Record snooze as a compulsive session signal
    getData().then(async ({ sessions }) => {
      sessions.push({
        domain: msg.domain, startTime: tsNow(),
        endTime: tsNow(), duration: 0,
        hour: getHour(), returnGap: 0, compulsive: true, snooze: true
      });
      await saveData(sessions.slice(-500));
    });
    return true;
  }

  if (msg.type === 'SET_LIMIT') {
    chrome.storage.local.set({ limitMins: msg.limitMins });
    return true;
  }
});

// ── Tab listeners ──────────────────────────────────────────────────
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  for (const id in activeSessions) {
    if (parseInt(id) !== tabId) await endSession(parseInt(id));
  }
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (!tab?.url) return;
  const domain = getDomain(tab.url);
  if (domain) startSession(tabId, domain);
});

chrome.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  if (change.status !== 'complete') return;
  const domain = getDomain(tab.url || '');
  if (domain) startSession(tabId, domain);
  else await endSession(tabId);
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await endSession(tabId);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    for (const id in activeSessions) await endSession(parseInt(id));
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});
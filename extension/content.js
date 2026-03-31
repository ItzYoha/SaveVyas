if (window.__iaInjected) throw new Error('already injected');
window.__iaInjected = true;

const DOMAIN = (() => {
  const h = location.hostname.replace('www.', '');
  const sites = ["youtube.com","instagram.com","twitter.com","x.com",
    "reddit.com","tiktok.com","facebook.com","netflix.com",
    "twitch.tv","pinterest.com","tumblr.com","snapchat.com"];
  return sites.find(s => h.includes(s)) || null;
})();

if (!DOMAIN) throw new Error('not a doom site');

// ── Nudge Banner ───────────────────────────────────────────────────
function showNudge(todayCount, lastGapSecs) {
  if (document.getElementById('__ia_nudge')) return;

  const gapStr = lastGapSecs !== null
    ? (lastGapSecs < 60 ? `${lastGapSecs}s ago` : `${Math.floor(lastGapSecs/60)}m ago`)
    : null;

  const banner = document.createElement('div');
  banner.id = '__ia_nudge';
  banner.innerHTML = `
    <div style="
      position:fixed;top:0;left:0;right:0;z-index:2147483647;
      background:linear-gradient(135deg,rgba(15,10,30,0.97),rgba(30,15,50,0.97));
      border-bottom:1px solid rgba(124,58,237,0.4);
      padding:10px 20px;display:flex;align-items:center;
      justify-content:space-between;gap:16px;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      backdrop-filter:blur(12px);
    ">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:8px;height:8px;border-radius:50%;background:#a78bfa;
                    box-shadow:0 0 8px #a78bfa;flex-shrink:0;"></div>
        <div>
          <span style="font-size:12px;font-weight:700;color:#fff;">Invisible Addiction</span>
          <span style="font-size:12px;color:#a1a1aa;margin-left:8px;">
            You've visited <strong style="color:#a78bfa;">${DOMAIN}</strong>
            <strong style="color:#f87171;"> ${todayCount}x today</strong>
            ${gapStr ? `— last visit <strong style="color:#fb923c;">${gapStr}</strong>` : ''}
          </span>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
        <span style="font-size:10px;color:#52525b;">Is this intentional?</span>
        <button id="__ia_nudge_yes" style="
          padding:4px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;
          background:rgba(74,222,128,0.15);border:1px solid rgba(74,222,128,0.3);color:#4ade80;">
          Yes, continue
        </button>
        <button id="__ia_nudge_no" style="
          padding:4px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;
          background:rgba(248,113,113,0.15);border:1px solid rgba(248,113,113,0.3);color:#f87171;">
          Leave
        </button>
      </div>
    </div>
  `;
  document.body.prepend(banner);
  document.body.style.marginTop = '48px';

  document.getElementById('__ia_nudge_yes').onclick = () => {
    banner.remove();
    document.body.style.marginTop = '';
  };
  document.getElementById('__ia_nudge_no').onclick = () => {
    history.back() || (location.href = 'about:blank');
  };
}

// ── Block Page ─────────────────────────────────────────────────────
function showBlockPage(totalMins, limitMins) {
  if (document.getElementById('__ia_block')) return;

  const backdrop = document.createElement('div');
  backdrop.id = '__ia_backdrop';
  backdrop.style.cssText = `
    position:fixed;inset:0;z-index:2147483646;
    background:rgba(3,3,3,0.85);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
  `;
  document.body.appendChild(backdrop);

  const scrollLockStyle = document.createElement('style');
  scrollLockStyle.id = '__ia_scrolllock';
  scrollLockStyle.textContent = `html, body, * { overflow:hidden !important; touch-action:none !important; }`;
  document.head.appendChild(scrollLockStyle);

  const blockScroll = (e) => e.stopPropagation();
  window.addEventListener('wheel',     blockScroll, { capture:true, passive:false });
  window.addEventListener('touchmove', blockScroll, { capture:true, passive:false });
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown','ArrowUp','PageDown','PageUp','Space',' '].includes(e.key)) e.preventDefault();
  }, { capture:true });

  const overlay = document.createElement('div');
  overlay.id = '__ia_block';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:2147483647;
    display:flex;align-items:center;justify-content:center;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;
  overlay.innerHTML = `
    <div style="
      background:rgba(15,10,30,0.98);border:1px solid rgba(124,58,237,0.3);
      border-radius:24px;padding:40px;max-width:420px;width:90%;text-align:center;
      box-shadow:0 0 60px rgba(124,58,237,0.2);
    ">
      <div style="font-size:48px;margin-bottom:16px;">🧠</div>
      <h2 style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-1px;margin-bottom:8px;">
        Time limit reached
      </h2>
      <p style="font-size:13px;color:#71717a;margin-bottom:20px;line-height:1.6;">
        You set a <strong style="color:#a78bfa;">${limitMins} min</strong> daily limit for
        <strong style="color:#a78bfa;">${DOMAIN}</strong>.<br>
        You've used <strong style="color:#f87171;">${Math.round(totalMins)} min</strong> today.
      </p>
      <div style="
        background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);
        border-radius:12px;padding:12px;margin-bottom:20px;
      ">
        <p style="font-size:11px;color:#f87171;font-weight:700;">🔴 Your addiction index is high today</p>
        <p style="font-size:11px;color:#71717a;margin-top:4px;">Taking breaks reduces compulsive behavior patterns.</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <button id="__ia_block_leave" style="
          padding:12px;border-radius:10px;cursor:pointer;font-size:13px;font-weight:700;
          background:linear-gradient(135deg,#7c3aed,#4f46e5);border:none;color:#fff;
          box-shadow:0 4px 20px rgba(124,58,237,0.3);">
          ← Leave this site
        </button>
        <button id="__ia_block_snooze" style="
          padding:10px;border-radius:10px;cursor:pointer;font-size:11px;font-weight:700;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#71717a;">
          Give me 5 more minutes (tracked)
        </button>
      </div>
      <p style="font-size:10px;color:#3f3f46;margin-top:16px;">Snoozing is recorded in your addiction score.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  function unblock() {
    backdrop.remove();
    overlay.remove();
    document.getElementById('__ia_scrolllock')?.remove();
    window.removeEventListener('wheel',     blockScroll, { capture:true });
    window.removeEventListener('touchmove', blockScroll, { capture:true });
  }

  document.getElementById('__ia_block_leave').onclick = () => {
    history.back() || (location.href = 'about:blank');
  };

  document.getElementById('__ia_block_snooze').onclick = () => {
    chrome.runtime.sendMessage({ type:'SNOOZE', domain:DOMAIN });
    unblock();
    setTimeout(() => showBlockPage(totalMins + 5, limitMins), 5 * 60 * 1000);
  };
}

// ── Check on load ──────────────────────────────────────────────────
chrome.runtime.sendMessage({ type:'GET_STATUS', domain:DOMAIN }, (res) => {
  if (!res) return;
  const { todayCount, lastGapSecs, totalMins, limitMins, blocked } = res;

  if (blocked && limitMins > 0 && totalMins >= limitMins) {
    showBlockPage(totalMins, limitMins);
    return;
  }

  if (todayCount >= 3 || (lastGapSecs !== null && lastGapSecs < 300)) {
    showNudge(todayCount, lastGapSecs);
  }
});
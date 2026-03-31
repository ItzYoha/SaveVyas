// background.js — FULL FILE, replace yours with this

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "SCROLL_DATA") return;

  chrome.storage.local.get(["scrollData"], (result) => {
    const existing = result.scrollData || [];
    existing.push(message.payload);
    chrome.storage.local.set({ scrollData: existing.slice(-200) });
  });
});

// Force-inject content.js into all already-open tabs when extension starts
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ url: "<all_urls>" }, (tabs) => {
    for (const tab of tabs) {
      if (tab.id && tab.url && !tab.url.startsWith("chrome://")) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content.js"]
        }).catch(() => {}); // ignore tabs we can't inject into
      }
    }
  });
});

// Open dashboard as a full tab when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});
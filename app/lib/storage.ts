// app/lib/storage.ts — The Data Bridge
/// <reference types="chrome"/>
export interface ScrollEntry {
    speed: number;
    maxSpeed: number;
    dwellTime: number;
    timestamp: number;
    url: string;
}

export async function getScrollData(): Promise<ScrollEntry[]> {
    // Safety check — won't crash in normal browser during dev
    if (typeof window === "undefined") return [];
    if (!window.chrome || !chrome.storage) {
        console.warn("Not in extension context, using mock data");
        return getMockData();
    }

    return new Promise((resolve) => {
        chrome.storage.local.get(["scrollData"], (result: { scrollData?: ScrollEntry[] }) => {
            resolve(result.scrollData || []);
        });
    });
}

// Mock data so UI doesn't look empty during dev/testing
function getMockData(): ScrollEntry[] {
    return [
        { speed: 0.8, maxSpeed: 2.1, dwellTime: 3, timestamp: Date.now() - 15000, url: "https://twitter.com" },
        { speed: 1.5, maxSpeed: 3.2, dwellTime: 1, timestamp: Date.now() - 12000, url: "https://twitter.com" },
        { speed: 0.3, maxSpeed: 0.9, dwellTime: 8, timestamp: Date.now() - 9000, url: "https://instagram.com" },
        { speed: 2.1, maxSpeed: 4.5, dwellTime: 0, timestamp: Date.now() - 6000, url: "https://twitter.com" },
        { speed: 0.5, maxSpeed: 1.2, dwellTime: 5, timestamp: Date.now() - 3000, url: "https://instagram.com" },
    ];
}
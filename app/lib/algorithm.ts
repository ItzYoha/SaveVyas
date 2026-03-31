// app/lib/algorithm.ts — The Brain (Member 5's logic)

import { ScrollEntry } from "./storage";

export function calculateAddictionScore(logs: ScrollEntry[]): number {
  if (logs.length === 0) return 0;

  let score = 50; // start neutral

  for (const log of logs) {
    if (log.speed > 1.5 && log.dwellTime < 2) {
      // Fast scroll + no reading = doomscrolling 📈
      score += 5;
    } else if (log.speed < 0.8 && log.dwellTime > 3) {
      // Slow scroll + reading = intentional 📉
      score -= 3;
    }
  }

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}
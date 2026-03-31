// dashboard/src/library/algorithm.ts

export interface ScrollLog {
  speed: number;
  dwellTime: number;
  timestamp: number;
}

export const calculateAddictionData = (logs: ScrollLog[]) => {
  if (logs.length === 0) return { score: 0, status: "Mindful" };

  // Logic: "Doomscrolling" = High Speed (> 1.5) + Low Dwell (< 1000ms)
  const mindlessLogs = logs.filter(log => log.speed > 1.5 && log.dwellTime < 1000);
  
  const score = Math.round((mindlessLogs.length / logs.length) * 100);
  
  let status = "Mindful";
  if (score > 30) status = "Warning";
  if (score > 60) status = "Addicted";

  return { score, status };
};
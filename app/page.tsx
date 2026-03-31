"use client";

import { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import HabitChart from "./components/HabitChart";
import Navbar from "./components/Navbar";
import { getScrollData, ScrollEntry } from "./lib/storage";
import { calculateAddictionScore } from "./lib/algorithm";

export default function Home() {
  const [logs, setLogs] = useState<ScrollEntry[]>([]);
  const [totalScroll, setTotalScroll] = useState(0);
  const [peakSpeed, setPeakSpeed] = useState(0);
  const [addictionScore, setAddictionScore] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const data = await getScrollData();
      setLogs(data);

      // Total scroll = sum of all speeds * 3000ms batches (approx px)
      const total = data.reduce((sum, d) => sum + d.speed * 3000, 0);
      setTotalScroll(Math.round(total));

      // Peak speed across all entries
      const peak = Math.max(...data.map((d) => d.maxSpeed), 0);
      setPeakSpeed(parseFloat(peak.toFixed(2)));

      // Addiction score from algorithm
      setAddictionScore(calculateAddictionScore(data));
    }

    fetchData();

    // Refresh every 5 seconds to get live data
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="p-8 md:p-16 space-y-12 max-w-7xl mx-auto">
        <header className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Dashboard<span className="text-violet-500">.</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-md">
            Analyzing your digital friction and scroll velocity in real-time.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Total Scroll" value={`${totalScroll.toLocaleString()}px`} />
          <StatCard title="Peak Velocity" value={`${peakSpeed} px/ms`} />
          <StatCard title="Addiction Index" value={`${addictionScore}%`} />
        </div>

        <section className="pt-4">
          {/* Pass logs down to chart */}
          <HabitChart data={logs} />
        </section>
      </main>
    </div>
  );
}
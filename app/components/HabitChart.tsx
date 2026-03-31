"use client";

import { ScrollEntry } from "../lib/storage";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface HabitChartProps {
  data: ScrollEntry[];
}

export default function HabitChart({ data }: HabitChartProps) {
  const chartData = data.map((entry, i) => ({
    time: `${i * 3}s`,
    speed: parseFloat((entry.speed * 1000).toFixed(1)), // convert to px/s
    dwell: entry.dwellTime,
  }));

  return (
    <div className="relative group bg-zinc-900/30 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:border-zinc-700/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-white text-lg font-bold">Scroll Dynamics</h3>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
            Speed Distribution (px/s)
          </p>
        </div>
        <div className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-md text-violet-400 text-[10px] font-bold uppercase tracking-tighter">
          Real-time Engine
        </div>
      </div>

      <div className="h-[350px] w-full rounded-2xl bg-[#050505]/50 border border-zinc-800/50 overflow-hidden p-4">
        {chartData.length === 0 ? (
          // Loading state
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-indigo-500 rounded-full animate-[spin_2s_linear_infinite]" />
            </div>
            <p className="text-zinc-400 text-sm font-bold tracking-widest uppercase animate-pulse">
              Syncing Storage...
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
              <YAxis stroke="#52525b" tick={{ fill: "#71717a", fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="speed"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                name="Speed (px/s)"
              />
              <Line
                type="monotone"
                dataKey="dwell"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                name="Dwell (s)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
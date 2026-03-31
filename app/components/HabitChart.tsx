export default function HabitChart() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
      <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-4">
        Scroll Speed Over Time
      </p>
      <div className="h-[250px] flex items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-medium">Chart loading...</p>
        </div>
      </div>
    </div>
  );
}
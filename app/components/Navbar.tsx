export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-zinc-950 border-b border-zinc-800 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="text-white text-lg font-bold tracking-tight">
          Invisible <span className="text-violet-400">Addiction</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-zinc-400 text-sm font-medium">
            Live Tracking
          </span>
        </div>
      </div>
    </nav>
  );
}
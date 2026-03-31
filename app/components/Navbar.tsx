export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-zinc-800/50 px-8 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <span className="text-white text-xl font-black tracking-tighter">
            INVISIBLE <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent uppercase text-sm ml-1 tracking-widest font-bold">Addiction</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
            Live Tracking
          </span>
        </div>
      </div>
    </nav>
  );
}
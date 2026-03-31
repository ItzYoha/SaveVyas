interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-7 transition-all duration-300 hover:border-violet-500/50 hover:bg-zinc-800/60 shadow-2xl">
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] mb-3 group-hover:text-zinc-300 transition-colors">
        {title}
      </p>
      <p className="text-white text-5xl font-black tracking-tighter decoration-violet-500/30 group-hover:scale-[1.03] transition-transform duration-300 origin-left">
        {value}
      </p>
    </div>
  );
}
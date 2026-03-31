interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg hover:bg-zinc-800 hover:scale-[1.02] transition-all duration-200 cursor-default">
      <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-2">
        {title}
      </p>
      <p className="text-white text-4xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
import StatCard from "./components/StatCard";
import HabitChart from "./components/HabitChart";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white">
          Invisible Addiction Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Scroll" value="12,430 px" />
          <StatCard title="Max Speed" value="320 px/s" />
          <StatCard title="Addiction Score" value="72%" />
        </div>

        {/* Chart */}
        <HabitChart />
      </main>
    </div>
  );
}
function StatCard({ label, value, color, delay = "0s" }) {
  const colorMap = {
    blue: "from-blue-500/40 via-blue-400/20 to-blue-300/10 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] text-blue-400",
    green:
      "from-green-500/40 via-green-400/20 to-green-300/10 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] text-green-400",
    red: "from-red-500/40 via-red-400/20 to-red-300/10 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] text-red-400",
    yellow:
      "from-yellow-500/40 via-yellow-400/20 to-yellow-300/10 hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] text-yellow-400",
  };

  return (
    <div
      className={`animate-[float_4s_ease-in-out_infinite] p-4 bg-gradient-to-br ${colorMap[color]} backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-500 ease-out hover:scale-105`}
      style={{ animationDelay: delay }}
    >
      <p className="text-white">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default StatCard;
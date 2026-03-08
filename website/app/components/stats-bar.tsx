interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: "2,500+", label: "Assets Upscaled" },
  { value: "4x", label: "Resolution Increase" },
  { value: "Real-ESRGAN", label: "AI Model" },
  { value: "FREE", label: "BSD Licensed" },
];

export default function StatsBar() {
  return (
    <div className="glass p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl md:text-3xl font-mono font-bold text-doom-green glow-green">
              {stat.value}
            </div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

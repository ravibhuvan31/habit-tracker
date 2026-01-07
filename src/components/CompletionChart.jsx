import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function CompletionChart({ myStats, partnerStats }) {
  const barData = [
    {
      name: "Completed",
      you: myStats.completed,
      partner: partnerStats.completed
    }
  ];

  const pieData = [
    { name: "Completed", value: myStats.completed },
    { name: "Not Completed", value: myStats.notCompleted }
  ];

  const COLORS = ["#3b82f6", "#ef4444"]; // blue, red

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* 📊 Bar Chart */}
      <div className="h-64">
        <h3 className="text-sm font-semibold mb-2">
          You vs Partner
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="you" fill="#3b82f6" radius={[4,4,0,0]} />
            <Bar dataKey="partner" fill="#8b5cf6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 Pie Chart */}
      <div className="h-64">
        <h3 className="text-sm font-semibold mb-2">
          Your Completion Ratio
        </h3>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

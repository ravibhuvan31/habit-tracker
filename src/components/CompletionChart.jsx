import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function CompletionChart({
  myStats,
  partnerStats,
  userId,
  partnerId
}) {
  const [myName, setMyName] = useState("You");
  const [partnerName, setPartnerName] = useState("Partner");

  useEffect(() => {
    if (!userId) return;

    async function loadNames() {
      const userSnap = await getDoc(doc(db, "users", userId));
      setMyName(userSnap?.data()?.name ?? "You");

      if (partnerId) {
        const partnerSnap = await getDoc(doc(db, "users", partnerId));
        setPartnerName(partnerSnap?.data()?.name ?? "Partner");
      }
    }

    loadNames();
  }, [userId, partnerId]);

  const data = [
    {
      name: "Completed",
      [myName]: myStats.completed,
      [partnerName]: partnerStats.completed
    },
    {
      name: "Missed",
      [myName]: myStats.notCompleted,
      [partnerName]: partnerStats.notCompleted
    }
  ];

  return (
    <div className="w-full">
      {/* 📊 Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey={myName} fill="#6366f1" />
          <Bar dataKey={partnerName} fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>

      {/* 🟣🟢 Legend */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-indigo-500" />
          <span>You</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-green-500" />
          <span>{partnerName}</span>
        </div>
      </div>
    </div>
  );
}

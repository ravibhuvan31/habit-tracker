import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { calculateStats, calculateStreaks } from "../utils/stats";
import CompletionChart from "./CompletionChart";

export default function StatsPanel({ statusMap, userId, partnerId }) {
  const [myName, setMyName] = useState("You");
  const [partnerName, setPartnerName] = useState("Partner");

  const myStats = calculateStats(statusMap, userId);
  const partnerStats = calculateStats(statusMap, partnerId);
  const myStreak = calculateStreaks(statusMap, userId);
  const partnerStreak = calculateStreaks(statusMap, partnerId);

  /* 🔄 Load names safely */
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

  return (
    <div className="bg-white dark:bg-gray-900
                    border border-gray-200 dark:border-gray-800
                    rounded-lg p-4 space-y-6">

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">You</h3>
          <p>Completed: {myStats.completed}</p>
          <p>Not completed: {myStats.notCompleted}</p>
          <p>Completion rate: {myStats.rate}%</p>
          <p>Current streak: {myStreak.current}</p>
          <p>Longest streak: {myStreak.longest}</p>
        </div>

        <div className="border rounded p-4">
          <h3 className="font-semibold mb-2">{partnerName}</h3>
          <p>Completed: {partnerStats.completed}</p>
          <p>Not completed: {partnerStats.notCompleted}</p>
          <p>Completion rate: {partnerStats.rate}%</p>
          <p>Current streak: {partnerStreak.current}</p>
          <p>Longest streak: {partnerStreak.longest}</p>
        </div>
      </div>

      {/* 📊 Chart must have height */}
      <div className="h-full">
        <CompletionChart
          myStats={myStats}
          partnerStats={partnerStats}
          userId={userId}
          partnerId={partnerId}
        />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { getMonthDays, isToday, isFuture } from "../utils/date";
import DayModal from "./DayModal";
import { auth, db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export default function Calendar({ pairId }) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const userId = auth.currentUser.uid;

  const year = today.getFullYear();
  const month = today.getMonth();
  const days = getMonthDays(year, month);

  // 🔥 Real-time listener
  useEffect(() => {
    const ref = doc(db, "dailyStatus", pairId);
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        setStatusMap(snap.data());
      }
    });
    return () => unsub();
  }, [pairId]);

  const handleSelect = async (status) => {
    const dateKey = selectedDate.toISOString().split("T")[0];

    await setDoc(
      doc(db, "dailyStatus", pairId),
      {
        [dateKey]: {
          ...(statusMap[dateKey] || {}),
          [userId]: status
        }
      },
      { merge: true }
    );

    setSelectedDate(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {today.toLocaleString("default", { month: "long" })} {year}
      </h2>

      <div className="grid grid-cols-7 text-center font-medium mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          if (!date) return <div key={idx}></div>;

          const key = date.toISOString().split("T")[0];
          const dayData = statusMap[key] || {};
          const myStatus = dayData[userId];

          return (
            <div
              key={idx}
              onClick={() => !isFuture(date) && setSelectedDate(date)}
              className={`
                h-24 border rounded p-1 flex flex-col cursor-pointer
                ${isToday(date) ? "border-blue-500 border-2" : ""}
                ${isFuture(date) ? "opacity-40 pointer-events-none" : ""}
              `}
            >
              <span className="text-sm font-semibold">{date.getDate()}</span>

              <div className="mt-auto flex flex-col gap-1">
                {/* YOU */}
                <div className={`h-2 rounded ${
                  myStatus === "completed"
                    ? "bg-green-500"
                    : myStatus === "not_completed"
                    ? "bg-red-500"
                    : "bg-gray-300"
                }`} />

                {/* PARTNER */}
                <div className="h-2 rounded bg-gray-300"></div>
              </div>
            </div>
          );
        })}
      </div>

      <DayModal
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
        onSelect={handleSelect}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { getMonthDays, isToday, isFuture } from "../utils/date";
import { getLocalDateKey } from "../utils/dateKey";
import { auth, db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import DayModal from "./DayModal";

export default function Calendar({ pairId, partnerId }) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusMap, setStatusMap] = useState({});
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  const year = today.getFullYear();
  const month = today.getMonth();
  const days = getMonthDays(year, month);

  /* 🌙 Dark mode effect */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* 🔄 Firestore listener */
  useEffect(() => {
    const ref = doc(db, "dailyStatus", pairId);
    const unsub = onSnapshot(ref, (snap) => {
      setStatusMap(snap.data() || {});
    });
    return () => unsub();
  }, [pairId]);

  const handleSelect = async (status) => {
    const dateKey = getLocalDateKey(selectedDate);

    await setDoc(
      doc(db, "dailyStatus", pairId),
      {
        [dateKey]: {
          ...(statusMap[dateKey] || {}),
          [userId]: status,
        },
      },
      { merge: true }
    );

    setSelectedDate(null);
  };

  const myColor = (status) =>
    status === "completed"
      ? "bg-blue-500"
      : status === "not_completed"
      ? "bg-red-500"
      : "bg-gray-300 dark:bg-gray-600";

  const partnerColor = (status) =>
    status === "completed"
      ? "bg-purple-500"
      : status === "not_completed"
      ? "bg-red-500"
      : "bg-gray-300 dark:bg-gray-600";

  return (
    <div className="w-full max-w-4xl mx-auto text-gray-900 dark:text-gray-100">

      {/* 🔝 Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {today.toLocaleString("default", { month: "long" })} {year}
        </h2>

        {/* 🌗 Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 text-sm rounded border
                     bg-white dark:bg-gray-800
                     border-gray-300 dark:border-gray-600"
        >
          {darkMode ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      {/* 🧭 Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm
                      bg-gray-50 dark:bg-gray-800
                      border border-gray-200 dark:border-gray-700
                      rounded p-3">
        <LegendItem color="bg-blue-500" label="You – Completed" />
        <LegendItem color="bg-purple-500" label="Partner – Completed" />
        <LegendItem color="bg-red-500" label="Not Completed" />
        <LegendItem color="bg-gray-300 dark:bg-gray-600" label="Pending" />
      </div>

      {/* 📅 Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          if (!date) return <div key={idx}></div>;

          const key = getLocalDateKey(date);
          const dayData = statusMap[key] || {};

          const myStatus = dayData[userId];
          const partnerStatus = partnerId ? dayData[partnerId] : null;

          return (
            <div
              key={idx}
              onClick={() => !isFuture(date) && setSelectedDate(date)}
              className={`
                h-28 rounded-lg p-2 flex flex-col cursor-pointer
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900
                hover:ring-2 hover:ring-blue-400
                transition
                ${isToday(date) ? "ring-2 ring-blue-500" : ""}
                ${isFuture(date) ? "opacity-40 pointer-events-none" : ""}
              `}
            >
              <span className="text-sm font-semibold">
                {date.getDate()}
              </span>

              <div className="mt-auto flex flex-col gap-2">
                <div className={`h-5 rounded ${myColor(myStatus)}`} />
                <div className={`h-5 rounded ${partnerColor(partnerStatus)}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 🪟 Modal */}
      <DayModal
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
        onSelect={handleSelect}
      />
    </div>
  );
}

/* 🧩 Small legend component */
function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded ${color}`} />
      {label}
    </div>
  );
}

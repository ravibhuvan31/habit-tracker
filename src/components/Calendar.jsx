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

  /* 📆 Month navigation state */
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const userId = auth.currentUser?.uid;
  if (!userId) return null;

  const days = getMonthDays(currentYear, currentMonth);

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

  /* 🔒 14-day lock check */
  const isLocked = (date) => {
    const diff =
      (today.setHours(0,0,0,0) - date.setHours(0,0,0,0)) /
      (1000 * 60 * 60 * 24);
    return diff > 14;
  };

  const handleSelect = async (status) => {
    if (!selectedDate || isLocked(selectedDate)) return;

    const dateKey = getLocalDateKey(selectedDate);

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

  /* 🎨 Colors */
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

  /* ⬅➡ Month navigation */
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-gray-900 dark:text-gray-100">

      {/* 🔝 Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="px-2">◀</button>
          <h2 className="text-xl font-semibold">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long"
            })}{" "}
            {currentYear}
          </h2>
          <button onClick={nextMonth} className="px-2">▶</button>
        </div>

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
        <LegendItem color="bg-gray-500" label="Locked (older than 14 days)" />
      </div>

      {/* 📅 Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, idx) => {
          if (!date) return <div key={idx}></div>;

          const key = getLocalDateKey(date);
          const dayData = statusMap[key] || {};
          const locked = isLocked(date);

          const myStatus = dayData[userId];
          const partnerStatus = partnerId ? dayData[partnerId] : null;

          return (
            <div
              key={idx}
              onClick={() =>
                !isFuture(date) && !locked && setSelectedDate(date)
              }
              className={`
                h-28 rounded-lg p-2 flex flex-col
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-900
                transition
                ${isToday(date) ? "ring-2 ring-blue-500" : ""}
                ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:ring-2 hover:ring-blue-400"}
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

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded ${color}`} />
      {label}
    </div>
  );
}

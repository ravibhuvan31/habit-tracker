import { getLocalDateKey } from "../utils/dateKey";

export default function DayModal({ date, onClose, onSelect }) {
  if (!date) return null;

  const today = new Date();
  const todayKey = getLocalDateKey(today);
  const selectedKey = getLocalDateKey(date);

  const diffDays =
    (today.setHours(0,0,0,0) - date.setHours(0,0,0,0)) /
    (1000 * 60 * 60 * 24);

  const isPast = selectedKey < todayKey;
  const isLocked = diffDays > 14;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center
                    bg-black/40 backdrop-blur-sm">

      <div className="w-80 rounded-xl p-6
                      bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-800
                      shadow-lg">

        {/* 📅 Date */}
        <h2 className="text-lg font-semibold text-center mb-1">
          {date.toDateString()}
        </h2>

        <p className="text-sm text-center mb-5
                      text-gray-600 dark:text-gray-400">
          {isLocked
            ? "This entry is locked (older than 14 days)"
            : isPast
              ? "Update your previous entry"
              : "Mark today’s task"}
        </p>

        {/* ✅ Actions */}
        <div className="flex flex-col gap-3">
          <button
            disabled={isLocked}
            className={`py-2 rounded-lg font-medium transition
              ${isLocked
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"}
            `}
            onClick={() => onSelect("completed")}
          >
            Completed
          </button>

          <button
            disabled={isLocked}
            className={`py-2 rounded-lg font-medium transition
              ${isLocked
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"}
            `}
            onClick={() => onSelect("not_completed")}
          >
            Not Completed
          </button>

          <button
            className="mt-2 text-sm
                       text-gray-500 dark:text-gray-400
                       hover:text-gray-700 dark:hover:text-gray-200
                       transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* 🔒 Hint */}
        {isLocked && (
          <p className="mt-4 text-xs text-center
                        text-gray-400 dark:text-gray-500">
            Editing is disabled after 14 days
          </p>
        )}
      </div>
    </div>
  );
}

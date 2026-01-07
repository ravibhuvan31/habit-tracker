import { getLocalDateKey } from "../utils/dateKey";

export default function DayModal({ date, onClose, onSelect }) {
  if (!date) return null;

  const todayKey = getLocalDateKey();
  const selectedKey = getLocalDateKey(date);
  const isPast = selectedKey < todayKey;

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
          {isPast
            ? "Update your previous entry"
            : "Mark today’s task"}
        </p>

        {/* ✅ Actions */}
        <div className="flex flex-col gap-3">
          <button
            className="py-2 rounded-lg
                       bg-blue-500 hover:bg-blue-600
                       text-white font-medium
                       transition"
            onClick={() => onSelect("completed")}
          >
            Completed
          </button>

          <button
            className="py-2 rounded-lg
                       bg-red-500 hover:bg-red-600
                       text-white font-medium
                       transition"
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
            Cancel
          </button>
        </div>

        {/* ⌨️ Hint */}
        <p className="mt-4 text-xs text-center
                      text-gray-400 dark:text-gray-500">
          Press Cancel to close
        </p>
      </div>
    </div>
  );
}

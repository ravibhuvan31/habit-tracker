export default function DayModal({ date, onClose, onSelect }) {
  if (!date) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4 text-center">
          {date.toDateString()}
        </h2>

        <div className="flex flex-col gap-3">
          <button
            className="bg-green-500 text-white py-2 rounded"
            onClick={() => onSelect("completed")}
          >
            Completed
          </button>

          <button
            className="bg-red-500 text-white py-2 rounded"
            onClick={() => onSelect("not_completed")}
          >
            Not Completed
          </button>

          <button
            className="mt-2 text-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

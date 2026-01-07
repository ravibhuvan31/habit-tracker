import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { getLocalDateKey } from "../utils/dateKey";


export default function TodayPrompt({ pairId, onAnswered }) {
  const userId = auth.currentUser.uid;

  
    const todayKey = getLocalDateKey();

  const submit = async (status) => {
    await setDoc(
      doc(db, "dailyStatus", pairId),
      {
        [todayKey]: {
          [userId]: status
        }
      },
      { merge: true }
    );

    onAnswered(); // hide prompt
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-yellow-50">
      <h2 className="text-lg font-semibold mb-2">
        Did you complete today’s task?
      </h2>

      <div className="flex gap-3">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => submit("completed")}
        >
          Completed
        </button>

        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => submit("not_completed")}
        >
          Not Completed
        </button>
      </div>
    </div>
  );
}

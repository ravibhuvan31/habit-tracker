import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Calendar from "../components/Calendar";

export default function Dashboard() {
  const [pairId, setPairId] = useState(null);

  useEffect(() => {
    const loadPair = async () => {
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (snap.exists()) {
        setPairId(snap.data().pairId);
      }
    };
    loadPair();
  }, []);

  if (!pairId) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shared Calendar</h1>
      <Calendar pairId={pairId} />
    </div>
  );
}

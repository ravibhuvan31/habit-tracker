import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pair() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const user = auth.currentUser;

  const createPair = async () => {
    const pairId = Math.random().toString(36).substring(2, 8);

    await setDoc(doc(db, "pairs", pairId), {
      userA: user.uid,
      userB: null
    });

    await setDoc(doc(db, "users", user.uid), {
      pairId
    });

    navigate("/dashboard");
  };

  const joinPair = async () => {
    const pairRef = doc(db, "pairs", code);
    const snap = await getDoc(pairRef);

    if (snap.exists() && !snap.data().userB) {
      await updateDoc(pairRef, {
        userB: user.uid
      });

      await setDoc(doc(db, "users", user.uid), {
        pairId: code
      });

      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <button onClick={createPair} className="bg-purple-500 text-white px-4 py-2">
        Create Pair
      </button>

      <input
        className="border p-2"
        placeholder="Invite Code"
        onChange={e => setCode(e.target.value)}
      />

      <button onClick={joinPair} className="bg-orange-500 text-white px-4 py-2">
        Join Pair
      </button>
    </div>
  );
}

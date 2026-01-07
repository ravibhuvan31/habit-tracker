import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pair() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const createPair = async () => {
    const pairId = Math.random().toString(36).substring(2, 8);
    await setDoc(doc(db, "pairs", pairId), {
      userA: auth.currentUser.uid,
      userB: null
    });
    navigate("/dashboard");
  };

  const joinPair = async () => {
    const pairRef = doc(db, "pairs", code);
    const pairSnap = await getDoc(pairRef);

    if (pairSnap.exists() && !pairSnap.data().userB) {
      await updateDoc(pairRef, {
        userB: auth.currentUser.uid
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <button className="bg-purple-500 text-white px-4 py-2" onClick={createPair}>
        Create Pair
      </button>
      <input className="border p-2" placeholder="Invite Code" onChange={e => setCode(e.target.value)} />
      <button className="bg-orange-500 text-white px-4 py-2" onClick={joinPair}>
        Join Pair
      </button>
    </div>
  );
}

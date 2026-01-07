import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Pair() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = auth.currentUser;
  if (!user) return null;

  const createPair = async () => {
    try {
      setError("");
      setLoading(true);

      const pairId = Math.random().toString(36).substring(2, 8);

      await setDoc(doc(db, "pairs", pairId), {
        userA: user.uid,
        userB: null
      });

      await setDoc(doc(db, "users", user.uid), {
        pairId
      });

      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create pair. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const joinPair = async () => {
    if (!code.trim()) {
      setError("Please enter an invite code.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const pairRef = doc(db, "pairs", code.trim());
      const snap = await getDoc(pairRef);

      if (!snap.exists()) {
        setError("Invalid invite code.");
        return;
      }

      if (snap.data().userB) {
        setError("This pair already has two users.");
        return;
      }

      await updateDoc(pairRef, {
        userB: user.uid
      });

      await setDoc(doc(db, "users", user.uid), {
        pairId: code.trim()
      });

      navigate("/dashboard");
    } catch (err) {
      setError("Failed to join pair. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-50 dark:bg-gray-950
                    text-gray-900 dark:text-gray-100">

      <div className="w-full max-w-md bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-800
                      rounded-xl p-6 space-y-6">

        {/* 🔗 Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-1">
            Pair with a Partner
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create a new pair or join using an invite code
          </p>
        </div>

        {/* ❌ Error */}
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* ➕ Create Pair */}
        <div className="border border-gray-200 dark:border-gray-700
                        rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Create a new pair</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You’ll get an invite code to share with your partner.
          </p>

          <button
            onClick={createPair}
            disabled={loading}
            className="w-full py-2 rounded
                       bg-purple-500 hover:bg-purple-600
                       disabled:opacity-50
                       text-white transition"
          >
            Create Pair
          </button>
        </div>

        {/* 🔑 Join Pair */}
        <div className="border border-gray-200 dark:border-gray-700
                        rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Join an existing pair</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter the invite code shared by your partner.
          </p>

          <input
            className="w-full px-3 py-2 rounded
                       border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Invite code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />

          <button
            onClick={joinPair}
            disabled={loading}
            className="w-full py-2 rounded
                       bg-blue-500 hover:bg-blue-600
                       disabled:opacity-50
                       text-white transition"
          >
            Join Pair
          </button>
        </div>

      </div>
    </div>
  );
}

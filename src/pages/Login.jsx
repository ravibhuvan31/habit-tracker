import { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const redirectAfterAuth = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists() && snap.data().pairId) {
      navigate("/dashboard");
    } else {
      navigate("/pair");
    }
  };

  const login = async () => {
    try {
      setError("");
      const res = await signInWithEmailAndPassword(auth, email, password);
      await redirectAfterAuth(res.user.uid);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const register = async () => {
    try {
      setError("");
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        pairId: null
      });

      navigate("/pair");
    } catch (err) {
      setError("Account already exists or password too weak");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-50 dark:bg-gray-950
                    text-gray-900 dark:text-gray-100">

      <div className="w-full max-w-sm bg-white dark:bg-gray-900
                      border border-gray-200 dark:border-gray-800
                      rounded-xl p-6 shadow-sm">

        {/* 🔐 Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-1">
            Accountability App
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Login or create an account
          </p>
        </div>

        {/* ✉️ Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full px-3 py-2 rounded
                       border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* 🔒 Password */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <input
            className="w-full px-3 py-2 rounded
                       border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* ❌ Error */}
        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* 🔘 Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={login}
            className="w-full py-2 rounded
                       bg-blue-500 hover:bg-blue-600
                       text-white transition"
          >
            Login
          </button>

          <button
            onClick={register}
            className="w-full py-2 rounded
                       border border-blue-500
                       text-blue-500 hover:bg-blue-50
                       dark:hover:bg-blue-900/20
                       transition"
          >
            Create Account
          </button>
        </div>

      </div>
    </div>
  );
}

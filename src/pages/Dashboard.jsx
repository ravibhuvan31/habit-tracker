import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getLocalDateKey } from "../utils/dateKey";

import Calendar from "../components/Calendar";
import TodayPrompt from "../components/TodayPrompt";
import StatsPanel from "../components/StatsPanel";

export default function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [pairId, setPairId] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [statusMap, setStatusMap] = useState({});

  /* 🔐 Auth listener */
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubAuth();
  }, []);

  /* 🔄 Load dashboard data */
  useEffect(() => {
    if (!userId) return;

    let unsubDaily = null;

    const loadData = async () => {
      const userSnap = await getDoc(doc(db, "users", userId));
      if (!userSnap.exists()) return;

      const pid = userSnap.data().pairId;
      setPairId(pid);

      const pairSnap = await getDoc(doc(db, "pairs", pid));
      if (pairSnap.exists()) {
        const pair = pairSnap.data();
        const partner =
          pair.userA === userId ? pair.userB : pair.userA;
        setPartnerId(partner || null);
      }

      const todayKey = getLocalDateKey();

      unsubDaily = onSnapshot(doc(db, "dailyStatus", pid), (snap) => {
        const data = snap.data() || {};
        setStatusMap(data);
        setShowPrompt(!data[todayKey]?.[userId]);
      });
    };

    loadData();
    return () => unsubDaily && unsubDaily();
  }, [userId]);

  if (!userId || !pairId) {
    return (
      <div className="min-h-screen flex items-center justify-center
                      text-gray-600 dark:text-gray-300">
        Loading dashboard…
      </div>
    );
  }

  const copyInvite = () => {
    navigator.clipboard.writeText(pairId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950
                    text-gray-900 dark:text-gray-100">

      <div className="max-w-6xl mx-auto p-6 space-y-6">

        {/* 🔝 Header */}
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">
            Accountability Calendar
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your daily task with your partner
          </p>
        </header>

        {/* 🟡 Invite Code */}
        {!partnerId && (
          <div className="rounded-lg border border-yellow-300
                          bg-yellow-50 dark:bg-yellow-900/20
                          p-4 flex flex-col gap-3">
            <p className="font-medium">
              Invite your partner using this code
            </p>

            <div className="flex items-center gap-3">
              <span className="font-mono text-lg px-3 py-1 rounded
                               bg-white dark:bg-gray-800
                               border border-gray-300 dark:border-gray-700">
                {pairId}
              </span>

              <button
                onClick={copyInvite}
                className="px-3 py-1 rounded text-sm
                           bg-blue-500 text-white
                           hover:bg-blue-600 transition"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* 🔔 Today Prompt */}
        {showPrompt && (
          <TodayPrompt
            pairId={pairId}
            onAnswered={() => setShowPrompt(false)}
          />
        )}

        {/* 📊 Stats */}
        <section className="bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            rounded-lg p-4">
          <StatsPanel
            statusMap={statusMap}
            userId={userId}
            partnerId={partnerId}
          />
        </section>

        {/* 📅 Calendar */}
        <section className="bg-white dark:bg-gray-900
                            border border-gray-200 dark:border-gray-800
                            rounded-lg p-4">
          <Calendar
            pairId={pairId}
            partnerId={partnerId}
          />
        </section>

      </div>
    </div>
  );
}

import { calculateStats, calculateStreaks } from "../utils/stats";

export default function StatsPanel({ statusMap, userId, partnerId }) {
  const myStats = calculateStats(statusMap, userId);
  const partnerStats = calculateStats(statusMap, partnerId);

  const myStreak = calculateStreaks(statusMap, userId);
  const partnerStreak = calculateStreaks(statusMap, partnerId);

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      {/* YOU */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">You</h3>
        <p>Completed: {myStats.completed}</p>
        <p>Not completed: {myStats.notCompleted}</p>
        <p>Completion rate: {myStats.rate}%</p>
        <p>Current streak: {myStreak.current}</p>
        <p>Longest streak: {myStreak.longest}</p>
      </div>

      {/* PARTNER */}
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Partner</h3>
        <p>Completed: {partnerStats.completed}</p>
        <p>Not completed: {partnerStats.notCompleted}</p>
        <p>Completion rate: {partnerStats.rate}%</p>
        <p>Current streak: {partnerStreak.current}</p>
        <p>Longest streak: {partnerStreak.longest}</p>
      </div>
    </div>
  );
}

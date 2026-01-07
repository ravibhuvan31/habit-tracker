export function calculateStats(statusMap, userId) {
  let completed = 0;
  let notCompleted = 0;

  Object.values(statusMap).forEach(day => {
    if (day[userId] === "completed") completed++;
    if (day[userId] === "not_completed") notCompleted++;
  });

  const total = completed + notCompleted;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { completed, notCompleted, rate };
}

export function calculateStreaks(statusMap, userId) {
  const dates = Object.keys(statusMap).sort(); // YYYY-MM-DD sorted
  let current = 0;
  let longest = 0;

  for (let i = 0; i < dates.length; i++) {
    const status = statusMap[dates[i]][userId];

    if (status === "completed") {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return { current, longest };
}

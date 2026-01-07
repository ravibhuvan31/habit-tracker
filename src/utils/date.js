export function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];

  // empty cells before month start
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // actual days
  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export function isToday(date) {
  const today = new Date();
  return (
    date &&
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isFuture(date) {
  const today = new Date();
  today.setHours(0,0,0,0);
  return date > today;
}

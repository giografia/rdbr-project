const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
export function formatPremiereWeek(dateString) {
  const date = parseLocalDate(dateString);
  return `PREMIERE · WEEK OF ${date.getDate()} ${MONTHS_SHORT[date.getMonth()].toUpperCase()}`;
}
export function formatReleaseDate(dateString) {
  const date = parseLocalDate(dateString);
  return `IN CINEMAS ${date.getDate()} ${MONTHS[date.getMonth()].toUpperCase()}`;
}
export function formatLongDate(dateString) {
  const date = parseLocalDate(dateString);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
export function getWeekday(dateString) {
  return WEEKDAYS[parseLocalDate(dateString).getDay()];
}
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
export function getNextDays(count) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) =>
    toISODate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
    ),
  );
}

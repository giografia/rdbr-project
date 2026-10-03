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

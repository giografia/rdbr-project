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
export function formatShortDate(dateString) {
  const date = parseLocalDate(dateString);
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)}`;
}
export function formatRefundDeadline(dateString, time, hoursBefore = 2) {
  const [hours, minutes] = time.split(":").map(Number);
  const deadline = parseLocalDate(dateString);
  deadline.setHours(hours - hoursBefore, minutes);

  const hh = String(deadline.getHours()).padStart(2, "0");
  const mm = String(deadline.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}, ${formatShortDate(toISODate(deadline))}`;
}
export function isoToDisplayDate(iso) {
  const [year, month, day] = iso.splt("-");
  return `${day}/${month}/${year}`;
}
export function displayToIsoDate(text) {
  const match = text.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day))
    return null;
  return `${year}-${month}-${day}`;
}

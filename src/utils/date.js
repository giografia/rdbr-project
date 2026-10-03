function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function monthName(date, style) {
  return date.toLocaleString("en-GB", { month: style }).toUpperCase();
}

export function formatPremiereWeek(dateString) {
  const date = parseLocalDate(dateString);
  return `PREMIERE · WEEK OF ${date.getDate()} ${monthName(date, "short")}`;
}
export function formatReleaseDate(dateString) {
  const date = parseLocalDate(dateString);
  return `IN CINEMAS ${date.getDate()} ${monthName(date, "long")}`;
}

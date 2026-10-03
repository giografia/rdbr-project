export function formatPremiereWeek(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const monthName = date
    .toLocaleDateString("en-GB", { month: "short" })
    .toUpperCase();
  return `PREMIERE · WEEK OF ${day} ${monthName}`;
}

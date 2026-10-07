export function countTickets(items) {
  const counts = {};
  items.forEach((seat) => {
    const name = seat.ticketType.name;
    counts[name] = (counts[name] ?? 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => `${count} x ${name}`)
    .join(", ");
}

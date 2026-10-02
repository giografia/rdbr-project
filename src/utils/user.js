export function getDisplayName(user) {
  return user.fullName?.trim().split(/\s+/)[0] || user.username;
}

export function getInitials(user) {
  const source = user.fullName?.trim() || user.username || "";
  const parts = source.split(/\s+/).filter(Boolean);
  const initials =
    parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2);
  return initials.toUpperCase();
}

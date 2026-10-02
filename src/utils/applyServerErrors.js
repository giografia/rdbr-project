export function applyServerErrors(error, setError) {
  if (error.status !== 422 || !error.errors) return false;

  Object.entries(error.errors).forEach(([field, messages]) => {
    setError(field, { type: "server", message: messages[0] });
  });
  return true;
}

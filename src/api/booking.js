import { apiFetch } from "./client";

export async function getSeatMap(sessionId) {
  const res = await apiFetch(`/sessions/${sessionId}/seats`);
  return res.data;
}
export async function createHold(sessionId, seats) {
  const res = await apiFetch(`/sessions/${sessionId}/holds`, {
    method: "POST",
    body: { seats },
  });
  return res.data;
}
export async function releaseHold(holdId) {
  return apiFetch(`/holds/${holdId}`, { method: "DELETE" });
}
export async function createOrder(values) {
  const res = await apiFetch("/orders", { method: "POST", body: values });
  return res.data;
}

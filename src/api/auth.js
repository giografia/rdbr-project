import { apiFetch } from "./client";

export async function login(credentials) {
  const res = await apiFetch("/login", { method: "POST", body: credentials });
  return res.data; // format - {user, token}
}
export async function register(formData) {
  const res = await apiFetch("/register", { method: "POST", body: formData });
  return res.data; // same format as login
}
export async function getMe() {
  const res = await apiFetch("/me");
  return res.data; // user
}
export async function logout() {
  await apiFetch("/logout", { method: "POST" });
}

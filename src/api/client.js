const BASE_URL = "https://api.kinoxii.redberryinternship.ge/api";

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.message || "Something went wrong");
    this.status = status;
    this.errors = data?.errors;
    this.data = data;
  }
}
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}
export async function apiFetch(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let requestBody;
  if (body instanceof FormData) {
    requestBody = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(BASE_URL + path, {
    method,
    headers,
    body: requestBody,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 401 && token && onUnauthorized) {
      onUnauthorized();
    }
    throw new ApiError(response.status, data);
  }
  return data;
}

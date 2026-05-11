const BASE_URL = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

function headers() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`,
  };
}

export const api = {
  get: (path: string) =>
    fetch(`${BASE_URL}${path}`, { method: "GET", headers: headers() }),

  post: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    }),

  put: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    fetch(`${BASE_URL}${path}`, { method: "DELETE", headers: headers() }),
};
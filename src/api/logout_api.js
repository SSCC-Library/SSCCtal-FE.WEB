import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://your.api",
  withCredentials: true, // 필요 시
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// 401이면 전역 로그아웃 호출
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // 리프레시 토큰을 쓰지 않기로 했으니 즉시 로그아웃
      if (typeof window !== "undefined" && typeof window.__appLogout === "function") {
        window.__appLogout();
      } else {
        // 최후 수단
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const auth = window.localStorage.getItem("polytrade-auth");

  if (!auth) {
    return config;
  }

  try {
    const parsedAuth = JSON.parse(auth) as { state?: { token?: string | null } };
    const token = parsedAuth.state?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    return config;
  }

  return config;
});

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

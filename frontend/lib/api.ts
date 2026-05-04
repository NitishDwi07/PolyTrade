import axios from "axios";
import type {
  Market,
  MarketTradesResponse,
  MarketsResponse,
  LeaderboardResponse,
  PortfolioResponse,
  TradeRequest,
  TradeResponse,
  UserTradesResponse,
  WalletResponse,
} from "@/lib/types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
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

function apiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as { error?: string } | undefined)?.error;
    return message ?? "Unable to complete request";
  }

  return "Unable to complete request";
}

export async function getMarkets(): Promise<Market[]> {
  try {
    const response = await api.get<MarketsResponse>("/api/markets");
    return response.data.markets;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getMarket(id: number | string): Promise<Market> {
  try {
    const response = await api.get<Market>(`/api/markets/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getMarketTrades(
  id: number | string,
  limit = 25,
): Promise<MarketTradesResponse> {
  try {
    const response = await api.get<MarketTradesResponse>(`/api/markets/${id}/trades`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function placeTrade(payload: TradeRequest): Promise<TradeResponse> {
  try {
    const response = await api.post<TradeResponse>("/api/trades", payload);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getWallet(userId: number): Promise<WalletResponse> {
  try {
    const response = await api.get<WalletResponse>(`/api/wallet/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getPortfolio(userId: number): Promise<PortfolioResponse> {
  try {
    const response = await api.get<PortfolioResponse>(`/api/portfolio/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const response = await api.get<LeaderboardResponse>("/api/leaderboard");
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getUserTrades(userId: number, limit = 25): Promise<UserTradesResponse> {
  try {
    const response = await api.get<UserTradesResponse>(`/api/trades/user/${userId}`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

import axios from "axios";
import type {
  AdminStats,
  CopyActivityResponse,
  CopyFollowersResponse,
  CopyFollowingResponse,
  CopyRelationshipResponse,
  LeaderboardResponse,
  Market,
  MarketResolution,
  MarketTradesResponse,
  MarketsResponse,
  PortfolioResponse,
  ResolveMarketResponse,
  TradeSide,
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

export async function getCopyFollowing(userId: number): Promise<CopyFollowingResponse> {
  try {
    const response = await api.get<CopyFollowingResponse>(`/api/copy/following/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getCopyFollowers(traderId: number): Promise<CopyFollowersResponse> {
  try {
    const response = await api.get<CopyFollowersResponse>(`/api/copy/followers/${traderId}`);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getCopyActivity(userId: number): Promise<CopyActivityResponse> {
  try {
    const response = await api.get<CopyActivityResponse>(`/api/copy/activity/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function followTrader(
  traderId: number,
  payload: { followerId: number; copyRatio: number },
): Promise<CopyRelationshipResponse> {
  try {
    const response = await api.post<CopyRelationshipResponse>(`/api/copy/follow/${traderId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function updateCopySettings(
  traderId: number,
  payload: { followerId: number; copyRatio: number; isEnabled: boolean },
): Promise<CopyRelationshipResponse> {
  try {
    const response = await api.patch<CopyRelationshipResponse>(`/api/copy/settings/${traderId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function unfollowTrader(traderId: number, followerId: number): Promise<void> {
  try {
    await api.delete(`/api/copy/follow/${traderId}`, {
      params: { followerId },
    });
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await api.get<AdminStats>("/api/admin/stats");
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function closeMarket(marketId: number): Promise<{ message: string; market: Market }> {
  try {
    const response = await api.post<{ message: string; market: Market }>(`/api/admin/markets/${marketId}/close`, {});
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function resolveMarket(
  marketId: number,
  payload: { winningSide: TradeSide; resolvedBy: string },
): Promise<ResolveMarketResponse> {
  try {
    const response = await api.post<ResolveMarketResponse>(`/api/admin/markets/${marketId}/resolve`, payload);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

export async function getMarketResolution(marketId: number): Promise<MarketResolution> {
  try {
    const response = await api.get<MarketResolution>(`/api/markets/${marketId}/resolution`);
    return response.data;
  } catch (error) {
    throw new Error(apiErrorMessage(error));
  }
}

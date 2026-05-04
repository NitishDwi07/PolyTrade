export type MarketStatus = "OPEN" | "CLOSED" | "RESOLVED";
export type TradeSide = "YES" | "NO";

export type Market = {
  id: number;
  question: string;
  description: string;
  category: string;
  status: MarketStatus;
  yesVolume: number;
  noVolume: number;
  totalVolume: number;
  yesPrice: number;
  noPrice: number;
  closesAt: string | null;
  winningSide: TradeSide | null;
  resolvedAt: string | null;
};

export type MarketsResponse = {
  markets: Market[];
};

export type MarketTrade = {
  id: number;
  userId: number;
  username: string;
  name: string;
  side: TradeSide;
  amount: number;
  price: number;
  shares: number;
  copiedFromTradeId: number | null;
  isCopied: boolean;
  createdAt: string;
};

export type MarketTradesResponse = {
  marketId: number;
  trades: MarketTrade[];
};

export type TradeRequest = {
  userId: number;
  marketId: number;
  side: TradeSide;
  amount: number;
};

export type TradeResponse = {
  message: string;
  trade: {
    id: number;
    userId: number;
    marketId: number;
    side: TradeSide;
    amount: number;
    price: number;
    shares: number;
    copiedFromTradeId: number | null;
    createdAt: string;
  };
  newBalance: number;
  position: {
    id: number;
    userId: number;
    marketId: number;
    side: TradeSide;
    shares: number;
    averagePrice: number;
    investedAmount: number;
    settled: boolean;
  };
  market: {
    id: number;
    yesPrice: number;
    noPrice: number;
    yesVolume: number;
    noVolume: number;
  };
  copySummary?: {
    attempted: number;
    executed: number;
    skipped: number;
    results: Array<{
      followerId: number;
      amount: number;
      status: string;
      reason?: string;
      tradeId?: number;
    }>;
  };
};

export type WalletTransaction = {
  id: number;
  amount: number;
  type: string;
  description: string;
  referenceId: number | null;
  createdAt: string;
};

export type WalletResponse = {
  userId: number;
  balance: number;
  transactions: WalletTransaction[];
};

export type PortfolioPosition = {
  marketId: number;
  marketQuestion: string;
  side: TradeSide;
  shares: number;
  averagePrice: number;
  investedAmount: number;
  currentPrice: number;
  estimatedValue: number;
  openPnl: number;
  settled: boolean;
  payout: number | null;
};

export type PortfolioResponse = {
  userId: number;
  balance: number;
  positions: PortfolioPosition[];
};

export type LeaderboardEntry = {
  rank: number;
  userId: number;
  name: string;
  username: string;
  balance: number;
  tradeCount: number;
  totalVolume: number;
  followerCount: number;
  followingCount: number;
};

export type LeaderboardResponse = {
  leaderboard: LeaderboardEntry[];
};

export type UserTrade = {
  id: number;
  marketId: number;
  marketQuestion: string;
  side: TradeSide;
  amount: number;
  price: number;
  shares: number;
  copiedFromTradeId: number | null;
  isCopied: boolean;
  createdAt: string;
};

export type UserTradesResponse = {
  userId: number;
  trades: UserTrade[];
};

export type CopyFollowingItem = {
  traderId: number;
  traderName: string;
  traderUsername: string;
  copyRatio: number;
  isEnabled: boolean;
  createdAt: string;
};

export type CopyFollowingResponse = {
  following: CopyFollowingItem[];
};

export type CopyFollowerItem = {
  followerId: number;
  followerName: string;
  followerUsername: string;
  copyRatio: number;
  isEnabled: boolean;
  createdAt: string;
};

export type CopyFollowersResponse = {
  followers: CopyFollowerItem[];
};

export type CopyActivityTrade = {
  id: number;
  marketId: number;
  marketQuestion: string;
  side: TradeSide;
  amount: number;
  price: number;
  shares: number;
  copiedFromTradeId: number;
  originalTraderId: number;
  originalTraderUsername: string;
  createdAt: string;
};

export type CopyActivityResponse = {
  userId: number;
  copiedTrades: CopyActivityTrade[];
};

export type CopyRelationshipResponse = {
  id?: number;
  followerId?: number;
  followerName?: string;
  followerUsername?: string;
  traderId?: number;
  traderName?: string;
  traderUsername?: string;
  copyRatio: number;
  isEnabled: boolean;
  createdAt: string;
};

export type AdminStats = {
  users: number;
  markets: number;
  openMarkets: number;
  resolvedMarkets: number;
  trades: number;
  totalVolume: number;
  copyRelationships: number;
};

export type MarketResolution = {
  id: number;
  marketId: number;
  winningSide: TradeSide;
  totalPool: number;
  winningShares: number;
  payoutPerShare: number;
  resolvedBy: string;
  alreadyResolved: boolean;
  createdAt: string;
  payouts: Array<{
    userId: number;
    side: TradeSide;
    shares: number;
    payout: number;
  }>;
};

export type ResolveMarketResponse = {
  message: string;
  resolution: MarketResolution;
};

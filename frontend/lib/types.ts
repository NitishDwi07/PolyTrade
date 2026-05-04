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

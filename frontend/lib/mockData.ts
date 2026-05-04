export type MarketStatus = "Open" | "Closing Soon" | "Resolved";
export type MarketCategory =
  | "Cricket"
  | "Crypto"
  | "AI / Tech"
  | "Politics"
  | "Startups"
  | "Climate";

export type RecentTrade = {
  id: string;
  trader: string;
  side: "YES" | "NO";
  amount: number;
  price: number;
  shares: number;
  time: string;
  copied?: boolean;
};

export type ProbabilityPoint = {
  time: string;
  yes: number;
  no: number;
};

export type UserPosition = {
  marketId: string;
  side: "YES" | "NO";
  shares: number;
  avgPrice: number;
  exposure: number;
  unrealizedPnl: number;
};

export type Market = {
  id: string;
  question: string;
  description: string;
  category: MarketCategory;
  status: MarketStatus;
  closesAt: string;
  yesPrice: number;
  noPrice: number;
  yesVolume: number;
  noVolume: number;
  totalVolume: number;
  participants: number;
  trend: number;
  createdBy: string;
  recentTrades: RecentTrade[];
  probabilityHistory: ProbabilityPoint[];
};

export type Trader = {
  id: string;
  name: string;
  pnl: string;
  winRate: string;
  followers: number;
  copyRatio: string;
};

export const marketCategories: MarketCategory[] = [
  "Cricket",
  "Crypto",
  "AI / Tech",
  "Politics",
  "Startups",
  "Climate",
];

export const traderNames = [
  "Maya Quant",
  "Arjun Edge",
  "Nora Signals",
  "Dev Runrate",
  "Ira Macro",
  "Kabir Climate",
  "Zoya Alpha",
];

const tradeSet = (
  prefix: string,
  trades: Array<Omit<RecentTrade, "id">>,
): RecentTrade[] => trades.map((trade, index) => ({ ...trade, id: `${prefix}-${index + 1}` }));

const history = (values: number[]): ProbabilityPoint[] =>
  values.map((yes, index) => ({
    time: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"][index],
    yes,
    no: 100 - yes,
  }));

export const markets: Market[] = [
  {
    id: "ipl-final-chase",
    question: "Will Bengaluru win the IPL final if chasing 180+?",
    description:
      "Resolves YES if Bengaluru successfully chases a target of 180 or more in the final. Otherwise resolves NO.",
    category: "Cricket",
    status: "Open",
    closesAt: "May 26, 2026 19:30 IST",
    yesPrice: 58,
    noPrice: 42,
    yesVolume: 72400,
    noVolume: 51600,
    totalVolume: 124000,
    participants: 842,
    trend: 4.6,
    createdBy: "Sports Desk",
    recentTrades: tradeSet("ipl", [
      { trader: "Dev Runrate", side: "YES", amount: 220, price: 58, shares: 379.31, time: "2m ago" },
      { trader: "Maya Quant", side: "YES", amount: 140, price: 57, shares: 245.61, time: "7m ago", copied: true },
      { trader: "Arjun Edge", side: "NO", amount: 90, price: 43, shares: 209.3, time: "13m ago" },
    ]),
    probabilityHistory: history([51, 53, 55, 54, 57, 58]),
  },
  {
    id: "btc-100k-june",
    question: "Will Bitcoin trade above $100K before June ends?",
    description:
      "Resolves YES if any major spot exchange records BTC/USD above $100,000 before June 30, 2026.",
    category: "Crypto",
    status: "Open",
    closesAt: "Jun 30, 2026 23:59 UTC",
    yesPrice: 64,
    noPrice: 36,
    yesVolume: 138900,
    noVolume: 77100,
    totalVolume: 216000,
    participants: 1287,
    trend: 7.2,
    createdBy: "Crypto Oracle",
    recentTrades: tradeSet("btc", [
      { trader: "Zoya Alpha", side: "YES", amount: 500, price: 64, shares: 781.25, time: "1m ago" },
      { trader: "Nora Signals", side: "NO", amount: 180, price: 37, shares: 486.49, time: "5m ago" },
      { trader: "Maya Quant", side: "YES", amount: 300, price: 63, shares: 476.19, time: "16m ago", copied: true },
    ]),
    probabilityHistory: history([55, 57, 59, 61, 60, 64]),
  },
  {
    id: "open-model-benchmark",
    question: "Will an open-source AI model top the benchmark leaderboard this quarter?",
    description:
      "Resolves YES if an openly downloadable model ranks first on the selected public reasoning benchmark before quarter close.",
    category: "AI / Tech",
    status: "Closing Soon",
    closesAt: "Jun 20, 2026 18:00 UTC",
    yesPrice: 47,
    noPrice: 53,
    yesVolume: 64100,
    noVolume: 72400,
    totalVolume: 136500,
    participants: 713,
    trend: -3.1,
    createdBy: "Model Watch",
    recentTrades: tradeSet("ai", [
      { trader: "Nora Signals", side: "NO", amount: 260, price: 53, shares: 490.57, time: "4m ago" },
      { trader: "Ira Macro", side: "YES", amount: 120, price: 47, shares: 255.32, time: "11m ago" },
      { trader: "Arjun Edge", side: "NO", amount: 160, price: 52, shares: 307.69, time: "22m ago", copied: true },
    ]),
    probabilityHistory: history([54, 51, 50, 49, 48, 47]),
  },
  {
    id: "digital-markets-bill",
    question: "Will India introduce a digital markets competition bill this session?",
    description:
      "Resolves YES if a formal bill addressing digital market competition is introduced in the current parliamentary session.",
    category: "Politics",
    status: "Open",
    closesAt: "Jul 18, 2026 17:00 IST",
    yesPrice: 52,
    noPrice: 48,
    yesVolume: 48300,
    noVolume: 44600,
    totalVolume: 92900,
    participants: 521,
    trend: 1.8,
    createdBy: "Policy Desk",
    recentTrades: tradeSet("policy", [
      { trader: "Ira Macro", side: "YES", amount: 200, price: 52, shares: 384.62, time: "8m ago" },
      { trader: "Kabir Climate", side: "NO", amount: 110, price: 48, shares: 229.17, time: "14m ago" },
      { trader: "Maya Quant", side: "YES", amount: 150, price: 51, shares: 294.12, time: "29m ago" },
    ]),
    probabilityHistory: history([49, 49, 51, 50, 51, 52]),
  },
  {
    id: "india-saas-unicorn",
    question: "Will a new India SaaS startup reach unicorn valuation this quarter?",
    description:
      "Resolves YES if a private India-headquartered SaaS company announces a funding round valuing it at $1B+ before quarter end.",
    category: "Startups",
    status: "Open",
    closesAt: "Aug 12, 2026 20:00 IST",
    yesPrice: 39,
    noPrice: 61,
    yesVolume: 35200,
    noVolume: 55100,
    totalVolume: 90300,
    participants: 468,
    trend: -2.4,
    createdBy: "Startup Radar",
    recentTrades: tradeSet("saas", [
      { trader: "Zoya Alpha", side: "NO", amount: 190, price: 61, shares: 311.48, time: "3m ago" },
      { trader: "Arjun Edge", side: "NO", amount: 130, price: 60, shares: 216.67, time: "19m ago" },
      { trader: "Nora Signals", side: "YES", amount: 80, price: 39, shares: 205.13, time: "33m ago", copied: true },
    ]),
    probabilityHistory: history([44, 43, 41, 42, 40, 39]),
  },
  {
    id: "monsoon-above-normal",
    question: "Will this year's India monsoon rainfall finish above normal?",
    description:
      "Resolves YES if official seasonal rainfall is above the long-period average by the final IMD monsoon report.",
    category: "Climate",
    status: "Open",
    closesAt: "Sep 30, 2026 18:00 IST",
    yesPrice: 55,
    noPrice: 45,
    yesVolume: 58900,
    noVolume: 48200,
    totalVolume: 107100,
    participants: 634,
    trend: 5.3,
    createdBy: "Climate Desk",
    recentTrades: tradeSet("climate", [
      { trader: "Kabir Climate", side: "YES", amount: 240, price: 55, shares: 436.36, time: "6m ago" },
      { trader: "Ira Macro", side: "NO", amount: 100, price: 45, shares: 222.22, time: "17m ago" },
      { trader: "Maya Quant", side: "YES", amount: 160, price: 54, shares: 296.3, time: "31m ago", copied: true },
    ]),
    probabilityHistory: history([47, 49, 50, 52, 53, 55]),
  },
];

export const userPositions: UserPosition[] = [
  {
    marketId: "btc-100k-june",
    side: "YES",
    shares: 476.19,
    avgPrice: 63,
    exposure: 300,
    unrealizedPnl: 14,
  },
  {
    marketId: "open-model-benchmark",
    side: "NO",
    shares: 307.69,
    avgPrice: 52,
    exposure: 160,
    unrealizedPnl: 3,
  },
  {
    marketId: "ipl-final-chase",
    side: "YES",
    shares: 245.61,
    avgPrice: 57,
    exposure: 140,
    unrealizedPnl: 2,
  },
];

export const traders: Trader[] = [
  {
    id: "maya",
    name: "Maya Quant",
    pnl: "+18.4%",
    winRate: "71%",
    followers: 324,
    copyRatio: "50%",
  },
  {
    id: "arjun",
    name: "Arjun Edge",
    pnl: "+14.9%",
    winRate: "67%",
    followers: 281,
    copyRatio: "35%",
  },
  {
    id: "nora",
    name: "Nora Signals",
    pnl: "+12.2%",
    winRate: "64%",
    followers: 196,
    copyRatio: "25%",
  },
];

export const walletTransactions = [
  { id: "tx-1", label: "Starter credit grant", amount: "+1,000", type: "Credit" },
  { id: "tx-2", label: "YES position: BTC above $100K", amount: "-300", type: "Debit" },
  { id: "tx-3", label: "Copied trade from Maya Quant", amount: "-140", type: "Debit" },
];

export const portfolioPositions = userPositions.map((position) => {
  const market = markets.find((item) => item.id === position.marketId);

  return {
    id: position.marketId,
    market: market?.question ?? position.marketId,
    side: position.side,
    exposure: String(position.exposure),
    pnl: `${position.unrealizedPnl >= 0 ? "+" : ""}${position.unrealizedPnl}`,
  };
});

export const formatCredits = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);

# PolyTrade

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)
![Go](https://img.shields.io/badge/Backend-Go-00ADD8?logo=go&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/API%20on-Render-46E3B7?logo=render&logoColor=black)
![Virtual Credits](https://img.shields.io/badge/Currency-Virtual%20Credits%20Only-22c55e)

> **Copy top traders in prediction markets using virtual credits.**

PolyTrade is a full-stack prediction market simulator where users trade YES/NO outcomes using virtual credits. It lowers the barrier for new users through **copy trading** — discover top traders on the leaderboard, follow them, set a copy ratio, and automatically mirror their future trades.

---

🔗 [Live Demo](#) &nbsp;|&nbsp; 🛠️ [Backend API](#) &nbsp;|&nbsp; 📄 [Demo Flow](docs/DEMO_FLOW.md) &nbsp;|&nbsp; 📘 [API Reference](docs/API_QUICK_REFERENCE.md)

---

## 🚀 What Is PolyTrade?

PolyTrade is a browser-based prediction market simulator built around three ideas: **markets**, **wallets**, and **copy trading**.

Users receive 1,000 virtual credits on signup and can immediately start trading on binary YES/NO markets. Each market displays probability-style prices, trade volume, and live status. Users can place manual trades or choose to follow experienced traders through the copy trading engine.

When a copied trade fires, the follower's wallet and portfolio update automatically — no action required. When markets close, an admin resolves the outcome, and virtual payouts are distributed to winning positions. Every transaction, copy event, and payout is recorded in the wallet ledger and visible in the portfolio.

---

## 🎯 Why PolyTrade?

Prediction markets are genuinely powerful tools for aggregating information and gauging probability. But for most people, they're hard to use:

- Binary pricing and probability percentages are confusing for newcomers
- Users don't know how to evaluate a market's quality or activity
- There's no natural discovery path for learning *who* trades well
- The feedback loop between a trade and its outcome is long and opaque

Most platforms drop new users into a live market with no guidance. The result is low engagement, poor decisions, and fast drop-off.

**The insight behind PolyTrade:** copy trading turns expert behavior into a structured onboarding path. Instead of asking every user to figure out the market from scratch, PolyTrade lets beginners follow traders they trust, observe the mechanics in real time, and gradually develop their own judgment — all within a risk-free virtual environment.

---

## 💡 Solution

PolyTrade connects three core loops:

**Manual Trading** → Users browse active markets, view probabilities and volume, and place YES/NO trades. Their wallet is debited, and their position is opened immediately.

**Copy Trading** → Users discover top performers on the leaderboard, follow them at a custom copy ratio (e.g. 50%), and automatically mirror every future trade proportionally. The copy activity log shows exactly what was copied and when.

**Resolution & Payouts** → Admins close markets and resolve outcomes. Winners receive virtual payouts proportional to their positions. Settled positions remain visible for portfolio review.

All activity — starter credits, manual trades, copied trades, and payouts — is recorded in the wallet ledger with full history.

---

## 🧠 Built for BuildRush

PolyTrade was built for **BuildRush**, a research-driven innovation challenge focused on practical problem-solving, technical execution, and real working prototypes.

The project explores a concrete question: *can social and copy mechanisms make prediction markets meaningfully more accessible to non-expert users?* It addresses that question with a functional full-stack system — not a mockup — that executes trades, automates copy logic, settles markets, and tracks everything transparently.

---

## ✨ Key Features

**📊 Binary YES/NO Markets**
Markets display probability-style prices, volume, recent activity, and status. Users can evaluate sentiment shifts over time.

**🖱️ Manual Trading**
Place YES or NO trades on any open market. Shares are calculated, wallet is debited, and position is opened instantly.

**🔁 Copy Trading Engine**
Follow any trader at a custom ratio. Every future trade they place is automatically mirrored proportionally into the follower's account.

**🏆 Trader Leaderboard**
Discover traders ranked by balance, trade volume, number of followers, and market participation. Find who's worth following.

**💰 Virtual Wallet Ledger**
Every credit event is recorded — starter credits, trade debits, copied trades, and resolved payouts. Full transaction history always visible.

**📁 Portfolio Tracking**
View open and settled positions with shares, entry prices, estimated value, and PnL. Positions update automatically on copy trades and resolution.

**📋 Recent Trades & Copy Activity**
Per-market and per-user trade history. Separate copy activity log showing every mirrored trade, source trader, and copy ratio applied.

**🔒 Admin Market Resolution**
Admins can close markets and resolve YES or NO outcomes. Resolution triggers automatic payout distribution to all winning positions.

**💸 Payout Settlement**
Winners receive virtual credits proportional to their position size and shares. Settled positions are marked and remain visible in portfolio history.

**🖥️ Full-Stack Dashboard**
A polished Next.js interface covering markets, trading, wallet, portfolio, leaderboard, copy settings, activity logs, and admin tools.

---

## 🧩 Core User Flow

```
Register / Login
        │
        ▼
Receive 1,000 virtual credits
        │
        ▼
Browse YES/NO markets
        │
        ├──────────────────────────┐
        ▼                          ▼
Place a manual trade        Follow a top trader
        │                          │
        │                  Set copy ratio (e.g. 50%)
        │                          │
        │                  Auto-copy future trades
        │                          │
        └──────────────────────────┘
        │
        ▼
Wallet & portfolio update in real time
        │
        ▼
Admin closes and resolves market
        │
        ▼
Winners receive virtual payouts
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────┐
│      Frontend (Next.js)          │
│   TypeScript · Tailwind · Zustand│
└────────────────┬─────────────────┘
                 │  REST API
                 ▼
┌──────────────────────────────────┐
│       Backend (Go + Gin)         │
│  Markets · Trades · Copy Engine  │
│  Wallet · Portfolio · Resolution │
└────────────────┬─────────────────┘
                 │  GORM
                 ▼
┌──────────────────────────────────┐
│     PostgreSQL (Neon / Local)    │
│  Users · Markets · Trades        │
│  Positions · Wallet · Copy Rels  │
└──────────────────────────────────┘
```

The frontend communicates with the Go REST API over HTTP. The backend handles all trade execution, copy logic, wallet updates, and market resolution. PostgreSQL persists users, markets, trades, positions, wallet transactions, copy relationships, and resolution records.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS, Zustand, Axios, Recharts, Lucide React |
| Backend | Go, Gin, GORM |
| Database | PostgreSQL (Neon in production, local for development) |
| Deployment | Vercel (frontend), Render (backend API) |
| Docs | Markdown — `docs/DEMO_FLOW.md`, `docs/API_QUICK_REFERENCE.md` |

---

## 📁 Project Structure

```
polytrade/
├── frontend/          # Next.js app — pages, components, state, API client
├── backend/           # Go API — routes, handlers, models, DB logic
├── docs/              # DEMO_FLOW.md and API_QUICK_REFERENCE.md
├── docker-compose.yml # Local multi-service setup
└── README.md
```

- **`frontend/`** — All UI pages (markets, trading, wallet, portfolio, leaderboard, copy settings, admin), Zustand state, Axios API client, Recharts visualizations.
- **`backend/`** — Gin router, handler modules (markets, trades, wallet, portfolio, leaderboard, copy trading, admin resolution), GORM models, seed data.
- **`docs/`** — Step-by-step demo flow and full API endpoint reference.

---

## ⚙️ Local Setup

### Prerequisites

- Node.js (v18+)
- Go (v1.21+)
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your local DATABASE_URL
go mod tidy
go run ./cmd/api
```

Backend runs at `http://localhost:4000`

```bash
# Health check
curl http://localhost:4000/health
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🌍 Environment Variables

**Backend** (`.env`):

```env
PORT=4000
DATABASE_URL=postgres://<user>@localhost:5432/polytrade?sslmode=disable
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🌱 Seed Data

The database seeds three demo users, active markets, starter credits, and copy relationships out of the box.

| User | User ID | Starting Balance |
|---|---|---|
| Vansh | 1 | 1,000 virtual credits |
| Nitish | 2 | 1,000 virtual credits |
| Alice | 3 | 1,000 virtual credits |

**Pre-seeded copy relationships:**
- Vansh follows Alice at **50%** copy ratio
- Nitish follows Alice at **30%** copy ratio

Alice's trades will automatically trigger proportional copied trades for both followers, demonstrating the copy engine immediately on first run.

---

## 🎬 Quick Demo Script

1. Open the app and log in as any seed user
2. Browse the YES/NO market listing
3. Place a manual trade and check the wallet ledger
4. Open the leaderboard and follow Alice
5. Trigger a trade as Alice — observe it copy to followers
6. View copy activity and portfolio positions
7. Open the admin dashboard
8. Close and resolve a market
9. Check wallet for virtual payout and portfolio for settled positions

Full walkthrough: [`docs/DEMO_FLOW.md`](docs/DEMO_FLOW.md)

---

## 🔐 Scope & Safety

PolyTrade operates entirely on **virtual credits**. It does not process real money, connect to financial systems, or represent real financial instruments of any kind. It is designed for simulation, learning, and product demonstration only.

---

## 📄 Documentation

| Document | Description |
|---|---|
| [`docs/DEMO_FLOW.md`](docs/DEMO_FLOW.md) | Step-by-step walkthrough for judges and reviewers |
| [`docs/API_QUICK_REFERENCE.md`](docs/API_QUICK_REFERENCE.md) | Full REST API endpoint reference |

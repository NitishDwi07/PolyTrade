# PolyTrade

Copy top traders in prediction markets using virtual credits.

**PolyTrade makes prediction markets easier for beginners by combining YES/NO trading, leaderboard discovery, and automatic copy trading.**

![Frontend](https://img.shields.io/badge/Frontend-Next.js-black)
![Backend](https://img.shields.io/badge/Backend-Go-00ADD8)
![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1)
![Status](https://img.shields.io/badge/Status-MVP-22c55e)

## What Is PolyTrade?

PolyTrade is a full-stack prediction market simulator where users trade on binary YES/NO outcomes using virtual credits. Markets show probability-style prices, trade volume, recent activity, and status so users can understand how sentiment changes over time.

The product adds a copy trading layer for beginners. Users can discover traders through a leaderboard, follow them, set copy ratios, and automatically mirror their future trades. Admins can close markets, resolve outcomes, and distribute virtual payouts to winning positions.

## The Problem

Prediction markets can be difficult for new users to approach. Pricing and probabilities are confusing, users may not know how to evaluate markets, and beginners often do not know which traders to trust.

Copy trading creates a guided onboarding path. Instead of requiring every user to make decisions from scratch, PolyTrade helps beginners learn from trader activity while still tracking their own wallet, exposure, and portfolio performance.

## The Solution

PolyTrade supports both manual and copy-based participation. Users can place their own YES/NO trades, follow top traders, and choose what percentage of a trader's future activity they want to mirror.

When copied trades execute, the wallet ledger and portfolio update automatically. When markets are resolved, winning positions receive virtual payouts and settled positions remain visible for review.

## Core User Flow

```text
Register/Login
      |
Receive 1,000 virtual credits
      |
Browse YES/NO markets
      |
Place a trade manually OR follow a trader
      |
Auto-copy future trades
      |
Track wallet and portfolio
      |
Admin resolves market
      |
Winners receive virtual payouts
```

## Key Features

- **YES/NO Markets** — Trade on simple binary outcomes with probability-style prices and market volume.
- **Copy Trading** — Follow a trader and mirror future trades based on your selected copy ratio.
- **Wallet Ledger** — Every starter credit, trade debit, copied trade, and payout is recorded.
- **Portfolio Tracking** — View open and settled positions with shares, prices, estimated value, and PnL.
- **Leaderboard** — Discover traders by balance, trade volume, followers, and participation signals.
- **Recent Activity** — Review market trades, user trade history, and copied trade activity.
- **Admin Resolution** — Close markets, resolve outcomes, and distribute virtual payouts transparently.
- **Full-Stack Dashboard** — A polished Next.js frontend connected to a Go REST API and PostgreSQL database.

## Architecture Overview

```text
Frontend (Next.js)
        |
      REST API
        |
Go Backend (Gin)
        |
   PostgreSQL
```

The frontend communicates with the Go REST API. The backend persists users, markets, trades, positions, wallet transactions, copy relationships, and market resolutions in PostgreSQL.

## Tech Stack

| Layer | Stack |
| --- | --- |
| Frontend | Next.js, TypeScript, Tailwind CSS, Zustand, Axios, Recharts, Lucide |
| Backend | Go, Gin, GORM |
| Database | PostgreSQL |
| Docs | [`DEMO_FLOW.md`](docs/DEMO_FLOW.md), [`API_QUICK_REFERENCE.md`](docs/API_QUICK_REFERENCE.md) |

## Backend Modules

- **Markets** — Market listing, detail views, prices, status, and resolution fields.
- **Trades** — Manual YES/NO trade execution with shares and market volume updates.
- **Wallet Ledger** — Balance updates and transaction history for credits, debits, and payouts.
- **Portfolio** — Position tracking for open and settled market exposure.
- **Leaderboard** — Trader ranking by balance, volume, trades, followers, and following counts.
- **Copy Trading** — Follow relationships, copy ratios, enable/disable controls, and copied trade execution.
- **Admin Resolution** — Market close/resolve flow with virtual payout settlement.
- **Seed Data** — Demo users, markets, starter credits, and copy relationships.

## Local Setup

### Prerequisites

- Node.js
- Go
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env
go mod tidy
go run ./cmd/api
```

Backend runs at:

```text
http://localhost:4000
```

Health check:

```bash
curl http://localhost:4000/health
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## Environment Variables

Backend:

```env
PORT=4000
DATABASE_URL=postgres://<user>@localhost:5432/polytrade?sslmode=disable
FRONTEND_URL=http://localhost:3000
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Demo Users

| User | userId | Demo setup |
| --- | ---: | --- |
| Vansh | 1 | Follows Alice at 50% |
| Nitish | 2 | Follows Alice at 30% |
| Alice | 3 | Seed trader used for copy activity |

All users start with 1,000 virtual credits.

## Quick Demo Script

1. Open the landing page.
2. Log in or register.
3. Browse YES/NO markets.
4. Place a manual trade.
5. View wallet and portfolio updates.
6. Open the leaderboard.
7. Check copy trading settings and activity.
8. Resolve a market from admin.
9. View the virtual payout in wallet and settled portfolio positions.

## Documentation

- Detailed demo flow: [`docs/DEMO_FLOW.md`](docs/DEMO_FLOW.md)
- API quick reference: [`docs/API_QUICK_REFERENCE.md`](docs/API_QUICK_REFERENCE.md)

## Scope & Safety

PolyTrade uses virtual credits only. It is designed for simulation, education, and product demonstration. It does not process real money or represent real financial instruments.

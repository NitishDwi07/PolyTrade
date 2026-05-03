
# PolyTrade

> **Making prediction markets accessible to everyone through copy trading.**

![Go](https://img.shields.io/badge/Go-1.22+-00ADD8) ![Next.js](https://img.shields.io/badge/Next.js-14.x-black) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue) ![Redis](https://img.shields.io/badge/Redis-7.x-red) ![License](https://img.shields.io/badge/License-MIT-yellow)

> ⚠️ **Hackathon / Educational Project** — PolyTrade is a simulation platform built for learning and demonstration purposes. All trades use **virtual credits only**. No real money, no real financial activity, no real payouts. Any payment/top-up feature, if added, should use **test/sandbox mode only**.

---

## What is PolyTrade?

PolyTrade is a full-stack prediction market simulator. Users trade on binary YES/NO outcome questions using virtual credits. The platform adds a copy trading layer on top: beginners can discover top-performing traders through a leaderboard, follow them, and automatically replicate their trades at a configurable ratio.

The goal is to make prediction markets intuitive. Instead of requiring users to understand pricing models and probabilities from day one, PolyTrade lets them learn by watching and copying experienced traders.

---

## The Problem

Prediction markets are analytically powerful but hard for newcomers:

- Pricing is counterintuitive
- Users must independently research and form strong views
- There is no beginner-friendly onboarding path
- New users often lose credits before understanding basic strategy
- Most platforms assume prior prediction-market knowledge

The result: most people try prediction markets once and leave.

---

## The Solution

PolyTrade introduces **copy trading** as a first-class feature:

1. **Top traders** are surfaced on a leaderboard ranked by PnL, win rate, and volume
2. **Followers** choose a trader, set a copy ratio, and enable auto-copy
3. When the trader places a trade, the follower's trade is automatically executed proportionally
4. Followers can pause, adjust, or stop copying anytime

This mirrors copy trading from traditional finance, but applies it to prediction markets using virtual credits.

---

## Demo Flow

1. Register and receive 1,000 virtual credits
2. Browse open YES/NO prediction markets
3. Place a manual trade on any market
4. Wallet balance and portfolio update
5. Market probabilities update based on trading volume
6. Visit leaderboard and follow a top trader
7. Set copy ratio, for example 50%
8. When that trader places a trade, your account automatically mirrors it
9. Admin resolves a market
10. Winning users receive virtual payouts

---

## Key Features

- **Virtual Wallet** — users start with demo credits
- **Wallet Ledger** — every debit and credit is recorded
- **Binary YES/NO Markets** — simple outcome-based trading
- **Dynamic Probability Pricing** — prices update based on YES/NO volume
- **Manual Trading** — users can place their own trades
- **Copy Trading Engine** — follow traders and auto-copy their trades
- **Leaderboard** — discover top-performing traders
- **Portfolio Tracker** — track positions, exposure, and PnL
- **Admin Panel** — create, close, resolve, and cancel markets
- **Market Resolution** — distribute virtual payouts to winners
- **Real-time Updates** — optional WebSocket updates for prices, wallet, and copy events

---

## What Makes PolyTrade Unique

| Feature | Polymarket | Manifold | **PolyTrade** |
|---|---|---|---|
| Copy Trading | ❌ | ❌ | ✅ |
| Leaderboard Discovery | ❌ | Limited | ✅ |
| Beginner Onboarding | ❌ | Partial | ✅ |
| Real Money | ✅ | ❌ | ❌ |
| Virtual Simulation | ❌ | ✅ | ✅ |
| Auto-Copy Engine | ❌ | ❌ | ✅ |
| Admin Market Resolution | ✅ | ✅ | ✅ |

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 14 |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Charts | Recharts |
| HTTP Client | Axios / fetch |
| Real-time | WebSocket client |

### Backend

| Layer | Technology |
|---|---|
| Language | Go |
| HTTP Framework | Gin / Fiber |
| Database | PostgreSQL |
| ORM / Query Layer | GORM or sqlc |
| Cache / Queue Infra | Redis |
| Background Jobs | Asynq |
| Auth | JWT |
| Validation | Go validator |
| Real-time | Gorilla WebSocket / native WebSocket |
| Config | godotenv / envconfig |
| Password Hashing | bcrypt |

---

## Architecture Overview

```txt
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                   │
│  Markets · Portfolio · Leaderboard · Copy Trading · Wallet  │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST + WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                      Go Backend API                         │
│  Auth · Markets · Trades · Copy Trading · Wallet · Admin    │
└──────┬──────────────────────────────────────┬───────────────┘
       │                                      │
┌──────▼──────┐                    ┌──────────▼────────┐
│ PostgreSQL  │                    │   Redis + Asynq   │
│ Main DB     │                    │ Cache · Queues    │
└─────────────┘                    └──────────┬────────┘
                                              │
                                   ┌──────────▼────────┐
                                   │   Go Workers      │
                                   │  Copy Trades      │
                                   │  Payouts          │
                                   │  Leaderboard      │
                                   │  Notifications    │
                                   └───────────────────┘
```

---

## Folder Structure

```txt
polytrade/
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── markets/
│   │   ├── portfolio/
│   │   ├── leaderboard/
│   │   ├── copy-trading/
│   │   ├── wallet/
│   │   └── admin/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── markets/
│   │   ├── portfolio/
│   │   ├── copy-trading/
│   │   ├── leaderboard/
│   │   └── wallet/
│   ├── lib/
│   │   ├── api.ts
│   │   └── socket.ts
│   ├── store/
│   └── package.json
│
├── backend/
│   ├── cmd/
│   │   ├── api/
│   │   │   └── main.go
│   │   └── worker/
│   │       └── main.go
│   ├── internal/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── handlers/
│   │   │   ├── auth_handler.go
│   │   │   ├── market_handler.go
│   │   │   ├── trade_handler.go
│   │   │   ├── wallet_handler.go
│   │   │   ├── portfolio_handler.go
│   │   │   ├── copy_handler.go
│   │   │   ├── leaderboard_handler.go
│   │   │   └── admin_handler.go
│   │   ├── services/
│   │   │   ├── auth_service.go
│   │   │   ├── wallet_service.go
│   │   │   ├── market_service.go
│   │   │   ├── trade_service.go
│   │   │   ├── copy_service.go
│   │   │   ├── portfolio_service.go
│   │   │   └── leaderboard_service.go
│   │   ├── jobs/
│   │   │   ├── copy_trade_job.go
│   │   │   ├── payout_job.go
│   │   │   └── leaderboard_job.go
│   │   └── websocket/
│   ├── migrations/
│   ├── go.mod
│   ├── go.sum
│   └── .env.example
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEMO.md
│
├── docker-compose.yml
└── README.md
```

---

## Backend Modules

| Module | Responsibility |
|---|---|
| Auth | Register, login, JWT generation, password hashing |
| Users | User profile and role management |
| Wallet | Balance, ledger history, demo top-up |
| Markets | Market creation, listing, closing, resolving |
| Trades | Manual trade execution and probability updates |
| Copy Trading | Follow/unfollow traders, ratio settings, copied trades |
| Portfolio | Aggregated positions and PnL |
| Leaderboard | Top traders ranked by PnL, win rate, and followers |
| Admin | Market lifecycle management |
| WebSocket | Real-time market and wallet updates |
| Workers | Async copy trades, payouts, leaderboard refresh |

---

## Database Tables

| Table | Purpose |
|---|---|
| users | User accounts, roles, credentials |
| wallets | One virtual wallet per user |
| wallet_transactions | Immutable ledger of all credit movements |
| markets | Market questions, status, close time |
| market_options | YES/NO options, volume, current price |
| trades | Manual and copied trade records |
| positions | Aggregated user holdings |
| copy_relationships | Follow links, copy ratio, enabled flag |
| leaderboard_snapshots | Trader ranking snapshots |
| market_resolutions | Final winning outcome and payout info |
| notifications | In-app notification records |

---

## API Endpoints

### Auth

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Markets

```txt
GET    /api/markets
GET    /api/markets/:id
POST   /api/markets
PATCH  /api/markets/:id
POST   /api/markets/:id/close
POST   /api/markets/:id/resolve
POST   /api/markets/:id/cancel
```

### Trades

```txt
POST   /api/markets/:id/trades
GET    /api/trades/me
GET    /api/markets/:id/trades
```

### Copy Trading

```txt
POST   /api/copy/follow/:traderId
DELETE /api/copy/follow/:traderId
PATCH  /api/copy/settings/:traderId
GET    /api/copy/following
GET    /api/copy/followers
```

### Wallet

```txt
GET    /api/wallet
GET    /api/wallet/transactions
POST   /api/wallet/topup-demo
```

### Portfolio

```txt
GET    /api/portfolio
GET    /api/portfolio/:marketId
```

### Leaderboard

```txt
GET    /api/leaderboard
GET    /api/traders/:id/performance
```

### Admin

```txt
GET    /api/admin/stats
GET    /api/admin/markets
GET    /api/admin/trades
GET    /api/admin/users
```

---

## How Trading Works

PolyTrade uses a simplified volume-weighted probability model for the MVP:

```txt
price_yes = yes_volume / (yes_volume + no_volume)
price_no  = 1 - price_yes
```

If there are no trades yet:

```txt
price_yes = 0.5
price_no  = 0.5
```

### Manual Trade Execution

1. User sends a trade request
2. Backend validates JWT
3. Backend checks the market is open
4. Backend checks wallet balance
5. Shares are calculated:

```txt
shares = amount / current_option_price
```

6. Wallet is debited inside a database transaction
7. Wallet transaction is recorded
8. Trade record is created
9. User position is created or updated
10. YES/NO volume is updated
11. Market price is recalculated
12. Copy trading logic is triggered for followers

---

## How Copy Trading Works

```txt
Trader places a manual trade
        │
        ▼
Backend checks active followers
        │
        ├── For each follower:
        │     ├── Check copy trading enabled
        │     ├── Calculate copied amount
        │     ├── Check follower balance
        │     ├── Create copied trade
        │     └── Mark copiedFromTradeId
        │
        ▼
Follower wallet and position update
```

### Copy Amount Formula

```txt
copied_amount = original_trade_amount × copy_ratio
```

Example:

```txt
Trader places 1000 credits on YES
Follower copy ratio = 50%
Follower trade = 500 credits on YES
```

### Safety Rules

- Copied trades are never copied again
- If follower balance is insufficient, copy is skipped
- Each copied trade stores the original trade ID
- Manual trades and copied trades are clearly separated
- Copy ratio can be changed anytime

---

## How Market Resolution Works

1. Admin closes a market
2. Admin resolves it with winning outcome: YES or NO
3. Backend calculates total pool:

```txt
total_pool = yes_volume + no_volume
```

4. Backend calculates total winning shares:

```txt
winning_shares_total = sum of all shares on winning option
```

5. Payout per share:

```txt
payout_per_share = total_pool / winning_shares_total
```

6. Each winner receives:

```txt
user_payout = user_winning_shares × payout_per_share
```

7. Wallets are credited
8. Wallet transactions are recorded
9. Positions are marked settled
10. Market status becomes RESOLVED

---

## WebSocket Events

### Server to Client

| Event | Payload |
|---|---|
| market.price_updated | `{ marketId, priceYes, priceNo, yesVolume, noVolume }` |
| market.trade_executed | `{ marketId, tradeId, option, amount, userId }` |
| user.wallet_updated | `{ balance, transactionId }` |
| user.position_updated | `{ marketId, option, shares, averageCost }` |
| copy.trade_copied | `{ originalTradeId, copiedTradeId, traderId, amount }` |
| leaderboard.updated | `{ top10: [...] }` |
| market.resolved | `{ marketId, outcome, payoutPerShare }` |
| notification.created | `{ id, message, type }` |

### Client to Server

| Event | Description |
|---|---|
| market.subscribe | Subscribe to a market's live updates |
| market.unsubscribe | Unsubscribe from market updates |
| user.subscribe | Subscribe to personal wallet and position updates |

---

## Background Jobs

For the hackathon MVP, copy trading can be implemented synchronously inside the Go service after the original trade completes.

If time allows, use **Asynq** with Redis for background jobs.

| Queue | Job | Trigger |
|---|---|---|
| copy-trading | process-copy-trade | After manual trade execution |
| markets | settle-market-payouts | After admin resolves market |
| leaderboard | update-leaderboard | After trade or resolution |
| notifications | create-notification | After trade, copy, or payout |

---

## Environment Variables

```env
# Server
PORT=4000
APP_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgres://polytrade:polytrade@localhost:5432/polytrade?sslmode=disable

# Redis
REDIS_ADDR=localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# Auth
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=168h

# Optional
ENABLE_WORKERS=false
```

---

## Local Setup

### Prerequisites

- Go 1.22+
- Node.js 20+
- Docker + Docker Compose
- PostgreSQL
- Redis

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/polytrade.git
cd polytrade
```

---

### 2. Start PostgreSQL and Redis

```bash
docker-compose up -d
```

---

### 3. Backend setup

```bash
cd backend
cp .env.example .env
go mod tidy
go run cmd/api/main.go
```

Backend runs at:

```txt
http://localhost:4000
```

Optional worker process:

```bash
go run cmd/worker/main.go
```

---

### 4. Frontend setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

---

## Docker Compose

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    container_name: polytrade-postgres
    environment:
      POSTGRES_DB: polytrade
      POSTGRES_USER: polytrade
      POSTGRES_PASSWORD: polytrade
    ports:
      - "5432:5432"
    volumes:
      - polytrade_postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: polytrade-redis
    ports:
      - "6379:6379"

volumes:
  polytrade_postgres_data:
```

---

## Screenshots

> Screenshots and demo GIFs will be added here.

| View | Description |
|---|---|
| `/markets` | Market feed with live probabilities |
| `/markets/:id` | Market detail with trading panel |
| `/leaderboard` | Ranked traders with follow buttons |
| `/copy-trading` | Followed traders and copy settings |
| `/portfolio` | Open positions and PnL |
| `/wallet` | Balance and transaction history |
| `/admin` | Market creation and resolution |

---

## Hackathon MVP Priority

### Must Have

- Auth
- Virtual wallet
- Market creation
- YES/NO trading
- Probability updates
- Portfolio page
- Leaderboard
- Follow trader
- Auto-copy trade
- Market resolution
- Basic payout system

### Good to Have

- WebSocket updates
- Notifications
- Leaderboard caching
- Asynq background jobs
- Admin analytics
- Better charts

### Skip for MVP

- Real payments
- Stripe integration
- Telegram bot
- Complex order book
- LMSR pricing
- Multi-outcome markets
- Mobile app
- Blockchain/on-chain settlement

---

## Resume-Worthy Highlights

- **Copy Trading Engine** — Built an auto-copy system where followers can mirror top traders' prediction-market trades using configurable copy ratios.

- **Transaction-Safe Wallet Ledger** — Designed a virtual credit wallet where every debit and payout is recorded as an immutable ledger transaction.

- **Go Backend Architecture** — Implemented backend services in Go with clean separation between handlers, services, models, middleware, and background jobs.

- **Prediction Market Simulator** — Built a binary YES/NO market system with dynamic probability updates based on trading volume.

- **Leaderboard-Based Discovery** — Ranked traders by performance metrics such as PnL, trade count, win rate, and follower count.

- **Admin Market Resolution** — Added admin-controlled market closing and resolution with proportional payout settlement.

- **Full-Stack Product Experience** — Combined a polished Next.js frontend with a Go/PostgreSQL backend to deliver a working hackathon-ready product.

---

## Future Scope

- LMSR or AMM-based pricing
- Limit orders and order book
- Multi-outcome prediction markets
- Advanced copy settings
- Trader profile pages
- Public trade history
- AI-assisted market creation
- Telegram notifications
- Stripe sandbox top-up
- Mobile app
- Better analytics dashboard

---

## Disclaimer

PolyTrade is an **educational simulation** built for a hackathon. It does not involve real money, real financial instruments, or real payouts of any kind. All credits are virtual and have no monetary value. This project is not affiliated with Polymarket or any financial services provider.
README (6).md
20 KB

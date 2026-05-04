# PolyTrade Demo Flow

## 1. What PolyTrade Does

PolyTrade is a prediction market simulator where users trade on simple YES/NO outcomes using virtual credits. It helps new users participate more confidently by letting them discover high-performing traders through a leaderboard. Users can follow traders, set a copy ratio, and automatically mirror future trades. Wallet, portfolio, and trade history views show how positions and balances change over time. Admin controls allow markets to be closed, resolved, and paid out transparently with virtual credits.

## 2. Run Locally

Backend:

```bash
cd backend
cp .env.example .env
go mod tidy
go run ./cmd/api
```

Frontend:

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

URLs:

- Frontend: http://localhost:3000
- Backend health: http://localhost:4000/health

## 3. Local PostgreSQL Setup

The backend reads `DATABASE_URL` from `backend/.env`. Make sure it matches your local PostgreSQL setup.

Example for local Mac Postgres:

```env
DATABASE_URL=postgres://vanshsaraf@localhost:5432/polytrade?sslmode=disable
```

Example for Docker Postgres:

```env
DATABASE_URL=postgres://polytrade:polytrade@localhost:5432/polytrade?sslmode=disable
```

If seed data looks wrong or you want a clean demo database:

```bash
dropdb polytrade
createdb polytrade
```

Then restart the backend so migrations and seed data run again.

## 4. Seed Users

- Vansh — `userId` 1
- Nitish — `userId` 2
- Alice — `userId` 3

Seed behavior:

- Vansh follows Alice at 50%.
- Nitish follows Alice at 30%.
- All users start with 1,000 virtual credits.

## 5. Suggested Live Demo Script

1. Open the landing page.
2. Log in or register.
3. Go to Markets.
4. Open a market detail page.
5. Place a manual YES or NO trade.
6. Show the wallet balance changed.
7. Show the portfolio updated with the new position.
8. Go to Leaderboard.
9. Show Alice as a trader discovery example.
10. Go to Copy Trading.
11. Show Vansh following Alice.
12. Trigger an Alice trade using the API command below.
13. Show copied trade activity for Vansh.
14. Go to Admin.
15. Resolve a market as YES.
16. Show wallet payout and settled portfolio state.

## 6. Useful API Test Commands

Health:

```bash
curl http://localhost:4000/health
```

Markets:

```bash
curl http://localhost:4000/api/markets
```

Place a trade as Alice:

```bash
curl -X POST http://localhost:4000/api/trades \
  -H "Content-Type: application/json" \
  -d '{"userId":3,"marketId":1,"side":"YES","amount":100}'
```

Vansh copy settings:

```bash
curl http://localhost:4000/api/copy/following/1
```

Vansh copy activity:

```bash
curl http://localhost:4000/api/copy/activity/1
```

Resolve market 1 as YES:

```bash
curl -X POST http://localhost:4000/api/admin/markets/1/resolve \
  -H "Content-Type: application/json" \
  -d '{"winningSide":"YES","resolvedBy":"admin"}'
```

Vansh wallet:

```bash
curl http://localhost:4000/api/wallet/1
```

Vansh portfolio:

```bash
curl http://localhost:4000/api/portfolio/1
```

Leaderboard:

```bash
curl http://localhost:4000/api/leaderboard
```

## 7. Demo Notes

- All credits are virtual.
- No real money is used.
- Auth is local frontend auth for the MVP.
- Backend seed users are used for the demo flow.
- Refresh wallet and portfolio after admin payout if the latest state is not visible immediately.

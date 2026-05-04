# PolyTrade API Quick Reference

## Health

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Check backend service health. |
| GET | `/api/health` | Check backend service health through the API namespace. |

## Markets

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/markets` | List all markets with prices, volume, status, and resolution fields. |
| GET | `/api/markets/:id` | Get one market by ID. |
| GET | `/api/markets/:id/trades` | Get recent trades for a market. |
| GET | `/api/markets/:id/resolution` | Get resolution details for a resolved market. |

## Trades

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/trades` | Place a YES or NO trade using virtual credits. |
| GET | `/api/trades/user/:userId` | Get a user's trade history. |

## Wallet

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/wallet/:userId` | Get wallet balance and recent ledger transactions. |

## Portfolio

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/portfolio/:userId` | Get user positions, estimated value, PnL, and settlement fields. |

## Leaderboard

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/leaderboard` | Get ranked traders with balances, trade counts, volume, followers, and following counts. |

## Copy Trading

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/copy/following/:userId` | Get traders followed by a user. |
| GET | `/api/copy/followers/:traderId` | Get followers for a trader. |
| GET | `/api/copy/activity/:userId` | Get copied trades for a user. |
| POST | `/api/copy/follow/:traderId` | Follow or update a trader with a copy ratio. |
| PATCH | `/api/copy/settings/:traderId` | Update copy ratio and enabled state. |
| DELETE | `/api/copy/follow/:traderId` | Unfollow a trader. |

## Admin

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/admin/stats` | Get user, market, trade, volume, and copy relationship totals. |
| POST | `/api/admin/markets/:id/close` | Close an open market. |
| POST | `/api/admin/markets/:id/resolve` | Resolve a market as YES or NO and trigger virtual payouts. |

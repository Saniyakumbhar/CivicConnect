# CivicConnect backend (Express + MongoDB)

## What it does
| Method | URL | Who | Purpose |
|---|---|---|---|
| POST | /api/auth/register/citizen | anyone | Citizen sign-up (optional profile photo) |
| POST | /api/auth/login | anyone | Login for Citizen / Officer / Admin (sets httpOnly cookie) |
| GET | /api/auth/me | logged in | Who am I? (restores session on refresh) |
| POST | /api/auth/logout | anyone | Clears the cookie |
| POST | /api/admin/officers | ADMIN | Create an officer account |
| GET | /api/admin/officers | ADMIN | List officers |
| PATCH | /api/admin/officers/:id/active | ADMIN | Enable / disable an officer |

All accounts live in ONE MongoDB collection (`users`) with a `role` field: CITIZEN, OFFICER or ADMIN.

## Security built in
- Passwords hashed with bcrypt (never stored as text)
- Login token in an httpOnly cookie (JavaScript cannot read it)
- Role checked on the SERVER for every protected route
- The server always assigns the role. A sign-up form can never create an Officer or Admin
- Login rate limit (10 tries / 15 min), helmet headers, 2 MB image-only upload, input validation

## Run it
1. Install Node.js and MongoDB (see SETUP in the chat) and make sure MongoDB is running.
2. In this folder:
```
npm install
copy .env.example .env      (then open .env and edit JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD)
npm run seed:admin          (creates the first admin, run once)
npm run dev
```
3. Check http://localhost:5000/api/health shows {"status":"ok"}.

## Before going live (production)
Set NODE_ENV=production, serve over HTTPS, use a strong JWT_SECRET, set CLIENT_ORIGIN to your real site,
and add `app.set("trust proxy", 1)` in src/app.js if the API sits behind a proxy/load balancer.

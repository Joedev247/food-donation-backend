# Food Donation Backend

Express backend for the Food Donation frontend.

## Setup

1. Copy `.env.example` to `.env`
2. Update `MONGO_URI`, `JWT_SECRET`, and `CORS_ORIGIN` as needed
3. Install dependencies:

```bash
cd food-donation-backend
npm install
```

4. Run the server:

```bash
npm run dev
```

## API Endpoints

- `POST /api/auth/login` - login with `email` and `password`
- `POST /api/users` - register a new user
- `GET /api/users` - list users
- `PUT /api/users/:id` - update user profile
- `DELETE /api/users/:id` - delete user
- `GET /api/donations` - list donations with optional query filters `donorId`, `ngoId`, `status`
- `POST /api/donations` - create a donation
- `PUT /api/donations/:id` - update donation / status
- `DELETE /api/donations/:id` - delete donation
- `GET /api/stats` - fetch stats with `userId` and `role` query parameters

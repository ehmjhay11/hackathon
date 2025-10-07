# Trackify REST API

A TypeScript-based REST API built with Next.js (App Router), MongoDB, and Mongoose for managing payments, donations, purchases, tools, and users.

## Features

- ✅ **TypeScript** for type safety
- ✅ **Next.js App Router** for API routes
- ✅ **MongoDB** with Mongoose ODM
- ✅ **Full CRUD operations** for all collections
- ✅ **Proper error handling** and validation
- ✅ **Modular architecture** with reusable components

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/trackify
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trackify?retryWrites=true&w=majority
```

### 3. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api`

## Data Models

### Payment
```typescript
{
  payment_id: string;    // Unique identifier
  name: string;          // Payment name
  date: Date;           // Payment date
  tools: string;        // Tools involved
  amount: number;       // Payment amount
}
```

### Donation
```typescript
{
  donation_id: string;   // Unique identifier
  name?: string;         // Optional donor name
  date: Date;           // Donation date
  amount: number;       // Donation amount
  tool: string;         // Related tool
}
```

### Purchase
```typescript
{
  purchase_id: string;   // Unique identifier
  tool_id: string;      // Related tool ID
  date: Date;           // Purchase date
  amount: number;       // Purchase amount
}
```

### Tool
```typescript
{
  tool_id: string;      // Unique identifier
  name: string;         // Tool name
  quantity: number;     // Available quantity
  amount: number;       // Tool price
}
```

### User
```typescript
{
  user_id: string;      // Unique identifier
  username: string;     // Unique username
  password: string;     // User password (excluded from responses)
}
```

## API Endpoints

All endpoints return JSON with the following structure:
- **Success**: `{ success: true, data: <result> }`
- **Error**: `{ success: false, error: "<message>" }`

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payments` | Get all payments |
| GET | `/api/payments/[id]` | Get payment by payment_id |
| POST | `/api/payments` | Create new payment |
| PUT | `/api/payments/[id]` | Update payment by payment_id |
| DELETE | `/api/payments/[id]` | Delete payment by payment_id |

### Donations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations` | Get all donations |
| GET | `/api/donations/[id]` | Get donation by donation_id |
| POST | `/api/donations` | Create new donation |
| PUT | `/api/donations/[id]` | Update donation by donation_id |
| DELETE | `/api/donations/[id]` | Delete donation by donation_id |

### Purchases

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/purchases` | Get all purchases |
| GET | `/api/purchases/[id]` | Get purchase by purchase_id |
| POST | `/api/purchases` | Create new purchase |
| PUT | `/api/purchases/[id]` | Update purchase by purchase_id |
| DELETE | `/api/purchases/[id]` | Delete purchase by purchase_id |

### Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tools` | Get all tools |
| GET | `/api/tools/[id]` | Get tool by tool_id |
| POST | `/api/tools` | Create new tool |
| PUT | `/api/tools/[id]` | Update tool by tool_id |
| DELETE | `/api/tools/[id]` | Delete tool by tool_id |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (passwords excluded) |
| GET | `/api/users/[id]` | Get user by user_id (password excluded) |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/[id]` | Update user by user_id |
| DELETE | `/api/users/[id]` | Delete user by user_id |

## Example Usage

### Create a Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "pay_001",
    "name": "Monthly Tool Subscription",
    "date": "2025-01-15T10:00:00Z",
    "tools": "Hammer, Screwdriver",
    "amount": 150.50
  }'
```

### Get All Tools
```bash
curl http://localhost:3000/api/tools
```

### Update a User
```bash
curl -X PUT http://localhost:3000/api/users/user_001 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updated_username",
    "password": "new_password"
  }'
```

## Project Structure

```
trackify/
├── models/
│   ├── Payment.ts      # Payment model and interface
│   ├── Donation.ts     # Donation model and interface
│   ├── Purchase.ts     # Purchase model and interface
│   ├── Tool.ts         # Tool model and interface
│   └── User.ts         # User model and interface
├── lib/
│   └── mongodb.ts      # Database connection utility
├── src/app/api/
│   ├── payments/
│   │   ├── route.ts           # GET, POST /api/payments
│   │   └── [id]/route.ts      # GET, PUT, DELETE /api/payments/[id]
│   ├── donations/
│   │   ├── route.ts           # GET, POST /api/donations
│   │   └── [id]/route.ts      # GET, PUT, DELETE /api/donations/[id]
│   ├── purchases/
│   │   ├── route.ts           # GET, POST /api/purchases
│   │   └── [id]/route.ts      # GET, PUT, DELETE /api/purchases/[id]
│   ├── tools/
│   │   ├── route.ts           # GET, POST /api/tools
│   │   └── [id]/route.ts      # GET, PUT, DELETE /api/tools/[id]
│   └── users/
│       ├── route.ts           # GET, POST /api/users
│       └── [id]/route.ts      # GET, PUT, DELETE /api/users/[id]
└── .env.local.example  # Environment variables template
```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Validation errors, duplicate IDs
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Database connection issues, server errors

## Development

### Run in Development Mode
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

## Database

Make sure MongoDB is running before starting the application. The database connection is managed through the shared utility in `lib/mongodb.ts` which handles connection caching for optimal performance.

## Security Note

- User passwords are excluded from all GET responses
- Input validation is handled by Mongoose schemas
- Unique constraints prevent duplicate entries
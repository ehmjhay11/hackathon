# Trackify Makerspace Management API

A TypeScript-based REST API built with Next.js (App Router), MongoDB, and Mongoose for managing a makerspace including payments, donations, tools, components, and users.

## Features

- ✅ **TypeScript** for type safety
- ✅ **Next.js App Router** for API routes
- ✅ **MongoDB** with Mongoose ODM
- ✅ **Auto-generated unique IDs** for all records
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

### Payment (Service Usage)
```typescript
{
  payment_id: string;    // Auto-generated: "pay_XXXXXXXX"
  userId: string;        // User who used the service
  serviceName: string;   // Name of service (e.g., "3D Printer", "Soldering Station")
  amount: number;        // Payment amount
  paymentMethod: string; // Payment method used
  timestamp: Date;       // When payment was made
}
```

### Donation (Monetary & Items)
```typescript
{
  donation_id: string;     // Auto-generated: "don_XXXXXXXX"
  donorName: string;       // Name of the donor
  type: 'monetary' | 'item'; // Type of donation
  amount?: number;         // Amount (required if type is 'monetary')
  itemDescription?: string; // Description (required if type is 'item')
  dateReceived: Date;      // When donation was received
}
```

### Tool (Makerspace Equipment)
```typescript
{
  tool_id: string;         // Auto-generated: "tool_XXXXXXXX"
  toolName: string;        // Name of the tool
  description: string;     // Tool description
  status: 'available' | 'in-use' | 'maintenance' | 'broken';
  lastMaintenance: Date;   // Last maintenance date
  location: string;        // Where the tool is located
}
```

### Component (Electronic Parts & Consumables)
```typescript
{
  component_id: string;    // Auto-generated: "comp_XXXXXXXX"
  componentName: string;   // Name of the component
  category: string;        // Category (e.g., "Resistors", "Capacitors", "Wire")
  quantity: number;        // Available quantity
  unit: string;           // Unit of measurement (e.g., "pieces", "meters", "grams")
  storageLocation: string; // Where the component is stored
}
```

### User
```typescript
{
  user_id: string;      // Auto-generated: "user_XXXXXXXX"
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

### Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tools` | Get all tools |
| GET | `/api/tools/[id]` | Get tool by tool_id |
| POST | `/api/tools` | Create new tool |
| PUT | `/api/tools/[id]` | Update tool by tool_id |
| DELETE | `/api/tools/[id]` | Delete tool by tool_id |

### Components

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/components` | Get all components |
| GET | `/api/components/[id]` | Get component by component_id |
| POST | `/api/components` | Create new component |
| PUT | `/api/components/[id]` | Update component by component_id |
| DELETE | `/api/components/[id]` | Delete component by component_id |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (passwords excluded) |
| GET | `/api/users/[id]` | Get user by user_id (password excluded) |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/[id]` | Update user by user_id |
| DELETE | `/api/users/[id]` | Delete user by user_id |

## Example Usage

## Example Usage

### Create a Service Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_ABC12345",
    "serviceName": "3D Printer",
    "amount": 15.50,
    "paymentMethod": "credit_card"
  }'
```
*Note: `payment_id` will be auto-generated as "pay_XXXXXXXX"*

### Create a Monetary Donation
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "John Doe",
    "type": "monetary",
    "amount": 100.00
  }'
```

### Create an Item Donation
```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "donorName": "Jane Smith",
    "type": "item",
    "itemDescription": "Old laptop with charger"
  }'
```

### Create a Component
```bash
curl -X POST http://localhost:3000/api/components \
  -H "Content-Type: application/json" \
  -d '{
    "componentName": "Arduino Uno",
    "category": "Microcontrollers",
    "quantity": 5,
    "unit": "pieces",
    "storageLocation": "Shelf A2"
  }'
```

### Get All Tools
```bash
curl http://localhost:3000/api/tools
```

### Update a User
```bash
curl -X PUT http://localhost:3000/api/users/user_ABC12345 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updated_username",
    "password": "new_password"
  }'
```
*Note: Use the auto-generated `user_id` from the create response*

## Project Structure

```
trackify/
├── models/
│   ├── Payment.ts      # Payment model and interface (service payments)
│   ├── Donation.ts     # Donation model and interface (monetary & items)
│   ├── Component.ts    # Component model and interface (electronic parts)
│   ├── Tool.ts         # Tool model and interface (makerspace tools)
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
│   ├── components/
│   │   ├── route.ts           # GET, POST /api/components
│   │   └── [id]/route.ts      # GET, PUT, DELETE /api/components/[id]
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
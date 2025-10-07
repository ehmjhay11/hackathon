# 🏗️ Trackify API/Backend Architecture Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Components](#core-components)
5. [Database Layer](#database-layer)
6. [API Routes](#api-routes)
7. [Data Models](#data-models)
8. [Error Handling](#error-handling)
9. [Development Scripts](#development-scripts)
10. [Request/Response Flow](#requestresponse-flow)
11. [Security Considerations](#security-considerations)
12. [Testing & Deployment](#testing--deployment)

---

## 🎯 Overview

The Trackify backend is a **REST API** built with **Next.js App Router** architecture, providing full CRUD operations for managing:
- 👥 **Users** - User accounts and authentication
- 🔧 **Tools** - Tool inventory management
- 💰 **Payments** - Payment transaction records
- 🎁 **Donations** - Donation tracking
- 🛒 **Purchases** - Purchase order management

### Key Features:
- ✅ **TypeScript-first** development with strict typing
- ✅ **MongoDB** with Mongoose ODM for data persistence
- ✅ **Centralized error handling** with consistent response formats
- ✅ **Connection caching** to optimize database performance
- ✅ **RESTful API design** following industry standards
- ✅ **Automatic validation** via Mongoose schemas

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 15.5.4 (App Router) | Full-stack React framework |
| **Language** | TypeScript | Type-safe development |
| **Database** | MongoDB | NoSQL document database |
| **ODM** | Mongoose 8.0.0 | Object Document Mapping |
| **Runtime** | Node.js | JavaScript runtime environment |
| **Package Manager** | npm | Dependency management |
| **Linting** | ESLint | Code quality and standards |

---

## 📁 Project Structure

```
trackify/
├── 📂 src/app/api/          # API Routes (Next.js App Router)
│   ├── 📂 test/db/          # Database connection testing
│   ├── 📂 users/            # User CRUD operations
│   ├── 📂 tools/            # Tool CRUD operations
│   ├── 📂 payments/         # Payment CRUD operations
│   ├── 📂 donations/        # Donation CRUD operations
│   └── 📂 purchases/        # Purchase CRUD operations
├── 📂 models/               # Mongoose schemas and interfaces
├── 📂 lib/                  # Utility libraries
├── 📂 scripts/              # Database management scripts
└── 📂 public/               # Static assets
```

---

## 🔧 Core Components

### 1. **Database Connection (`lib/mongodb.ts`)**

**Purpose**: Manages MongoDB connections with caching optimization

**How it works**:
```typescript
// Global connection caching prevents connection spam
let cached = global.mongoose || { conn: null, promise: null };

async function connectDB(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) return cached.conn;
  
  // Create new connection promise if none exists
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }
  
  // Await and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}
```

**Key Features**:
- 🔄 **Connection reuse** across API requests
- 🚀 **Hot reload support** in development
- ⚡ **Performance optimization** by preventing connection overhead
- 🛡️ **Error handling** with connection cleanup

---

### 2. **Error Handling (`lib/errorHandler.ts`)**

**Purpose**: Centralizes error processing and response formatting

**How it works**:
```typescript
export function handleMongoError(error: unknown): { status: number; message: string } {
  const mongoError = error as MongoError;
  
  // Handle duplicate key violations (code 11000)
  if (mongoError.code === 11000) {
    const field = Object.keys(mongoError.keyPattern)[0];
    return { status: 400, message: `${field} already exists` };
  }
  
  // Generic server error for unknown issues
  return { status: 500, message: 'Internal server error' };
}
```

**Benefits**:
- 📊 **Consistent error responses** across all endpoints
- 🎯 **Specific error codes** for different scenarios
- 🔍 **Detailed logging** for debugging
- 🛡️ **Security** by not exposing internal errors

---

## 🗃️ Database Layer

### MongoDB Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `user` | User accounts | `user_id`, `username`, `password` |
| `tools` | Tool inventory | `tool_id`, `name`, `description`, `price` |
| `payment` | Payment records | `payment_id`, `user_id`, `amount`, `status` |
| `donation` | Donations | `donation_id`, `user_id`, `amount`, `cause` |
| `purchase` | Purchase orders | `purchase_id`, `user_id`, `tool_id`, `quantity` |

### Mongoose Schema Features

**TypeScript Integration**:
```typescript
export interface IUser extends Document {
  user_id: string;
  username: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  timestamps: true,    // Automatic createdAt/updatedAt
  collection: 'user'   // Explicit collection naming
});
```

**Benefits**:
- ✅ **Type safety** with TypeScript interfaces
- ✅ **Validation** built into schemas
- ✅ **Indexing** for unique constraints
- ✅ **Timestamps** for audit trails

---

## 🌐 API Routes

### Route Pattern Structure

The API follows **Next.js App Router** conventions with file-based routing:

```
/api/{collection}/route.ts        # Collection operations (GET all, POST)
/api/{collection}/[id]/route.ts   # Item operations (GET, PUT, DELETE)
```

### HTTP Methods & Operations

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|-------------|----------|
| `GET` | `/api/users` | Get all users | None | Array of users |
| `POST` | `/api/users` | Create user | User data | Created user |
| `GET` | `/api/users/[id]` | Get user by ID | None | Single user |
| `PUT` | `/api/users/[id]` | Update user | Updated fields | Updated user |
| `DELETE` | `/api/users/[id]` | Delete user | None | Success message |

### Request/Response Examples

**Create User (POST /api/users)**:
```json
// Request
{
  "user_id": "user123",
  "username": "john_doe",
  "password": "securepassword"
}

// Response (201 Created)
{
  "success": true,
  "data": {
    "user_id": "user123",
    "username": "john_doe",
    "createdAt": "2025-10-07T10:30:00Z",
    "updatedAt": "2025-10-07T10:30:00Z"
  }
}
```

**Error Response**:
```json
// Response (400 Bad Request)
{
  "success": false,
  "error": "username already exists"
}
```

---

## 📊 Data Models

Each model follows a consistent pattern with TypeScript interfaces and Mongoose schemas:

### 1. **User Model** (`models/User.ts`)
- **Purpose**: Manages user accounts and authentication
- **Unique Fields**: `user_id`, `username`
- **Security**: Password excluded from API responses

### 2. **Tool Model** (`models/Tool.ts`)
- **Purpose**: Manages tool inventory and specifications
- **Key Features**: Price tracking, description, availability

### 3. **Payment Model** (`models/Payment.ts`)
- **Purpose**: Tracks payment transactions and status
- **Relationships**: Links to users via `user_id`

### 4. **Donation Model** (`models/Donation.ts`)
- **Purpose**: Records charitable donations and causes
- **Tracking**: Amount, purpose, and donor information

### 5. **Purchase Model** (`models/Purchase.ts`)
- **Purpose**: Manages purchase orders and transactions
- **Relationships**: Links users to tools with quantity

---

## 🔄 Request/Response Flow

### 1. **Incoming API Request**
```
1. Client sends HTTP request to /api/endpoint
2. Next.js App Router matches route file
3. Appropriate HTTP method handler is called
```

### 2. **Database Connection**
```
4. connectDB() checks for existing connection
5. Reuses cached connection or creates new one
6. Returns active MongoDB connection
```

### 3. **Data Processing**
```
7. Request body parsed and validated
8. Mongoose model operations executed
9. Database queries performed with error handling
```

### 4. **Response Generation**
```
10. Success: Return data with 200/201 status
11. Error: handleMongoError() processes errors
12. Consistent JSON response sent to client
```

### Example Flow Diagram:
```
Client Request → Route Handler → connectDB() → Mongoose Model → MongoDB
     ↓              ↓              ↓            ↓              ↓
   JSON            Parse         Cache        Query          Store
Response ← Error Handler ← Connection ← Validation ← Document
```

---

## 🛡️ Security Considerations

### Current Implementations:
- 🔐 **Password Exclusion**: Passwords never returned in API responses
- ✅ **Input Validation**: Mongoose schema validation
- 🚫 **Error Sanitization**: Internal errors not exposed to clients
- 🔒 **Unique Constraints**: Prevent duplicate users/resources

### Recommended Enhancements:
- 🔑 **Authentication**: JWT tokens or session management
- 🛡️ **Authorization**: Role-based access control
- 🔐 **Password Hashing**: bcrypt or similar
- 🚦 **Rate Limiting**: Prevent API abuse
- 🌐 **CORS Configuration**: Control cross-origin requests

---

## 🧪 Development Scripts

Located in `/scripts/` directory:

### Database Management Scripts:

| Script | Command | Purpose |
|--------|---------|---------|
| **Connection Test** | `npm run test:db` | Verify MongoDB connectivity |
| **Sample Data** | `npm run init:data` | Populate database with test data |
| **Migration** | `npm run migrate:collections` | Update collection names |
| **Help Guide** | `npm run db:help` | Show all available commands |

### Script Architecture:
```javascript
// CommonJS format for Node.js compatibility
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Direct MongoDB operations without Next.js dependencies
async function testConnection() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Database connected successfully');
}
```

---

## ⚡ Performance Optimizations

### 1. **Connection Caching**
- Reuses database connections across requests
- Prevents connection pool exhaustion
- Reduces latency for subsequent requests

### 2. **Mongoose Optimizations**
- `bufferCommands: false` for immediate connection
- Selective field querying with `.select()`
- Proper indexing on unique fields

### 3. **Next.js Benefits**
- **App Router**: Modern routing with streaming
- **TypeScript**: Compile-time error detection
- **Turbopack**: Fast development builds

---

## 🚀 Testing & Deployment

### Development Testing:
```bash
# Test database connection
npm run test:db

# Initialize sample data
npm run init:data

# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/users
```

### API Testing URLs:
- 🔗 `http://localhost:3000/api/test/db` - Database connection
- 👥 `http://localhost:3000/api/users` - Users endpoint
- 🔧 `http://localhost:3000/api/tools` - Tools endpoint
- 💰 `http://localhost:3000/api/payments` - Payments endpoint

### Production Deployment:
1. **Environment Variables**: Set `MONGODB_URI` in production
2. **Build Process**: `npm run build`
3. **Platform Options**: Vercel, AWS, Digital Ocean
4. **Database**: MongoDB Atlas or self-hosted

---

## 🔍 Troubleshooting

### Common Issues:

**Connection Errors**:
```bash
# Check environment variables
cat .env.local

# Test connection manually
npm run test:db
```

**Build Errors**:
```bash
# Check TypeScript compilation
npm run build

# Lint code
npm run lint
```

**API Errors**:
- Check Next.js server logs
- Verify MongoDB connection string
- Test individual endpoints with curl/Postman

---

## 📚 Additional Resources

- 📖 [Next.js App Router Documentation](https://nextjs.org/docs/app)
- 🍃 [Mongoose Documentation](https://mongoosejs.com/docs/)
- 🗃️ [MongoDB Documentation](https://docs.mongodb.com/)
- 🔷 [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

## 🎯 Summary

The **Trackify API** is a robust, TypeScript-based backend solution that provides:

✅ **Complete CRUD operations** for 5 core entities  
✅ **Optimized database connections** with caching  
✅ **Centralized error handling** for consistency  
✅ **Type-safe development** with TypeScript  
✅ **RESTful API design** following best practices  
✅ **Comprehensive testing tools** for development  
✅ **Scalable architecture** ready for production  

The modular design ensures easy maintenance, testing, and future feature additions while maintaining high performance and security standards.

---

*📝 Last Updated: October 7, 2025*  
*🏷️ Version: 1.0.0*  
*👨‍💻 Generated for Trackify Backend Documentation*
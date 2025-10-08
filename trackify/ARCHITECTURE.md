# 🏗️ Sorsogon Community Innovation Labs - Architecture Overview

## 📋 Project Summary
A comprehensive full-stack web application for managing Innovation Labs services, payments, donations, and community member interactions built with Next.js 15, MongoDB, and TypeScript.

---

## 🎯 System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React/Next.js UI Components]
        PAGES[App Router Pages]
        HOOKS[React Hooks & State]
    end
    
    subgraph "API Layer"
        API[Next.js API Routes]
        AUTH[Authentication API]
        PAYMENTS[Payment APIs]
        REPORTS[Reporting APIs]
    end
    
    subgraph "Database Layer"
        MONGO[(MongoDB)]
        MODELS[Mongoose Models]
        SCRIPTS[Population Scripts]
    end
    
    subgraph "External Services"
        EMAIL[Email Services]
        STORAGE[File Storage]
    end
    
    UI --> API
    PAGES --> UI
    HOOKS --> UI
    API --> MODELS
    AUTH --> MODELS
    PAYMENTS --> MODELS
    REPORTS --> MODELS
    MODELS --> MONGO
    SCRIPTS --> MONGO
    API --> EMAIL
    API --> STORAGE
```

---

## 🏢 Application Structure

### **Frontend Architecture (Next.js 15)**
```
src/
├── app/                    # App Router (Next.js 15)
│   ├── page.tsx           # Main application entry point
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
│       ├── auth/
│       ├── payments/
│       ├── donations/
│       └── reports/
├── components/            # React Components
│   ├── ui/               # Reusable UI components
│   ├── payment/          # Payment-specific forms
│   ├── Dashboard.tsx     # Main dashboard
│   ├── LoginPage.tsx     # Authentication
│   ├── PaymentPage.tsx   # Payment services
│   ├── ServicePreview.tsx # Service details
│   └── ...
├── lib/                  # Utilities & configurations
├── models/               # Mongoose schemas
├── types/                # TypeScript definitions
└── scripts/              # Database utilities
```

---

## 🗄️ Database Schema (MongoDB)

### **Collections Overview**
```mermaid
erDiagram
    USERS ||--o{ PAYMENTS : makes
    USERS ||--o{ DONATIONS : makes
    TOOLS ||--o{ PAYMENTS : uses
    COMPONENTS ||--o{ PAYMENTS : uses
    
    USERS {
        string user_id PK
        string username
        string email
        string password
        string membershipLevel
        date joinDate
        boolean isActive
    }
    
    PAYMENTS {
        string payment_id PK
        string userId FK
        string service
        number totalCost
        string paymentMethod
        date timestamp
    }
    
    DONATIONS {
        string donation_id PK
        string donorName
        string donationType
        number amount
        array items
        date timestamp
    }
    
    TOOLS {
        string tool_id PK
        string name
        string category
        number hourlyRate
        boolean available
    }
    
    COMPONENTS {
        string component_id PK
        string name
        string type
        number price
        number stock
    }
```

### **Data Models**
1. **Users Collection** - Community member authentication & profiles
2. **Payments Collection** - Service payment transactions
3. **Donations Collection** - Monetary & item donations
4. **Tools Collection** - Available hardware tools & equipment
5. **Components Collection** - Electronic components & parts inventory

---

## 🔧 Service Architecture

### **Core Services**
```mermaid
graph LR
    subgraph "Innovation Services"
        A[3D Printer] --> PA[Printer Payment]
        B[Document Printer] --> PB[Document Payment]
        C[Soldering Station] --> PC[Soldering Payment]
        D[Hardware Tools] --> PD[Tools Payment]
        E[Electronic Components] --> PE[Components Payment]
        F[Donations] --> PF[Donation Processing]
    end
    
    subgraph "Payment Processing"
        PA --> API[Payment API]
        PB --> API
        PC --> API
        PD --> API
        PE --> API
        PF --> API
    end
    
    API --> DB[(Database)]
```

### **Service-Specific Components**

#### **1. 3D Printer Service**
- **Component**: `PrinterPaymentForm.tsx`
- **Features**: Filament calculation, time-based pricing, material selection
- **Pricing**: ₱5/hour + material costs

#### **2. Document Printer Service**
- **Component**: `DocumentPrinterPaymentForm.tsx`
- **Features**: Multi-job support, paper size options, binding services
- **Pricing**: ₱2-5/page + premium options

#### **3. Soldering Station**
- **Component**: `SolderingPaymentForm.tsx`
- **Features**: Hourly billing, safety equipment tracking
- **Pricing**: ₱10/hour

#### **4. Tools & Components**
- **Component**: `ToolsComponentsPaymentForm.tsx`
- **Features**: Inventory management, bulk discounts
- **Pricing**: Variable based on item

---

## 🔐 Authentication & Authorization

### **Authentication Flow**
```mermaid
sequenceDiagram
    participant U as User
    participant L as LoginPage
    participant A as Auth API
    participant DB as Database
    participant D as Dashboard
    
    U->>L: Enter credentials
    L->>A: POST /api/auth/login
    A->>DB: Query user by email
    DB->>A: Return user data
    A->>A: Validate password
    A->>L: Return auth response
    L->>D: Redirect with username
    D->>D: Display personalized welcome
```

### **User Management**
- **Registration**: Admin-managed (contact Innovation Labs)
- **Login**: Email/password authentication
- **Session**: Client-side state management
- **Roles**: Guest, Community Member, Administrator

---

## 💳 Payment Processing Architecture

### **Payment Flow**
```mermaid
sequenceDiagram
    participant U as User
    participant S as Service Page
    participant P as Payment Form
    participant API as Payment API
    participant DB as Database
    
    U->>S: Select service
    S->>P: Navigate to payment form
    U->>P: Configure service options
    P->>P: Calculate real-time costs
    U->>P: Submit payment
    P->>API: POST /api/payments
    API->>DB: Store payment record
    DB->>API: Confirm storage
    API->>P: Return success
    P->>S: Redirect to dashboard
```

### **Payment Methods**
- Cash payments
- Credit/Debit cards
- Bank transfers

---

## 📊 Data Flow Architecture

### **Application State Management**
```mermaid
graph TD
    subgraph "App State"
        CS[Current Section]
        CU[Current User]
        SS[Selected Service]
    end
    
    subgraph "Component Communication"
        D[Dashboard] --> CS
        L[Login] --> CU
        SP[Service Preview] --> SS
        PP[Payment Page] --> API[Payment API]
    end
    
    subgraph "Navigation Flow"
        CS --> |dashboard| D
        CS --> |payments| PP
        CS --> |service-preview| SP
        CS --> |community| L
    end
```

### **Key State Variables**
- `currentSection`: Controls which page/component is displayed
- `currentUser`: Stores authenticated user information
- `selectedService`: Tracks which service user wants to use

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: Next.js 15.5.4 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React

### **Backend**
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom JWT-like implementation

### **Development Tools**
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript compiler
- **Database Scripts**: Custom population scripts

---

## 🚀 Deployment Architecture

### **Production Environment**
```mermaid
graph TB
    subgraph "Frontend"
        NEXTJS[Next.js Application]
        STATIC[Static Assets]
    end
    
    subgraph "Backend Services"
        API[API Routes]
        AUTH[Authentication]
        DB[(MongoDB)]
    end
    
    subgraph "External Services"
        CDN[CDN for Assets]
        EMAIL[Email Service]
    end
    
    USER[Users] --> CDN
    USER --> NEXTJS
    NEXTJS --> API
    API --> AUTH
    API --> DB
    API --> EMAIL
```

### **Environment Configuration**
- Development: Local MongoDB, Next.js dev server
- Production: Cloud MongoDB, Vercel/similar hosting

---

## 🔄 Key User Journeys

### **1. Guest User Journey**
```
Dashboard (Guest) → Service Selection → Service Preview → Payment Form → Completion
```

### **2. Community Member Journey**
```
Login → Dashboard (Personalized) → Service Selection → Payment → Member Benefits
```

### **3. Administrator Journey**
```
Login → Admin Panel → Reports → User Management → System Configuration
```

---

## 📈 Scalability Considerations

### **Performance Optimizations**
- **Component Lazy Loading**: Dynamic imports for large components
- **Database Indexing**: Optimized queries on user_id, email, timestamps
- **Caching**: Static generation for service information
- **Image Optimization**: Next.js automatic image optimization

### **Future Enhancements**
- **Real-time Updates**: WebSocket integration for live pricing
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Detailed usage reports and insights
- **Integration APIs**: Third-party service integrations
- **Multi-tenancy**: Support for multiple Innovation Labs locations

---

## 🔧 Development Workflow

### **Setup & Configuration**
1. **Environment Setup**: Node.js, MongoDB connection
2. **Database Population**: `npm run populate:labs`
3. **Development Server**: `npm run dev`
4. **Type Checking**: TypeScript compilation
5. **Testing**: Component and API testing

### **Code Organization**
- **Separation of Concerns**: Clear component, API, and data layers
- **Type Safety**: Comprehensive TypeScript coverage
- **Reusable Components**: UI component library
- **Consistent Styling**: Tailwind CSS design system

---

## 📋 API Endpoints

### **Authentication**
- `POST /api/auth/login` - User authentication

### **Payments**
- `POST /api/payments` - Process service payments
- `GET /api/payments` - Retrieve payment history

### **Donations**
- `POST /api/donations` - Process donations
- `GET /api/donations` - Retrieve donation records

### **Reports**
- `GET /api/reports` - Generate system reports
- `GET /api/analytics` - Usage analytics

---

This architecture provides a robust, scalable foundation for the Sorsogon Community Innovation Labs platform, enabling efficient management of services, payments, and community interactions while maintaining excellent user experience and system reliability.
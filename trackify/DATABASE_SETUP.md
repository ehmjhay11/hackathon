# 🗄️ Database Setup Guide - Innovation Labs

## Latest Database Script: `populate-innovation-labs.cjs`

This comprehensive script populates your MongoDB database with realistic data for the Innovation Labs system.

## 🚀 Quick Setup

### 1. Environment Setup
Ensure your `.env.local` file contains:
```bash
MONGODB_URI=mongodb://localhost:27017/innovation_labs
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/innovation_labs
```

### 2. Run Database Population
```bash
cd trackify
npm run populate:labs
```

## 📊 What Gets Created

### 👥 **Users (5 records)**
- Admin account with lifetime membership
- Premium and basic members
- Student and innovator accounts
- Realistic join dates and activity status

### 🔧 **Tools (10 records)**
- Electronics equipment (soldering stations, multimeters, oscilloscope)
- 3D printers (Ender 3 Pro, Prusa i3 MK3S+)
- Hand tools and measurement devices
- Power tools and bench equipment
- Realistic costs, locations, and maintenance dates

### 🔌 **Electronic Components (13 types)**
- **Microcontrollers**: Arduino Uno R3, ESP32 DevKit, Raspberry Pi 4
- **Sensors**: DHT22, HC-SR04, MPU6050
- **Displays**: 16x2 LCD, OLED modules
- **Basic Components**: LEDs, resistors, capacitors
- **Connectors**: Jumper wires, breadboards
- Stock quantities, pricing, and supplier information

### 💰 **Payment Records (7 transactions)**
- **3D Printing**: Variable pricing based on filament and time
- **Soldering Station**: Hourly billing examples
- **Tools**: Equipment rental/usage fees
- **Components**: Parts purchasing transactions
- Realistic service details and pricing calculations

### 🎁 **Donations (7 records)**
- **Monetary**: Government and community donations
- **Item Donations**: Equipment and component contributions
- Donation tracking with dates and donor information

## 📈 Database Summary Report

After running the script, you'll see:
```
📊 INNOVATION LABS DATABASE SUMMARY
=====================================
👥 Users: 5
🔧 Tools: 10 (Total Value: ₱47,000+)
🔌 Components: 13 types (1,000+ pieces)
💰 Payments: 7 (₱3,400+ revenue)
🎁 Donations: 7 (₱97,500+ raised)
```

## 🎯 Service Coverage

### Payment Integration Ready
- **3D Printer**: PLA/ABS filament cost + power usage
- **Soldering Station**: ₱10/hour billing
- **Tools**: Individual tool rental rates
- **Components**: Per-unit pricing with inventory tracking

### Real-World Data
- Accurate Philippine peso pricing
- Realistic equipment specifications
- Proper inventory management
- Service usage patterns

## 🔄 Alternative Commands

```bash
# Test database connection
npm run test:db

# Reset with older data
npm run reset:db

# Database connection help
npm run db:help
```

## 🎛️ MongoDB Collections Created

1. **users** - User accounts and memberships
2. **tools** - Equipment inventory and status
3. **component** - Electronic parts catalog
4. **payments** - Service transaction records
5. **donation** - Community contributions

## 💡 Next Steps

1. ✅ Run the population script
2. ✅ Start your Next.js development server
3. ✅ Test payment forms with populated data
4. ✅ Verify admin panel functionality
5. ✅ Check inventory management features

---

**Ready to populate your Innovation Labs database?**
```bash
npm run populate:labs
```
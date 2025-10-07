const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

// Define schemas directly in the script
const toolSchema = new mongoose.Schema({
  tool_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 }
}, { timestamps: true, collection: 'tools' });

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true, collection: 'user' });

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  tools: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 }
}, { timestamps: true, collection: 'payment' });

const donationSchema = new mongoose.Schema({
  donation_id: { type: String, required: true, unique: true },
  name: { type: String, required: false },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true, min: 0 },
  tool: { type: String, required: true }
}, { timestamps: true, collection: 'donation' });

const purchaseSchema = new mongoose.Schema({
  purchase_id: { type: String, required: true, unique: true },
  tool_id: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true, min: 0 }
}, { timestamps: true, collection: 'purchase' });

// Create models
const Tool = mongoose.model('Tool', toolSchema, 'tools');
const User = mongoose.model('User', userSchema, 'user');
const Payment = mongoose.model('Payment', paymentSchema, 'payment');
const Donation = mongoose.model('Donation', donationSchema, 'donation');
const Purchase = mongoose.model('Purchase', purchaseSchema, 'purchase');

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database with sample data...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    // Sample Tools Data
    console.log('\n📦 Creating Tools...');
    const toolsData = [
      { tool_id: 'tool_001', name: 'Hammer', quantity: 15, amount: 29.99 },
      { tool_id: 'tool_002', name: 'Screwdriver Set', quantity: 8, amount: 45.50 },
      { tool_id: 'tool_003', name: 'Electric Drill', quantity: 5, amount: 89.99 },
      { tool_id: 'tool_004', name: 'Measuring Tape', quantity: 12, amount: 15.75 },
      { tool_id: 'tool_005', name: 'Socket Wrench Set', quantity: 6, amount: 65.00 }
    ];

    for (const tool of toolsData) {
      try {
        await Tool.create(tool);
        console.log(`  ✅ Created tool: ${tool.name}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  ⚠️ Tool already exists: ${tool.name}`);
        } else {
          console.log(`  ❌ Error creating tool ${tool.name}:`, error.message);
        }
      }
    }

    // Sample Users Data
    console.log('\n👥 Creating Users...');
    const usersData = [
      { user_id: 'user_001', username: 'john_doe', password: 'securepass123' },
      { user_id: 'user_002', username: 'jane_smith', password: 'mypassword456' },
      { user_id: 'user_003', username: 'mike_wilson', password: 'password789' }
    ];

    for (const user of usersData) {
      try {
        await User.create(user);
        console.log(`  ✅ Created user: ${user.username}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  ⚠️ User already exists: ${user.username}`);
        } else {
          console.log(`  ❌ Error creating user ${user.username}:`, error.message);
        }
      }
    }

    // Sample Payments Data
    console.log('\n💰 Creating Payments...');
    const paymentsData = [
      {
        payment_id: 'pay_001',
        name: 'Tool Purchase - January',
        date: new Date('2025-01-15'),
        tools: 'Hammer, Screwdriver Set',
        amount: 75.49
      },
      {
        payment_id: 'pay_002',
        name: 'Equipment Rental',
        date: new Date('2025-01-20'),
        tools: 'Electric Drill',
        amount: 89.99
      }
    ];

    for (const payment of paymentsData) {
      try {
        await Payment.create(payment);
        console.log(`  ✅ Created payment: ${payment.name}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  ⚠️ Payment already exists: ${payment.name}`);
        } else {
          console.log(`  ❌ Error creating payment:`, error.message);
        }
      }
    }

    // Sample Donations Data
    console.log('\n🎁 Creating Donations...');
    const donationsData = [
      {
        donation_id: 'don_001',
        name: 'John Doe',
        date: new Date('2025-01-10'),
        amount: 50.00,
        tool: 'Hammer'
      },
      {
        donation_id: 'don_002',
        date: new Date('2025-01-25'),
        amount: 25.00,
        tool: 'Screwdriver Set'
      }
    ];

    for (const donation of donationsData) {
      try {
        await Donation.create(donation);
        console.log(`  ✅ Created donation: ${donation.name || 'Anonymous'} - $${donation.amount}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  ⚠️ Donation already exists: ${donation.donation_id}`);
        } else {
          console.log(`  ❌ Error creating donation:`, error.message);
        }
      }
    }

    // Sample Purchases Data
    console.log('\n🛒 Creating Purchases...');
    const purchasesData = [
      {
        purchase_id: 'pur_001',
        tool_id: 'tool_001',
        date: new Date('2025-01-12'),
        amount: 29.99
      },
      {
        purchase_id: 'pur_002',
        tool_id: 'tool_002',
        date: new Date('2025-01-18'),
        amount: 45.50
      }
    ];

    for (const purchase of purchasesData) {
      try {
        await Purchase.create(purchase);
        console.log(`  ✅ Created purchase: ${purchase.purchase_id} - $${purchase.amount}`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`  ⚠️ Purchase already exists: ${purchase.purchase_id}`);
        } else {
          console.log(`  ❌ Error creating purchase:`, error.message);
        }
      }
    }

    // Summary
    console.log('\n📊 Database Summary:');
    const toolsCount = await Tool.countDocuments();
    const usersCount = await User.countDocuments();
    const paymentsCount = await Payment.countDocuments();
    const donationsCount = await Donation.countDocuments();
    const purchasesCount = await Purchase.countDocuments();

    console.log(`  🔧 Tools: ${toolsCount} documents`);
    console.log(`  👥 Users: ${usersCount} documents`);
    console.log(`  💰 Payments: ${paymentsCount} documents`);
    console.log(`  🎁 Donations: ${donationsCount} documents`);
    console.log(`  🛒 Purchases: ${purchasesCount} documents`);

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n🌐 Test your API endpoints:');
    console.log('  1. Start server: npm run dev');
    console.log('  2. Test: http://localhost:3000/api/tools');

    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

initializeDatabase();
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');
require('dotenv').config({ path: '.env.local' });

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Updated Schemas for Makerspace Management
const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membershipLevel: { type: String, enum: ['basic', 'premium', 'lifetime'], default: 'basic' },
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, collection: 'user' });

const toolSchema = new mongoose.Schema({
  tool_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['available', 'in-use', 'maintenance', 'broken'], default: 'available' },
  location: { type: String, required: true },
  lastMaintenance: { type: Date, default: Date.now },
  purchaseDate: { type: Date, default: Date.now },
  cost: { type: Number, required: true, min: 0 }
}, { timestamps: true, collection: 'tools' });

const paymentSchema = new mongoose.Schema({
  payment_id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  serviceName: { type: String, required: true },
  description: { type: String, required: false },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer', 'paypal'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  serviceDate: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'payment' });

const donationSchema = new mongoose.Schema({
  donation_id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, enum: ['monetary', 'item'], required: true },
  amount: { type: Number, required: function() { return this.type === 'monetary'; }, min: 0 },
  itemDescription: { type: String, required: function() { return this.type === 'item'; } },
  estimatedValue: { type: Number, required: function() { return this.type === 'item'; }, min: 0 },
  condition: { type: String, enum: ['new', 'excellent', 'good', 'fair'], required: function() { return this.type === 'item'; } },
  donationDate: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'donation' });

const componentSchema = new mongoose.Schema({
  component_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  lowStockThreshold: { type: Number, required: true, min: 0 },
  storageLocation: { type: String, required: true },
  supplier: { type: String, required: false },
  costPerUnit: { type: Number, required: true, min: 0 },
  lastRestocked: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'component' });

// Create models
const User = mongoose.model('User', userSchema, 'user');
const Tool = mongoose.model('Tool', toolSchema, 'tools');
const Payment = mongoose.model('Payment', paymentSchema, 'payment');
const Donation = mongoose.model('Donation', donationSchema, 'donation');
const Component = mongoose.model('Component', componentSchema, 'component');

async function clearDatabase() {
  console.log('\n🧹 Clearing existing database...');
  try {
    // Drop all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (let collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`   🗑️  Dropped collection: ${collection.name}`);
    }
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function populateDatabase() {
  console.log('\n🌱 Populating database with fresh makerspace data...');

  try {
    // Sample Users Data
    console.log('\n👥 Creating Users...');
    const usersData = [
      {
        user_id: `user_${nanoid(8)}`,
        username: 'alice_maker',
        email: 'alice@example.com',
        password: 'hashedpassword1',
        membershipLevel: 'premium',
        joinDate: new Date('2024-01-15'),
        isActive: true
      },
      {
        user_id: `user_${nanoid(8)}`,
        username: 'bob_engineer',
        email: 'bob@example.com',
        password: 'hashedpassword2',
        membershipLevel: 'basic',
        joinDate: new Date('2024-03-20'),
        isActive: true
      },
      {
        user_id: `user_${nanoid(8)}`,
        username: 'carol_inventor',
        email: 'carol@example.com',
        password: 'hashedpassword3',
        membershipLevel: 'lifetime',
        joinDate: new Date('2023-11-10'),
        isActive: true
      },
      {
        user_id: `user_${nanoid(8)}`,
        username: 'david_creator',
        email: 'david@example.com',
        password: 'hashedpassword4',
        membershipLevel: 'basic',
        joinDate: new Date('2024-06-05'),
        isActive: true
      }
    ];

    await User.insertMany(usersData);
    console.log(`   ✅ Created ${usersData.length} users`);

    // Sample Tools Data
    console.log('\n🔧 Creating Tools...');
    const toolsData = [
      {
        tool_id: `tool_${nanoid(8)}`,
        name: 'Ultimaker S3 3D Printer',
        description: 'Professional dual-extrusion 3D printer for high-quality prototypes',
        category: '3D Printing',
        status: 'available',
        location: 'Station A1',
        lastMaintenance: new Date('2024-09-15'),
        purchaseDate: new Date('2023-08-20'),
        cost: 3500.00
      },
      {
        tool_id: `tool_${nanoid(8)}`,
        name: 'Hakko FX-888D Soldering Station',
        description: 'Digital soldering station with precise temperature control',
        category: 'Electronics',
        status: 'in-use',
        location: 'Electronics Bench B2',
        lastMaintenance: new Date('2024-08-30'),
        purchaseDate: new Date('2023-12-05'),
        cost: 180.00
      },
      {
        tool_id: `tool_${nanoid(8)}`,
        name: 'DEWALT DWE7491RS Table Saw',
        description: '10-inch jobsite table saw with rolling stand',
        category: 'Woodworking',
        status: 'maintenance',
        location: 'Woodshop C3',
        lastMaintenance: new Date('2024-10-01'),
        purchaseDate: new Date('2023-05-12'),
        cost: 650.00
      },
      {
        tool_id: `tool_${nanoid(8)}`,
        name: 'Arduino Uno R3',
        description: 'Microcontroller board for electronics prototyping',
        category: 'Electronics',
        status: 'available',
        location: 'Electronics Storage D1',
        lastMaintenance: new Date('2024-09-20'),
        purchaseDate: new Date('2024-01-08'),
        cost: 25.00
      },
      {
        tool_id: `tool_${nanoid(8)}`,
        name: 'Creality Ender 3 V2',
        description: 'Entry-level FDM 3D printer for basic prototyping',
        category: '3D Printing',
        status: 'broken',
        location: 'Station A2',
        lastMaintenance: new Date('2024-09-28'),
        purchaseDate: new Date('2023-11-15'),
        cost: 250.00
      }
    ];

    await Tool.insertMany(toolsData);
    console.log(`   ✅ Created ${toolsData.length} tools`);

    // Get user IDs for payments and donations
    const users = await User.find({}, 'user_id');
    const userIds = users.map(user => user.user_id);

    // Sample Payments Data
    console.log('\n💰 Creating Payments...');
    const paymentsData = [
      {
        payment_id: `pay_${nanoid(8)}`,
        userId: userIds[0],
        serviceName: '3D Printing Service',
        description: 'PLA material usage - 50g',
        amount: 15.00,
        paymentMethod: 'card',
        status: 'completed',
        serviceDate: new Date('2024-10-05')
      },
      {
        payment_id: `pay_${nanoid(8)}`,
        userId: userIds[1],
        serviceName: 'Soldering Station Usage',
        description: '2 hours electronics assembly',
        amount: 8.00,
        paymentMethod: 'cash',
        status: 'completed',
        serviceDate: new Date('2024-10-04')
      },
      {
        payment_id: `pay_${nanoid(8)}`,
        userId: userIds[2],
        serviceName: 'Laser Cutting Service',
        description: 'Acrylic sheet cutting - 30cm²',
        amount: 25.00,
        paymentMethod: 'bank_transfer',
        status: 'completed',
        serviceDate: new Date('2024-10-03')
      },
      {
        payment_id: `pay_${nanoid(8)}`,
        userId: userIds[3],
        serviceName: 'Woodworking Tools',
        description: 'Table saw and router usage - 1 day',
        amount: 20.00,
        paymentMethod: 'paypal',
        status: 'pending',
        serviceDate: new Date('2024-10-06')
      }
    ];

    await Payment.insertMany(paymentsData);
    console.log(`   ✅ Created ${paymentsData.length} payments`);

    // Sample Donations Data
    console.log('\n🎁 Creating Donations...');
    const donationsData = [
      {
        donation_id: `don_${nanoid(8)}`,
        userId: userIds[0],
        type: 'monetary',
        amount: 100.00,
        donationDate: new Date('2024-09-15')
      },
      {
        donation_id: `don_${nanoid(8)}`,
        userId: userIds[1],
        type: 'item',
        itemDescription: 'Dell Inspiron 15 Laptop - i5 processor, 8GB RAM',
        estimatedValue: 450.00,
        condition: 'good',
        donationDate: new Date('2024-09-20')
      },
      {
        donation_id: `don_${nanoid(8)}`,
        userId: userIds[2],
        type: 'monetary',
        amount: 250.00,
        donationDate: new Date('2024-10-01')
      },
      {
        donation_id: `don_${nanoid(8)}`,
        userId: userIds[3],
        type: 'item',
        itemDescription: 'Assorted electronic components - resistors, capacitors, LEDs',
        estimatedValue: 75.00,
        condition: 'new',
        donationDate: new Date('2024-09-25')
      },
      {
        donation_id: `don_${nanoid(8)}`,
        userId: userIds[0],
        type: 'item',
        itemDescription: 'Makita Cordless Drill with battery and charger',
        estimatedValue: 120.00,
        condition: 'excellent',
        donationDate: new Date('2024-10-02')
      }
    ];

    await Donation.insertMany(donationsData);
    console.log(`   ✅ Created ${donationsData.length} donations`);

    // Sample Components Data
    console.log('\n🔌 Creating Components...');
    const componentsData = [
      {
        component_id: `comp_${nanoid(8)}`,
        name: 'Resistor 220Ω',
        description: '1/4W carbon film resistor, 5% tolerance',
        category: 'Passive Components',
        quantity: 500,
        unit: 'pieces',
        lowStockThreshold: 50,
        storageLocation: 'Drawer A1',
        supplier: 'DigiKey',
        costPerUnit: 0.05,
        lastRestocked: new Date('2024-08-15')
      },
      {
        component_id: `comp_${nanoid(8)}`,
        name: 'Arduino Nano',
        description: 'Compact microcontroller board based on ATmega328P',
        category: 'Microcontrollers',
        quantity: 25,
        unit: 'pieces',
        lowStockThreshold: 5,
        storageLocation: 'Cabinet B3',
        supplier: 'Arduino Store',
        costPerUnit: 22.00,
        lastRestocked: new Date('2024-09-10')
      },
      {
        component_id: `comp_${nanoid(8)}`,
        name: 'Breadboard 830 tie-points',
        description: 'Half-size solderless breadboard for prototyping',
        category: 'Prototyping',
        quantity: 15,
        unit: 'pieces',
        lowStockThreshold: 3,
        storageLocation: 'Shelf C2',
        supplier: 'Adafruit',
        costPerUnit: 5.50,
        lastRestocked: new Date('2024-09-20')
      },
      {
        component_id: `comp_${nanoid(8)}`,
        name: 'LED 5mm Red',
        description: 'Standard red LED, 5mm diameter, 20mA forward current',
        category: 'LEDs',
        quantity: 200,
        unit: 'pieces',
        lowStockThreshold: 20,
        storageLocation: 'Drawer A2',
        supplier: 'Mouser',
        costPerUnit: 0.15,
        lastRestocked: new Date('2024-08-25')
      },
      {
        component_id: `comp_${nanoid(8)}`,
        name: 'Capacitor 100µF 25V',
        description: 'Electrolytic capacitor, radial lead, 100µF 25V',
        category: 'Passive Components',
        quantity: 75,
        unit: 'pieces',
        lowStockThreshold: 10,
        storageLocation: 'Drawer A3',
        supplier: 'DigiKey',
        costPerUnit: 0.25,
        lastRestocked: new Date('2024-09-05')
      },
      {
        component_id: `comp_${nanoid(8)}`,
        name: 'Jumper Wires M-M',
        description: 'Male to male jumper wires, 20cm length, pack of 40',
        category: 'Cables & Connectors',
        quantity: 10,
        unit: 'packs',
        lowStockThreshold: 2,
        storageLocation: 'Drawer B1',
        supplier: 'Amazon',
        costPerUnit: 3.00,
        lastRestocked: new Date('2024-09-15')
      }
    ];

    await Component.insertMany(componentsData);
    console.log(`   ✅ Created ${componentsData.length} components`);

    // Summary
    console.log('\n📊 Database Population Summary:');
    const userCount = await User.countDocuments();
    const toolCount = await Tool.countDocuments();
    const paymentCount = await Payment.countDocuments();
    const donationCount = await Donation.countDocuments();
    const componentCount = await Component.countDocuments();

    console.log(`  👥 Users: ${userCount} documents`);
    console.log(`  🔧 Tools: ${toolCount} documents`);
    console.log(`  💰 Payments: ${paymentCount} documents`);
    console.log(`  🎁 Donations: ${donationCount} documents`);
    console.log(`  🔌 Components: ${componentCount} documents`);
    console.log(`\n🎉 Total: ${userCount + toolCount + paymentCount + donationCount + componentCount} documents created`);

  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Database Reset and Population...');
  console.log('⏰ Current time:', new Date().toISOString());
  
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await clearDatabase();
    
    // Populate with fresh data
    await populateDatabase();
    
    console.log('\n✅ Database reset and population completed successfully!');
    console.log('\n🔗 Test your API endpoints:');
    console.log('  http://localhost:3000/api/users');
    console.log('  http://localhost:3000/api/tools');
    console.log('  http://localhost:3000/api/payments');
    console.log('  http://localhost:3000/api/donations');
    console.log('  http://localhost:3000/api/components');
    
  } catch (error) {
    console.error('❌ Process failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
main();
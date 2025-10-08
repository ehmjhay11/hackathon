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

// Enhanced Schemas for Innovation Labs
const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membershipLevel: { type: String, enum: ['basic', 'premium', 'lifetime'], default: 'basic' },
  joinDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, collection: 'users' });

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
  serviceDate: { type: Date, default: Date.now },
  serviceDetails: { type: mongoose.Schema.Types.Mixed, required: false },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'payments' });

const donationSchema = new mongoose.Schema({
  donation_id: { type: String, required: true, unique: true },
  donorName: { type: String, required: true },
  type: { type: String, enum: ['monetary', 'item'], required: true },
  amount: { type: Number, required: function() { return this.type === 'monetary'; }, min: 0 },
  itemDescription: { type: String, required: function() { return this.type === 'item'; } },
  dateReceived: { type: Date, default: Date.now }
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
const User = mongoose.model('User', userSchema, 'users');
const Tool = mongoose.model('Tool', toolSchema, 'tools');
const Payment = mongoose.model('Payment', paymentSchema, 'payments');
const Donation = mongoose.model('Donation', donationSchema, 'donation');
const Component = mongoose.model('Component', componentSchema, 'component');

async function clearDatabase() {
  console.log('\n🧹 Clearing existing database...');
  try {
    await User.deleteMany({});
    await Tool.deleteMany({});
    await Payment.deleteMany({});
    await Donation.deleteMany({});
    await Component.deleteMany({});
    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

async function populateUsers() {
  console.log('\n👥 Creating Innovation Labs users...');
  
  const users = [
    {
      user_id: `user_${nanoid(8)}`,
      username: 'admin_sorsogon',
      email: 'admin@sorsogonlabs.gov.ph',
      password: 'hashed_password_123', // In real app, this would be bcrypt hashed
      membershipLevel: 'lifetime',
      joinDate: new Date('2024-01-15'),
      isActive: true
    },
    {
      user_id: `user_${nanoid(8)}`,
      username: 'maria_santos',
      email: 'maria.santos@email.com',
      password: 'hashed_password_456',
      membershipLevel: 'premium',
      joinDate: new Date('2024-03-10'),
      isActive: true
    },
    {
      user_id: `user_${nanoid(8)}`,
      username: 'juan_dela_cruz',
      email: 'juan.delacruz@email.com',
      password: 'hashed_password_789',
      membershipLevel: 'basic',
      joinDate: new Date('2024-06-20'),
      isActive: true
    },
    {
      user_id: `user_${nanoid(8)}`,
      username: 'tech_student_01',
      email: 'student1@sorsogontech.edu.ph',
      password: 'hashed_password_101',
      membershipLevel: 'basic',
      joinDate: new Date('2024-08-05'),
      isActive: true
    },
    {
      user_id: `user_${nanoid(8)}`,
      username: 'innovator_jane',
      email: 'jane.innovator@startup.ph',
      password: 'hashed_password_102',
      membershipLevel: 'premium',
      joinDate: new Date('2024-09-12'),
      isActive: true
    }
  ];

  await User.insertMany(users);
  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function populateTools() {
  console.log('\n🔧 Creating Innovation Labs tools inventory...');
  
  const tools = [
    // Electronics & Soldering
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Professional Soldering Station',
      description: 'Temperature-controlled soldering iron with digital display and adjustable heat settings',
      category: 'Electronics',
      status: 'available',
      location: 'Electronics Workbench A1',
      lastMaintenance: new Date('2024-09-15'),
      purchaseDate: new Date('2024-01-20'),
      cost: 2500
    },
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Digital Multimeter',
      description: 'High-precision digital multimeter for voltage, current, and resistance measurements',
      category: 'Electronics',
      status: 'available',
      location: 'Electronics Workbench A2',
      lastMaintenance: new Date('2024-08-20'),
      purchaseDate: new Date('2024-02-05'),
      cost: 1200
    },
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Oscilloscope',
      description: '2-channel digital oscilloscope for signal analysis and debugging',
      category: 'Electronics',
      status: 'available',
      location: 'Electronics Workbench B1',
      lastMaintenance: new Date('2024-09-01'),
      purchaseDate: new Date('2024-03-10'),
      cost: 8500
    },
    
    // 3D Printing & Digital Fabrication
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Ender 3 Pro 3D Printer',
      description: 'FDM 3D printer with heated bed, supports PLA, ABS, and PETG filaments',
      category: '3D Printing',
      status: 'available',
      location: '3D Printing Station 1',
      lastMaintenance: new Date('2024-09-20'),
      purchaseDate: new Date('2024-02-15'),
      cost: 12000
    },
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Prusa i3 MK3S+',
      description: 'High-quality FDM 3D printer with automatic bed leveling and filament sensor',
      category: '3D Printing',
      status: 'in-use',
      location: '3D Printing Station 2',
      lastMaintenance: new Date('2024-08-25'),
      purchaseDate: new Date('2024-04-01'),
      cost: 28000
    },
    
    // Hand Tools & General Workshop
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Precision Screwdriver Set',
      description: '32-piece precision screwdriver set with magnetic tips and various bit types',
      category: 'Hand Tools',
      status: 'available',
      location: 'Tool Cabinet A-3',
      lastMaintenance: new Date('2024-07-10'),
      purchaseDate: new Date('2024-01-30'),
      cost: 850
    },
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Digital Calipers',
      description: 'High-precision digital calipers with LCD display, accuracy to 0.01mm',
      category: 'Measurement',
      status: 'available',
      location: 'Measurement Tools Drawer',
      lastMaintenance: new Date('2024-08-15'),
      purchaseDate: new Date('2024-03-05'),
      cost: 650
    },
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Hot Air Rework Station',
      description: 'Temperature and airflow controlled hot air station for SMD rework',
      category: 'Electronics',
      status: 'available',
      location: 'Electronics Workbench A3',
      lastMaintenance: new Date('2024-09-10'),
      purchaseDate: new Date('2024-05-20'),
      cost: 4200
    },
    
    // Power Tools
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Cordless Drill Driver',
      description: '18V cordless drill/driver with LED light and adjustable torque settings',
      category: 'Power Tools',
      status: 'available',
      location: 'Power Tools Cabinet',
      lastMaintenance: new Date('2024-08-30'),
      purchaseDate: new Date('2024-04-15'),
      cost: 3200
    },
    {
      tool_id: `tool_${nanoid(8)}`,
      name: 'Bench Power Supply',
      description: 'Variable DC power supply 0-30V, 0-5A with digital display',
      category: 'Electronics',
      status: 'available',
      location: 'Electronics Workbench B2',
      lastMaintenance: new Date('2024-09-05'),
      purchaseDate: new Date('2024-06-01'),
      cost: 5500
    }
  ];

  await Tool.insertMany(tools);
  console.log(`✅ Created ${tools.length} tools`);
  return tools;
}

async function populateComponents() {
  console.log('\n🔌 Creating Innovation Labs electronic components inventory...');
  
  const components = [
    // Microcontrollers & Development Boards
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'Arduino Uno R3',
      description: 'ATmega328P-based microcontroller board with USB interface',
      category: 'Microcontrollers',
      quantity: 25,
      unit: 'pieces',
      lowStockThreshold: 5,
      storageLocation: 'Cabinet A - Shelf 1',
      supplier: 'Arduino Store Philippines',
      costPerUnit: 680,
      lastRestocked: new Date('2024-08-15')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'ESP32 DevKit',
      description: 'WiFi and Bluetooth enabled microcontroller development board',
      category: 'Microcontrollers',
      quantity: 15,
      unit: 'pieces',
      lowStockThreshold: 3,
      storageLocation: 'Cabinet A - Shelf 1',
      supplier: 'Espressif Systems',
      costPerUnit: 450,
      lastRestocked: new Date('2024-09-01')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'Raspberry Pi 4 Model B',
      description: '8GB RAM single-board computer with quad-core ARM processor',
      category: 'Single Board Computers',
      quantity: 8,
      unit: 'pieces',
      lowStockThreshold: 2,
      storageLocation: 'Cabinet A - Shelf 2',
      supplier: 'Raspberry Pi Foundation',
      costPerUnit: 4200,
      lastRestocked: new Date('2024-07-20')
    },
    
    // Sensors
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'DHT22 Temperature Humidity Sensor',
      description: 'Digital temperature and humidity sensor with high accuracy',
      category: 'Sensors',
      quantity: 30,
      unit: 'pieces',
      lowStockThreshold: 8,
      storageLocation: 'Cabinet B - Drawer 1',
      supplier: 'Adafruit Industries',
      costPerUnit: 320,
      lastRestocked: new Date('2024-08-25')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'Ultrasonic Distance Sensor HC-SR04',
      description: 'Ultrasonic ranging module for distance measurement 2cm-400cm',
      category: 'Sensors',
      quantity: 20,
      unit: 'pieces',
      lowStockThreshold: 5,
      storageLocation: 'Cabinet B - Drawer 1',
      supplier: 'Local Electronics Store',
      costPerUnit: 180,
      lastRestocked: new Date('2024-09-10')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'MPU6050 Gyroscope Accelerometer',
      description: '6-axis motion tracking device with 3-axis gyroscope and accelerometer',
      category: 'Sensors',
      quantity: 12,
      unit: 'pieces',
      lowStockThreshold: 3,
      storageLocation: 'Cabinet B - Drawer 2',
      supplier: 'InvenSense',
      costPerUnit: 280,
      lastRestocked: new Date('2024-08-05')
    },
    
    // Display Modules
    {
      component_id: `comp_${nanoid(8)}`,
      name: '16x2 LCD Display',
      description: '16x2 character LCD display with I2C backpack module',
      category: 'Displays',
      quantity: 18,
      unit: 'pieces',
      lowStockThreshold: 4,
      storageLocation: 'Cabinet C - Shelf 1',
      supplier: 'Hitachi Display',
      costPerUnit: 250,
      lastRestocked: new Date('2024-08-30')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: '0.96" OLED Display',
      description: '128x64 pixels OLED display module with SPI/I2C interface',
      category: 'Displays',
      quantity: 10,
      unit: 'pieces',
      lowStockThreshold: 2,
      storageLocation: 'Cabinet C - Shelf 1',
      supplier: 'Adafruit Industries',
      costPerUnit: 520,
      lastRestocked: new Date('2024-09-15')
    },
    
    // Basic Electronic Components
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'LED Assortment Kit',
      description: 'Mixed pack of 5mm LEDs - Red, Green, Blue, Yellow, White (100 pieces)',
      category: 'LEDs',
      quantity: 500,
      unit: 'pieces',
      lowStockThreshold: 50,
      storageLocation: 'Cabinet D - Drawer 1',
      supplier: 'Local Electronics Store',
      costPerUnit: 3,
      lastRestocked: new Date('2024-09-01')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'Resistor Kit 1/4W',
      description: '1/4W carbon film resistors assortment 1Ω to 1MΩ (600 pieces)',
      category: 'Resistors',
      quantity: 600,
      unit: 'pieces',
      lowStockThreshold: 100,
      storageLocation: 'Cabinet D - Drawer 2',
      supplier: 'Vishay Intertechnology',
      costPerUnit: 2,
      lastRestocked: new Date('2024-08-10')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'Ceramic Capacitor Kit',
      description: 'Ceramic capacitors assortment 10pF to 100nF (300 pieces)',
      category: 'Capacitors',
      quantity: 300,
      unit: 'pieces',
      lowStockThreshold: 50,
      storageLocation: 'Cabinet D - Drawer 3',
      supplier: 'Murata Manufacturing',
      costPerUnit: 5,
      lastRestocked: new Date('2024-08-20')
    },
    
    // Connectors & Cables
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'Jumper Wire Set',
      description: 'Male-to-male, male-to-female, female-to-female jumper wires (120 pieces)',
      category: 'Connectors',
      quantity: 240,
      unit: 'pieces',
      lowStockThreshold: 40,
      storageLocation: 'Cabinet E - Drawer 1',
      supplier: 'DuPont Connectors',
      costPerUnit: 8,
      lastRestocked: new Date('2024-09-05')
    },
    {
      component_id: `comp_${nanoid(8)}`,
      name: 'Breadboard 830 Points',
      description: 'Solderless breadboard with 830 tie points for prototyping',
      category: 'Prototyping',
      quantity: 20,
      unit: 'pieces',
      lowStockThreshold: 5,
      storageLocation: 'Cabinet E - Shelf 1',
      supplier: '3M Electronics',
      costPerUnit: 120,
      lastRestocked: new Date('2024-08-25')
    }
  ];

  await Component.insertMany(components);
  console.log(`✅ Created ${components.length} electronic components`);
  return components;
}

async function populatePayments(users) {
  console.log('\n💰 Creating Innovation Labs payment records...');
  
  const currentDate = new Date();
  const payments = [
    // 3D Printing Payments
    {
      payment_id: `pay_${nanoid(8)}`,
      userId: users[1].user_id,
      serviceName: '3d-printer',
      description: '3D Printing: 150g PLA, 2.5h',
      amount: 192.50,
      paymentMethod: 'cash',
      status: 'completed',
      serviceDate: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000),
      serviceDetails: {
        filamentWeight: 150,
        filamentType: 'PLA',
        printingTime: 2.5,
        filamentCost: 180.00,
        powerCost: 12.50,
        totalCost: 192.50
      }
    },
    {
      payment_id: `pay_${nanoid(8)}`,
      userId: users[2].user_id,
      serviceName: '3d-printer',
      description: '3D Printing: 300g ABS, 4.0h',
      amount: 425.00,
      paymentMethod: 'card',
      status: 'completed',
      serviceDate: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000),
      serviceDetails: {
        filamentWeight: 300,
        filamentType: 'ABS',
        printingTime: 4.0,
        filamentCost: 405.00,
        powerCost: 20.00,
        totalCost: 425.00
      }
    },
    
    // Soldering Station Payments
    {
      payment_id: `pay_${nanoid(8)}`,
      userId: users[3].user_id,
      serviceName: 'soldering-station',
      description: 'Soldering Station: 1.5 hours',
      amount: 15.00,
      paymentMethod: 'cash',
      status: 'completed',
      serviceDate: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      serviceDetails: {
        hoursUsed: 1.5,
        totalCost: 15.00
      }
    },
    {
      payment_id: `pay_${nanoid(8)}`,
      userId: users[4].user_id,
      serviceName: 'soldering-station',
      description: 'Soldering Station: 3.0 hours',
      amount: 30.00,
      paymentMethod: 'bank_transfer',
      status: 'completed',
      serviceDate: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000),
      serviceDetails: {
        hoursUsed: 3.0,
        totalCost: 30.00
      }
    },
    
    // Tools Payments
    {
      payment_id: `pay_${nanoid(8)}`,
      userId: users[1].user_id,
      serviceName: 'tools',
      description: 'Tools: Precision Screwdriver Set (1x ₱850)',
      amount: 850.00,
      paymentMethod: 'card',
      status: 'completed',
      serviceDate: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      serviceDetails: {
        selectedItems: [
          {
            id: 'tool_screwdriver_01',
            name: 'Precision Screwdriver Set',
            costPerUnit: 850,
            quantity: 1,
            totalCost: 850
          }
        ],
        totalCost: 850.00
      }
    },
    
    // Components Payments
    {
      payment_id: `pay_${nanoid(8)}`,
      userId: users[2].user_id,
      serviceName: 'components',
      description: 'Components: Arduino Uno R3 (2x ₱680), ESP32 DevKit (1x ₱450)',
      amount: 1810.00,
      paymentMethod: 'cash',
      status: 'completed',
      serviceDate: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000),
      serviceDetails: {
        selectedItems: [
          {
            id: 'comp_arduino_uno',
            name: 'Arduino Uno R3',
            costPerUnit: 680,
            quantity: 2,
            totalCost: 1360
          },
          {
            id: 'comp_esp32_dev',
            name: 'ESP32 DevKit',
            costPerUnit: 450,
            quantity: 1,
            totalCost: 450
          }
        ],
        totalCost: 1810.00
      }
    },
    
    // Recent Payments
    {
      payment_id: `pay_${nanoid(8)}`,
      userId: users[3].user_id,
      serviceName: '3d-printer',
      description: '3D Printing: 80g PLA, 1.2h',
      amount: 102.00,
      paymentMethod: 'card',
      status: 'completed',
      serviceDate: new Date(currentDate.getTime() - 6 * 60 * 60 * 1000), // 6 hours ago
      serviceDetails: {
        filamentWeight: 80,
        filamentType: 'PLA',
        printingTime: 1.2,
        filamentCost: 96.00,
        powerCost: 6.00,
        totalCost: 102.00
      }
    }
  ];

  await Payment.insertMany(payments);
  console.log(`✅ Created ${payments.length} payment records`);
  return payments;
}

async function populateDonations() {
  console.log('\n🎁 Creating Innovation Labs donation records...');
  
  const currentDate = new Date();
  const donations = [
    {
      donation_id: `don_${nanoid(8)}`,
      donorName: 'Sorsogon City Government',
      type: 'monetary',
      amount: 50000,
      dateReceived: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      donation_id: `don_${nanoid(8)}`,
      donorName: 'Tech Innovators Association',
      type: 'monetary',
      amount: 25000,
      dateReceived: new Date(currentDate.getTime() - 20 * 24 * 60 * 60 * 1000)
    },
    {
      donation_id: `don_${nanoid(8)}`,
      donorName: 'Local Electronics Store',
      type: 'item',
      itemDescription: 'Box of assorted resistors, capacitors, and LEDs (500+ pieces)',
      dateReceived: new Date(currentDate.getTime() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      donation_id: `don_${nanoid(8)}`,
      donorName: 'Anonymous Benefactor',
      type: 'monetary',
      amount: 15000,
      dateReceived: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      donation_id: `don_${nanoid(8)}`,
      donorName: 'Sorsogon State University',
      type: 'item',
      itemDescription: 'Old but functional laptop computers for educational use (3 units)',
      dateReceived: new Date(currentDate.getTime() - 8 * 24 * 60 * 60 * 1000)
    },
    {
      donation_id: `don_${nanoid(8)}`,
      donorName: 'Maria Santos',
      type: 'monetary',
      amount: 5000,
      dateReceived: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      donation_id: `don_${nanoid(8)}`,
      donorName: 'Innovation Labs Community',
      type: 'monetary',
      amount: 2500,
      dateReceived: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000)
    }
  ];

  await Donation.insertMany(donations);
  console.log(`✅ Created ${donations.length} donation records`);
  return donations;
}

async function generateReport(users, tools, components, payments, donations) {
  console.log('\n📊 INNOVATION LABS DATABASE SUMMARY');
  console.log('=====================================');
  
  console.log(`👥 Users: ${users.length}`);
  console.log(`   • Lifetime Members: ${users.filter(u => u.membershipLevel === 'lifetime').length}`);
  console.log(`   • Premium Members: ${users.filter(u => u.membershipLevel === 'premium').length}`);
  console.log(`   • Basic Members: ${users.filter(u => u.membershipLevel === 'basic').length}`);
  
  console.log(`\n🔧 Tools: ${tools.length}`);
  console.log(`   • Available: ${tools.filter(t => t.status === 'available').length}`);
  console.log(`   • In Use: ${tools.filter(t => t.status === 'in-use').length}`);
  console.log(`   • Total Value: ₱${tools.reduce((sum, t) => sum + t.cost, 0).toLocaleString()}`);
  
  console.log(`\n🔌 Components: ${components.length} types`);
  console.log(`   • Total Inventory: ${components.reduce((sum, c) => sum + c.quantity, 0)} pieces`);
  console.log(`   • Low Stock Items: ${components.filter(c => c.quantity <= c.lowStockThreshold).length}`);
  console.log(`   • Total Value: ₱${components.reduce((sum, c) => sum + (c.quantity * c.costPerUnit), 0).toLocaleString()}`);
  
  console.log(`\n💰 Payments: ${payments.length}`);
  console.log(`   • Total Revenue: ₱${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`);
  console.log(`   • 3D Printing: ${payments.filter(p => p.serviceName === '3d-printer').length} transactions`);
  console.log(`   • Soldering: ${payments.filter(p => p.serviceName === 'soldering-station').length} transactions`);
  console.log(`   • Tools: ${payments.filter(p => p.serviceName === 'tools').length} transactions`);
  console.log(`   • Components: ${payments.filter(p => p.serviceName === 'components').length} transactions`);
  
  console.log(`\n🎁 Donations: ${donations.length}`);
  const monetaryDonations = donations.filter(d => d.type === 'monetary');
  const itemDonations = donations.filter(d => d.type === 'item');
  console.log(`   • Monetary: ${monetaryDonations.length} (₱${monetaryDonations.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()})`);
  console.log(`   • Item Donations: ${itemDonations.length} contributions`);
  
  console.log('\n✅ Database populated successfully!');
  console.log('🚀 Innovation Labs is ready for operation!');
}

async function main() {
  try {
    console.log('🏗️  SORSOGON COMMUNITY INNOVATION LABS - DATABASE SETUP');
    console.log('======================================================');
    
    await connectDB();
    await clearDatabase();
    
    const users = await populateUsers();
    const tools = await populateTools();
    const components = await populateComponents();
    const payments = await populatePayments(users);
    const donations = await populateDonations();
    
    await generateReport(users, tools, components, payments, donations);
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the population script
main();
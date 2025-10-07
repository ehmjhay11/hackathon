const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  console.log('📝 Please create .env.local with:');
  console.log('   MONGODB_URI=mongodb://localhost:27017/trackify');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log(`🔗 Connecting to: ${MONGODB_URI}`);
    
    await mongoose.connect(MONGODB_URI);
    
    const connection = mongoose.connection;
    
    if (connection.readyState === 1) {
      console.log('✅ MongoDB connected successfully!');
      console.log(`📊 Database: ${connection.db.databaseName}`);
      console.log(`🔗 Host: ${connection.host}:${connection.port}`);
      
      // Test basic operations
      try {
        const collections = await connection.db.listCollections().toArray();
        console.log(`📁 Collections found: ${collections.length}`);
        
        if (collections.length > 0) {
          console.log('📋 Existing collections:');
          collections.forEach(col => console.log(`   - ${col.name}`));
        } else {
          console.log('📋 No collections found (will be created when data is added)');
        }
      } catch (error) {
        console.log('⚠️ Could not list collections:', error.message);
      }
      
    } else {
      console.log('❌ MongoDB connection failed');
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Make sure MongoDB is running');
      console.log('   2. Check if MongoDB service is started');
      console.log('   3. Try: net start MongoDB (Windows)');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection();
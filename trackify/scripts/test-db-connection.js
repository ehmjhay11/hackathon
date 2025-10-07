import connectDB from '../lib/mongodb.js';

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const connection = await connectDB();
    
    if (connection.readyState === 1) {
      console.log('✅ MongoDB connected successfully!');
      console.log(`📊 Database: ${connection.db.databaseName}`);
      console.log(`🔗 Host: ${connection.host}:${connection.port}`);
      
      // Test basic operations
      const collections = await connection.db.listCollections().toArray();
      console.log(`📁 Collections found: ${collections.length}`);
      
      if (collections.length > 0) {
        console.log('📋 Existing collections:');
        collections.forEach(col => console.log(`   - ${col.name}`));
      }
      
    } else {
      console.log('❌ MongoDB connection failed');
    }
    
    // Close connection
    await connection.close();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
}

// Run the test
testConnection();
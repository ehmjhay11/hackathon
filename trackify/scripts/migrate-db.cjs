const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function migrateCollections() {
  try {
    console.log('🔄 Migrating collections to match schema diagram...');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    const db = mongoose.connection.db;

    // List current collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Current collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Collections that need to be renamed/migrated
    const migrationMap = {
      'payments': 'payment',
      'donations': 'donation', 
      'purchases': 'purchase',
      'users': 'user',
      'tools': 'tools' // This one stays the same
    };

    console.log('\n🔄 Starting migration...');

    for (const [oldName, newName] of Object.entries(migrationMap)) {
      try {
        // Check if old collection exists
        const oldExists = collections.some(col => col.name === oldName);
        const newExists = collections.some(col => col.name === newName);

        if (oldExists && oldName !== newName) {
          console.log(`\n📦 Migrating ${oldName} → ${newName}`);
          
          // Get documents from old collection
          const oldCollection = db.collection(oldName);
          const documents = await oldCollection.find({}).toArray();
          
          console.log(`   📄 Found ${documents.length} documents`);

          if (documents.length > 0) {
            // Insert into new collection
            const newCollection = db.collection(newName);
            await newCollection.insertMany(documents);
            console.log(`   ✅ Migrated ${documents.length} documents to ${newName}`);
            
            // Drop old collection
            await oldCollection.drop();
            console.log(`   🗑️ Dropped old collection: ${oldName}`);
          } else {
            console.log(`   ⚠️ No documents to migrate from ${oldName}`);
            // Drop empty old collection
            await oldCollection.drop();
            console.log(`   🗑️ Dropped empty collection: ${oldName}`);
          }
        } else if (oldExists && oldName === newName) {
          console.log(`   ✅ Collection ${oldName} already has correct name`);
        } else if (!oldExists) {
          console.log(`   ⚠️ Collection ${oldName} not found, skipping`);
        }
      } catch (error) {
        console.log(`   ❌ Error migrating ${oldName}:`, error.message);
      }
    }

    // List final collections
    console.log('\n📋 Final collections:');
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(col => console.log(`   - ${col.name}`));

    console.log('\n🎉 Migration completed!');
    console.log('\n📝 Collection names now match the schema diagram:');
    console.log('   💰 payment');
    console.log('   🎁 donation');
    console.log('   🛒 purchase');
    console.log('   🔧 tools');
    console.log('   👥 user');

    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Confirm before migrating
console.log('⚠️  This will rename your collections to match the schema diagram');
console.log('⚠️  Old collections will be dropped after data migration');
console.log('⚠️  Press Ctrl+C to cancel, or wait 3 seconds to proceed...');

setTimeout(() => {
  migrateCollections();
}, 3000);